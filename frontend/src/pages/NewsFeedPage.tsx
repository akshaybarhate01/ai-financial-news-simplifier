import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter, X, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';
import { Article, Category, NewsListResponse } from '../types';
import { NewsCard } from '../components/news/NewsCard';
import { CategoryPills } from '../components/news/CategoryPills';
import { SearchBar } from '../components/common/SearchBar';
import { CardGridSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useNewsStore } from '../store/newsStore';
import { useTranslation } from '../hooks/useTranslation';

export const NewsFeedPage: React.FC = () => {
  const { activeCategory, searchQuery, selectedTicker, setSelectedTicker, resetFilters } = useNewsStore();
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [selectedSource, setSelectedSource] = useState<string>('');

  // 1. Fetch Categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: () => api.get('/news/categories'),
  });

  // 2. Fetch Filtered News
  const { data: newsData, isLoading, refetch } = useQuery<NewsListResponse>({
    queryKey: ['news-feed', page, activeCategory, searchQuery, selectedTicker, selectedSource],
    queryFn: () => {
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('page_size', '9');
      if (activeCategory) params.append('category', activeCategory);
      if (searchQuery) params.append('search', searchQuery);
      if (selectedTicker) params.append('ticker', selectedTicker);
      if (selectedSource) params.append('source', selectedSource);
      return api.get(`/news?${params.toString()}`);
    },
  });

  const articles = newsData?.items || [];
  const totalPages = newsData?.total_pages || 1;

  const sources = ['Bloomberg Markets', 'Reuters Financial', 'Wall Street Journal', 'Financial Times', 'CNBC Energy', 'Mint Financial'];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
            {t('live_news_stream')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {t('live_news_sub')}
          </p>
        </div>

        {/* Active Filters Pill Summary */}
        {(activeCategory || selectedTicker || searchQuery || selectedSource) && (
          <div className="flex items-center gap-2 flex-wrap">
            {selectedTicker && (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-800 dark:text-cyan-300 px-2.5 py-1 rounded-lg border border-fintech-cyan-200 dark:border-cyan-800">
                Ticker: {selectedTicker}
                <button onClick={() => setSelectedTicker(null)}>
                  <X className="w-3 h-3 text-fintech-cyan-600 dark:text-cyan-400 hover:text-fintech-cyan-900" />
                </button>
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white underline font-medium"
            >
              {t('reset_filters')}
            </button>
          </div>
        )}
      </div>

      {/* Filter Bar: Categories + Source Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white dark:bg-[#0D1B2E] p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xs">
        <CategoryPills categories={categories} />

        <div className="flex items-center gap-2 flex-shrink-0">
          <select
            value={selectedSource}
            onChange={(e) => {
              setSelectedSource(e.target.value);
              setPage(1);
            }}
            className="text-xs py-1.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
          >
            <option value="">{t('all_sources')}</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Grid */}
      {isLoading ? (
        <CardGridSkeleton count={6} />
      ) : articles.length === 0 ? (
        <EmptyState
          title={t('no_articles_match')}
          description={t('no_articles_desc')}
          actionText={t('clear_filters')}
          onAction={resetFilters}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-6">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('previous')}
          </button>

          <span className="text-xs font-mono font-medium text-slate-500 dark:text-slate-400">
            {t('page_of', { page, totalPages })}
          </span>

          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs"
          >
            {t('next')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};
