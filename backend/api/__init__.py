from backend.api.auth import router as auth_router
from backend.api.news import router as news_router
from backend.api.bookmarks import router as bookmarks_router
from backend.api.analytics import router as analytics_router
from backend.api.glossary import router as glossary_router
from backend.api.company import router as company_router
from backend.api.user import router as user_router

__all__ = [
    "auth_router",
    "news_router",
    "bookmarks_router",
    "analytics_router",
    "glossary_router",
    "company_router",
    "user_router",
]
