import React from 'react';
import { TrendingUp, Building2 } from 'lucide-react';
import { useNewsStore } from '../../store/newsStore';

import { useTranslation } from '../../hooks/useTranslation';

interface TrendingTickersProps {
  companies: { ticker: string; name: string; change_24h?: string }[];
}

export const TrendingTickers: React.FC<TrendingTickersProps> = ({ companies }) => {
  const { selectedTicker, setSelectedTicker } = useNewsStore();
  const { t } = useTranslation();

  return (
    <div className="fintech-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-fintech-cyan-600 dark:text-cyan-400" />
          {t('institutional_focus')}
        </span>
        {selectedTicker && (
          <button
            onClick={() => setSelectedTicker(null)}
            className="text-[11px] text-fintech-cyan-700 dark:text-cyan-400 hover:underline"
          >
            {t('clear_filters')}
          </button>
        )}
      </div>

      <div className="space-y-2">
        {companies.map((comp) => {
          const isSelected = selectedTicker === comp.ticker;
          return (
            <button
              key={comp.ticker}
              onClick={() => setSelectedTicker(isSelected ? null : comp.ticker)}
              className={`w-full text-left p-2.5 rounded-lg flex items-center justify-between transition-colors border ${
                isSelected
                  ? 'bg-fintech-cyan-50 dark:bg-cyan-950/70 border-fintech-cyan-300 dark:border-cyan-600'
                  : 'bg-slate-50 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-100 dark:border-slate-700/60'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-fintech-navy-900 dark:text-white">
                  {comp.ticker}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                  {comp.name}
                </span>
              </div>

              {comp.change_24h && (
                <span
                  className={`text-[11px] font-mono font-semibold ${
                    comp.change_24h.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                  }`}
                >
                  {comp.change_24h}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
