from rest_framework import serializers
from .models import AudioFile

class AudioFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioFile
        fields = ['id', 'title', 'audio_file', 'description', 'uploaded_date']
        read_only_fields = ['id', 'uploaded_date']

    def validate_description(self, value):
        """Ensure description is not empty"""
        if not value.strip():
            raise serializers.ValidationError("Description is required.")
        return value.strip()