from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel

class UserPreferenceUpdate(BaseModel):
    preferred_language: Optional[str] = None # 'en', 'hi', 'mr'
    preferred_categories: Optional[List[str]] = None
    watchlist_companies: Optional[List[str]] = None
    email_brief_frequency: Optional[str] = None
    theme_mode: Optional[str] = None

class UserPreferenceOut(BaseModel):
    preferred_language: str
    preferred_categories: List[str]
    watchlist_companies: List[str]
    email_brief_frequency: str
    theme_mode: str

    class Config:
        from_attributes = True

class BookmarkCreate(BaseModel):
    article_id: int
    folder: Optional[str] = "General"
    tags: Optional[List[str]] = []
    notes: Optional[str] = None

class BookmarkOut(BaseModel):
    id: int
    user_id: int
    article_id: int
    folder: str
    tags: List[str]
    notes: Optional[str] = None
    created_at: datetime
    article: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class ReadingHistoryCreate(BaseModel):
    article_id: int
    read_duration_seconds: int = 30

class ReadingHistoryOut(BaseModel):
    id: int
    article_id: int
    read_duration_seconds: int
    read_at: datetime
    article: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True
