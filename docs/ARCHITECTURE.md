# System Architecture & Technical Design

## Overview

**AI Financial News Simplifier** is an enterprise-grade fintech intelligence platform engineered with a strict clean-architecture separation between presentation, security middleware, application services, and data persistence.

---

## Architectural Principles

1. **Separation of Concerns**: Core business and AI logic is isolated in stateless services (`groq_service.py`, `news_service.py`, `glossary_service.py`).
2. **Defensive Gateway**: All inference requests pass through `PromptGuard` before LLM tokenization to eliminate prompt injection and data exfiltration threats.
3. **Resilient Dual-Engine**: Groq Cloud API with `llama-3.3-70b-versatile` serves as primary inference, backed by an intelligent local semantic fallback engine.
4. **Structured JSON Output**: The LLM outputs strict JSON objects adhering to Pydantic contracts rather than unconstrained markdown.

---

## Entity-Relationship (ER) Diagram

```mermaid
erDiagram
    User ||--o{ Bookmark : saves
    User ||--o{ ReadingHistory : reads
    User ||--|| UserPreference : configures
    User ||--o{ Analytics : aggregates
    NewsArticle ||--|| AISummary : generates
    NewsArticle ||--|| Sentiment : analyzes
    NewsArticle ||--o{ Bookmark : bookmarked_in
    NewsArticle ||--o{ ReadingHistory : tracked_in
    Category ||--o{ NewsArticle : categorizes
    CompanyIntelligence ||--o{ NewsArticle : referenced_in

    User {
        int id PK
        string email UK
        string hashed_password
        string full_name
        string role
        boolean is_active
        datetime created_at
    }

    NewsArticle {
        int id PK
        string title
        text content
        string url UK
        string source_name
        datetime published_at
        int category_id FK
        string ticker
        boolean is_trending
    }

    AISummary {
        int id PK
        int article_id FK
        json three_line_summary
        text beginner_explanation
        text eli15_explanation
        json key_takeaways
        text why_it_matters
        text market_impact
        float confidence_score
        text hindi_summary
        text marathi_summary
        string model_version
    }

    Sentiment {
        int id PK
        int article_id FK
        string sentiment_label
        float confidence
        text reasoning
        json target_assets
    }

    CompanyIntelligence {
        int id PK
        string ticker UK
        string name
        string industry
        string ceo
        string headquarters
        string market_cap
        text overview
    }

    Glossary {
        int id PK
        string term UK
        string slug UK
        string category
        text short_definition
        text beginner_analogy
        text full_explanation
        json related_terms
    }
```

---

## Data Flow Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User as Client (Browser)
    participant UI as React + Zustand
    participant GW as Prompt Guard Middleware
    participant API as FastAPI Router
    participant LLM as Groq (Llama 3.3 70B)
    participant DB as PostgreSQL / SQLite

    User->>UI: Selects Article & asks "What is the market impact?"
    UI->>GW: POST /api/news/chat {article_id, question}
    GW->>GW: Sanitize zero-width chars & scan malicious tokens
    GW->>API: Validated payload
    API->>DB: Fetch article text & context
    DB-->>API: Verified article records
    API->>LLM: Encapsulated prompt with rigid context boundary
    LLM-->>API: Strict JSON response {answer, is_in_scope, confidence}
    API-->>UI: Uniform JSON envelope {success: true, data: {...}}
    UI-->>User: Displays clean chat response
```
