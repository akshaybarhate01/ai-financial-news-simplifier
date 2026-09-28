import React from 'react';
import { Sparkles, GraduationCap } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface ELI15ToggleProps {
  isELI15: boolean;
  onToggle: (val: boolean) => void;
}

export const ELI15Toggle: React.FC<ELI15ToggleProps> = ({ isELI15, onToggle }) => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
      <button
        onClick={() => onToggle(false)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          !isELI15
            ? 'bg-white dark:bg-slate-900 text-fintech-navy-900 dark:text-white shadow-xs'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <GraduationCap className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
        {t('analyst_mode')}
      </button>

      <button
        onClick={() => onToggle(true)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
          isELI15
            ? 'bg-fintech-cyan-600 text-white shadow-xs'
            : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
      >
        <Sparkles className="w-3.5 h-3.5" />
        {t('eli15_button')}
      </button>
    </div>
  );
};
