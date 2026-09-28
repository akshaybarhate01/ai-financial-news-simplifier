import { Article, DailyBrief, GlossaryTerm, AnalyticsData, User, UserPreferences, Category } from '../types';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Macroeconomics', slug: 'macroeconomics', description: 'Central banks, GDP growth, inflation dynamics, and sovereign monetary policy.' },
  { id: 2, name: 'Equities & Markets', slug: 'equities', description: 'Corporate earnings, stock market movements, and enterprise valuations.' },
  { id: 3, name: 'Fixed Income & Bonds', slug: 'fixed-income', description: 'Treasury yields, corporate credit spreads, and debt issuance.' },
  { id: 4, name: 'Commodities & Energy', slug: 'commodities', description: 'Crude oil, precious metals, and natural resource geopolitics.' },
  { id: 5, name: 'Central Banks', slug: 'central-banks', description: 'Federal Reserve, ECB, Bank of Japan, and RBI policy decisions.' },
  { id: 6, name: 'Fintech & Payments', slug: 'fintech', description: 'Digital banking, payment rails, and blockchain infrastructure.' },
  { id: 7, name: 'Mergers & Acquisitions', slug: 'mergers-acquisitions', description: 'Strategic buyouts, private equity takeovers, and regulatory antitrust scrutiny.' },
  { id: 8, name: 'Crypto & Digital Assets', slug: 'crypto', description: 'Bitcoin spot liquidity, institutional crypto funds, and decentralized protocols.' },
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 1,
    title: 'Nvidia Blackwell GPU Deliveries Accelerate as Hyperscalers Expand AI Data Centers',
    description: 'Nvidia confirms volume shipments of its next-generation Blackwell architecture, driving record revenue expectations across Microsoft, Alphabet, and Meta cloud platforms.',
    content: 'Nvidia Corporation announced that customer shipments of its flagship Blackwell B200 and GB200 AI GPUs are accelerating ahead of initial Wall Street estimates. Major hyperscale cloud providers including Microsoft Azure, Google Cloud, and Amazon Web Services have expanded their multi-billion dollar capital expenditure budgets to secure advanced high-density computing clusters. Chief Executive Jensen Huang reaffirmed that AI infrastructure demand remains exceptionally robust. Wall Street analysts project Blackwell will contribute over  billion in incremental quarterly data center revenue, while gross margins remain near 75%.',
    url: 'https://www.bloomberg.com/news/articles/2026-09-20/nvidia-blackwell-gpu-accelerates-ai-datacenter',
    image_url: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Bloomberg Markets',
    author: 'Ian King',
    published_at: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: { id: 2, name: 'Equities & Markets', slug: 'equities' },
    ticker: 'NVDA',
    company_name: 'Nvidia Corporation',
    is_trending: true,
    ai_summary: {
      three_line_summary: [
        'Nvidia started high-volume customer shipments of its flagship Blackwell B200 and GB200 AI processors ahead of initial Wall Street schedules.',
        'Big tech hyperscalers (Microsoft, Alphabet, Meta) raised multi-billion dollar capital budgets specifically to acquire Blackwell computing clusters.',
        'Institutional analysts estimate more than  billion in new quarterly data center sales with gross margins sustaining near 75%.'
      ],
      beginner_explanation: 'Nvidia builds the powerful computing engines that power modern Artificial Intelligence systems. Cloud computing giants like Microsoft and Google are spending unprecedented sums of money to buy Nvidia chip architectures, guaranteeing huge revenue growth for Nvidia over the coming quarters.',
      eli15_explanation: 'Think of AI as an enormous construction boom and Nvidia as the only company capable of making the heavy excavators and cranes everyone needs. The biggest builders are pre-ordering every single machine Nvidia can produce, paying top dollar before they even leave the factory.',
      why_it_matters: 'Validates that multi-billion dollar AI infrastructure investments are expanding rather than decelerating, serving as a powerful bellwether for the entire tech sector.',
      market_impact: 'Positive spillover for semiconductor foundries, advanced packaging suppliers, server rack manufacturers, and power utility providers.',
      key_takeaways: [
        'Blackwell B200 volume deliveries are running ahead of initial production ramp expectations.',
        'Gross profit margins are projected to hold steady at a premium ~75%.',
        'Directly reinforces multi-year capital expenditure guidance from major hyperscale cloud providers.'
      ],
      model_version: 'Llama 3.3 (70B)',
      confidence_score: 0.96,
      hindi_summary: 'एनवीडिया ने अपने नए ब्लैकवेल एआई चिप्स की बड़े पैमाने पर शिपमेंट शुरू कर दी है। माइक्रोसॉफ्ट और गूगल जैसे बड़े क्लाउड प्लेटफॉर्म अरबों डॉलर खर्च करके इन्हें खरीद रहे हैं, जिससे टेक सेक्टर में भारी तेजी का अनुमान है।',
      marathi_summary: 'एनव्हिडियाने आपल्या प्रगत ब्लॅकवेल एआय प्रोसेसरचे वितरण वेगाने सुरू केले आहे. मायक्रोसॉफ्ट आणि गुगलसारख्या दिग्गज कंपन्या अब्जावधी डॉलर्सची गुंतवणूक करून हे चिप्स खरेदी करत आहेत.'
    },
    sentiment: {
      sentiment_label: 'Bullish',
      confidence: 0.88,
      reasoning: 'Unprecedented hyperscaler capex commitments and accelerated Blackwell GPU shipments guarantee massive multi-quarter revenue expansion.',
    },
    company: {
      ticker: 'NVDA',
      name: 'Nvidia Corporation',
      industry: 'Semiconductors & Technology Hardware',
      market_cap: '.45 Trillion',
      pe_ratio: '54.2',
      ceo: 'Jensen Huang',
      headquarters: 'Santa Clara, California, USA',
      overview: 'Global market leader in graphics processing units (GPUs) and accelerated computing platforms powering artificial intelligence enterprise workflows.'
    },
    detected_terms: [
      {
        term: 'Gross Margin',
        slug: 'gross-margin',
        category: 'Corporate Finance',
        short_definition: 'The percentage of revenue that exceeds the cost of goods sold.',
        beginner_analogy: 'If you bake a cake for  worth of flour and sugar and sell it for , your gross margin is 80%.'
      },
      {
        term: 'Capital Expenditure',
        slug: 'capital-expenditure',
        category: 'Corporate Finance',
        short_definition: 'Funds used by a company to acquire and upgrade physical assets.',
        beginner_analogy: 'Buying a commercial delivery truck rather than just paying for fuel and daily maintenance.'
      }
    ]
  },
  {
    id: 2,
    title: 'Federal Reserve Weighs 25-Basis-Point Rate Cut as Core Inflation Moderates Toward 2% Target',
    description: 'Fed officials signal confidence that inflationary pressures have structurally subsided, clearing the path for orderly monetary policy normalization.',
    content: 'Federal Reserve policymakers signaled an increasing consensus toward lowering the federal funds target rate by 25 basis points at the upcoming FOMC meeting. Recent Consumer Price Index (CPI) metrics indicated that core goods deflation and cooling housing rent indices have sustained the path toward the central bank target.',
    url: 'https://www.reuters.com/markets/us/fed-weighs-rate-cut-core-inflation-moderates-2026-09-21/',
    image_url: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Reuters Financial',
    author: 'Howard Schneider',
    published_at: new Date(Date.now() - 3600000 * 5).toISOString(),
    category: { id: 1, name: 'Macroeconomics', slug: 'macroeconomics' },
    is_trending: true,
    ai_summary: {
      three_line_summary: [
        'Federal Reserve leadership reached an emerging consensus to lower benchmark interest rates by 25 basis points (0.25%).',
        'Cooling housing rent prices and steady consumer goods metrics brought core inflation safely toward the 2.0% target.',
        'US 10-year bond yields declined to 3.82%, lowering borrowing expenses for commercial real estate and home mortgages.'
      ],
      beginner_explanation: 'The Federal Reserve is preparing to cut interest rates because price increases across grocery stores and housing have calmed down. When the Fed cuts rates, it becomes cheaper for people and businesses to borrow money, boosting economic activity.',
      eli15_explanation: 'Imagine the economy is a car driving down a steep hill. The central bank applied the brakes (raising interest rates) to keep the car from speeding out of control. Now that the car has slowed down safely, they are gently taking their foot off the brake.',
      why_it_matters: 'Directly influences borrowing costs for home mortgages, auto loans, credit cards, and corporate loans across the entire world.',
      market_impact: 'Stimulates stock market valuations, supports real estate refinancing, and weakens the US dollar slightly relative to foreign currencies.',
      key_takeaways: [
        'Federal Funds target rate reduction of 25 bps anticipated at upcoming FOMC.',
        'Core CPI demonstrates sustainable trend towards the 2% price stability mandate.',
        'Labor market conditions remain balanced without alarming spikes in unemployment.'
      ],
      model_version: 'Llama 3.3 (70B)',
      confidence_score: 0.94,
      hindi_summary: 'अमेरिकी फेडरल रिजर्व ब्याज दरों में 0.25% की कटौती करने की तैयारी कर रहा है क्योंकि मुद्रास्फीति 2% के लक्ष्य की ओर घट रही है।',
      marathi_summary: 'अमेरिकन फेडरल रिझर्व्हने व्याजदरात ०.२५% कपात करण्याचे संकेत दिले आहेत. महागाई नियंत्रणात आल्याने कर्ज स्वस्त होईल.'
    },
    sentiment: {
      sentiment_label: 'Bullish',
      confidence: 0.76,
      reasoning: 'Lower benchmark interest rates reduce corporate debt servicing costs and stimulate equity multiples and consumer spending.'
    },
    detected_terms: [
      {
        term: 'Basis Points',
        slug: 'basis-points',
        category: 'Financial Math',
        short_definition: 'A unit of measure equal to 1/100th of 1% (0.01%). 25 basis points = 0.25%.',
        beginner_analogy: 'Like counting cents instead of dollars so you can measure small fractional changes precisely.'
      }
    ]
  },
  {
    id: 3,
    title: 'Apple Services Revenue Hits All-Time High Supported by 1.2 Billion Paid Subscriptions',
    description: 'Apple reports accelerating growth across iCloud, Apple Pay, and the App Store as high-margin recurring software revenue cushions hardware replacement cycles.',
    content: 'Apple Inc. reported quarterly financial results highlighting record performance in its Services division, which generated over  billion in high-margin recurring revenue. The technology giant now counts over 1.2 billion active paid subscriptions across its global installed base of 2.2 billion active hardware devices.',
    url: 'https://www.wsj.com/tech/apple-services-revenue-all-time-high-2026-09-22',
    image_url: 'https://images.unsplash.com/photo-1510519138197-06b8628cbf47?auto=format&fit=crop&w=1200&q=80',
    source_name: 'Wall Street Journal',
    author: 'Aaron Tilley',
    published_at: new Date(Date.now() - 3600000 * 8).toISOString(),
    category: { id: 2, name: 'Equities & Markets', slug: 'equities' },
    ticker: 'AAPL',
    company_name: 'Apple Inc.',
    is_trending: false,
    ai_summary: {
      three_line_summary: [
        'Apple Services reached a historic  billion quarterly revenue milestone with 1.2 billion active paid subscriptions.',
        'Gross margins for the services division reached 74%, generating  billion in quarterly operating cash flow.',
        'Apple returned  billion to investors through common stock share repurchases and regular dividends.'
      ],
      beginner_explanation: 'Apple is transforming from a company that just sells phones into a recurring subscription powerhouse. People are paying monthly fees for iCloud, Apple Music, and app purchases, providing steady cash flow.',
      eli15_explanation: 'Imagine you own an amusement park. Instead of just selling tickets at the gate once a year, every visitor now pays you a small monthly membership for priority rides, snacks, and games.',
      why_it_matters: 'Recurring software revenue makes Apple far less vulnerable to fluctuations in how often consumers upgrade their physical phones.',
      market_impact: 'Strengthens balance sheet flexibility and solidifies consumer tech sector investor sentiment.',
      key_takeaways: [
        '1.2 billion active paid subscriptions across 2.2 billion active devices.',
        'Quarterly operating cash flow reached  billion.',
        'High-margin services revenue provides defensive buffer against hardware cyclicality.'
      ],
      model_version: 'Llama 3.3 (70B)',
      confidence_score: 0.95
    },
    sentiment: {
      sentiment_label: 'Bullish',
      confidence: 0.82,
      reasoning: 'High-margin recurring revenue with 1.2 billion subscriptions guarantees exceptional cash flow visibility.'
    },
    company: {
      ticker: 'AAPL',
      name: 'Apple Inc.',
      industry: 'Consumer Electronics & Cloud Services',
      market_cap: '.52 Trillion',
      pe_ratio: '34.8',
      ceo: 'Tim Cook',
      headquarters: 'Cupertino, California, USA',
      overview: 'Designs, manufactures, and markets smartphones, personal computers, tablets, and sells a variety of related digital services and software platforms.'
    }
  }
];

