# Deployment & Infrastructure Guide

This application is fully containerized and production-ready for deployment on Docker Compose, AWS ECS, Google Cloud Run, or Kubernetes.

---

## 1. Quickstart with Docker Compose

Run the entire stack with PostgreSQL, FastAPI, and Nginx React frontend in one command:

```bash
# Clone and enter workspace
cd scratch/ai-financial-news

# Copy environment variables
cp backend/.env.example .env

# Spin up containers
docker-compose up --build -d
```

### Verified Endpoints:
* Frontend Web App: `http://localhost`
* Backend API: `http://localhost:8000`
* Swagger UI Docs: `http://localhost:8000/docs`
* Health Check: `http://localhost:8000/api/health`

---

## 2. Local Development Without Docker

### Backend:
```powershell
cd backend
# Set Python Path & initialize database
$env:PYTHONPATH = ".."
py -m pip install -r requirements.txt
py -m uvicorn backend.main:app --reload --port 8000
```

### Frontend:
```powershell
cd frontend
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
& "C:\Program Files\nodejs\npm.cmd" install
& "C:\Program Files\nodejs\npm.cmd" run dev
```
Navigate to `http://localhost:5173`.

---

## 3. Production Environment Variables Reference

| Variable | Description | Default |
|---|---|---|
| `ENVIRONMENT` | Runtime environment mode | `production` |
| `DATABASE_URL` | PostgreSQL or SQLite connection URI | `sqlite:///./financial_news.db` |
| `SECRET_KEY` | Symmetric key for signing JWTs | Must be generated |
| `GROQ_API_KEY` | Groq Cloud API Key for Llama 3.3 | Optional (fallback active) |
| `GROQ_MODEL` | Target LLM model identifier | `llama-3.3-70b-versatile` |
| `NEWS_API_KEY` | NewsAPI key for global financial wire | Optional (fallback active) |
