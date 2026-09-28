import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { TrendingUp, Building2, Flame, ExternalLink, ArrowUpRight } from 'lucide-react';
import { api } from '../services/api';
import { CompanyData, Article } from '../types';
import { CompanyCard } from '../components/company/CompanyCard';
import { NewsCard } from '../components/news/NewsCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useTranslation } from '../hooks/useTranslation';

export const TrendingPage: React.FC = () => {
  const { t } = useTranslation();

  // 1. Fetch Trending Companies
  const { data: companies = [], isLoading: isCompaniesLoading } = useQuery<CompanyData[]>({
    queryKey: ['trending-companies-full'],
    queryFn: () => api.get('/companies'),
  });

  // 2. Fetch Trending News
  const { data: newsData, isLoading: isNewsLoading } = useQuery<{ items: Article[] }>({
    queryKey: ['trending-news'],
    queryFn: () => api.get('/news?trending=true&page_size=6'),
  });

  const trendingArticles = newsData?.items || [];

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-amber-500" />
          <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
            {t('market_pulse_title')}
          </h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('market_pulse_sub')}
        </p>
      </div>

      {/* Trending Companies Showcase */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
          <Building2 className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
          {t('institutional_focus')}
        </h2>

        {isCompaniesLoading ? (
          <LoadingSkeleton count={2} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {companies.map((company) => (
              <CompanyCard key={company.ticker} company={company} />
            ))}
          </div>
        )}
      </div>

      {/* High-Impact Trending Articles */}
      <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
        <h2 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
          {t('trending_stories')}
        </h2>

        {isNewsLoading ? (
          <LoadingSkeleton count={3} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trendingArticles.map((art) => (
              <NewsCard key={art.id} article={art} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
