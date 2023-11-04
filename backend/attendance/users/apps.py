from django.apps import AppConfig
from django.utils.translation import gettext_lazy as _


class UsersConfig(AppConfig):
    name = "ucf_here_face_demo.users"
    verbose_name = _("Users")

    def ready(self):
        try:
            import ucf_here_face_demo.users.signals  # noqa: F401
        except ImportError:
            pass
