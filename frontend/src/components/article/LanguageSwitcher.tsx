import React from 'react';
import { Languages } from 'lucide-react';

interface LanguageSwitcherProps {
  currentLanguage: 'en' | 'hi' | 'mr';
  onChange: (lang: 'en' | 'hi' | 'mr') => void;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onChange,
}) => {
  const languages: { code: 'en' | 'hi' | 'mr'; label: string; native: string }[] = [
    { code: 'en', label: 'English', native: 'EN' },
    { code: 'hi', label: 'Hindi', native: 'हिंदी' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
  ];

  return (
    <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs transition-colors">
      <div className="pl-1.5 pr-0.5 text-slate-400 dark:text-slate-400">
        <Languages className="w-3.5 h-3.5" />
      </div>
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => onChange(lang.code)}
          className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
            currentLanguage === lang.code
              ? 'bg-white dark:bg-slate-900 text-fintech-navy-900 dark:text-white shadow-xs font-semibold'
              : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
          }`}
          title={lang.label}
        >
          {lang.native}
        </button>
      ))}
    </div>
  );
};
