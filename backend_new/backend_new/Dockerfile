FROM python:3.11-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PORT=8000

COPY requirements.txt ./requirements.txt

RUN pip install --no-cache-dir --upgrade pip \
    && pip install --no-cache-dir -r requirements.txt

COPY . ./backend_new

EXPOSE 8000

CMD ["sh", "-c", "uvicorn backend_new.main:app --host 0.0.0.0 --port ${PORT:-8000}"]