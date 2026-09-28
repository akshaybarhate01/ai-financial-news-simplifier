import React from 'react';
import { Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';
import { AISummaryData, SentimentData } from '../../types';
import { SentimentBadge } from '../news/SentimentBadge';
import { useTranslation } from '../../hooks/useTranslation';

interface SummaryCardProps {
  summary: AISummaryData;
  sentiment?: SentimentData;
  isELI15: boolean;
  language: 'en' | 'hi' | 'mr';
}

export const SummaryCard: React.FC<SummaryCardProps> = ({
  summary,
  sentiment,
  isELI15,
  language,
}) => {
  const { t } = useTranslation();

  const getLocalizedSummary = () => {
    if (language === 'hi' && summary.hindi_summary) {
      return summary.hindi_summary;
    }
    if (language === 'mr' && summary.marathi_summary) {
      return summary.marathi_summary;
    }
    return isELI15 ? summary.eli15_explanation : summary.beginner_explanation;
  };

  return (
    <div className="fintech-card p-6 space-y-6">
      {/* Header: AI Model & Confidence */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-fintech-navy-900 dark:text-white">
              {t('ai_intelligence')}
            </h4>
            <p className="text-[11px] text-slate-400 font-mono">
              Model: {summary.model_version || 'Llama 3.3 (70B)'}
            </p>
          </div>
        </div>

        <div className="text-right">
          <div className="text-xs font-semibold text-fintech-navy-900 dark:text-slate-200">
            {Math.round(summary.confidence_score * 100)}% {t('confidence')}
          </div>
          <p className="text-[11px] text-slate-400">{t('structured_output')}</p>
        </div>
      </div>

      {/* Primary Explanation Box (Analyst or ELI15 or Translation) */}
      <div
        className={`p-4 rounded-xl border ${
          isELI15
            ? 'bg-gradient-to-br from-fintech-cyan-50/70 to-white dark:from-cyan-950/40 dark:to-[#0D1B2E] border-fintech-cyan-200 dark:border-cyan-800/80'
            : 'bg-slate-50/80 dark:bg-[#081322] border-slate-200 dark:border-slate-800'
        }`}
      >
        <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-fintech-navy-900 dark:text-slate-100 mb-2">
          <Lightbulb className={`w-3.5 h-3.5 ${isELI15 ? 'text-fintech-cyan-600 dark:text-cyan-400' : 'text-slate-600 dark:text-slate-400'}`} />
          {isELI15 ? t('eli15_analogy_title') : t('analyst_breakdown_title')}
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {getLocalizedSummary()}
        </p>
      </div>

      {/* 3-Line Summary */}
      <div>
        <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
          {t('core_briefing_3line')}
        </h5>
        <div className="space-y-2.5">
          {summary.three_line_summary.map((line, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-300">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-fintech-navy-900 dark:text-slate-200 font-bold flex items-center justify-center text-[10px]">
                {idx + 1}
              </span>
              <span className="leading-snug pt-0.5">{line}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Takeaways */}
      {summary.key_takeaways && summary.key_takeaways.length > 0 && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3">
            {t('institutional_takeaways')}
          </h5>
          <ul className="space-y-2">
            {summary.key_takeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-fintech-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                <span>{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Why it Matters & Market Impact Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#081322] border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            {t('why_it_matters')}
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {summary.why_it_matters}
          </p>
        </div>

        <div className="p-3.5 rounded-lg bg-slate-50 dark:bg-[#081322] border border-slate-100 dark:border-slate-800">
          <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
            {t('market_impact')}
          </span>
          <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
            {summary.market_impact}
          </p>
        </div>
      </div>

      {/* Market Sentiment Reasoning */}
      {sentiment && (
        <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {t('sentiment_bias')}
            </span>
            <SentimentBadge sentiment={sentiment.sentiment_label} />
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#081322] p-3 rounded-lg border border-slate-100 dark:border-slate-800 leading-relaxed">
            <span className="font-semibold text-slate-800 dark:text-slate-200">{t('analytical_rationale')} </span>
            {sentiment.reasoning}
          </p>
        </div>
      )}
    </div>
  );
};
