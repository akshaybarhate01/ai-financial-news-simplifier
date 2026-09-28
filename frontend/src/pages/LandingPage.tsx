import React from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Sparkles,
  ShieldCheck,
  Languages,
  BookOpen,
  ArrowRight,
  BarChart3,
  Bot,
  Zap,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

export const LandingPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-16 py-6">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-6 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fintech-cyan-50 dark:bg-cyan-950/60 border border-fintech-cyan-200/80 dark:border-cyan-800 text-fintech-cyan-700 dark:text-cyan-400 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t('hero_badge')}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight leading-tight">
          {t('hero_title')}{' '}
          <span className="text-fintech-cyan-600 dark:text-cyan-400">{t('hero_title_highlight')}</span>
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
          {t('hero_desc')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/news"
            className="px-6 py-3 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 font-semibold text-sm hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 transition-all shadow-sm flex items-center gap-2 group"
          >
            {t('explore_news')}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-xs"
          >
            {t('open_dashboard')}
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400 dark:text-slate-500 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {t('trust_analogies')}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {t('trust_defense')}
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            {t('trust_multilingual')}
          </span>
        </div>
      </section>

      {/* Feature Pillar Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="fintech-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white">
            {t('feature_3line_title')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('feature_3line_desc')}
          </p>
        </div>

        <div className="fintech-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400 flex items-center justify-center">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white">
            {t('feature_eli15_title')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('feature_eli15_desc')}
          </p>
        </div>

        <div className="fintech-card p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400 flex items-center justify-center">
            <Bot className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white">
            {t('feature_chat_title')}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('feature_chat_desc')}
          </p>
        </div>
      </section>

      {/* Interactive Feature Demo Preview */}
      <section className="fintech-card p-8 bg-slate-900 dark:bg-[#070F1E] border-slate-800 text-white rounded-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-fintech-cyan-500">
              {t('arch_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              {t('arch_title')}
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              {t('arch_desc')}
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-fintech-cyan-400 hover:text-fintech-cyan-300"
              >
                {t('inspect_security')}
              </Link>
            </div>
          </div>

          <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3 font-mono text-xs text-slate-300">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-[11px] text-slate-400">
              <span>structured_output.json</span>
              <span className="text-emerald-400">Validated 200 OK</span>
            </div>
            <p className="text-slate-400">"three_line_summary": [</p>
            <p className="pl-4 text-emerald-300">"Nvidia Blackwell B200 shipments accelerate ahead of estimates."</p>
            <p className="pl-4 text-emerald-300">"Hyperscale cloud capex expanded to secure AI computing clusters."</p>
            <p className="pl-4 text-emerald-300">"Expected quarterly data center revenue exceeds $10 billion."</p>
            <p className="text-slate-400">],</p>
            <p className="text-slate-400">"sentiment": &#123; "label": <span className="text-emerald-400">"Bullish"</span>, "confidence": <span className="text-cyan-400">0.96</span> &#125;</p>
          </div>
        </div>
      </section>
    </div>
  );
};
