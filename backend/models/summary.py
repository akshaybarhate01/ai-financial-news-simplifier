import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.session import Base

class AISummary(Base):
    __tablename__ = "ai_summaries"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), unique=True, nullable=False)
    
    three_line_summary = Column(JSON, nullable=False) # list of 3 strings
    beginner_explanation = Column(Text, nullable=False)
    eli15_explanation = Column(Text, nullable=False) # Explain Like I'm 15 with everyday analogies
    key_takeaways = Column(JSON, nullable=False) # list of bullet points
    why_it_matters = Column(Text, nullable=False)
    market_impact = Column(Text, nullable=False)
    confidence_score = Column(Float, default=0.95, nullable=False)
    
    # Multilingual translations
    hindi_summary = Column(Text, nullable=True)
    marathi_summary = Column(Text, nullable=True)
    
    model_version = Column(String(50), default="llama-3.3-70b-versatile", nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    article = relationship("NewsArticle", back_populates="ai_summary")
