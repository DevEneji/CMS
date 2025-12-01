# Create Dockerfile in CMS/ folder
cat > Dockerfile << 'EOF'
FROM node:18-alpine as react-build

# Build React
WORKDIR /app/react
COPY media-site-frontend/package*.json ./
RUN npm install
COPY media-site-frontend/ ./
RUN npm run build

FROM python:3.11-slim

# Install dependencies
WORKDIR /app
COPY media_site/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy Django project
COPY media_site/ .

# Copy React build from previous stage
COPY --from=react-build /app/react/build /app/media-site-frontend/build

# Collect static files
RUN python manage.py collectstatic --noinput

# Run Django
CMD python manage.py migrate && gunicorn core.wsgi:application --bind 0.0.0.0:$PORT

EXPOSE $PORT
EOF

# Update railway.json
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE"
  }
}
EOF