# AI Financial News Simplifier — Industry Production Build

An enterprise fintech intelligence platform that retrieves live financial news, simplifies complex market journalism using **Llama 3.3 (70B)**, explains terminology with interactive analogies and glossary highlights, analyzes institutional sentiment, and equips analysts with contextually grounded AI assistance.

Built with a clean fintech design aesthetic inspired by Bloomberg, Linear, Stripe, and Google Finance.

---

## Key Features

* **Live Financial News Stream**: Filterable by sector, ticker, date, and verified wire sources with Redis-style in-memory caching and URL/title deduplication.
* **3-Line AI Simplification**: High-signal summary, plain-English breakdown, key takeaways, and direct market & valuation impact.
* **Explain Like I'm 15 (ELI15)**: Dedicated toggle explaining difficult concepts (e.g. inflation, repo rate, yield curves) through real-world everyday analogies with zero jargon.
* **Interactive Financial Glossary**: Automatically detects terms like GDP, CPI, Repo Rate, Bond, Liquidity, Dividend, and Fiscal Deficit. Clicking terms opens an analogy and definition drawer.
* **Institutional Market Sentiment**: Elegant Bullish, Neutral, and Bearish badges with analytical justification and target assets.
* **Company Intelligence Dossiers**: Reusable corporate profiles showing market cap, P/E ratio, 24h change, CEO, headquarters, overview, and related stories.
* **Personalized Dashboard**: Morning Brief, Top 5 Catalysts, Market Mood Gauge, Trending Companies, Bookmarks, and Reading History.
* **Interactive Chart.js Analytics**: Sector allocation doughnut, sentiment distribution bar chart, and weekly reading engagement volume.
* **Bookmarks & Collections**: Save articles, assign folders and custom tags, and export an executive PDF digest.
* **Multilingual Translation**: Preserves institutional meaning across English, Hindi (हिंदी), and Marathi (मराठी).
* **Contextual AI Chatbot**: "Ask AI About This Article" strictly scoped to facts stated in that specific story with prompt injection defense.
* **Daily AI Briefing**: Synthesizes market mood, top headlines, biggest movers, and economic events into an exportable PDF report.
* **Cybersecurity Defense**: Multi-layered Prompt Injection Defense middleware, bcrypt salt hashing, and JWT token rotation.

---

## Tech Stack

* **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Query, Zustand, Chart.js, react-chartjs-2, Lucide Icons.
* **Backend**: FastAPI, Python 3.14, SQLAlchemy, Pydantic v2, PyJWT, Bcrypt, ReportLab.
* **AI Intelligence**: Groq API (`llama-3.3-70b-versatile`) + Deterministic Semantic Fallback Engine.
* **Data Persistence**: Normalized SQLite (zero-config default) & PostgreSQL.
* **DevOps**: Docker, Docker Compose, Nginx, GitHub Actions CI.

---

## Quickstart Guide

### 1. Run with Docker Compose
```bash
docker-compose up --build -d
```
* Web App: [http://localhost](http://localhost)
* API Docs: [http://localhost:8000/docs](http://localhost:8000/docs)

### 2. Run Locally on Windows / Host

#### Backend:
```powershell
cd backend
$env:PYTHONPATH = ".."
py -m uvicorn backend.main:app --reload --port 8000
```

#### Frontend:
```powershell
cd frontend
$env:PATH = "C:\Program Files\nodejs;$env:PATH"
& "C:\Program Files\nodejs\npm.cmd" run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Demo Credentials

The database automatically seeds an initial analyst profile on first boot:

* **Email**: `analyst@fintechnews.com`
* **Password**: `Analyst123!`

---

## Running the Automated Test Suite

```powershell
$env:PYTHONPATH = "C:\Users\ADMIN\.gemini\antigravity-ide\scratch\ai-financial-news"
py -m pytest tests/ -v
```

14 passing tests covering:
* Authentication & JWT rotation
* News listing, filtering, and pagination
* AI structured JSON output schema validation
* Cybersecurity prompt injection & jailbreak detection
* Bookmarks CRUD & PDF export generation
