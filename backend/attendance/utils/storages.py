from django.conf import settings
from storages.backends.s3 import S3Storage


class StaticS3Storage(S3Storage):
    location = "static"
    default_acl = "public-read"
    querystring_auth = False


class MediaS3Storage(S3Storage):
    location = ""
    bucket_name = settings.MEDIA_BUCKET_NAME
    file_overwrite = False
    querystring_auth = True
