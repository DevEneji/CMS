import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from django.conf import settings

print("=== Django Media Configuration Check ===")
print(f"DEBUG: {settings.DEBUG}")
print(f"MEDIA_URL: {settings.MEDIA_URL}")
print(f"MEDIA_ROOT: {settings.MEDIA_ROOT}")
print(f"MEDIA_ROOT exists: {os.path.exists(settings.MEDIA_ROOT)}")

if os.path.exists(settings.MEDIA_ROOT):
    print(f"\nContents of {settings.MEDIA_ROOT}:")
    for root, dirs, files in os.walk(settings.MEDIA_ROOT):
        level = root.replace(settings.MEDIA_ROOT, '').count(os.sep)
        indent = ' ' * 2 * level
        print(f"{indent}{os.path.basename(root)}/")
        subindent = ' ' * 2 * (level + 1)
        for file in files[:5]:  # Show first 5 files per directory
            print(f"{subindent}{file}")
        if len(files) > 5:
            print(f"{subindent}... and {len(files) - 5} more")

# Check a specific model
try:
    from blog.models import BlogPost
    print(f"\n=== Post Images in Database ===")
    for post in BlogPost.objects.all()[:5]:  # First 5 posts
        if post.image:
            print(f"Post {post.id}: {post.image.name}")
            full_path = os.path.join(settings.MEDIA_ROOT, post.image.name)
            print(f"  Full path: {full_path}")
            print(f"  Exists: {os.path.exists(full_path)}")
            print(f"  URL: {post.image.url}")
except Exception as e:
    print(f"\nCould not check models: {e}")