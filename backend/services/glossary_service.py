import re
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from backend.models.glossary import Glossary

INITIAL_GLOSSARY_DATA = [
    {
        "term": "Inflation",
        "slug": "inflation",
        "category": "Macroeconomics",
        "short_definition": "The rate at which the general level of prices for goods and services is rising.",
        "beginner_analogy": "Imagine a chocolate bar cost $1 last year, but today the exact same bar costs $1.10. That 10-cent hike without any extra chocolate is inflation eating away at your purchasing power.",
        "full_explanation": "Inflation reduces the purchasing power of each unit of currency. Central banks like the Federal Reserve or RBI combat runaway inflation by raising benchmark interest rates to cool down consumer borrowing and corporate spending.",
        "related_terms": ["CPI", "Interest Rate", "Purchasing Power", "Stagflation"]
    },
    {
        "term": "CPI",
        "slug": "cpi",
        "category": "Macroeconomics",
        "short_definition": "Consumer Price Index: A measure that examines the weighted average of prices of a basket of consumer goods and services.",
        "beginner_analogy": "Think of CPI as the monthly receipt from a giant supermarket cart containing everyday essentials (bread, milk, rent, electricity, gasoline). Tracking this bill tells us if living costs are rising or falling.",
        "full_explanation": "The Consumer Price Index is the primary yardstick utilized by global policymakers to evaluate cost-of-living adjustments and calibrate monetary stimulus or tightening cycles.",
        "related_terms": ["Inflation", "Core CPI", "Federal Reserve", "Cost of Living"]
    },
    {
        "term": "GDP",
        "slug": "gdp",
        "category": "Macroeconomics",
        "short_definition": "Gross Domestic Product: The total monetary value of all finished goods and services produced within a country in a specific time period.",
        "beginner_analogy": "GDP is the country's annual report card. If a country were a mega-bakery, GDP is the total revenue generated from every loaf of bread, pastry, and coffee sold across all branches.",
        "full_explanation": "GDP provides an economic snapshot of a country, used to estimate the size of an economy and its growth rate. A contracting GDP over two consecutive quarters is the classical technical definition of a recession.",
        "related_terms": ["Recession", "Economic Growth", "Per Capita GDP", "Productivity"]
    },
    {
        "term": "Repo Rate",
        "slug": "repo-rate",
        "category": "Monetary Policy",
        "short_definition": "Repurchase Option Rate: The rate at which the central bank lends money to commercial banks in the event of any shortfall of funds.",
        "beginner_analogy": "If your neighborhood bank runs low on cash at closing time, they borrow emergency funds from the Central Bank. The interest rate on that loan is the Repo Rate. When it rises, your car and home loans also become pricier.",
        "full_explanation": "Central banks employ the repo rate as their primary lever to regulate credit expansion. Higher repo rates drain excess liquidity from the banking system to control inflation.",
        "related_terms": ["Reverse Repo Rate", "Liquidity", "Monetary Policy", "Central Bank"]
    },
    {
        "term": "Liquidity",
        "slug": "liquidity",
        "category": "Financial Markets",
        "short_definition": "The ease with which an asset can be converted into cash without affecting its market price.",
        "beginner_analogy": "Cash in your pocket is 100% liquid; you can buy a sandwich instantly. A luxury penthouse apartment is illiquid; finding a buyer and closing paperwork could take six months.",
        "full_explanation": "Liquid markets have ample buyers and sellers with tight bid-ask spreads. When market liquidity vanishes, volatility surges and trading costs spike dramatically.",
        "related_terms": ["Cash Flow", "Market Depth", "Volatility", "Bid-Ask Spread"]
    },
    {
        "term": "Bond",
        "slug": "bond",
        "category": "Debt & Fixed Income",
        "short_definition": "A fixed-income instrument that represents a loan made by an investor to a borrower (typically corporate or governmental).",
        "beginner_analogy": "A formal I.O.U. certificate. You lend the government $1,000 for 10 years; they pay you a fixed $40 interest 'coupon' every year, and give your full $1,000 back at maturity.",
        "full_explanation": "Bonds are debt securities used by sovereign governments and corporations to finance capital expenditures, infrastructure, or operational deficits without diluting equity ownership.",
        "related_terms": ["Yield Curve", "Treasury", "Coupon Rate", "Default Risk"]
    },
    {
        "term": "Yield Curve",
        "slug": "yield-curve",
        "category": "Debt & Fixed Income",
        "short_definition": "A line graph plotting the interest rates of bonds having equal credit quality but differing maturity dates.",
        "beginner_analogy": "Normally, lending money for 10 years pays higher interest than lending for 3 months. When the graph 'inverts' (short term pays more than long term), it's a historic warning siren for an impending recession.",
        "full_explanation": "Yield curve inversions (particularly the 2-year vs 10-year US Treasury spread) have accurately presaged virtually every major modern global economic recession.",
        "related_terms": ["Bond", "Recession", "Treasury Spread", "Interest Rates"]
    },
    {
        "term": "Dividend",
        "slug": "dividend",
        "category": "Equities",
        "short_definition": "The distribution of a portion of a company's earnings, decided and managed by the company's board of directors, to a class of its shareholders.",
        "beginner_analogy": "Think of it as your cut of the profits. If you and your friend run a lemonade stand and make $100 profit, you might decide to pocket $20 each as a reward and reinvest the rest into more lemons.",
        "full_explanation": "Mature, profitable blue-chip enterprises frequently issue recurring cash dividends as an indicator of financial stability and shareholder return discipline.",
        "related_terms": ["Dividend Yield", "Payout Ratio", "Equities", "Share Repurchase"]
    },
    {
        "term": "Fiscal Deficit",
        "slug": "fiscal-deficit",
        "category": "Public Finance",
        "short_definition": "The shortfall in a government's total income (taxes and other receipts) compared with its total expenditures.",
        "beginner_analogy": "If a government earns $100 from taxes this month but spends $120 building bridges, schools, and defense, that missing $20 must be borrowed. That gap is the fiscal deficit.",
        "full_explanation": "Governments bridge fiscal deficits through sovereign debt issuance. While controlled deficits stimulate capital formation, chronic excessive deficits induce currency debasement and sovereign ratings downgrades.",
        "related_terms": ["Sovereign Debt", "National Budget", "Taxation", "GDP"]
    },
    {
        "term": "P/E Ratio",
        "slug": "pe-ratio",
        "category": "Valuation",
        "short_definition": "Price-to-Earnings Ratio: The ratio for valuing a company that measures its current share price relative to its per-share earnings (EPS).",
        "beginner_analogy": "How many dollars you must pay today to purchase $1 of a company's annual profit. If P/E is 20, you're paying $20 upfront for every dollar the business earns each year.",
        "full_explanation": "A high P/E indicates investors anticipate robust future revenue acceleration, whereas a low P/E can denote undervaluation or structural headwinds.",
        "related_terms": ["Valuation", "Earnings Per Share", "Market Cap", "Multiple"]
    },
    {
        "term": "Quantitative Easing",
        "slug": "quantitative-easing",
        "category": "Monetary Policy",
        "short_definition": "An unconventional monetary policy whereby a central bank purchases longer-term securities from the open market in order to increase the money supply.",
        "beginner_analogy": "When slashing interest rates to zero isn't enough, the Central Bank opens an electronic money tap and floods financial institutions with cash in exchange for government bonds to restart commerce.",
        "full_explanation": "Introduced extensively following the 2008 GFC and 2020 pandemic, quantitative easing injects massive baseline reserves, flattens yields, and stimulates capital markets.",
        "related_terms": ["Central Bank", "Balance Sheet", "Liquidity", "Money Supply"]
    }
]

