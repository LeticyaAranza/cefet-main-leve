from django.conf import settings


def google_analytics(request):
    return {
        "GA_MEASUREMENT_ID": getattr(settings, "GOOGLE_ANALYTICS_ID", ""),
    }
