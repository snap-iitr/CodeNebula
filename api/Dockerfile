# Stage 1: Build stage
FROM python:3.11-slim as builder

WORKDIR /app

# Install system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install Python dependencies (including gunicorn)
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt gunicorn

# Stage 2: Runtime stage
FROM python:3.11-slim

WORKDIR /app

# Copy Python dependencies
COPY --from=builder /root/.local /root/.local
# Ensure Python user-installed packages are in PATH
ENV PATH=/root/.local/bin:$PATH

# Copy application code
COPY . .

# Install runtime system dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends chromium-driver && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production

EXPOSE 8000
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "--workers", "4", "app:app"]