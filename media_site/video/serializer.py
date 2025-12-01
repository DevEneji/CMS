from rest_framework import serializers
from .models import VideoFile

class VideoFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoFile
        fields = ['id', 'title', 'video_file', 'thumbnail', 'description', 'uploaded_date']
        read_only_fields = ['id', 'uploaded_date', 'thumbnail',]

    def validate_description(self, value):
        """Ensure description is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Description is required.")
        return value.strip()