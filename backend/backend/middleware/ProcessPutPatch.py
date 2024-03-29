class ProcessPutPatchMiddleware:  # noqa: N999
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if (
            request.method in ("PUT", "PATCH")
            and request.content_type != "application/json"
        ):
            initial_method = request.method
            request.method = "POST"
            request.META["REQUEST_METHOD"] = "POST"
            request._load_post_and_files()  # noqa: SLF001
            request.META["REQUEST_METHOD"] = initial_method
            request.method = initial_method

        return self.get_response(request)
