import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Bookmark, Download, Trash2, ExternalLink, Folder, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { BookmarkItem } from '../types';
import { useBookmarkStore } from '../store/bookmarkStore';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { useTranslation } from '../hooks/useTranslation';

export const BookmarksPage: React.FC = () => {
  const { bookmarks, fetchBookmarks, removeBookmark, isLoading } = useBookmarkStore();
  const { t } = useTranslation();
  const [selectedFolder, setSelectedFolder] = useState<string>('All');
  const [isExporting, setIsExporting] = useState(false);

  React.useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const folders = ['All', ...Array.from(new Set(bookmarks.map((b) => b.folder || 'General')))];

  const filteredBookmarks =
    selectedFolder === 'All'
      ? bookmarks
      : bookmarks.filter((b) => (b.folder || 'General') === selectedFolder);

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const blob = await api.get<Blob>('/bookmarks/pdf');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Saved_Financial_Intelligence_Digest.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Could not export PDF digest. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
            {t('curated_bookmarks')}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {t('curated_bookmarks_sub')}
          </p>
        </div>

        <button
          onClick={handleExportPDF}
          disabled={isExporting || bookmarks.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 text-xs font-semibold hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 disabled:opacity-50 transition-colors shadow-sm self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          {isExporting ? t('generating_digest') : t('export_collection_pdf')}
        </button>
      </div>

      {/* Folder Filter Bar */}
      {folders.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
                selectedFolder === folder
                  ? 'bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 shadow-2xs'
                  : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Folder className="w-3 h-3 inline-block mr-1 opacity-70" />
              {folder}
            </button>
          ))}
        </div>
      )}

      {/* Bookmarks List */}
      {isLoading ? (
        <LoadingSkeleton count={3} />
      ) : filteredBookmarks.length === 0 ? (
        <EmptyState
          title={t('no_bookmarks_yet')}
          description={t('articles_recorded_here')}
          actionText={t('explore_news')}
          onAction={() => (window.location.href = '/news')}
        />
      ) : (
        <div className="space-y-4">
          {filteredBookmarks.map((bm) => {
            const art = bm.article;
            return (
              <div
                key={bm.id}
                className="fintech-card p-5 flex flex-col sm:flex-row items-start justify-between gap-4"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {art?.source_name || 'Financial Press'}
                    </span>
                    <span className="text-[11px] font-medium text-fintech-cyan-700 dark:text-cyan-300 bg-fintech-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-fintech-cyan-200 dark:border-cyan-800">
                      Folder: {bm.folder}
                    </span>
                  </div>

                  <Link to={`/article/${bm.article_id}`} className="block group">
                    <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white group-hover:text-fintech-cyan-700 dark:group-hover:text-cyan-400 transition-colors">
                      {art?.title || `Article #${bm.article_id}`}
                    </h3>
                  </Link>

                  {art?.ai_summary?.three_line_summary && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                      {art.ai_summary.three_line_summary[0]}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 sm:self-center">
                  <Link
                    to={`/article/${bm.article_id}`}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-fintech-cyan-700 dark:hover:text-cyan-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors text-xs font-semibold inline-flex items-center gap-1"
                  >
                    Read
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    onClick={() => removeBookmark(bm.article_id)}
                    className="p-2 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
