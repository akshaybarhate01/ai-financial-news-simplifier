import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from backend.database.session import Base

class Glossary(Base):
    __tablename__ = "glossary"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    term = Column(String(100), unique=True, index=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    category = Column(String(100), nullable=False, index=True)
    short_definition = Column(Text, nullable=False)
    beginner_analogy = Column(Text, nullable=False)
    full_explanation = Column(Text, nullable=False)
    related_terms = Column(JSON, default=list, nullable=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
