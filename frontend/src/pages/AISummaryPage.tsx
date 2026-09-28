import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Lightbulb, ExternalLink, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Article, NewsListResponse } from '../types';
import { ELI15Toggle } from '../components/article/ELI15Toggle';
import { LanguageSwitcher } from '../components/article/LanguageSwitcher';
import { SentimentBadge } from '../components/news/SentimentBadge';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useNewsStore } from '../store/newsStore';
import { useTranslation } from '../hooks/useTranslation';

export const AISummaryPage: React.FC = () => {
  const { activeLanguage, setActiveLanguage } = useNewsStore();
  const { t } = useTranslation();
  const [isELI15, setIsELI15] = useState(false);

  const { data: newsData, isLoading } = useQuery<NewsListResponse>({
    queryKey: ['ai-summaries-feed'],
    queryFn: () => api.get('/news?page=1&page_size=12'),
  });

  const articles = newsData?.items || [];

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
              {t('ai_summaries')}
            </h1>
            <span className="text-xs font-mono font-bold bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400 px-2 py-0.5 rounded border border-fintech-cyan-200 dark:border-cyan-800">
              Llama 3.3 (70B)
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('hero_desc')}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <ELI15Toggle isELI15={isELI15} onToggle={setIsELI15} />
          <LanguageSwitcher
            currentLanguage={activeLanguage}
            onChange={(l) => setActiveLanguage(l)}
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((art) => {
            const summary = art.ai_summary;
            const explanation =
              activeLanguage === 'hi' && summary?.hindi_summary
                ? summary.hindi_summary
                : activeLanguage === 'mr' && summary?.marathi_summary
                ? summary.marathi_summary
                : isELI15 && summary?.eli15_explanation
                ? summary.eli15_explanation
                : summary?.beginner_explanation || art.description;

            return (
              <div key={art.id} className="fintech-card p-6 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded">
                      {art.source_name}
                    </span>
                    {art.sentiment && (
                      <SentimentBadge sentiment={art.sentiment.sentiment_label} />
                    )}
                  </div>

                  <Link to={`/article/${art.id}`} className="block group">
                    <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white group-hover:text-fintech-cyan-700 dark:group-hover:text-cyan-400 line-clamp-2 transition-colors">
                      {art.title}
                    </h3>
                  </Link>

                  {/* Plain English / ELI15 Box */}
                  <div className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                    isELI15
                      ? 'bg-fintech-cyan-50/60 dark:bg-cyan-950/40 border-fintech-cyan-200 dark:border-cyan-800 text-fintech-navy-900 dark:text-cyan-200'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-700 dark:text-slate-300'
                  }`}>
                    <div className="flex items-center gap-1.5 font-bold uppercase text-[10px] text-slate-500 dark:text-slate-400 mb-1">
                      <Lightbulb className="w-3 h-3 text-fintech-cyan-600 dark:text-cyan-400" />
                      {isELI15 ? t('eli15_button') : t('analyst_breakdown_title')}
                    </div>
                    {explanation}
                  </div>

                  {/* 3-Line Bullet Points */}
                  {summary && summary.three_line_summary && (
                    <div className="space-y-1.5 pt-1">
                      {summary.three_line_summary.map((line, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
                          <span className="font-bold text-fintech-cyan-700 dark:text-cyan-400 font-mono">•</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 dark:text-slate-500">
                    {t('confidence')}: {Math.round((summary?.confidence_score || 0.95) * 100)}%
                  </span>
                  <Link
                    to={`/article/${art.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-fintech-cyan-700 dark:text-cyan-400 hover:text-fintech-cyan-800 dark:hover:text-cyan-300"
                  >
                    {t('analyze')}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
