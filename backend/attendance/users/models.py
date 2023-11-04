from django.contrib.auth.models import AbstractUser
from django.db.models import CharField, EmailField, TextChoices, BooleanField
from django.utils.translation import gettext_lazy as _

from attendance.users.managers import UserManager


class User(AbstractUser):
    """
    Default custom user model for this project.
    If adding fields that need to be filled at user signup,
    check forms.SignupForm and forms.SocialSignupForms accordingly.
    """

    # First and last name do not cover name patterns around the globe
    name = CharField(_("Name of User"), blank=True, max_length=255)
    first_name = None  # type: ignore
    last_name = None  # type: ignore
    email = EmailField(_("email address"), unique=True)
    username = None  # type: ignore

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    init_image = BooleanField(default=False)

    objects = UserManager()

    class UserRoleChoices(TextChoices):
        ADMIN = "admin", _("Admin")
        TEACHER = "teacher", _("Teacher")
        STUDENT = "student", _("Student")

    role = CharField(
        _("Role"),
        max_length=16,
        choices=UserRoleChoices.choices,
        default=UserRoleChoices.STUDENT,
    )
