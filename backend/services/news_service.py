import os
import time
import hashlib
import logging
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional
import httpx
from sqlalchemy.orm import Session
from backend.models.article import NewsArticle
from backend.models.category import Category
from backend.models.summary import AISummary
from backend.models.sentiment import Sentiment
from backend.models.company import CompanyIntelligence
from backend.services.groq_service import groq_service

logger = logging.getLogger("fintech_news.news_service")

# High-signal baseline seed articles ensuring 100% realistic experience immediately
SEED_ARTICLES = [
    {
        "title": "Nvidia Blackwell GPU Deliveries Accelerate as Hyperscalers Expand AI Data Centers",
        "description": "Nvidia confirms volume shipments of its next-generation Blackwell architecture, driving record revenue expectations across Microsoft, Alphabet, and Meta cloud platforms.",
        "content": (
            "Nvidia Corporation announced that customer shipments of its flagship Blackwell B200 and GB200 AI GPUs are accelerating ahead of initial Wall Street estimates. "
            "Major hyperscale cloud providers including Microsoft Azure, Google Cloud, and Amazon Web Services have expanded their multi-billion dollar capital expenditure budgets "
            "to secure advanced high-density computing clusters. Chief Executive Jensen Huang reaffirmed that AI infrastructure demand remains exceptionally robust. "
            "Wall Street analysts project Blackwell will contribute over $10 billion in incremental quarterly data center revenue, while gross margins remain near 75%. "
            "The announcement has catalyzed a broad rally across semiconductor suppliers and server assembly partners."
        ),
        "url": "https://www.bloomberg.com/news/articles/2026-09-20/nvidia-blackwell-gpu-accelerates-ai-datacenter",
        "image_url": "https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80",
        "source_name": "Bloomberg Markets",
        "source_id": "bloomberg",
        "author": "Ian King",
        "category_slug": "equities",
        "ticker": "NVDA",
        "company_name": "Nvidia Corporation",
        "is_trending": True,
        "sentiment_label": "Bullish",
        "sentiment_reasoning": "Unprecedented hyperscaler capex commitments and accelerated Blackwell GPU shipments guarantee massive multi-quarter revenue expansion."
    },
    {
        "title": "Federal Reserve Weighs 25-Basis-Point Rate Cut as Core Inflation Moderates Toward 2% Target",
        "description": "Fed officials signal confidence that inflationary pressures have structurally subsided, clearing the path for orderly monetary policy normalization.",
        "content": (
            "Federal Reserve policymakers signaled an increasing consensus toward lowering the federal funds target rate by 25 basis points at the upcoming FOMC meeting. "
            "Recent Consumer Price Index (CPI) metrics indicated that core goods deflation and cooling housing rent indices have sustained the path toward the central bank's 2.0% objective. "
            "Federal Reserve Chairman Jerome Powell noted in recent public remarks that the labor market has attained a balanced equilibrium, eliminating wage-spiral risks. "
            "Fixed income markets rallied in response, with the 10-year US Treasury yield easing toward 3.82% as institutional investors anticipated lower borrowing costs "
            "for corporate credit and commercial real estate refinancing."
        ),
        "url": "https://www.reuters.com/markets/us/fed-weighs-rate-cut-core-inflation-moderates-2026-09-21/",
        "image_url": "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
        "source_name": "Reuters Financial",
        "source_id": "reuters",
        "author": "Howard Schneider",
        "category_slug": "macroeconomics",
        "ticker": None,
        "company_name": None,
        "is_trending": True,
        "sentiment_label": "Bullish",
        "sentiment_reasoning": "Lower benchmark interest rates reduce corporate debt servicing costs and stimulate equity multiples and consumer spending."
    },
    {
        "title": "Apple Services Revenue Hits All-Time High Supported by 1.2 Billion Paid Subscriptions",
        "description": "Apple reports accelerating growth across iCloud, Apple Pay, and the App Store as high-margin recurring software revenue cushions hardware replacement cycles.",
        "content": (
            "Apple Inc. reported quarterly financial results highlighting record performance in its Services division, which generated over $25 billion in high-margin recurring revenue. "
            "The technology giant now counts over 1.2 billion active paid subscriptions across its global installed base of 2.2 billion active hardware devices. "
            "Chief Executive Tim Cook highlighted strong adoption of Apple Intelligence features integrated into the latest iPhone 16 family, driving upgraded consumer retention. "
            "Operating cash flow reached $28 billion for the quarter, allowing Apple to return $24 billion to shareholders via share buybacks and regular quarterly dividend distributions."
        ),
        "url": "https://www.wsj.com/tech/apple-services-revenue-all-time-high-2026-09-22",
        "image_url": "https://images.unsplash.com/photo-1510519138197-06b8628cbf47?auto=format&fit=crop&w=1200&q=80",
        "source_name": "Wall Street Journal",
        "source_id": "wsj",
        "author": "Aaron Tilley",
        "category_slug": "equities",
        "ticker": "AAPL",
        "company_name": "Apple Inc.",
        "is_trending": True,
        "sentiment_label": "Bullish",
        "sentiment_reasoning": "Surging recurring services revenue expands Apple's gross margin profile to 46% and decouples earnings from cyclical hardware volatility."
    },
    {
        "title": "US Treasury Yield Curve Steepens as Benchmark 10-Year Bond Yield Adjusts to Fiscal Outlook",
        "description": "Yield curve normalizes after prolonged historical inversion, reshaping bank lending margins and bond portfolio durations.",
        "content": (
            "The US Treasury yield curve continued its steepening trajectory, with the spread between 2-year and 10-year Treasury notes widening to +28 basis points. "
            "The milestone marks a decisive exit from the longest yield curve inversion in modern economic history, which began in mid-2022. "
            "Commercial banks and regional financial institutions reported an immediate easing of net interest margin (NIM) compression, "
            "allowing lenders to expand underwriting standards for prime corporate borrowers. Sovereign wealth funds and institutional bond managers are rebalancing duration risk."
        ),
        "url": "https://www.ft.com/content/us-treasury-yield-curve-steepens-normalizes-2026-09-22",
        "image_url": "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
        "source_name": "Financial Times",
        "source_id": "financial-times",
        "author": "Kate Duguid",
        "category_slug": "fixed-income",
        "ticker": "JPM",
        "company_name": "JPMorgan Chase & Co.",
        "is_trending": False,
        "sentiment_label": "Neutral",
        "sentiment_reasoning": "Yield curve disinversion eliminates immediate recession indicators but signals elevated long-term sovereign debt issuance."
    },
    {
        "title": "Crude Oil Swings Near $78 Per Barrel as Middle East Shipping Routes Face Strategic Redirections",
        "description": "Energy markets process maritime route diversions and OPEC+ output quota discipline, impacting airline operational costs and global refinery margins.",
        "content": (
            "Brent crude futures fluctuated near $78.40 per barrel following geopolitical friction across critical Red Sea maritime choke-points, "
            "prompting international tanker operators to reroute cargoes around Africa's Cape of Good Hope. "
            "The additional transit time of 10 to 14 days has introduced tanker freight premiums and heightened spot jet fuel prices for global airlines. "
            "Meanwhile, OPEC+ delegates confirmed adherence to existing voluntary crude production cuts through the upcoming quarter to prevent excess market inventory builds."
        ),
        "url": "https://www.cnbc.com/2026/09/22/crude-oil-prices-middle-east-shipping-reroutes.html",
        "image_url": "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80",
        "source_name": "CNBC Energy",
        "source_id": "cnbc",
        "author": "Natasha Turak",
        "category_slug": "commodities",
        "ticker": None,
        "company_name": None,
        "is_trending": False,
        "sentiment_label": "Neutral",
        "sentiment_reasoning": "Supply side risks from shipping bottlenecks are counterbalanced by disciplined non-OPEC production and stable refining inventories."
    },
    {
        "title": "RBI Retains Repo Rate at 6.50% Citing Robust 7.2% Domestic GDP Growth and Food Price Vigilance",
        "description": "The Reserve Bank of India maintains its withdrawal of accommodation monetary policy stance, emphasizing financial stability and strong corporate balance sheets.",
        "content": (
            "The Monetary Policy Committee of the Reserve Bank of India voted unanimously to keep the policy repo rate unchanged at 6.50%. "
            "Governor Shaktikanta Das highlighted that India's domestic economic fundamentals remain extraordinarily resilient, with full-year real GDP growth projected at 7.2%. "
            "Systemic banking liquidity has remained comfortable, fostering double-digit credit growth across infrastructure, retail mortgage, and manufacturing sectors. "
            "The central bank reiterated its commitment to aligning headline CPI inflation durably with the 4.0% medium-term target before considering monetary accommodation."
        ),
        "url": "https://www.livemint.com/economy/rbi-monetary-policy-repo-rate-september-2026-1171887654321.html",
        "image_url": "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
        "source_name": "Mint Financial",
        "source_id": "livemint",
        "author": "Gopika Gopakumar",
        "category_slug": "central-banks",
        "ticker": "RELIANCE",
        "company_name": "Reliance Industries Limited",
        "is_trending": True,
        "sentiment_label": "Bullish",
        "sentiment_reasoning": "High GDP expansion coupled with monetary predictability provides ideal operating tailwinds for Indian capital markets and corporate capex."
    }
]

