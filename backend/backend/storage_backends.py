from django.conf import settings
from storages.backends.gcloud import GoogleCloudStorage
from storages.utils import setting
from urllib.parse import urljoin


class GoogleCloudMediaStorage(GoogleCloudStorage):
    def __init__(self, *args, **kwargs):  # sourcery skip: raise-specific-error
        if not settings.MEDIA_URL:
            raise Exception("MEDIA_URL has not been configured")
        kwargs["bucket_name"] = setting("GS_BUCKET_NAME")
        super(GoogleCloudMediaStorage, self).__init__(*args, **kwargs)

    def url(self, name):
        return urljoin(settings.MEDIA_URL, name)
