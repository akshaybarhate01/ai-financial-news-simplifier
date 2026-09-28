from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.orm import relationship
from backend.database.session import Base

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), unique=True, nullable=False)
    slug = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    icon = Column(String(50), nullable=True)

    articles = relationship("NewsArticle", back_populates="category")
