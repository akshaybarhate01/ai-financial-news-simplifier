import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.database.session import Base

class CompanyIntelligence(Base):
    __tablename__ = "companies"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    ticker = Column(String(20), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False, index=True)
    logo_url = Column(String(500), nullable=True)
    industry = Column(String(100), nullable=False)
    ceo = Column(String(255), nullable=True)
    headquarters = Column(String(255), nullable=True)
    market_cap = Column(String(50), nullable=True) # e.g. "$3.12 Trillion"
    overview = Column(Text, nullable=False)
    website = Column(String(255), nullable=True)
    pe_ratio = Column(String(20), nullable=True) # e.g. "34.5"
    change_24h = Column(String(20), nullable=True) # e.g. "+2.4%"
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
