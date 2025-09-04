# Dockerfile for Python FastAPI Service
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for better caching
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy Python application
COPY chatbot.py .
COPY .env* ./
COPY models/ ./models/
COPY utils/ ./utils/
COPY middleware/ ./middleware/

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD python -c "import requests; requests.get(`${process.env.REACT_APP_API_URL}/health`)" || exit 1

# Run the FastAPI application
CMD ["uvicorn", "chatbot:app", "--host", "0.0.0.0", "--port", "8000"]