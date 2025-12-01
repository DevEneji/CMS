from django.db import models

class AudioFile(models.Model):
    title = models.CharField(max_length=200)
    audio_file = models.FileField(upload_to='audio_files/')
    description = models.TextField()
    uploaded_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title