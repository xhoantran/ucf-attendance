from typing import Any

import jwt
from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework import serializers

from attendance.users.serializers import UserSerializer

from .models import Attendance, Course, Session, get_face_image_path

User = get_user_model()


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ("id", "name", "teacher_id")


class SessionReadSerializer(serializers.ModelSerializer):
    course_id = CourseSerializer()

    class Meta:
        model = Session
        fields = ("id", "course_id", "start_time", "end_time")


class SessionWriteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ("id", "course_id")

    def validate_course_id(self, value):
        if value.teacher_id != self.context["request"].user:
            raise serializers.ValidationError("Course does not belong to you.")
        return value


class AttendanceSerializer(serializers.ModelSerializer):
    session_id = SessionReadSerializer()
    student_id = UserSerializer()

    class Meta:
        model = Attendance
        fields = (
            "id",
            "session_id",
            "student_id",
            "created_at",
            "face_recognition_status",
        )


class AttendanceImageSerializer(serializers.ModelSerializer):
    session_id = SessionReadSerializer()
    student_id = UserSerializer()
    init_face_image = serializers.SerializerMethodField()

    class Meta:
        model = Attendance
        fields = (
            "id",
            "session_id",
            "student_id",
            "created_at",
            "face_recognition_status",
            "face_image",
            "init_face_image",
        )

    def get_init_face_image(self, obj):
        if "storages" not in settings.INSTALLED_APPS:
            return "init.jpeg"

        import boto3

        s3_client = boto3.client("s3")
        return s3_client.generate_presigned_url(
            ClientMethod="get_object",
            Params={
                "Bucket": settings.MEDIA_BUCKET_NAME,
                "Key": f"{obj.student_id.id}/init.jpeg",
            },
            ExpiresIn=3600,
        )


class AttendanceCreateSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, data):
        # Get token from request data
        token = data["token"]

        # Get session id from token
        payload = jwt.decode(token, options={"verify_signature": False})
        session_id = payload.get("session_id", None)
        teacher_id = payload.get("teacher_id", None)

        # Early return if session id is not present
        if not session_id or not teacher_id:
            raise serializers.ValidationError("Invalid token.")

        # Get session secret from cache
        session_secret = cache.get(f"teacher:{teacher_id}:session:{session_id}:secret")
        if not session_secret:
            print(f'No session secret "teacher:{teacher_id}:session:{session_id}:secret"')
            raise serializers.ValidationError("Token not active for this session.")

        # Verify token
        try:
            payload = jwt.decode(token, session_secret, algorithms=["HS256"])
        except jwt.exceptions.InvalidSignatureError:
            raise serializers.ValidationError("Invalid signature.")
        except jwt.exceptions.ExpiredSignatureError:
            raise serializers.ValidationError("Token expired.")

        data["session_id"] = session_id
        data["teacher_id"] = teacher_id
        return data

    def get_presigned_put_object_url(self):
        if "storages" not in settings.INSTALLED_APPS:
            return None

        import boto3

        if self.context["request"].user.init_image:
            path = get_face_image_path(
                self.instance, f"{self.instance.id}_{int(self.instance.created_at.timestamp())}"
            )
        else:
            path = get_face_image_path(self.instance, f"{self.instance.id}_init")

        s3_client = boto3.client("s3")
        return s3_client.generate_presigned_url(
            ClientMethod="put_object",
            Params={
                "Bucket": settings.MEDIA_BUCKET_NAME,
                "Key": path,
                "ContentType": "image/jpeg",
            },
            ExpiresIn=3600,
        )

    def create(self, validated_data):
        attendance_obj, _ = Attendance.objects.get_or_create(
            session_id_id=validated_data["session_id"],
            student_id=self.context["request"].user,
        )
        if (
            attendance_obj.face_recognition_status == Attendance.FaceRecognitionStatus.FAILED
            or attendance_obj.face_recognition_status == Attendance.FaceRecognitionStatus.SUCCESS
        ):
            raise serializers.ValidationError("You have already checked in.")
        return attendance_obj

    def to_representation(self, instance: Any) -> Any:
        serialized_data = AttendanceSerializer(instance).data
        if not bool(instance.face_image):
            serialized_data["face_image_upload_url"] = self.get_presigned_put_object_url()
        return serialized_data


class ImageProcessingCallbackSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    face_recognition_status = serializers.CharField()
    face_image = serializers.CharField()

    def create(self, validated_data):
        attendance = Attendance.objects.get(id=validated_data["id"])
        attendance.face_recognition_status = validated_data["face_recognition_status"]
        attendance.face_image = validated_data["face_image"]
        attendance.save()

        # Update init_image status)
        if "init" in validated_data["face_image"]:
            User.objects.filter(id=attendance.student_id.id).update(init_image=True)

        return attendance
