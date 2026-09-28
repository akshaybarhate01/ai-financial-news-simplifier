import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SentimentBadgeProps {
  sentiment: 'Bullish' | 'Neutral' | 'Bearish' | string;
  showIcon?: boolean;
  className?: string;
}

export const SentimentBadge: React.FC<SentimentBadgeProps> = ({
  sentiment,
  showIcon = true,
  className = '',
}) => {
  const norm = (sentiment || 'Neutral').toLowerCase();

  if (norm === 'bullish') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/60 ${className}`}
      >
        {showIcon && <TrendingUp className="w-3 h-3 text-emerald-600" />}
        Bullish
      </span>
    );
  }

  if (norm === 'bearish') {
    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 border border-rose-200/60 ${className}`}
      >
        {showIcon && <TrendingDown className="w-3 h-3 text-rose-600" />}
        Bearish
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 ${className}`}
    >
      {showIcon && <Minus className="w-3 h-3 text-slate-500" />}
      Neutral
    </span>
  );
};
