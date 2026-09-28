import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Globe, TrendingUp, Landmark, Shield, Layers, Coins, ArrowRight } from 'lucide-react';
import { api } from '../services/api';
import { Category } from '../types';
import { useNewsStore } from '../store/newsStore';
import { useTranslation } from '../hooks/useTranslation';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';

export const CategoriesPage: React.FC = () => {
  const navigate = useNavigate();
  const { setActiveCategory } = useNewsStore();
  const { t } = useTranslation();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories-full'],
    queryFn: () => api.get('/news/categories'),
  });

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'macroeconomics':
        return <Globe className="w-6 h-6 text-fintech-cyan-600 dark:text-cyan-400" />;
      case 'equities':
        return <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />;
      case 'central-banks':
        return <Landmark className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />;
      case 'fixed-income':
        return <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />;
      case 'commodities':
        return <Layers className="w-6 h-6 text-amber-600 dark:text-amber-400" />;
      case 'crypto':
        return <Coins className="w-6 h-6 text-purple-600 dark:text-purple-400" />;
      default:
        return <Globe className="w-6 h-6 text-fintech-cyan-600 dark:text-cyan-400" />;
    }
  };

  const handleSelectCategory = (slug: string) => {
    setActiveCategory(slug);
    navigate('/news');
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
          {t('categories_title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('categories_sub')}
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => handleSelectCategory(cat.slug)}
              className="fintech-card p-6 cursor-pointer hover:border-fintech-cyan-500 dark:hover:border-cyan-500 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center">
                  {getCategoryIcon(cat.slug)}
                </div>
                <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white group-hover:text-fintech-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold text-fintech-cyan-700 dark:text-cyan-400 group-hover:text-fintech-cyan-800 dark:group-hover:text-cyan-300">
                <span>{t('browse_sector_news')}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
