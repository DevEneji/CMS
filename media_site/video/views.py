from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import VideoFile
from .serializer import VideoFileSerializer

class VideoFileListAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get(self, request):
        video_file = VideoFile.objects.all().order_by('-uploaded_date')
        serializer = VideoFileSerializer(video_file, many = True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = VideoFileSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
class VideoFileDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        return get_object_or_404(VideoFile, pk=pk)
    
    def get(self, request, pk):
        video_file = self.get_object(pk)
        serializer = VideoFileSerializer(video_file)
        return Response(serializer.data)
    
    def put(self, request, pk):
        video_file = self.get_object(pk)
        serializer = VideoFileSerializer(video_file, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTPP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        self.permission_classes = [IsAuthenticated]
        video_file = self.get_object(pk)
        video_file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

