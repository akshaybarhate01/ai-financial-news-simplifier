import pytest
import os
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure test uses an in-memory or isolated test database
os.environ["DATABASE_URL"] = "sqlite:///./test_financial_news.db"
os.environ["SECRET_KEY"] = "test-secret-key-391820391283019283"

from backend.database.session import Base, get_db
from backend.main import app
from backend.database.init_db import init_database
from backend.models.user import User

test_engine = create_engine("sqlite:///./test_financial_news.db", connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    init_database()
    yield
    # Clean up test db file if desired
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_financial_news.db"):
        try:
            os.remove("./test_financial_news.db")
        except Exception:
            pass

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def auth_headers(client):
    """Obtain valid JWT authorization headers for the demo user."""
    response = client.post(
        "/api/auth/login",
        json={"email": "analyst@fintechnews.com", "password": "Analyst123!"}
    )
    data = response.json()
    token = data["data"]["access_token"]
    return {"Authorization": f"Bearer {token}"}
