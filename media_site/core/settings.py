from datetime import timedelta
from pathlib import Path
import os
import dj_database_url

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent  # Points to media_site/

# React Build Path - go up from media_site to CMS, then to media-site-frontend
CMS_ROOT = BASE_DIR.parent  # Points to CMS/ folder
REACT_BUILD_DIR = CMS_ROOT / 'media-site-frontend' / 'build'

# Check if running in container
IS_DOCKER = os.path.exists('/.dockerenv')
# Check if running on Railway
IS_RAILWAY = "RAILWAY" in os.environ or "RAILWAY_ENVIRONMENT" in os.environ

# SECURITY WARNING: keep the secret key used in production secret!
# Use environment variable for production, fallback for development
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure--3)_33g5ro_m^$r=fp945ygz6hf0m3xof8w)&ae^bg#81z_)qc')

# SECURITY WARNING: don't run with debug turned on in production!
# Use environment variable, default to True for safety
DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

# Hosts configuration
if IS_DOCKER or IS_RAILWAY:
    # Production on Railway
    DEBUG = False  # Force DEBUG=False on Railway
    ALLOWED_HOSTS = ['.railway.app', 'localhost', '127.0.0.1']
    
    # Get Railway public domain if available
    railway_domain = os.getenv('RAILWAY_PUBLIC_DOMAIN', '')
    if railway_domain:
        ALLOWED_HOSTS.append(railway_domain)
    
    # CORS for production
    CORS_ALLOWED_ORIGINS = [
        f'https://{railway_domain}' if railway_domain else 'https://*.railway.app',
    ]
    CSRF_TRUSTED_ORIGINS = CORS_ALLOWED_ORIGINS.copy()
    
else:
    # Local development
    ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']
    
    # CORS for development (allow all)
    CORS_ALLOW_ALL_ORIGINS = True
    CSRF_TRUSTED_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000']

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'rest_framework',
    'rest_framework_simplejwt',
    'blog',
    'audio', 
    'video',
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # Must be first
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # For static files
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

# Database configuration
if IS_RAILWAY:
    # Use Railway PostgreSQL database
    DATABASES = {
        'default': dj_database_url.config(
            default=os.getenv('DATABASE_URL'),
            conn_max_age=600,
            ssl_require=True
        )
    }
else:
    # Local SQLite for development
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }

# Static files configuration
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')

# Include React build in static files if it exists
if REACT_BUILD_DIR.exists() and REACT_BUILD_DIR.is_dir():
    STATICFILES_DIRS = [
        os.path.join(REACT_BUILD_DIR, 'static'),
    ]
    print(f"✅ React build found at: {REACT_BUILD_DIR}")
else:
    print(f"⚠️ React build NOT found at: {REACT_BUILD_DIR}")
    STATICFILES_DIRS = []

# WhiteNoise configuration for serving static files
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# Media files configuration
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

# Template configuration
TEMPLATE_DIRS = [
    os.path.join(BASE_DIR, 'templates'),  # Your Django templates
]

if REACT_BUILD_DIR.exists():
    TEMPLATE_DIRS.append(str(REACT_BUILD_DIR))  # React build files

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': TEMPLATE_DIRS,
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Internationalization
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework configuration
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework_simplejwt.authentication.JWTAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 10
}

# JWT Settings
SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=1),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'AUTH_HEADER_TYPES': ('Bearer',),
}

# CORS settings (already configured above in host-specific sections)
# Add specific development origins for React dev server
if not IS_RAILWAY:
    CORS_ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

# Email backend for development
if DEBUG:
    EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Railway-specific settings
if IS_RAILWAY:
    # Force HTTPS in production
    SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    
    # Logging for Railway
    LOGGING = {
        'version': 1,
        'disable_existing_loggers': False,
        'handlers': {
            'console': {
                'class': 'logging.StreamHandler',
            },
        },
        'root': {
            'handlers': ['console'],
            'level': 'INFO',
        },
    }

# Print debug info
print(f"✅ Django settings loaded")
print(f"   BASE_DIR: {BASE_DIR}")
print(f"   IS_RAILWAY: {IS_RAILWAY}")
print(f"   DEBUG: {DEBUG}")
print(f"   ALLOWED_HOSTS: {ALLOWED_HOSTS}")
print(f"   REACT_BUILD_DIR: {REACT_BUILD_DIR}")
print(f"   REACT_BUILD_EXISTS: {REACT_BUILD_DIR.exists()}")