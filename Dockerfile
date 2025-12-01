# Stage 1: Build React
FROM node:18-alpine as react-build

# Build React
WORKDIR /app/react
COPY media-site-frontend/package*.json ./
RUN npm install
COPY media-site-frontend/ ./
RUN npm run build

# Stage 2: Django with React build
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Django requirements
COPY media_site/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project
COPY media_site/ .

# Copy React build from previous stage
COPY --from=react-build /app/react/build /app/media-site-frontend/build

# Collect static files
RUN python manage.py collectstatic --noinput

# Run Django
CMD python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT

# Expose port
EXPOSE $PORT