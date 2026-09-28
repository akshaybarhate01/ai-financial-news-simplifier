import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Search, Lightbulb, Link2 } from 'lucide-react';
import { api } from '../services/api';
import { GlossaryTerm } from '../types';
import { GlossaryDrawer } from '../components/article/GlossaryDrawer';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { useTranslation } from '../hooks/useTranslation';

export const GlossaryPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const { data: terms = [], isLoading } = useQuery<GlossaryTerm[]>({
    queryKey: ['glossary-terms-full'],
    queryFn: () => api.get('/glossary'),
  });

  const filteredTerms = terms.filter(
    (tItem) =>
      tItem.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tItem.short_definition.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tItem.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDrawer = (term: GlossaryTerm) => {
    setSelectedTerm(term);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
            {t('glossary_title')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('glossary_sub')}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('search_glossary')}
            className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-transparent focus:bg-white dark:focus:bg-slate-900 focus:border-fintech-cyan-500 focus:outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTerms.map((term) => (
            <div
              key={term.slug}
              onClick={() => openDrawer(term)}
              className="fintech-card p-5 cursor-pointer hover:border-fintech-cyan-500 dark:hover:border-cyan-500 transition-all flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-fintech-cyan-700 dark:text-cyan-400 bg-fintech-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded">
                    {term.category}
                  </span>
                  <BookOpen className="w-4 h-4 text-slate-300 dark:text-slate-600 group-hover:text-fintech-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
                </div>

                <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white group-hover:text-fintech-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                  {term.term}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 mt-2 leading-relaxed">
                  {term.short_definition}
                </p>

                {/* Analogy Preview */}
                <div className="mt-3 p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2">
                  <Lightbulb className="w-3.5 h-3.5 text-fintech-cyan-600 dark:text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="line-clamp-2">{term.beginner_analogy}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-fintech-cyan-700 dark:text-cyan-400 group-hover:text-fintech-cyan-800 dark:group-hover:text-cyan-300">
                {t('view_full_analogy')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Side Drawer */}
      <GlossaryDrawer
        term={selectedTerm}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
