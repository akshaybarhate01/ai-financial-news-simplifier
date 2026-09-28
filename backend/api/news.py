from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.user import User
from backend.models.article import NewsArticle
from backend.models.category import Category
from backend.models.summary import AISummary
from backend.models.sentiment import Sentiment
from backend.models.company import CompanyIntelligence
from backend.models.bookmark import Bookmark
from backend.models.glossary import Glossary
from backend.schemas.ai import SimplifyRequest, ChatRequest
from backend.services.news_service import news_service
from backend.services.groq_service import groq_service
from backend.services.glossary_service import GlossaryService
from backend.services.company_service import CompanyService
from backend.services.pdf_service import PDFService
from backend.auth.jwt_handler import get_optional_current_user, get_current_user
from backend.utils.response import success_response

router = APIRouter(prefix="/news", tags=["Financial News & AI"])

@router.get("", response_model=dict)
def list_news(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    category: Optional[str] = None,
    search: Optional[str] = None,
    ticker: Optional[str] = None,
    source: Optional[str] = None,
    trending: Optional[bool] = None,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve paginated and filterable financial news articles."""
    result = news_service.get_articles(
        db=db,
        page=page,
        page_size=page_size,
        category_slug=category,
        search_query=search,
        ticker=ticker,
        source_name=source,
        is_trending=trending
    )

    user_bookmarks = set()
    if current_user:
        user_bookmarks = set(
            b.article_id for b in db.query(Bookmark.article_id).filter(Bookmark.user_id == current_user.id).all()
        )

    serialized_items = []
    for art in result["items"]:
        serialized_items.append({
            "id": art.id,
            "title": art.title,
            "description": art.description,
            "url": art.url,
            "image_url": art.image_url,
            "source_name": art.source_name,
            "source_id": art.source_id,
            "author": art.author,
            "published_at": art.published_at.isoformat(),
            "category": {
                "id": art.category.id,
                "name": art.category.name,
                "slug": art.category.slug
            } if art.category else None,
            "ticker": art.ticker,
            "company_name": art.company_name,
            "is_trending": art.is_trending,
            "sentiment": {
                "sentiment_label": art.sentiment.sentiment_label,
                "confidence": art.sentiment.confidence,
                "reasoning": art.sentiment.reasoning
            } if art.sentiment else None,
            "ai_summary": {
                "three_line_summary": art.ai_summary.three_line_summary,
                "eli15_explanation": art.ai_summary.eli15_explanation
            } if art.ai_summary else None,
            "is_bookmarked": art.id in user_bookmarks
        })

    return success_response(
        data={
            "items": serialized_items,
            "total": result["total"],
            "page": result["page"],
            "page_size": result["page_size"],
            "total_pages": result["total_pages"]
        }
    )

@router.get("/categories", response_model=dict)
def get_categories(db: Session = Depends(get_db)):
    """Retrieve all financial categories and sectors."""
    categories = db.query(Category).all()
    return success_response(
        data=[
            {
                "id": c.id,
                "name": c.name,
                "slug": c.slug,
                "description": c.description,
                "icon": c.icon
            } for c in categories
        ]
    )

@router.get("/article/{article_id}", response_model=dict)
def get_article_detail(
    article_id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve complete article details with AI analysis, company intelligence, and detected glossary terms."""
    article = db.query(NewsArticle).filter(NewsArticle.id == article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Article with ID {article_id} not found."
        )

    # Fetch or auto-create AI summary if missing
    if not article.ai_summary:
        ai_data = groq_service.simplify_article(article.title, article.content or article.description or "")
        summary = AISummary(
            article_id=article.id,
            three_line_summary=ai_data["three_line_summary"],
            beginner_explanation=ai_data["beginner_explanation"],
            eli15_explanation=ai_data["eli15_explanation"],
            key_takeaways=ai_data["key_takeaways"],
            why_it_matters=ai_data["why_it_matters"],
            market_impact=ai_data["market_impact"],
            confidence_score=ai_data.get("confidence_score", 0.95),
            hindi_summary=ai_data.get("hindi_summary"),
            marathi_summary=ai_data.get("marathi_summary"),
            model_version="llama-3.3-70b-versatile"
        )
        db.add(summary)

        sent_data = ai_data.get("sentiment", {})
        sentiment = Sentiment(
            article_id=article.id,
            sentiment_label=sent_data.get("sentiment_label", "Neutral"),
            confidence=sent_data.get("confidence", 0.88),
            reasoning=sent_data.get("reasoning", "Market analysis based on article trajectory."),
            target_assets=sent_data.get("target_assets", [article.ticker] if article.ticker else ["Equities"])
        )
        db.add(sentiment)
        db.commit()
        db.refresh(article)

    # Detect glossary terms
    all_terms = db.query(Glossary).all()
    terms_cache = [
        {
            "term": t.term,
            "slug": t.slug,
            "category": t.category,
            "short_definition": t.short_definition,
            "beginner_analogy": t.beginner_analogy
        } for t in all_terms
    ]
    detected_terms = GlossaryService.detect_terms_in_text(
        f"{article.title} {article.content or ''}",
        terms_cache
    )

    # Company intelligence
    company_data = None
    if article.ticker:
        company = db.query(CompanyIntelligence).filter(CompanyIntelligence.ticker == article.ticker.upper()).first()
        if company:
            company_data = {
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
                "change_24h": company.change_24h
            }

    is_bookmarked = False
    if current_user:
        is_bookmarked = db.query(Bookmark).filter(
            Bookmark.user_id == current_user.id,
            Bookmark.article_id == article.id
        ).first() is not None

    return success_response(
        data={
            "id": article.id,
            "title": article.title,
            "description": article.description,
            "content": article.content,
            "url": article.url,
            "image_url": article.image_url,
            "source_name": article.source_name,
            "author": article.author,
            "published_at": article.published_at.isoformat(),
            "category": {
                "id": article.category.id,
                "name": article.category.name,
                "slug": article.category.slug
            } if article.category else None,
            "ticker": article.ticker,
            "company_name": article.company_name,
            "is_trending": article.is_trending,
            "is_bookmarked": is_bookmarked,
            "ai_summary": {
                "three_line_summary": article.ai_summary.three_line_summary,
                "beginner_explanation": article.ai_summary.beginner_explanation,
                "eli15_explanation": article.ai_summary.eli15_explanation,
                "key_takeaways": article.ai_summary.key_takeaways,
                "why_it_matters": article.ai_summary.why_it_matters,
                "market_impact": article.ai_summary.market_impact,
                "confidence_score": article.ai_summary.confidence_score,
                "hindi_summary": article.ai_summary.hindi_summary,
                "marathi_summary": article.ai_summary.marathi_summary,
                "model_version": article.ai_summary.model_version
            } if article.ai_summary else None,
            "sentiment": {
                "sentiment_label": article.sentiment.sentiment_label,
                "confidence": article.sentiment.confidence,
                "reasoning": article.sentiment.reasoning,
                "target_assets": article.sentiment.target_assets
            } if article.sentiment else None,
            "company": company_data,
            "detected_terms": detected_terms
        }
    )

@router.post("/simplify", response_model=dict)
def simplify_article_endpoint(payload: SimplifyRequest, db: Session = Depends(get_db)):
    """Generate on-demand structured simplification for an article or custom financial text."""
    title = payload.title or "Financial Market Report"
    content = payload.content or ""

    if payload.article_id:
        article = db.query(NewsArticle).filter(NewsArticle.id == payload.article_id).first()
        if article:
            title = article.title
            content = article.content or article.description or ""

    result = groq_service.simplify_article(title=title, content=content, language=payload.language)
    return success_response(data=result)

@router.post("/chat", response_model=dict)
def chat_with_article_endpoint(payload: ChatRequest, db: Session = Depends(get_db)):
    """Ask contextual questions strictly scoped to the article."""
    article = db.query(NewsArticle).filter(NewsArticle.id == payload.article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Referenced article not found."
        )

    history = [{"role": m.role, "content": m.content} for m in payload.history]
    chat_result = groq_service.chat_with_article(
        title=article.title,
        content=article.content or article.description or "",
        question=payload.question,
        history=history
    )

    return success_response(data=chat_result)

@router.get("/daily-brief", response_model=dict)
def get_daily_brief(db: Session = Depends(get_db)):
    """Generate executive daily financial intelligence brief."""
    articles = db.query(NewsArticle).order_by(NewsArticle.published_at.desc()).limit(6).all()
    serialized = [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "source_name": a.source_name,
            "ticker": a.ticker
        } for a in articles
    ]
    brief = groq_service.generate_daily_brief(serialized)
    return success_response(data=brief)

@router.get("/daily-brief/pdf")
def export_daily_brief_pdf(db: Session = Depends(get_db)):
    """Generate and stream downloadable PDF for the daily AI brief."""
    articles = db.query(NewsArticle).order_by(NewsArticle.published_at.desc()).limit(6).all()
    serialized = [
        {
            "id": a.id,
            "title": a.title,
            "description": a.description,
            "source_name": a.source_name,
            "ticker": a.ticker
        } for a in articles
    ]
    brief = groq_service.generate_daily_brief(serialized)
    pdf_bytes = PDFService.generate_daily_brief_pdf(brief)

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": 'attachment; filename="Daily_AI_Financial_Brief.pdf"'}
    )
