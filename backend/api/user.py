from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.database.session import get_db
from backend.models.user import User
from backend.models.user_preference import UserPreference
from backend.schemas.user import UserPreferenceUpdate, UserPreferenceOut
from backend.auth.jwt_handler import get_current_user
from backend.utils.response import success_response

router = APIRouter(prefix="/user", tags=["User Profile & Preferences"])

@router.get("/profile", response_model=dict)
def get_profile(current_user: User = Depends(get_current_user)):
    return success_response(
        data={
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "role": current_user.role,
            "created_at": current_user.created_at.isoformat()
        }
    )

@router.put("/profile", response_model=dict)
def update_profile(
    payload: dict,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if "full_name" in payload and payload["full_name"].strip():
        current_user.full_name = payload["full_name"].strip()
    db.commit()
    return success_response(
        data={
            "id": current_user.id,
            "email": current_user.email,
            "full_name": current_user.full_name
        },
        message="Profile updated successfully."
    )

@router.get("/preferences", response_model=dict)
def get_preferences(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not prefs:
        prefs = UserPreference(
            user_id=current_user.id,
            preferred_language="en",
            preferred_categories=["macroeconomics", "equities"],
            watchlist_companies=["NVDA", "AAPL", "MSFT"]
        )
        db.add(prefs)
        db.commit()
        db.refresh(prefs)

    return success_response(
        data={
            "preferred_language": prefs.preferred_language,
            "preferred_categories": prefs.preferred_categories,
            "watchlist_companies": prefs.watchlist_companies,
            "email_brief_frequency": prefs.email_brief_frequency,
            "theme_mode": prefs.theme_mode
        }
    )

@router.put("/preferences", response_model=dict)
def update_preferences(
    payload: UserPreferenceUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prefs = db.query(UserPreference).filter(UserPreference.user_id == current_user.id).first()
    if not prefs:
        prefs = UserPreference(user_id=current_user.id)
        db.add(prefs)

    if payload.preferred_language is not None:
        prefs.preferred_language = payload.preferred_language
    if payload.preferred_categories is not None:
        prefs.preferred_categories = payload.preferred_categories
    if payload.watchlist_companies is not None:
        prefs.watchlist_companies = payload.watchlist_companies
    if payload.email_brief_frequency is not None:
        prefs.email_brief_frequency = payload.email_brief_frequency
    if payload.theme_mode is not None:
        prefs.theme_mode = payload.theme_mode

    db.commit()
    return success_response(
        data={
            "preferred_language": prefs.preferred_language,
            "preferred_categories": prefs.preferred_categories,
            "watchlist_companies": prefs.watchlist_companies,
            "email_brief_frequency": prefs.email_brief_frequency,
            "theme_mode": prefs.theme_mode
        },
        message="Preferences saved."
    )
