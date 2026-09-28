import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { TrendingUp, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '../components/common/ThemeToggle';
import { LanguageSwitcher } from '../components/article/LanguageSwitcher';
import { useNewsStore } from '../store/newsStore';
import { useTranslation } from '../hooks/useTranslation';

export const AuthLayout: React.FC = () => {
  const { activeLanguage, setActiveLanguage } = useNewsStore();
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-fintech-surface-50 dark:bg-[#070F1E] text-fintech-text-primary dark:text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 transition-colors duration-150 relative">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <ThemeToggle />
        <LanguageSwitcher
          currentLanguage={activeLanguage}
          onChange={(l) => setActiveLanguage(l)}
        />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-fintech-navy-900 dark:bg-cyan-500 text-fintech-cyan-500 dark:text-slate-950 flex items-center justify-center font-bold text-lg shadow-sm">
            <TrendingUp className="w-6 h-6 stroke-[2.5]" />
          </div>
          <span className="text-xl font-bold text-fintech-navy-900 dark:text-white">
            {t('brand_name')}<span className="text-fintech-cyan-600 dark:text-cyan-400">{t('brand_suffix')}</span>
          </span>
        </Link>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="fintech-card py-8 px-6 sm:px-10">
          <Outlet />
        </div>

        <div className="mt-6 text-center text-xs text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Bcrypt Hash Protection & Encrypted JWT Bearer Session</span>
        </div>
      </div>
    </div>
  );
};
