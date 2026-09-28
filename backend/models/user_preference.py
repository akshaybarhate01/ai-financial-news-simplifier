import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.session import Base

class UserPreference(Base):
    __tablename__ = "user_preferences"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    preferred_language = Column(String(10), default="en", nullable=False) # 'en', 'hi', 'mr'
    preferred_categories = Column(JSON, default=list, nullable=False) # ['Macroeconomics', 'Equities']
    watchlist_companies = Column(JSON, default=list, nullable=False) # ['AAPL', 'NVDA', 'MSFT']
    email_brief_frequency = Column(String(20), default="daily", nullable=False)
    theme_mode = Column(String(10), default="light", nullable=False) # 'light', 'dark'
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="preferences")
