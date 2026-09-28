from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.company import CompanyIntelligence
from backend.models.article import NewsArticle
from backend.utils.response import success_response

router = APIRouter(prefix="/companies", tags=["Company Intelligence"])

@router.get("", response_model=dict)
def list_companies(db: Session = Depends(get_db)):
    """Retrieve all tracked corporate intelligence profiles."""
    companies = db.query(CompanyIntelligence).all()
    results = [
        {
            "id": c.id,
            "ticker": c.ticker,
            "name": c.name,
            "logo_url": c.logo_url,
            "industry": c.industry,
            "ceo": c.ceo,
            "headquarters": c.headquarters,
            "market_cap": c.market_cap,
            "overview": c.overview,
            "website": c.website,
            "pe_ratio": c.pe_ratio,
            "change_24h": c.change_24h
        } for c in companies
    ]
    return success_response(data=results)

@router.get("/{ticker}", response_model=dict)
def get_company_detail(ticker: str, db: Session = Depends(get_db)):
    """Retrieve single company dossier with related articles."""
    company = db.query(CompanyIntelligence).filter(CompanyIntelligence.ticker == ticker.upper()).first()
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company with ticker '{ticker}' not found."
        )

    # Fetch related articles
    related_articles = db.query(NewsArticle).filter(NewsArticle.ticker == ticker.upper()).limit(5).all()
    related_data = [
        {
            "id": a.id,
            "title": a.title,
            "source_name": a.source_name,
            "published_at": a.published_at.isoformat()
        } for a in related_articles
    ]

    return success_response(
        data={
            "id": company.id,
            "ticker": company.ticker,
            "name": company.name,
            "logo_url": company.logo_url,
            "industry": company.industry,
            "ceo": company.ceo,
            "headquarters": company.headquarters,
            "market_cap": company.market_cap,
            "overview": company.overview,
            "website": company.website,
            "pe_ratio": company.pe_ratio,
            "change_24h": company.change_24h,
            "related_articles": related_data
        }
    )
