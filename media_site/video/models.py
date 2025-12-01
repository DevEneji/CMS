from django.db import models
import os
from PIL import Image
import subprocess
import tempfile

# ffmpeg -version
# pip install ffmpeg-python

class VideoFile(models.Model):
    title = models.CharField(max_length=200)
    video_file = models.FileField(upload_to='video_files/')
    thumbnail = models.ImageField(upload_to = 'video_thumbnails/', blank=True, null=True)
    description = models.TextField()
    uploaded_date = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        # First save to get the file path
        super().save(*args, **kwargs)
        
        # Generate thumbnail if video file exists and no thumbnail yet
        if self.video_file and not self.thumbnail:
            self.generate_thumbnail()

    def generate_thumbnail(self):
        try:
            # Create a temporary file for the thumbnail
            with tempfile.NamedTemporaryFile(suffix='.jpg', delete=False) as temp_thumb:
                temp_path = temp_thumb.name

            # Use ffmpeg to extract a frame at 1 second
            video_path = self.video_file.path
            cmd = [
                'ffmpeg', '-i', video_path,
                '-ss', '00:00:01',  # Capture at 1 second
                '-vframes', '1',    # Capture 1 frame
                '-vf', 'scale=320:-1',  # Resize to 320px width
                '-q:v', '2',        # Quality setting
                temp_path,
                '-y'  # Overwrite output file
            ]
            
            subprocess.run(cmd, check=True, capture_output=True)
            
            # Save thumbnail to model
            thumb_name = f"thumb_{os.path.basename(self.video_file.name)}.jpg"
            self.thumbnail.save(thumb_name, open(temp_path, 'rb'))
            
            # Clean up temp file
            os.unlink(temp_path)
            
            # Save again to store thumbnail
            super().save()
            
        except Exception as e:
            print(f"Error generating thumbnail: {e}")

    