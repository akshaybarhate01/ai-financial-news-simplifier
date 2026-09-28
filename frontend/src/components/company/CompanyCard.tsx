import React from 'react';
import { Building2, Globe, TrendingUp, User, MapPin } from 'lucide-react';
import { CompanyData } from '../../types';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

interface CompanyCardProps {
  company: CompanyData;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({ company }) => {
  const { t } = useTranslation();

  return (
    <div className="fintech-card p-5 space-y-4">
      {/* Header: Name, Ticker, Industry */}
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center p-2 overflow-hidden flex-shrink-0">
            {company.logo_url ? (
              <img
                src={company.logo_url}
                alt={company.name}
                className="w-full h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <Building2 className="w-5 h-5 text-slate-500 dark:text-slate-400" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-bold text-fintech-navy-900 dark:text-white leading-tight">
              {company.name}
            </h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-mono text-xs font-bold text-fintech-cyan-700 dark:text-cyan-400 bg-fintech-cyan-50 dark:bg-cyan-950/60 px-1.5 py-0.5 rounded">
                {company.ticker}
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{company.industry}</span>
            </div>
          </div>
        </div>

        {company.change_24h && (
          <span
            className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
              company.change_24h.startsWith('+')
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
            }`}
          >
            {company.change_24h}
          </span>
        )}
      </div>

      {/* Corporate Metadata Metrics */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {company.market_cap && (
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase">{t('market_cap')}</span>
            <span className="font-semibold text-fintech-navy-900 dark:text-white font-mono">{company.market_cap}</span>
          </div>
        )}
        {company.pe_ratio && (
          <div className="p-2 rounded bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-semibold uppercase">{t('pe_ratio')}</span>
            <span className="font-semibold text-fintech-navy-900 dark:text-white font-mono">{company.pe_ratio}</span>
          </div>
        )}
      </div>

      {/* Leadership & Location */}
      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
        {company.ceo && (
          <div className="flex items-center gap-2">
            <User className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span><b>{t('ceo')}:</b> {company.ceo}</span>
          </div>
        )}
        {company.headquarters && (
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span><b>{t('hq')}:</b> {company.headquarters}</span>
          </div>
        )}
      </div>

      {/* Overview */}
      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-3">
        {company.overview}
      </p>

      {/* Related News Coverage */}
      {company.related_articles && company.related_articles.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-2">
            {t('recent_coverage')}
          </span>
          <div className="space-y-1.5">
            {company.related_articles.map((art) => (
              <Link
                key={art.id}
                to={`/article/${art.id}`}
                className="block text-xs text-fintech-navy-900 dark:text-slate-200 hover:text-fintech-cyan-700 dark:hover:text-cyan-400 line-clamp-1 transition-colors"
              >
                • {art.title}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
