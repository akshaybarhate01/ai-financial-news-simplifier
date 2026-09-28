import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, ExternalLink, Sparkles, Building2 } from 'lucide-react';
import { Article } from '../../types';
import { SentimentBadge } from './SentimentBadge';
import { ImpactBadge } from './ImpactBadge';
import { BookmarkButton } from './BookmarkButton';
import { useTranslation } from '../../hooks/useTranslation';

interface NewsCardProps {
  article: Article;
  featured?: boolean;
}

export const NewsCard: React.FC<NewsCardProps> = ({ article, featured = false }) => {
  const { t } = useTranslation();

  const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const threeLineSummary = article.ai_summary?.three_line_summary || [];

  return (
    <div
      className={`group fintech-card flex flex-col justify-between overflow-hidden ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      <div>
        {/* Card Header: Source, Ticker, Bookmark */}
        <div className="p-5 pb-3 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-fintech-navy-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              {article.source_name}
            </span>
            {article.ticker && (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-medium text-fintech-cyan-700 dark:text-cyan-400 bg-fintech-cyan-50 dark:bg-cyan-950/50 px-2 py-0.5 rounded border border-fintech-cyan-200/50 dark:border-cyan-800/60">
                <Building2 className="w-3 h-3" />
                {article.ticker}
              </span>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {publishedDate}
            </span>
          </div>

          <BookmarkButton articleId={article.id} initialBookmarked={article.is_bookmarked} size="sm" />
        </div>

        {/* Card Body: Title & Summary */}
        <div className="p-5 pt-4">
          <Link to={`/article/${article.id}`} className="block group-hover:text-fintech-cyan-600 transition-colors">
            <h3 className="text-base sm:text-lg font-bold leading-snug line-clamp-2 text-fintech-navy-900 dark:text-white group-hover:text-fintech-cyan-700 dark:group-hover:text-cyan-400">
              {article.title}
            </h3>
          </Link>

          {/* AI 3-Line Summary Highlight */}
          {threeLineSummary.length > 0 ? (
            <div className="mt-3.5 p-3 rounded-lg bg-slate-50/80 dark:bg-[#081322] border border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
              <div className="flex items-center gap-1 font-semibold text-[11px] uppercase tracking-wider text-fintech-cyan-700 dark:text-cyan-400 mb-1">
                <Sparkles className="w-3 h-3" />
                {t('ai_takeaway')}
              </div>
              <p className="line-clamp-2 leading-relaxed">
                {threeLineSummary[0]}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {article.description}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer: Sentiment, Impact, Read Link */}
      <div className="px-5 py-3.5 bg-slate-50/50 dark:bg-[#070F1E] border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2 mt-auto">
        <div className="flex items-center gap-2 flex-wrap">
          {article.sentiment && (
            <SentimentBadge sentiment={article.sentiment.sentiment_label} />
          )}
          {article.category && (
            <ImpactBadge category={article.category.name} />
          )}
        </div>

        <Link
          to={`/article/${article.id}`}
          className="text-xs font-semibold text-fintech-cyan-700 dark:text-cyan-400 hover:text-fintech-cyan-800 dark:hover:text-cyan-300 inline-flex items-center gap-1 group/btn"
        >
          {t('analyze')}
          <ExternalLink className="w-3 h-3 transition-transform group-hover/btn:translate-x-0.5" />
        </Link>
      </div>
    </div>
  );
};
