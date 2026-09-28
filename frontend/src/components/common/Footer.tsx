import React from 'react';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-white dark:bg-[#0B1728] border-t border-slate-200 dark:border-slate-800 mt-16 py-12 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-150">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Col */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-fintech-navy-900 dark:bg-cyan-500 text-fintech-cyan-500 dark:text-slate-950 flex items-center justify-center font-bold">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-sm font-bold text-fintech-navy-900 dark:text-white">
                {t('brand_name')}<span className="text-fintech-cyan-600 dark:text-cyan-400">{t('brand_suffix')}</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              {t('footer_desc')}
            </p>
          </div>

          {/* Markets & Features */}
          <div>
            <span className="text-[11px] font-bold text-fintech-navy-900 dark:text-white uppercase tracking-wider block mb-3">
              {t('platform_features')}
            </span>
            <ul className="space-y-2">
              <li>
                <Link to="/news" className="hover:text-fintech-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  {t('news_feed')}
                </Link>
              </li>
              <li>
                <Link to="/ai-summaries" className="hover:text-fintech-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  {t('ai_summaries')}
                </Link>
              </li>
              <li>
                <Link to="/glossary" className="hover:text-fintech-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  {t('glossary')}
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-fintech-cyan-600 dark:hover:text-cyan-400 transition-colors">
                  {t('analytics')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology & Architecture */}
          <div>
            <span className="text-[11px] font-bold text-fintech-navy-900 dark:text-white uppercase tracking-wider block mb-3">
              {t('tech_stack')}
            </span>
            <ul className="space-y-2 text-slate-600 dark:text-slate-400">
              <li>Llama 3.3 (70B) via Groq API</li>
              <li>FastAPI + Python 3.14 + SQLAlchemy</li>
              <li>React 18 + TypeScript + Tailwind CSS</li>
              <li>Chart.js Financial Visualizations</li>
            </ul>
          </div>

          {/* Cybersecurity & Trust */}
          <div>
            <span className="text-[11px] font-bold text-fintech-navy-900 dark:text-white uppercase tracking-wider block mb-3">
              {t('cybersecurity')}
            </span>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                {t('prompt_injection_defense')}
              </li>
              <li>Bcrypt + JWT Token Rotation</li>
              <li>In-Memory Rate Limiting</li>
              <li className="pt-2">
                <Link
                  to="/about"
                  className="font-semibold text-fintech-cyan-700 dark:text-cyan-400 hover:underline"
                >
                  {t('view_security_specs')}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <p>{t('all_rights_reserved')}</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:underline">{t('security_specs')}</Link>
            <Link to="/settings" className="hover:underline">{t('settings')}</Link>
            <Link to="/glossary" className="hover:underline">{t('glossary')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
