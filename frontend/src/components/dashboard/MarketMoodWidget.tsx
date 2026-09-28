import React from 'react';
import { Gauge } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface MarketMoodWidgetProps {
  score?: number;
  label?: string;
  summary?: string;
}

export const MarketMoodWidget: React.FC<MarketMoodWidgetProps> = ({
  score = 68,
  label = 'Cautiously Bullish',
  summary = 'Equities supported by semiconductor infrastructure growth and stable yields.',
}) => {
  const { t } = useTranslation();

  return (
    <div className="fintech-card p-5 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 flex items-center gap-1.5">
          <Gauge className="w-3.5 h-3.5 text-fintech-cyan-600 dark:text-cyan-400" />
          {t('market_mood_index')}
        </span>
        <span className="text-xs font-mono font-bold text-fintech-cyan-700 dark:text-cyan-400 bg-fintech-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-fintech-cyan-200 dark:border-cyan-800">
          {score}/100
        </span>
      </div>

      <div>
        <h4 className="text-base font-bold text-fintech-navy-900 dark:text-white leading-tight">
          {label}
        </h4>
        <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden my-2">
          <div
            className="bg-gradient-to-r from-fintech-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {summary}
        </p>
      </div>
    </div>
  );
};
