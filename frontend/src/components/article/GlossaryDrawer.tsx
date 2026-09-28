import React from 'react';
import { X, BookOpen, Lightbulb, Link2 } from 'lucide-react';
import { GlossaryTerm } from '../../types';
import { useTranslation } from '../../hooks/useTranslation';

interface GlossaryDrawerProps {
  term: GlossaryTerm | null;
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryDrawer: React.FC<GlossaryDrawerProps> = ({
  term,
  isOpen,
  onClose,
}) => {
  const { t } = useTranslation();
  if (!isOpen || !term) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white dark:bg-[#0B1728] h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 border-l border-slate-200 dark:border-slate-800">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white dark:bg-[#0B1728] z-10">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-fintech-cyan-700 dark:text-cyan-400">
                  {term.category}
                </span>
                <h3 className="text-xl font-bold text-fintech-navy-900 dark:text-white">
                  {term.term}
                </h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="p-6 space-y-6">
            {/* Short Definition */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                {t('standard_def')}
              </h4>
              <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60">
                {term.short_definition}
              </p>
            </div>

            {/* Everyday Analogy */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-fintech-cyan-700 dark:text-cyan-400 mb-2 flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
                {t('eli15_analogy_title')}
              </h4>
              <div className="p-4 rounded-xl bg-gradient-to-br from-fintech-cyan-50/60 to-white dark:from-cyan-950/40 dark:to-slate-900 border border-fintech-cyan-200/80 dark:border-cyan-800/60">
                <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {term.beginner_analogy}
                </p>
              </div>
            </div>

            {/* In-depth Institutional Explanation */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-2">
                {t('institutional_role')}
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {term.full_explanation}
              </p>
            </div>

            {/* Related Financial Terms */}
            {term.related_terms && term.related_terms.length > 0 && (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-400 mb-3 flex items-center gap-1.5">
                  <Link2 className="w-3.5 h-3.5" />
                  {t('related_concepts')}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {term.related_terms.map((rel, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                    >
                      {rel}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 font-semibold text-xs hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 transition-colors shadow-sm"
          >
            {t('close_glossary')}
          </button>
        </div>
      </div>
    </div>
  );
};
