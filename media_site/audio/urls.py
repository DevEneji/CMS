from django.urls import path
from .views import AudioFileListAPIView, AudioFileDetailAPIView

urlpatterns = [
    path('', AudioFileListAPIView.as_view(), name = 'audio_list'),
    path('<int:pk>/', AudioFileDetailAPIView.as_view(), name = 'audio_detail'),
]