from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import AudioFile
from .serializers import AudioFileSerializer

class AudioFileListAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    
    def get(self, request):
        # Public access
        audio_files = AudioFile.objects.all().order_by('-uploaded_date')
        serializer = AudioFileSerializer(audio_files, many = True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = AudioFileSerializer(data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)


class AudioFileDetailAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]

    def get_object(self, pk):
        return get_object_or_404(AudioFile, pk=pk)
    
    def get(self, request, pk):
        audio_file = self.get_object(pk)
        serializer = AudioFileSerializer(audio_file)
        return Response(serializer.data)
    
    def put(self, request, pk):
        audio_file = self.get_object(pk)
        serializer = AudioFileSerializer(audio_file, data = request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status = status.HTTP_201_CREATED)
        return Response(serializer.errors, status = status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        audio_file = self.get_object(pk)
        audio_file.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
