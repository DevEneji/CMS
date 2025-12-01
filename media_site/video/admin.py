from django.contrib import admin
from .models import VideoFile

@admin.register(VideoFile)
class VideoFileAdminn(admin.ModelAdmin):
    list_display = ['title', 'uploaded_date']
