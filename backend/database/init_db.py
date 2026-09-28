import logging
from sqlalchemy.orm import Session
from backend.database.session import engine, Base, SessionLocal
from backend.models.user import User
from backend.models.user_preference import UserPreference
from backend.auth.security import hash_password
from backend.services.glossary_service import GlossaryService
from backend.services.company_service import CompanyService
from backend.services.news_service import news_service

logger = logging.getLogger("fintech_news.init_db")

def init_database():
    """Create all database schema tables and seed baseline financial records."""
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()
    try:
        # 1. Seed Glossary
        GlossaryService.seed_initial_glossary(db)

        # 2. Seed Companies
        CompanyService.seed_initial_companies(db)

        # 3. Seed News and Categories
        news_service.seed_initial_news(db)

        # 4. Seed Demo Analyst User
        demo_user = db.query(User).filter(User.email == "analyst@fintechnews.com").first()
        if not demo_user:
            demo_user = User(
                email="analyst@fintechnews.com",
                hashed_password=hash_password("Analyst123!"),
                full_name="Arya Stark (Fintech Lead)",
                role="analyst",
                is_active=True
            )
            db.add(demo_user)
            db.flush()

            prefs = UserPreference(
                user_id=demo_user.id,
                preferred_language="en",
                preferred_categories=["macroeconomics", "equities", "central-banks"],
                watchlist_companies=["NVDA", "AAPL", "MSFT", "TSLA"]
            )
            db.add(prefs)
            db.commit()
            logger.info("Demo user 'analyst@fintechnews.com' created.")

    except Exception as e:
        logger.error(f"Error during database initialization: {e}", exc_info=True)
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    init_database()
