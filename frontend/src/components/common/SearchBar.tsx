import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { useNewsStore } from '../../store/newsStore';
import { useTranslation } from '../../hooks/useTranslation';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  placeholder,
  className = '',
}) => {
  const { searchQuery, setSearchQuery } = useNewsStore();
  const { t } = useTranslation();
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const effectivePlaceholder = placeholder || t('search_placeholder');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [localQuery, setSearchQuery]);

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-slate-400 dark:text-slate-400 absolute left-3.5 pointer-events-none" />
      <input
        type="text"
        value={localQuery}
        onChange={(e) => setLocalQuery(e.target.value)}
        placeholder={effectivePlaceholder}
        className="w-full text-xs sm:text-sm pl-9 pr-9 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/90 text-slate-800 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 border border-slate-200/50 dark:border-slate-700/60 focus:bg-white dark:focus:bg-slate-900 focus:border-fintech-cyan-500 dark:focus:border-cyan-400 focus:outline-none transition-all duration-150"
      />
      {localQuery && (
        <button
          onClick={() => {
            setLocalQuery('');
            setSearchQuery('');
          }}
          className="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
