FROM python:3.11-slim

# Install ffmpeg for yt-dlp video merging and audio extraction
RUN apt-get update && \
    apt-get install -y ffmpeg && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Create the downloads directory just to be safe
RUN mkdir -p downloads

# Render sets the PORT environment variable automatically (defaults to 10000). 
# We'll use a shell script to run uvicorn with the correct port.
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
