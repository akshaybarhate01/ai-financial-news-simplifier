from typing import Optional, List, Dict, Any
from datetime import datetime
from pydantic import BaseModel, HttpUrl

class CategoryOut(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    icon: Optional[str] = None

    class Config:
        from_attributes = True

class SentimentOut(BaseModel):
    id: Optional[int] = None
    sentiment_label: str
    confidence: float
    reasoning: str
    target_assets: List[str] = []

    class Config:
        from_attributes = True

class AISummaryOut(BaseModel):
    id: Optional[int] = None
    three_line_summary: List[str]
    beginner_explanation: str
    eli15_explanation: str
    key_takeaways: List[str]
    why_it_matters: str
    market_impact: str
    confidence_score: float
    hindi_summary: Optional[str] = None
    marathi_summary: Optional[str] = None
    model_version: str

    class Config:
        from_attributes = True

class CompanyOut(BaseModel):
    id: Optional[int] = None
    ticker: str
    name: str
    logo_url: Optional[str] = None
    industry: str
    ceo: Optional[str] = None
    headquarters: Optional[str] = None
    market_cap: Optional[str] = None
    overview: str
    website: Optional[str] = None
    pe_ratio: Optional[str] = None
    change_24h: Optional[str] = None

    class Config:
        from_attributes = True

class ArticleOut(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    content: Optional[str] = None
    url: str
    image_url: Optional[str] = None
    source_name: str
    source_id: Optional[str] = None
    author: Optional[str] = None
    published_at: datetime
    category: Optional[CategoryOut] = None
    ticker: Optional[str] = None
    company_name: Optional[str] = None
    is_trending: bool = False
    ai_summary: Optional[AISummaryOut] = None
    sentiment: Optional[SentimentOut] = None
    company: Optional[CompanyOut] = None
    is_bookmarked: bool = False

    class Config:
        from_attributes = True

class NewsListResponse(BaseModel):
    items: List[ArticleOut]
    total: int
    page: int
    page_size: int
    total_pages: int
