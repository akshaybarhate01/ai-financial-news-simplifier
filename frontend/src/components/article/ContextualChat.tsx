import React, { useState } from 'react';
import { Send, Bot, User as UserIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';
import { useTranslation } from '../../hooks/useTranslation';

interface ContextualChatProps {
  articleId: number;
  articleTitle: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  isInScope?: boolean;
}

export const ContextualChat: React.FC<ContextualChatProps> = ({ articleId, articleTitle }) => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: t('chat_initial'),
      isInScope: true,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'What is the direct market impact?',
    'Why is the sentiment rated this way?',
    'What key numbers or metrics are reported?',
  ];

  const handleSend = async (queryText?: string) => {
    const textToSend = queryText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: textToSend };
    setMessages((prev) => [...prev, userMessage]);
    if (!queryText) setInput('');
    setIsLoading(true);

    try {
      const response = await api.post('/news/chat', {
        article_id: articleId,
        question: textToSend,
        history: messages.slice(-4).map((m) => ({ role: m.role, content: m.content })),
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: response.answer,
          isInScope: response.is_in_scope,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: err.message || 'Could not process query. Please try again.',
          isInScope: false,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fintech-card flex flex-col h-[520px] overflow-hidden">
      {/* Chat Header */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#070F1E] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-fintech-cyan-50 dark:bg-cyan-950/60 text-fintech-cyan-700 dark:text-cyan-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-fintech-navy-900 dark:text-white">
              {t('ask_ai_title')}
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              {t('ask_ai_sub')}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
          {t('grounded')}
        </span>
      </div>

      {/* Suggested Quick Questions */}
      <div className="px-4 py-2 bg-white dark:bg-[#0A1627] border-b border-slate-100 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">{t('try_label')}</span>
        {sampleQuestions.map((sq, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(sq)}
            className="text-[11px] text-slate-600 dark:text-slate-300 hover:text-fintech-cyan-700 dark:hover:text-cyan-400 hover:bg-fintech-cyan-50 dark:hover:bg-slate-800 px-2.5 py-1 rounded-md border border-slate-200 dark:border-slate-700 whitespace-nowrap transition-colors"
          >
            {sq}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-white dark:bg-[#0D1B2E]">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-2.5 ${
              m.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                m.role === 'user'
                  ? 'bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950'
                  : 'bg-fintech-cyan-100 dark:bg-slate-800 text-fintech-cyan-700 dark:text-cyan-400'
              }`}
            >
              {m.role === 'user' ? <UserIcon className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            <div
              className={`max-w-[85%] rounded-xl p-3 text-xs leading-relaxed ${
                m.role === 'user'
                  ? 'bg-fintech-navy-900 dark:bg-cyan-600 text-white rounded-tr-none'
                  : m.isInScope === false
                  ? 'bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300 rounded-tl-none'
                  : 'bg-slate-100 dark:bg-[#11233D] text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/60 dark:border-slate-700'
              }`}
            >
              {m.isInScope === false && (
                <div className="flex items-center gap-1 font-semibold text-[11px] text-rose-700 dark:text-rose-400 mb-1">
                  <AlertCircle className="w-3 h-3" />
                  {t('out_of_scope')}
                </div>
              )}
              {m.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
            <Bot className="w-3.5 h-3.5 animate-pulse text-fintech-cyan-600 dark:text-cyan-400" />
            <span>{t('analyzing_context')}</span>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="p-3 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-[#0A1627] flex items-center gap-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('chat_placeholder')}
          disabled={isLoading}
          className="flex-1 text-xs px-3.5 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#11233D] text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="p-2.5 bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950 rounded-lg hover:bg-fintech-navy-800 dark:hover:bg-cyan-400 disabled:opacity-40 transition-colors"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
};