export const MOCK_DAILY_BRIEF: DailyBrief = {
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
  executive_summary: 'Global financial assets are navigating a favorable disinflation backdrop, led by accelerating enterprise capital expenditure in AI infrastructure and anticipated policy rate easing from the Federal Reserve. Benchmark Treasury yields retreated to 3.82% while equity indices remain near record levels.',
  market_mood: {
    score: 72,
    label: 'Moderately Bullish',
    summary: 'Institutional appetite favors quality large-cap tech equities and duration-sensitive fixed income, supported by orderly central bank guidance.'
  },
  biggest_movers: [
    { ticker: 'NVDA', name: 'Nvidia Corp', change: '+4.8%', sentiment: 'Bullish' },
    { ticker: 'AAPL', name: 'Apple Inc', change: '+2.1%', sentiment: 'Bullish' },
    { ticker: 'MSFT', name: 'Microsoft Corp', change: '+1.7%', sentiment: 'Bullish' },
    { ticker: 'XOM', name: 'Exxon Mobil', change: '-2.3%', sentiment: 'Bearish' }
  ],
  top_stories: [
    {
      id: 1,
      title: 'Nvidia Blackwell GPU Deliveries Accelerate as Hyperscalers Expand AI Data Centers',
      description: 'Nvidia confirms volume shipments of its next-generation Blackwell architecture, driving record revenue expectations.',
      source_name: 'Bloomberg Markets',
      ticker: 'NVDA'
    },
    {
      id: 2,
      title: 'Federal Reserve Weighs 25-Basis-Point Rate Cut as Core Inflation Moderates',
      description: 'Fed officials signal confidence that inflationary pressures have structurally subsided.',
      source_name: 'Reuters Financial',
      ticker: 'MACRO'
    }
  ],
  economic_events: [
    { time: '08:30 AM EST', event: 'US Consumer Price Index (YoY)', impact: 'High Impact' },
    { time: '02:00 PM EST', event: 'FOMC Interest Rate Decision', impact: 'High Impact' },
    { time: '02:30 PM EST', event: 'Fed Chair Press Conference', impact: 'High Impact' }
  ],
  recommended_reading: [
    { id: 1, title: 'Blackwell GPU Architecture Deep Dive', source_name: 'Semiconductor Wire' },
    { id: 2, title: 'Federal Reserve Monetary Framework 2026', source_name: 'Central Bank Digest' }
  ]
};

