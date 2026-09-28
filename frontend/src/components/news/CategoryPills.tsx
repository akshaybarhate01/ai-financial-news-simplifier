import React from 'react';
import { useNewsStore } from '../../store/newsStore';
import { useTranslation } from '../../hooks/useTranslation';

interface CategoryPillsProps {
  categories: { id: number; name: string; slug: string }[];
}

export const CategoryPills: React.FC<CategoryPillsProps> = ({ categories }) => {
  const { activeCategory, setActiveCategory } = useNewsStore();
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
      <button
        onClick={() => setActiveCategory(null)}
        className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
          activeCategory === null
            ? 'bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm font-semibold'
            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        {t('all_markets')}
      </button>

      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(isActive ? null : cat.slug)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-150 ${
              isActive
                ? 'bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-sm font-semibold'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {cat.name}
          </button>
        );
      })}
    </div>
  );
};
