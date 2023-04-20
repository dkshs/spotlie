from django.conf import settings
from storages.backends.gcloud import GoogleCloudStorage
from storages.utils import setting
from urllib.parse import urljoin


class ConfigurationError(Exception):
    pass


class GoogleCloudMediaStorage(GoogleCloudStorage):
    def __init__(self, *args, **kwargs):
        if not settings.MEDIA_URL:
            raise ConfigurationError("MEDIA_URL has not been configured")
        kwargs["bucket_name"] = setting("GS_MEDIA_BUCKET_NAME")
        super(GoogleCloudMediaStorage, self).__init__(*args, **kwargs)

    def url(self, name):
        return urljoin(settings.MEDIA_URL, name)


class GoogleCloudStaticStorage(GoogleCloudStorage):
    def __init__(self, *args, **kwargs):
        if not settings.STATIC_URL:
            raise ConfigurationError("STATIC_URL has not been configured")
        kwargs["bucket_name"] = setting("GS_STATIC_BUCKET_NAME")
        super(GoogleCloudStaticStorage, self).__init__(*args, **kwargs)

    def url(self, name):
        return urljoin(settings.STATIC_URL, name)
