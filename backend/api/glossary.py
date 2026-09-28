from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.glossary import Glossary
from backend.utils.response import success_response

router = APIRouter(prefix="/glossary", tags=["Financial Glossary"])

@router.get("", response_model=dict)
def get_all_glossary_terms(db: Session = Depends(get_db)):
    """Retrieve full encyclopedia of financial terminology with analogies."""
    terms = db.query(Glossary).order_by(Glossary.term.asc()).all()
    results = [
        {
            "id": t.id,
            "term": t.term,
            "slug": t.slug,
            "category": t.category,
            "short_definition": t.short_definition,
            "beginner_analogy": t.beginner_analogy,
            "full_explanation": t.full_explanation,
            "related_terms": t.related_terms
        } for t in terms
    ]
    return success_response(data=results)

@router.get("/{slug}", response_model=dict)
def get_term_detail(slug: str, db: Session = Depends(get_db)):
    """Retrieve in-depth breakdown for a specific financial term."""
    term = db.query(Glossary).filter(Glossary.slug == slug.lower()).first()
    if not term:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Glossary term '{slug}' not found."
        )

    return success_response(
        data={
            "id": term.id,
            "term": term.term,
            "slug": term.slug,
            "category": term.category,
            "short_definition": term.short_definition,
            "beginner_analogy": term.beginner_analogy,
            "full_explanation": term.full_explanation,
            "related_terms": term.related_terms
        }
    )
