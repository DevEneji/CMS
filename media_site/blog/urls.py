from django.urls import path
from .views import BlogPostListAPIView, BlogPostDetailAPIView

urlpatterns = [
    path('', BlogPostListAPIView.as_view(), name = 'blog_list'),
    path('<int:pk>/', BlogPostDetailAPIView.as_view(), name = 'blog_detail'),
]