INITIAL_CATEGORIES = [
    {"name": "Macroeconomics", "slug": "macroeconomics", "description": "Global economic indicators, inflation, GDP, and trade balance", "icon": "Globe"},
    {"name": "Equities & Stocks", "slug": "equities", "description": "Company earnings, corporate actions, and equity market indices", "icon": "TrendingUp"},
    {"name": "Monetary Policy", "slug": "central-banks", "description": "Central bank actions, interest rates, and quantitative easing", "icon": "Landmark"},
    {"name": "Fixed Income", "slug": "fixed-income", "description": "Government bonds, treasury yields, and corporate credit markets", "icon": "Shield"},
    {"name": "Commodities & Energy", "slug": "commodities", "description": "Crude oil, gold, copper, agricultural produce, and minerals", "icon": "Layers"},
    {"name": "Crypto & Digital Assets", "slug": "crypto", "description": "Bitcoin, Ethereum, blockchain protocols, and institutional custody", "icon": "Coins"}
]

class NewsService:
    def __init__(self):
        self.api_key = os.getenv("NEWS_API_KEY")
        self.cache: Dict[str, Any] = {}
        self.cache_ttl = 900 # 15 minutes cache

    def seed_initial_news(self, db: Session):
        """Seed categories and baseline high-quality financial news articles."""
        # 1. Seed Categories
        cat_map = {}
        for c in INITIAL_CATEGORIES:
            cat = db.query(Category).filter(Category.slug == c["slug"]).first()
            if not cat:
                cat = Category(
                    name=c["name"],
                    slug=c["slug"],
                    description=c["description"],
                    icon=c["icon"]
                )
                db.add(cat)
                db.flush()
            cat_map[c["slug"]] = cat.id
        db.commit()

        # 2. Seed Articles if database empty
        count = db.query(NewsArticle).count()
        if count == 0:
            for seed in SEED_ARTICLES:
                cat_id = cat_map.get(seed.get("category_slug", "macroeconomics"))
                article = NewsArticle(
                    title=seed["title"],
                    description=seed["description"],
                    content=seed["content"],
                    url=seed["url"],
                    image_url=seed["image_url"],
                    source_name=seed["source_name"],
                    source_id=seed["source_id"],
                    author=seed["author"],
                    published_at=datetime.utcnow() - timedelta(hours=len(seed["title"]) % 12),
                    category_id=cat_id,
                    ticker=seed.get("ticker"),
                    company_name=seed.get("company_name"),
                    is_trending=seed.get("is_trending", False)
                )
                db.add(article)
                db.flush()

                # Generate AI Summary
                ai_data = groq_service.simplify_article(article.title, article.content)
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

                # Generate Sentiment
                sent_data = ai_data.get("sentiment", {})
                sentiment = Sentiment(
                    article_id=article.id,
                    sentiment_label=seed.get("sentiment_label", sent_data.get("sentiment_label", "Neutral")),
                    confidence=sent_data.get("confidence", 0.90),
                    reasoning=seed.get("sentiment_reasoning", sent_data.get("reasoning", "Measured market sentiment.")),
                    target_assets=sent_data.get("target_assets", [seed.get("ticker")] if seed.get("ticker") else ["Equities"])
                )
                db.add(sentiment)

            db.commit()

    def fetch_live_news_from_api(self, category: Optional[str] = None, query: Optional[str] = None) -> List[Dict[str, Any]]:
        """Fetch real-time news from NewsAPI with caching and deduplication."""
        if not self.api_key or not self.api_key.strip():
            return []

        cache_key = f"news_{category or 'all'}_{query or 'all'}"
        cached = self.cache.get(cache_key)
        if cached and (time.time() - cached["timestamp"] < self.cache_ttl):
            return cached["articles"]

        try:
            url = "https://newsapi.org/v2/top-headlines"
            params = {
                "apiKey": self.api_key,
                "category": "business",
                "language": "en",
                "pageSize": 25
            }
            if query:
                url = "https://newsapi.org/v2/everything"
                params = {
                    "apiKey": self.api_key,
                    "q": f"{query} AND (finance OR stock OR market)",
                    "language": "en",
                    "sortBy": "publishedAt",
                    "pageSize": 25
                }

            with httpx.Client(timeout=10.0) as client:
                resp = client.get(url, params=params)
                if resp.status_code == 200:
                    data = resp.json()
                    raw_articles = data.get("articles", [])
                    
                    # Deduplicate by URL & title hash
                    seen_hashes = set()
                    cleaned_articles = []
                    for art in raw_articles:
                        title = art.get("title")
                        url = art.get("url")
                        if not title or not url or "[Removed]" in title:
                            continue
                        h = hashlib.md5(f"{title}_{url}".encode("utf-8")).hexdigest()
                        if h in seen_hashes:
                            continue
                        seen_hashes.add(h)
                        cleaned_articles.append(art)

                    self.cache[cache_key] = {
                        "timestamp": time.time(),
                        "articles": cleaned_articles
                    }
                    return cleaned_articles
        except Exception as e:
            logger.warning(f"Failed to query live NewsAPI: {e}")

        return []

    def get_articles(
        self,
        db: Session,
        page: int = 1,
        page_size: int = 10,
        category_slug: Optional[str] = None,
        search_query: Optional[str] = None,
        ticker: Optional[str] = None,
        source_name: Optional[str] = None,
        is_trending: Optional[bool] = None
    ) -> Dict[str, Any]:
        """Query news articles with pagination and filtering."""
        query = db.query(NewsArticle)

        if category_slug:
            query = query.join(Category).filter(Category.slug == category_slug)
        if ticker:
            query = query.filter(NewsArticle.ticker == ticker.upper())
        if source_name:
            query = query.filter(NewsArticle.source_name.ilike(f"%{source_name}%"))
        if is_trending is not None:
            query = query.filter(NewsArticle.is_trending == is_trending)
        if search_query:
            pattern = f"%{search_query}%"
            query = query.filter(
                (NewsArticle.title.ilike(pattern)) |
                (NewsArticle.description.ilike(pattern)) |
                (NewsArticle.content.ilike(pattern)) |
                (NewsArticle.company_name.ilike(pattern))
            )

        total = query.count()
        total_pages = (total + page_size - 1) // page_size if total > 0 else 1
        offset = (page - 1) * page_size

        items = query.order_by(NewsArticle.published_at.desc()).offset(offset).limit(page_size).all()

        return {
            "items": items,
            "total": total,
            "page": page,
            "page_size": page_size,
            "total_pages": total_pages
        }

news_service = NewsService()
