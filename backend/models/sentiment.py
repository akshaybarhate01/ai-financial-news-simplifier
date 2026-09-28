import datetime
from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.session import Base

class Sentiment(Base):
    __tablename__ = "sentiments"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"), unique=True, nullable=False)
    sentiment_label = Column(String(20), nullable=False) # 'Bullish', 'Bearish', 'Neutral'
    confidence = Column(Float, default=0.88, nullable=False)
    reasoning = Column(Text, nullable=False) # Why it is bullish/bearish
    target_assets = Column(JSON, default=list, nullable=False) # e.g. ["NVDA", "AI Infrastructure", "Nasdaq"]
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    article = relationship("NewsArticle", back_populates="sentiment")
