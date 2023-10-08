from django.conf import settings
from django.urls import path
from rest_framework.routers import DefaultRouter, SimpleRouter

from ucf_here_face_demo.core.views import (
    AttendanceListCreateAPIView,
    AttendanceReportDetailAPIView,
    AttendanceReportListAPIView,
    CourseModelViewSet,
    ImageProcessingCallbackAPIView,
    SessionModelViewSet,
)

if settings.DEBUG:
    router = DefaultRouter()
else:
    router = SimpleRouter()

router.register("course", CourseModelViewSet)
router.register("session", SessionModelViewSet)


app_name = "api"
urlpatterns = router.urls
urlpatterns += [
    path("attendance/", AttendanceListCreateAPIView.as_view(), name="attendance-list-create"),
    path("attendance/report/", AttendanceReportListAPIView.as_view(), name="attendance-report-list"),
    path("attendance/<int:pk>/report/", AttendanceReportDetailAPIView.as_view(), name="attendance-report-detail"),
    path("image-processing-callback/", ImageProcessingCallbackAPIView.as_view(), name="image-processing-callback"),
]