export const MOCK_GLOSSARY: GlossaryTerm[] = [
  {
    id: 1,
    term: 'Repo Rate',
    slug: 'repo-rate',
    category: 'Monetary Policy',
    short_definition: 'The rate at which central banks lend short-term funds against government bonds.',
    beginner_analogy: 'Pawning a watch for one week cash and buying it back for a small fee.',
    full_explanation: 'The interest rate at which a central bank lends short-term funds to commercial banks against pledged government securities.',
    related_terms: ['Reverse Repo', 'Overnight Policy Rate', 'Federal Funds Rate']
  },
  {
    id: 2,
    term: 'Quantitative Easing',
    slug: 'quantitative-easing',
    category: 'Central Banking',
    short_definition: 'Central bank purchases of long-term bonds to inject money into the banking system.',
    beginner_analogy: 'Watering a garden with a giant firehose during a severe drought.',
    full_explanation: 'An unconventional monetary policy tool where a central bank purchases long-term government bonds to inject liquidity.',
    related_terms: ['Quantitative Tightening', 'Balance Sheet Expansion']
  },
  {
    id: 3,
    term: 'Consumer Price Index (CPI)',
    slug: 'cpi',
    category: 'Macroeconomics',
    short_definition: 'Measures changes in prices paid by consumers for goods and services over time.',
    beginner_analogy: 'A monthly grocery receipt for the exact same cart of groceries.',
    full_explanation: 'A benchmark macroeconomic measure examining the weighted average prices of consumer goods and services.',
    related_terms: ['Core CPI', 'Personal Consumption Expenditures']
  }
];

