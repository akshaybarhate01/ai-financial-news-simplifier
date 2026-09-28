import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from dotenv import load_dotenv

load_dotenv()

from backend.database.init_db import init_database
from backend.middleware.prompt_guard import PromptSecurityException
from backend.middleware.error_handler import (
    http_exception_handler,
    validation_exception_handler,
    prompt_security_exception_handler,
    global_exception_handler
)
from backend.middleware.rate_limiter import rate_limiter
from backend.api.auth import router as auth_router
from backend.api.news import router as news_router
from backend.api.bookmarks import router as bookmarks_router
from backend.api.analytics import router as analytics_router
from backend.api.glossary import router as glossary_router
from backend.api.company import router as company_router
from backend.api.user import router as user_router
from backend.utils.response import success_response

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("fintech_news")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Starting AI Financial News Simplifier Backend...")
    init_database()
    logger.info("Database initialized successfully.")
    yield
    logger.info("Shutting down AI Financial News Simplifier Backend.")

app = FastAPI(
    title="AI Financial News Simplifier API",
    description="Enterprise API providing simplified financial news via Llama 3.3 70B, real-time sentiment analysis, and cybersecurity prompt defense.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Configuration
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Exception Handlers for uniform JSON envelopes
app.add_exception_handler(StarletteHTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(PromptSecurityException, prompt_security_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Rate Limiting Middleware
@app.middleware("http")
async def apply_rate_limit(request: Request, call_next):
    # Exempt health and docs endpoints
    if request.url.path in ["/health", "/api/health", "/docs", "/openapi.json", "/redoc"]:
        return await call_next(request)
    rate_limiter.check_rate_limit(request)
    return await call_next(request)

# Health Check Endpoints
@app.get("/health", tags=["Health"])
@app.get("/api/health", tags=["Health"])
def health_check():
    return success_response(
        data={
            "status": "healthy",
            "service": "AI Financial News Simplifier",
            "version": "1.0.0",
            "environment": os.getenv("ENVIRONMENT", "development")
        },
        message="System operating with zero anomalies."
    )

# Register API Routers under /api
app.include_router(auth_router, prefix="/api")
app.include_router(news_router, prefix="/api")
app.include_router(bookmarks_router, prefix="/api")
app.include_router(analytics_router, prefix="/api")
app.include_router(glossary_router, prefix="/api")
app.include_router(company_router, prefix="/api")
app.include_router(user_router, prefix="/api")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
