from django.urls import path
from .views import VideoFileListAPIView, VideoFileDetailAPIView

urlpatterns = [
    path('', VideoFileListAPIView.as_view(), name='video_list'),
    path('<int:pk>/', VideoFileDetailAPIView.as_view(), name = 'video_detail'),
]