export const MOCK_ANALYTICS: AnalyticsData = {
  total_articles_read: 48,
  streak_days: 7,
  weekly_reading_time_minutes: 185,
  top_sectors: {
    labels: ['Equities', 'Macroeconomics', 'Central Banks', 'Commodities'],
    values: [45, 30, 15, 10]
  },
  sentiment_distribution: {
    bullish: 16,
    neutral: 7,
    bearish: 4,
    bullish_percentage: 60
  },
  weekly_activity: {
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    articles_read: [6, 9, 8, 12, 15, 7, 10],
    minutes_spent: [22, 34, 28, 45, 52, 25, 38]
  },
  trending_companies: [
    { ticker: 'NVDA', name: 'Nvidia Corp', industry: 'Semiconductors', market_cap: '.45T', change_24h: '+4.8%', mentions: 24 },
    { ticker: 'AAPL', name: 'Apple Inc', industry: 'Consumer Tech', market_cap: '.52T', change_24h: '+2.1%', mentions: 18 }
  ]
};

export const MOCK_USER: User = {
  id: 1,
  email: 'analyst@fintechnews.com',
  full_name: 'Arya Stark (Fintech Lead)',
  role: 'analyst',
  created_at: new Date(Date.now() - 3600000 * 24 * 30).toISOString()
};

export const MOCK_PREFERENCES: UserPreferences = {
  preferred_language: 'en',
  preferred_categories: ['macroeconomics', 'equities', 'central-banks'],
  watchlist_companies: ['NVDA', 'AAPL', 'MSFT', 'TSLA'],
  email_brief_frequency: 'daily',
  theme_mode: 'dark'
};
