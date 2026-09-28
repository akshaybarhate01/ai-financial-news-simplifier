from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.user import User
from backend.models.bookmark import Bookmark
from backend.models.reading_history import ReadingHistory
from backend.models.article import NewsArticle
from backend.schemas.user import BookmarkCreate, ReadingHistoryCreate
from backend.auth.jwt_handler import get_current_user
from backend.services.pdf_service import PDFService
from backend.utils.response import success_response

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks & Reading History"])

@router.get("", response_model=dict)
def list_user_bookmarks(
    folder: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve saved articles for the authenticated user."""
    query = db.query(Bookmark).filter(Bookmark.user_id == current_user.id)
    if folder:
        query = query.filter(Bookmark.folder == folder)

    bookmarks = query.order_by(Bookmark.created_at.desc()).all()
    results = []
    for b in bookmarks:
        art = b.article
        results.append({
            "id": b.id,
            "article_id": b.article_id,
            "folder": b.folder,
            "tags": b.tags,
            "notes": b.notes,
            "created_at": b.created_at.isoformat(),
            "article": {
                "id": art.id,
                "title": art.title,
                "description": art.description,
                "source_name": art.source_name,
                "url": art.url,
                "image_url": art.image_url,
                "published_at": art.published_at.isoformat(),
                "ticker": art.ticker,
                "ai_summary": {
                    "three_line_summary": art.ai_summary.three_line_summary if art.ai_summary else [],
                    "beginner_explanation": art.ai_summary.beginner_explanation if art.ai_summary else ""
                }
            } if art else None
        })

    return success_response(data=results)

@router.post("", response_model=dict, status_code=status.HTTP_201_CREATED)
def add_bookmark(
    payload: BookmarkCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Bookmark an article for future reading."""
    article = db.query(NewsArticle).filter(NewsArticle.id == payload.article_id).first()
    if not article:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Article not found."
        )

    existing = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        Bookmark.article_id == payload.article_id
    ).first()

    if existing:
        existing.folder = payload.folder or existing.folder
        existing.tags = payload.tags or existing.tags
        existing.notes = payload.notes or existing.notes
        db.commit()
        return success_response(message="Bookmark updated successfully.")

    bookmark = Bookmark(
        user_id=current_user.id,
        article_id=payload.article_id,
        folder=payload.folder or "General",
        tags=payload.tags or [],
        notes=payload.notes
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return success_response(
        data={"id": bookmark.id, "article_id": bookmark.article_id},
        message="Article bookmarked successfully."
    )

@router.delete("/{bookmark_or_article_id}", response_model=dict)
def delete_bookmark(
    bookmark_or_article_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Remove an article from user bookmarks by bookmark ID or article ID."""
    bookmark = db.query(Bookmark).filter(
        Bookmark.user_id == current_user.id,
        (Bookmark.id == bookmark_or_article_id) | (Bookmark.article_id == bookmark_or_article_id)
    ).first()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Bookmark not found."
        )

    db.delete(bookmark)
    db.commit()

    return success_response(message="Bookmark removed successfully.")

@router.get("/pdf")
def export_bookmarks_pdf(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Generate and download an executive PDF digest of all user bookmarks."""
    bookmarks = db.query(Bookmark).filter(Bookmark.user_id == current_user.id).all()
    serialized = []
    for b in bookmarks:
        art = b.article
        serialized.append({
            "folder": b.folder,
            "article": {
                "title": art.title if art else "Untitled",
                "source_name": art.source_name if art else "Financial News",
                "description": art.description if art else "",
                "ai_summary": {
                    "three_line_summary": art.ai_summary.three_line_summary if art and art.ai_summary else [],
                    "beginner_explanation": art.ai_summary.beginner_explanation if art and art.ai_summary else ""
                }
            }
        })

    pdf_bytes = PDFService.generate_bookmarks_pdf(serialized, current_user.full_name)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="Bookmarks_Digest_{current_user.full_name.replace(" ", "_")}.pdf"'}
    )

@router.post("/history", response_model=dict)
def record_reading_history(
    payload: ReadingHistoryCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Automatically record when a user reads an article."""
    history = ReadingHistory(
        user_id=current_user.id,
        article_id=payload.article_id,
        read_duration_seconds=payload.read_duration_seconds
    )
    db.add(history)
    db.commit()

    return success_response(message="Reading history recorded.")

@router.get("/history", response_model=dict)
def get_reading_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Retrieve the authenticated user's reading history."""
    history_items = db.query(ReadingHistory).filter(
        ReadingHistory.user_id == current_user.id
    ).order_by(ReadingHistory.read_at.desc()).limit(20).all()

    results = []
    for h in history_items:
        art = h.article
        results.append({
            "id": h.id,
            "article_id": h.article_id,
            "read_duration_seconds": h.read_duration_seconds,
            "read_at": h.read_at.isoformat(),
            "article": {
                "id": art.id,
                "title": art.title,
                "source_name": art.source_name,
                "ticker": art.ticker,
                "published_at": art.published_at.isoformat()
            } if art else None
        })

    return success_response(data=results)
