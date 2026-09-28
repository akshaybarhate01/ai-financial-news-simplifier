export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  created_at?: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface SentimentData {
  sentiment_label: 'Bullish' | 'Neutral' | 'Bearish';
  confidence: number;
  reasoning: string;
  target_assets?: string[];
}

export interface AISummaryData {
  three_line_summary: string[];
  beginner_explanation: string;
  eli15_explanation: string;
  key_takeaways: string[];
  why_it_matters: string;
  market_impact: string;
  confidence_score: number;
  hindi_summary?: string;
  marathi_summary?: string;
  model_version?: string;
}

export interface CompanyData {
  id?: number;
  ticker: string;
  name: string;
  logo_url?: string;
  industry: string;
  ceo?: string;
  headquarters?: string;
  market_cap?: string;
  overview: string;
  website?: string;
  pe_ratio?: string;
  change_24h?: string;
  related_articles?: { id: number; title: string; source_name: string; published_at: string }[];
}

export interface GlossaryTerm {
  id: number;
  term: string;
  slug: string;
  category: string;
  short_definition: string;
  beginner_analogy: string;
  full_explanation: string;
  related_terms: string[];
}

export interface Article {
  id: number;
  title: string;
  description?: string;
  content?: string;
  url: string;
  image_url?: string;
  source_name: string;
  source_id?: string;
  author?: string;
  published_at: string;
  category?: Category;
  ticker?: string;
  company_name?: string;
  is_trending?: boolean;
  is_bookmarked?: boolean;
  ai_summary?: AISummaryData;
  sentiment?: SentimentData;
  company?: CompanyData;
  detected_terms?: {
    term: string;
    slug: string;
    category: string;
    short_definition: string;
    beginner_analogy: string;
  }[];
}

export interface NewsListResponse {
  items: Article[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface BookmarkItem {
  id: number;
  article_id: number;
  folder: string;
  tags: string[];
  notes?: string;
  created_at: string;
  article?: Article;
}

export interface ReadingHistoryItem {
  id: number;
  article_id: number;
  read_duration_seconds: number;
  read_at: string;
  article?: Article;
}

export interface DailyBrief {
  date: string;
  market_mood: {
    label: string;
    score: number;
    summary: string;
  };
  executive_summary: string;
  top_stories: {
    id: number;
    title: string;
    description: string;
    source_name: string;
    ticker?: string;
  }[];
  biggest_movers: {
    ticker: string;
    name: string;
    change: string;
    sentiment: string;
  }[];
  economic_events: {
    time: string;
    event: string;
    impact: string;
  }[];
  recommended_reading: {
    id: number;
    title: string;
    source_name: string;
  }[];
}

export interface AnalyticsData {
  total_articles_read: number;
  streak_days: number;
  weekly_reading_time_minutes: number;
  top_sectors: {
    labels: string[];
    values: number[];
  };
  sentiment_distribution: {
    bullish: number;
    neutral: number;
    bearish: number;
    bullish_percentage: number;
  };
  weekly_activity: {
    days: string[];
    articles_read: number[];
    minutes_spent: number[];
  };
  trending_companies: {
    ticker: string;
    name: string;
    industry: string;
    market_cap: string;
    change_24h: string;
    mentions: number;
  }[];
}

export interface UserPreferences {
  preferred_language: 'en' | 'hi' | 'mr';
  preferred_categories: string[];
  watchlist_companies: string[];
  email_brief_frequency: string;
  theme_mode: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    details: any;
  };
}
