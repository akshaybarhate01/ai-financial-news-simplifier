from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class SimplifyRequest(BaseModel):
    article_id: Optional[int] = None
    title: Optional[str] = None
    content: Optional[str] = None
    language: str = "en" # 'en', 'hi', 'mr'

class SimplifyResponse(BaseModel):
    article_id: Optional[int] = None
    three_line_summary: List[str]
    beginner_explanation: str
    eli15_explanation: str
    key_takeaways: List[str]
    why_it_matters: str
    market_impact: str
    confidence_score: float = 0.95
    sentiment: Dict[str, Any]
    hindi_summary: Optional[str] = None
    marathi_summary: Optional[str] = None
    detected_terms: List[Dict[str, str]] = []

class ChatMessage(BaseModel):
    role: str # 'user' or 'assistant'
    content: str

class ChatRequest(BaseModel):
    article_id: int
    question: str = Field(..., min_length=2, max_length=500)
    history: List[ChatMessage] = []

class ChatResponse(BaseModel):
    answer: str
    is_in_scope: bool = True
    context_used: List[str] = []
    confidence: float = 0.95

class DailyBriefResponse(BaseModel):
    date: str
    market_mood: Dict[str, Any]
    executive_summary: str
    top_stories: List[Dict[str, Any]]
    biggest_movers: List[Dict[str, Any]]
    economic_events: List[Dict[str, Any]]
    recommended_reading: List[Dict[str, Any]]
