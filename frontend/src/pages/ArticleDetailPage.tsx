import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Clock,
  ExternalLink,
  Volume2,
  VolumeX,
  Share2,
  Building2,
  ArrowLeft,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { api } from '../services/api';
import { Article, GlossaryTerm } from '../types';
import { SummaryCard } from '../components/article/SummaryCard';
import { ELI15Toggle } from '../components/article/ELI15Toggle';
import { LanguageSwitcher } from '../components/article/LanguageSwitcher';
import { GlossaryDrawer } from '../components/article/GlossaryDrawer';
import { ContextualChat } from '../components/article/ContextualChat';
import { CompanyCard } from '../components/company/CompanyCard';
import { BookmarkButton } from '../components/news/BookmarkButton';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { ErrorState } from '../components/common/ErrorState';
import { useNewsStore } from '../store/newsStore';
import { useTranslation } from '../hooks/useTranslation';

export const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { activeLanguage, setActiveLanguage } = useNewsStore();
  const { t } = useTranslation();
  const [isELI15, setIsELI15] = useState(false);
  const [selectedTerm, setSelectedTerm] = useState<GlossaryTerm | null>(null);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // 1. Fetch Article Detail
  const { data: article, isLoading, error, refetch } = useQuery<Article>({
    queryKey: ['article-detail', id],
    queryFn: () => api.get(`/news/article/${id}`),
    enabled: !!id,
  });

  // Automatically record reading history
  useEffect(() => {
    if (id && localStorage.getItem('fintech_access_token')) {
      api.post('/bookmarks/history', {
        article_id: Number(id),
        read_duration_seconds: 45,
      }).catch(() => {});
    }
  }, [id]);

  // Audio Speech Synthesis
  const toggleSpeech = () => {
    if (!article) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = isELI15 && article.ai_summary
      ? article.ai_summary.eli15_explanation
      : `${article.title}. ${article.content || article.description || ''}`;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleTermClick = (termData: any) => {
    setSelectedTerm({
      id: 0,
      term: termData.term,
      slug: termData.slug,
      category: termData.category,
      short_definition: termData.short_definition,
      beginner_analogy: termData.beginner_analogy,
      full_explanation: termData.short_definition,
      related_terms: [],
    });
    setIsGlossaryOpen(true);
  };

  if (isLoading) {
    return <LoadingSkeleton count={3} />;
  }

  if (error || !article) {
    return (
      <ErrorState
        message="Could not load requested financial intelligence article."
        onRetry={() => refetch()}
      />
    );
  }

  // Render article content with highlighted glossary terms
  const renderHighlightedContent = (text: string) => {
    if (!article.detected_terms || article.detected_terms.length === 0) {
      return text;
    }

    const termMap = new Map();
    article.detected_terms.forEach((dt) => {
      termMap.set(dt.term.toLowerCase(), dt);
    });

    // Create regex matching detected terms
    const pattern = new RegExp(
      `\\b(${article.detected_terms.map((t) => t.term).join('|')})\\b`,
      'gi'
    );

    const parts = text.split(pattern);
    return parts.map((part, index) => {
      const lower = part.toLowerCase();
      if (termMap.has(lower)) {
        const termInfo = termMap.get(lower);
        return (
          <span
            key={index}
            onClick={() => handleTermClick(termInfo)}
            className="glossary-term-highlight"
            title={`Click to view analogy & definition for ${part}`}
          >
            {part}
          </span>
        );
      }
      return part;
    });
  };

  const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="space-y-8 pb-16">
      {/* Back Link & Quick Utility Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <Link
          to="/news"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-fintech-navy-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('back_to_feed')}
        </Link>

        <div className="flex items-center gap-2.5">
          <ELI15Toggle isELI15={isELI15} onToggle={setIsELI15} />
          <LanguageSwitcher
            currentLanguage={activeLanguage}
            onChange={(l) => setActiveLanguage(l)}
          />

          <button
            onClick={toggleSpeech}
            className={`p-2 rounded-xl text-xs font-semibold border transition-colors flex items-center gap-1.5 ${
              isSpeaking
                ? 'bg-fintech-cyan-600 text-white border-fintech-cyan-600'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
            title={isSpeaking ? t('mute') : t('listen')}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{isSpeaking ? t('mute') : t('listen')}</span>
          </button>

          <BookmarkButton articleId={article.id} initialBookmarked={article.is_bookmarked} />
        </div>
      </div>

      {/* Main 2-Column Split Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 Cols): Headline, Image, Full Article, Glossary Links */}
        <div className="lg:col-span-7 space-y-6">
          {/* Metadata Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-fintech-navy-900 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
              {article.source_name}
            </span>
            {article.category && (
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-md">
                {article.category.name}
              </span>
            )}
            {article.ticker && (
              <span className="inline-flex items-center gap-1 text-xs font-mono font-semibold text-fintech-cyan-700 dark:text-cyan-400 bg-fintech-cyan-50 dark:bg-cyan-950/60 px-2 py-0.5 rounded border border-fintech-cyan-200 dark:border-cyan-800">
                <Building2 className="w-3 h-3" />
                {article.ticker}
              </span>
            )}
            <span className="text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {publishedDate}
            </span>
          </div>

          {/* Article Headline */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-fintech-navy-900 dark:text-white leading-tight">
            {article.title}
          </h1>

          {/* Author Byline */}
          {article.author && (
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('by_author', { author: article.author })}
            </p>
          )}

          {/* Hero Image */}
          {article.image_url && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-2xs max-h-[400px]">
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Detected Glossary Terms Notice */}
          {article.detected_terms && article.detected_terms.length > 0 && (
            <div className="p-3.5 rounded-xl bg-fintech-cyan-50/70 dark:bg-cyan-950/50 border border-fintech-cyan-200 dark:border-cyan-800 text-xs text-fintech-cyan-900 dark:text-cyan-200 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400 flex-shrink-0" />
              <span>
                <b>{t('interactive_terms_detected')}</b> {t('interactive_terms_sub')}
              </span>
            </div>
          )}

          {/* Full Article Body */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-sm leading-relaxed text-slate-700 dark:text-slate-300 space-y-4 pt-2">
            <p className="font-medium text-slate-900 dark:text-slate-100 text-base leading-relaxed">
              {renderHighlightedContent(article.description || '')}
            </p>

            {article.content && (
              <p className="leading-relaxed">
                {renderHighlightedContent(article.content)}
              </p>
            )}

            <p className="text-xs text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-4 font-mono">
              {t('original_wire_source')} <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-fintech-cyan-700 dark:text-cyan-400 underline">{article.source_name}</a>
            </p>
          </div>
        </div>

        {/* Right Column (5 Cols): AI Summary Card, Company Card, Contextual AI Chat */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Structured Summary */}
          {article.ai_summary && (
            <SummaryCard
              summary={article.ai_summary}
              sentiment={article.sentiment}
              isELI15={isELI15}
              language={activeLanguage}
            />
          )}

          {/* Company Intelligence Dossier */}
          {article.company && (
            <CompanyCard company={article.company} />
          )}

          {/* Strictly Scoped Contextual AI Chatbot */}
          <ContextualChat
            articleId={article.id}
            articleTitle={article.title}
          />
        </div>
      </div>

      {/* Interactive Glossary Drawer */}
      <GlossaryDrawer
        term={selectedTerm}
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
};
