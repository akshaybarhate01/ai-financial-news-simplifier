from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from backend.models.company import CompanyIntelligence

INITIAL_COMPANIES = [
    {
        "ticker": "NVDA",
        "name": "Nvidia Corporation",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg",
        "industry": "Semiconductors & AI Hardware",
        "ceo": "Jensen Huang",
        "headquarters": "Santa Clara, California, USA",
        "market_cap": "$3.15 Trillion",
        "overview": "Nvidia designs graphics processing units (GPUs) for gaming, professional visualization, data centers, and automotive infotainment, currently dominating the AI accelerator silicon market with Hopper and Blackwell architectures.",
        "website": "https://www.nvidia.com",
        "pe_ratio": "52.4",
        "change_24h": "+3.18%"
    },
    {
        "ticker": "AAPL",
        "name": "Apple Inc.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
        "industry": "Consumer Electronics & Services",
        "ceo": "Tim Cook",
        "headquarters": "Cupertino, California, USA",
        "market_cap": "$3.45 Trillion",
        "overview": "Apple manufactures consumer hardware including the iPhone, iPad, Mac, and Apple Watch, backed by high-margin recurring software ecosystems including Apple Services, iCloud, and Apple Pay.",
        "website": "https://www.apple.com",
        "pe_ratio": "33.8",
        "change_24h": "+0.85%"
    },
    {
        "ticker": "MSFT",
        "name": "Microsoft Corporation",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_%282012%29.svg",
        "industry": "Cloud Computing & Enterprise Software",
        "ceo": "Satya Nadella",
        "headquarters": "Redmond, Washington, USA",
        "market_cap": "$3.10 Trillion",
        "overview": "Microsoft develops enterprise cloud infrastructure (Azure), productivity software (Microsoft 365), operating systems (Windows), gaming (Xbox), and leads generative AI deployment through its partnership with OpenAI.",
        "website": "https://www.microsoft.com",
        "pe_ratio": "34.2",
        "change_24h": "-0.42%"
    },
    {
        "ticker": "GOOGL",
        "name": "Alphabet Inc.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
        "industry": "Internet Services & Artificial Intelligence",
        "ceo": "Sundar Pichai",
        "headquarters": "Mountain View, California, USA",
        "market_cap": "$2.20 Trillion",
        "overview": "Alphabet operates Google Search, YouTube, Android, Google Cloud Platform, and DeepMind research, monetizing primarily through search advertising, cloud infrastructure, and enterprise AI subscriptions.",
        "website": "https://abc.xyz",
        "pe_ratio": "24.6",
        "change_24h": "+1.25%"
    },
    {
        "ticker": "TSLA",
        "name": "Tesla, Inc.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/e/e8/Tesla_logo.png",
        "industry": "Electric Vehicles & Clean Energy",
        "ceo": "Elon Musk",
        "headquarters": "Austin, Texas, USA",
        "market_cap": "$780 Billion",
        "overview": "Tesla manufactures electric vehicles, energy storage systems (Megapack), solar roofs, and is developing autonomous driving robotics (Full Self-Driving, Cybercab, and Optimus humanoid robot).",
        "website": "https://www.tesla.com",
        "pe_ratio": "68.2",
        "change_24h": "+4.30%"
    },
    {
        "ticker": "JPM",
        "name": "JPMorgan Chase & Co.",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/a/af/J_P_Morgan_Chase_Logo_2008_1.svg",
        "industry": "Investment Banking & Financial Services",
        "ceo": "Jamie Dimon",
        "headquarters": "New York City, New York, USA",
        "market_cap": "$620 Billion",
        "overview": "The largest bank in the United States and one of the largest in the world, providing investment banking, asset management, treasury services, and commercial retail banking across over 100 markets.",
        "website": "https://www.jpmorganchase.com",
        "pe_ratio": "12.4",
        "change_24h": "+0.55%"
    },
    {
        "ticker": "RELIANCE",
        "name": "Reliance Industries Limited",
        "logo_url": "https://upload.wikimedia.org/wikipedia/commons/2/27/Reliance_Industries_Logo.svg",
        "industry": "Conglomerate (Energy, Retail, Telecom)",
        "ceo": "Mukesh Ambani",
        "headquarters": "Mumbai, Maharashtra, India",
        "market_cap": "$240 Billion",
        "overview": "India's largest conglomerate with diversified holdings across hydrocarbon petrochemicals, retail chain stores (Reliance Retail), 5G telecommunications (Jio Infocomm), and green new energy gigafactories.",
        "website": "https://www.ril.com",
        "pe_ratio": "26.1",
        "change_24h": "+1.10%"
    }
]

class CompanyService:
    @staticmethod
    def seed_initial_companies(db: Session):
        count = db.query(CompanyIntelligence).count()
        if count == 0:
            for item in INITIAL_COMPANIES:
                company = CompanyIntelligence(
                    ticker=item["ticker"],
                    name=item["name"],
                    logo_url=item["logo_url"],
                    industry=item["industry"],
                    ceo=item["ceo"],
                    headquarters=item["headquarters"],
                    market_cap=item["market_cap"],
                    overview=item["overview"],
                    website=item["website"],
                    pe_ratio=item["pe_ratio"],
                    change_24h=item["change_24h"]
                )
                db.add(company)
            db.commit()

    @staticmethod
    def get_company_by_ticker(db: Session, ticker: str) -> Optional[CompanyIntelligence]:
        return db.query(CompanyIntelligence).filter(CompanyIntelligence.ticker == ticker.upper()).first()

    @staticmethod
    def get_trending_companies(db: Session, limit: int = 5) -> List[CompanyIntelligence]:
        return db.query(CompanyIntelligence).limit(limit).all()
