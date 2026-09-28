from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SectorAnalytics(BaseModel):
    labels: List[str]
    values: List[int]

class SentimentAnalytics(BaseModel):
    bullish: int
    neutral: int
    bearish: int
    bullish_percentage: float

class WeeklyReadingAnalytics(BaseModel):
    days: List[str]
    articles_read: List[int]
    minutes_spent: List[int]

class AnalyticsResponse(BaseModel):
    total_articles_read: int
    streak_days: int
    weekly_reading_time_minutes: int
    top_sectors: SectorAnalytics
    sentiment_distribution: SentimentAnalytics
    weekly_activity: WeeklyReadingAnalytics
    trending_companies: List[Dict[str, Any]]
