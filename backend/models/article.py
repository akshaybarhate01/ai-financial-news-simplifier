import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.database.session import Base

class NewsArticle(Base):
    __tablename__ = "news_articles"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title = Column(String(500), nullable=False, index=True)
    description = Column(Text, nullable=True)
    content = Column(Text, nullable=True)
    url = Column(String(1000), unique=True, index=True, nullable=False)
    image_url = Column(String(1000), nullable=True)
    source_name = Column(String(255), nullable=False, index=True)
    source_id = Column(String(100), nullable=True)
    author = Column(String(255), nullable=True)
    published_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False, index=True)
    
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=True)
    ticker = Column(String(20), nullable=True, index=True)
    company_name = Column(String(255), nullable=True, index=True)
    is_trending = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)

    # Relationships
    category = relationship("Category", back_populates="articles")
    ai_summary = relationship("AISummary", back_populates="article", uselist=False, cascade="all, delete-orphan")
    sentiment = relationship("Sentiment", back_populates="article", uselist=False, cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="article", cascade="all, delete-orphan")
    reading_history = relationship("ReadingHistory", back_populates="article", cascade="all, delete-orphan")
