import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Bookmark,
  Clock,
  ExternalLink,
  Flame,
  Building2,
  Sparkles,
  Layers,
} from 'lucide-react';
import { api } from '../services/api';
import { Article, DailyBrief, AnalyticsData, BookmarkItem, CompanyData } from '../types';
import { MorningBriefCard } from '../components/dashboard/MorningBriefCard';
import { MarketMoodWidget } from '../components/dashboard/MarketMoodWidget';
import { TrendingTickers } from '../components/dashboard/TrendingTickers';
import { NewsCard } from '../components/news/NewsCard';
import { SectorChart } from '../components/analytics/SectorChart';
import { SentimentChart } from '../components/analytics/SentimentChart';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';

export const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useTranslation();

  // 1. Fetch Daily Morning Brief
  const { data: brief, isLoading: isBriefLoading } = useQuery<DailyBrief>({
    queryKey: ['daily-brief'],
    queryFn: () => api.get('/news/daily-brief'),
  });

  // 2. Fetch Top 5 News
  const { data: newsData, isLoading: isNewsLoading } = useQuery<{ items: Article[] }>({
    queryKey: ['top-5-news'],
    queryFn: () => api.get('/news?page=1&page_size=5'),
  });

  // 3. Fetch Companies
  const { data: companies = [] } = useQuery<CompanyData[]>({
    queryKey: ['companies'],
    queryFn: () => api.get('/companies'),
  });

  // 4. Fetch Analytics
  const { data: analytics } = useQuery<AnalyticsData>({
    queryKey: ['analytics'],
    queryFn: () => api.get('/analytics'),
  });

  // 5. Fetch Bookmarks
  const { data: bookmarks = [] } = useQuery<BookmarkItem[]>({
    queryKey: ['user-bookmarks'],
    queryFn: () => api.get('/bookmarks'),
    enabled: !!localStorage.getItem('fintech_access_token'),
  });

  // 6. Fetch Reading History
  const { data: history = [] } = useQuery<any[]>({
    queryKey: ['reading-history'],
    queryFn: () => api.get('/bookmarks/history'),
    enabled: !!localStorage.getItem('fintech_access_token'),
  });

  const topNews = newsData?.items || [];

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
            {t('dashboard')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('welcome_back')}{user ? `, ${user.full_name}` : ''}. {t('welcome_sub')}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/news"
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-2xs"
          >
            {t('explore_news')}
          </Link>
          <Link
            to="/ai-summaries"
            className="px-3 py-1.5 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 text-xs font-semibold hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 shadow-2xs flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-fintech-cyan-400 dark:text-slate-950" />
            {t('ai_summaries')}
          </Link>
        </div>
      </div>

      {/* 1. Morning Brief Card */}
      {isBriefLoading || !brief ? (
        <LoadingSkeleton count={1} />
      ) : (
        <MorningBriefCard brief={brief} />
      )}

      {/* 2. Main 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Top 5 News & Analytics */}
        <div className="lg:col-span-2 space-y-8">
          {/* Top 5 Stories */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-amber-500" />
                <h2 className="text-base font-bold text-fintech-navy-900 dark:text-white">
                  {t('top_catalysts')}
                </h2>
              </div>
              <Link
                to="/news"
                className="text-xs font-semibold text-fintech-cyan-700 dark:text-cyan-400 hover:underline"
              >
                {t('view_live_wire')}
              </Link>
            </div>

            {isNewsLoading ? (
              <LoadingSkeleton count={3} />
            ) : (
              <div className="space-y-4">
                {topNews.slice(0, 5).map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            )}
          </div>

          {/* Weekly Analytics Charts */}
          {analytics && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <h2 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
                {t('weekly_analytics_title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <SectorChart
                  labels={analytics.top_sectors.labels}
                  values={analytics.top_sectors.values}
                />
                <SentimentChart
                  bullish={analytics.sentiment_distribution.bullish}
                  neutral={analytics.sentiment_distribution.neutral}
                  bearish={analytics.sentiment_distribution.bearish}
                />
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Market Mood, Trending Companies, Bookmarks & History */}
        <div className="space-y-6">
          {/* Market Mood Widget */}
          {brief && (
            <MarketMoodWidget
              score={brief.market_mood.score}
              label={brief.market_mood.label}
              summary={brief.market_mood.summary}
            />
          )}

          {/* Trending Companies */}
          {companies.length > 0 && (
            <TrendingTickers
              companies={companies.map((c) => ({
                ticker: c.ticker,
                name: c.name,
                change_24h: c.change_24h,
              }))}
            />
          )}

          {/* User Bookmarks Snippet */}
          <div className="fintech-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                <Bookmark className="w-3.5 h-3.5 text-fintech-cyan-600 dark:text-cyan-400" />
                {t('saved_bookmarks_title')}
              </span>
              <Link to="/bookmarks" className="text-[11px] text-fintech-cyan-700 dark:text-cyan-400 hover:underline">
                {t('view_all')} ({bookmarks.length})
              </Link>
            </div>

            {bookmarks.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
                {t('no_bookmarks_yet')}
              </p>
            ) : (
              <div className="space-y-2">
                {bookmarks.slice(0, 3).map((bm) => (
                  <Link
                    key={bm.id}
                    to={`/article/${bm.article_id}`}
                    className="block p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700/60"
                  >
                    <span className="text-xs font-semibold text-fintech-navy-900 dark:text-white line-clamp-1">
                      {bm.article?.title || `Article #${bm.article_id}`}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 block mt-0.5">
                      Folder: {bm.folder}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reading History */}
          <div className="fintech-card p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-fintech-cyan-600 dark:text-cyan-400" />
                {t('recent_reading_history')}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {history.length} Read
              </span>
            </div>

            {history.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 py-3 text-center">
                {t('articles_recorded_here')}
              </p>
            ) : (
              <div className="space-y-2">
                {history.slice(0, 3).map((item, idx) => (
                  <Link
                    key={idx}
                    to={`/article/${item.article_id}`}
                    className="block p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-100 dark:border-slate-700/60"
                  >
                    <span className="text-xs text-slate-700 dark:text-slate-200 line-clamp-1">
                      {item.article?.title || `Article #${item.article_id}`}
                    </span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 block mt-0.5 font-mono">
                      {new Date(item.read_at).toLocaleDateString()}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
