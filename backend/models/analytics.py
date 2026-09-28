import datetime
from sqlalchemy import Column, Integer, Date, ForeignKey, JSON
from sqlalchemy.orm import relationship
from backend.database.session import Base

class Analytics(Base):
    __tablename__ = "analytics"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True, index=True)
    recorded_date = Column(Date, default=datetime.date.today, nullable=False, index=True)
    articles_read = Column(Integer, default=0, nullable=False)
    sectors_explored = Column(JSON, default=dict, nullable=False) # e.g. {"Equities": 5, "Macroeconomics": 3}
    sentiment_distribution = Column(JSON, default=dict, nullable=False) # e.g. {"Bullish": 4, "Neutral": 2, "Bearish": 1}
    weekly_engagement = Column(JSON, default=list, nullable=False) # e.g. [12, 18, 15, 22, 30, 25, 20]

    user = relationship("User", back_populates="analytics")
