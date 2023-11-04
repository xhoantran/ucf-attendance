from django.core.cache import cache
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import exceptions, generics, permissions, viewsets, views
from rest_framework.decorators import action
from rest_framework.filters import OrderingFilter
from rest_framework.request import Request
from rest_framework.response import Response

from attendance.users.permissions import IsStudent, IsTeacher

from .models import Attendance, Course, Session
from .serializers import (
    AttendanceCreateSerializer,
    AttendanceImageSerializer,
    AttendanceSerializer,
    CourseSerializer,
    ImageProcessingCallbackSerializer,
    SessionReadSerializer,
    SessionWriteSerializer,
)


class CourseModelViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer
    permission_classes = (IsTeacher,)
    ordering = ("name",)

    def get_queryset(self):
        return Course.objects.filter(teacher_id=self.request.user)

    def create(self, request: Request, *args, **kwargs):
        request.data["teacher_id"] = request.user.id
        return super().create(request, *args, **kwargs)

    def update(self, request: Request, *args, **kwargs):
        request.data["teacher_id"] = request.user.id
        return super().update(request, *args, **kwargs)


class SessionModelViewSet(viewsets.ModelViewSet):
    queryset = Session.objects.all()
    permission_classes = (IsTeacher,)
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_fields = ("course_id",)
    ordering_fields = ("start_time",)
    ordering = ("-start_time",)

    def get_queryset(self):
        return Session.objects.filter(course_id__teacher_id=self.request.user)

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return SessionReadSerializer
        return SessionWriteSerializer

    @action(detail=True, methods=["post"])
    def end(self, request: Request, pk=None):
        session = self.get_object()
        session.end_time = timezone.now()
        session.save()
        cache.delete(f"teacher:{request.user.id}:session:{pk}:secret")
        return Response(self.get_serializer(session).data)

    @action(detail=True, methods=["post"])
    def get_secret(self, request: Request, pk=None):
        if secret := cache.get(f"teacher:{request.user.id}:session:{pk}:secret"):
            return Response({"secret": secret})

        session: Session = self.get_object()
        return Response({"secret": session.generate_secret()})


class AttendanceListCreateAPIView(generics.ListCreateAPIView):
    queryset = Attendance.objects.all()
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    permission_classes = (IsTeacher | IsStudent,)
    filterset_fields = ("session_id",)
    ordering_fields = ("created_at",)
    ordering = ("-created_at",)

    def check_permissions(self, request: Request):
        if request.method == "POST":
            self.permission_classes = (IsStudent,)
        super().check_permissions(request)

    def get_serializer_class(self):
        if self.request.method == "POST":
            return AttendanceCreateSerializer
        return AttendanceSerializer

    def create(self, request: Request, *args, **kwargs):
        request.data["student_id"] = request.user.id
        return super().create(request, *args, **kwargs)

    def get_queryset(self):
        if IsStudent().has_permission(self.request, self):
            return Attendance.objects.select_related(
                "session_id",
                "student_id",
                "session_id__course_id",
            ).filter(
                student_id=self.request.user,
            )

        if IsTeacher().has_permission(self.request, self):
            return Attendance.objects.select_related(
                "session_id",
                "student_id",
                "session_id__course_id",
            ).filter(
                session_id__course_id__teacher_id=self.request.user,
            )

        raise exceptions.PermissionDenied()


class ImageProcessingCallbackAPIView(generics.CreateAPIView):
    serializer_class = ImageProcessingCallbackSerializer
    permission_classes = (permissions.AllowAny,)

    def create(self, request: Request, *args, **kwargs):
        if request.headers.get("X-Internal-Service") != "Lambda":
            return Response(status=403)
        return super().create(request, *args, **kwargs)


class AttendanceReportListAPIView(generics.ListAPIView):
    queryset = Attendance.objects.all()
    permission_classes = (IsTeacher,)
    serializer_class = AttendanceSerializer
    filter_backends = (DjangoFilterBackend, OrderingFilter)
    filterset_fields = ("session_id",)
    ordering_fields = ("created_at",)
    ordering = ("-created_at",)

    def get_queryset(self):
        return Attendance.objects.select_related(
            "session_id",
            "student_id",
            "session_id__course_id",
        ).filter(
            session_id__course_id__teacher_id=self.request.user,
            face_recognition_status=Attendance.FaceRecognitionStatus.FAILED,
        )


class AttendanceReportDetailAPIView(generics.RetrieveAPIView):
    queryset = Attendance.objects.all()
    permission_classes = (IsTeacher,)
    serializer_class = AttendanceImageSerializer

    def get_queryset(self):
        return Attendance.objects.select_related(
            "session_id",
            "student_id",
            "session_id__course_id",
        ).filter(
            session_id__course_id__teacher_id=self.request.user,
        )


class AttendanceOverrideAPIView(views.APIView):
    def post(self, request: Request, pk=None):
        if not IsTeacher().has_permission(request, Attendance):
            raise exceptions.PermissionDenied()

        attendance = Attendance.objects.get(pk=pk)
        attendance.face_recognition_status = Attendance.FaceRecognitionStatus.SUCCESS
        attendance.save()
        return Response(AttendanceSerializer(attendance).data)