class GlossaryService:
    @staticmethod
    def seed_initial_glossary(db: Session):
        """Seed default glossary terms if the table is empty."""
        count = db.query(Glossary).count()
        if count == 0:
            for item in INITIAL_GLOSSARY_DATA:
                glossary_term = Glossary(
                    term=item["term"],
                    slug=item["slug"],
                    category=item["category"],
                    short_definition=item["short_definition"],
                    beginner_analogy=item["beginner_analogy"],
                    full_explanation=item["full_explanation"],
                    related_terms=item["related_terms"]
                )
                db.add(glossary_term)
            db.commit()

    @staticmethod
    def get_all_terms(db: Session) -> List[Glossary]:
        return db.query(Glossary).order_by(Glossary.term).all()

    @staticmethod
    def get_term_by_slug(db: Session, slug: str) -> Optional[Glossary]:
        return db.query(Glossary).filter(Glossary.slug == slug.lower()).first()

    @staticmethod
    def detect_terms_in_text(text: str, terms_cache: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Detect occurrences of financial terms in article text.
        Returns a list of detected term dictionaries with word positions and short explanations.
        """
        if not text:
            return []
        
        detected = []
        lower_text = text.lower()
        
        for item in terms_cache:
            term = item["term"]
            # Look for whole word boundary match
            pattern = r'\b' + re.escape(term.lower()) + r'\b'
            if re.search(pattern, lower_text):
                detected.append({
                    "term": term,
                    "slug": item.get("slug", term.lower().replace(" ", "-")),
                    "category": item.get("category", "General"),
                    "short_definition": item.get("short_definition", ""),
                    "beginner_analogy": item.get("beginner_analogy", "")
                })
        
        return detected
