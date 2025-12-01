from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/blog/', include('blog.urls')),
    path('api/audio/', include('audio.urls')),
    path('api/video/', include('video.urls')),

     # Serve React's index.html for all other routes
    re_path(r'^.*$', TemplateView.as_view(
        template_name='index.html',
        extra_context={}
    )),
] + static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)

# Only serve static files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
