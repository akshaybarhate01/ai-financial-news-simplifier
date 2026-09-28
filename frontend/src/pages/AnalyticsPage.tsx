import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart3, TrendingUp, CheckCircle, Clock, BookOpen } from 'lucide-react';
import { api } from '../services/api';
import { AnalyticsData } from '../types';
import { SectorChart } from '../components/analytics/SectorChart';
import { SentimentChart } from '../components/analytics/SentimentChart';
import { WeeklyVolumeChart } from '../components/analytics/WeeklyVolumeChart';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useTranslation } from '../hooks/useTranslation';

export const AnalyticsPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: analytics, isLoading } = useQuery<AnalyticsData>({
    queryKey: ['analytics-full'],
    queryFn: () => api.get('/analytics'),
  });

  if (isLoading || !analytics) {
    return <LoadingSkeleton count={3} />;
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
          {t('analytics_title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('analytics_sub')}
        </p>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="fintech-card p-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-semibold uppercase">
            <BookOpen className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
            {t('articles_analyzed')}
          </div>
          <p className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white mt-2 font-mono">
            {analytics.total_articles_read}
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
            +18% this week
          </span>
        </div>

        <div className="fintech-card p-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-semibold uppercase">
            <Clock className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
            {t('reading_engagement')}
          </div>
          <p className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white mt-2 font-mono">
            {analytics.weekly_reading_time_minutes}m
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Total time spent</span>
        </div>

        <div className="fintech-card p-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-semibold uppercase">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {t('bullish_ratio')}
          </div>
          <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-2 font-mono">
            {analytics.sentiment_distribution.bullish_percentage}%
          </p>
          <span className="text-[11px] text-slate-400 dark:text-slate-500">Prevailing market bias</span>
        </div>

        <div className="fintech-card p-4">
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-400 text-xs font-semibold uppercase">
            <CheckCircle className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
            {t('active_streak')}
          </div>
          <p className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white mt-2 font-mono">
            {analytics.streak_days} Days
          </p>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Consistent analyst</span>
        </div>
      </div>

      {/* Chart.js Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SectorChart
          labels={analytics.top_sectors.labels}
          values={analytics.top_sectors.values}
        />

        <SentimentChart
          bullish={analytics.sentiment_distribution.bullish}
          neutral={analytics.sentiment_distribution.neutral}
          bearish={analytics.sentiment_distribution.bearish}
        />

        <div className="lg:col-span-2">
          <WeeklyVolumeChart
            days={analytics.weekly_activity.days}
            articlesRead={analytics.weekly_activity.articles_read}
          />
        </div>
      </div>
    </div>
  );
};
