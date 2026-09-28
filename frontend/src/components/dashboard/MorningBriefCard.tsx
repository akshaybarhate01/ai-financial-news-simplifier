import React, { useState } from 'react';
import { Download, Sunrise } from 'lucide-react';
import { DailyBrief } from '../../types';
import { api } from '../../services/api';
import { useTranslation } from '../../hooks/useTranslation';

interface MorningBriefCardProps {
  brief: DailyBrief;
}

export const MorningBriefCard: React.FC<MorningBriefCardProps> = ({ brief }) => {
  const { t } = useTranslation();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const blob = await api.get<Blob>('/news/daily-brief/pdf');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Executive_Daily_Brief_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Could not generate PDF export. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="fintech-card p-6 bg-gradient-to-br from-white via-white to-slate-50 dark:from-[#0D1B2E] dark:via-[#0D1B2E] dark:to-[#070F1E] border-fintech-surface-200 dark:border-slate-800">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400">
            <Sunrise className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-fintech-navy-900 dark:text-white">
                {t('morning_brief')}
              </h3>
              <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                {t('live_edition')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {brief.date} • Synthesized by Llama 3.3 70B
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950 text-xs font-semibold hover:bg-fintech-navy-800 dark:hover:bg-cyan-400 disabled:opacity-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          {isDownloading ? t('exporting_pdf') : t('download_brief_pdf')}
        </button>
      </div>

      {/* Executive Summary */}
      <div className="py-4">
        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
          {brief.executive_summary}
        </p>
      </div>

      {/* Grid: Market Mood & Key Movers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100 dark:border-slate-800">
        {/* Mood */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071322] border border-slate-100 dark:border-slate-800/80 flex flex-col justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400">
            {t('market_mood_index')}
          </span>
          <div className="my-2">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-fintech-navy-900 dark:text-white">
                {brief.market_mood.label}
              </span>
              <span className="text-xs font-mono font-bold text-fintech-cyan-700 dark:text-cyan-400">
                {brief.market_mood.score}/100
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden mt-1.5">
              <div
                className="bg-fintech-cyan-600 dark:bg-cyan-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${brief.market_mood.score}%` }}
              />
            </div>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2">
            {brief.market_mood.summary}
          </p>
        </div>

        {/* Biggest Movers */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#071322] border border-slate-100 dark:border-slate-800/80 md:col-span-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 block mb-2">
            {t('key_movers')}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {brief.biggest_movers.map((mover) => (
              <div
                key={mover.ticker}
                className="p-2 bg-white dark:bg-[#0D1B2E] rounded-lg border border-slate-200/80 dark:border-slate-700/80 flex flex-col"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-fintech-navy-900 dark:text-white">
                    {mover.ticker}
                  </span>
                  <span
                    className={`text-[11px] font-mono font-semibold ${
                      mover.change.startsWith('+') ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {mover.change}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 truncate mt-0.5">
                  {mover.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
