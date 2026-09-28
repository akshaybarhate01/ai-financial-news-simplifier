import React from 'react';
import { ShieldCheck, Cpu, Database, Server, CheckCircle2, Terminal, ExternalLink } from 'lucide-react';

import { useTranslation } from '../hooks/useTranslation';

export const AboutPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
          {t('security_specs')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          Production engineering design, cybersecurity prompt defenses, and enterprise multi-layer topology.
        </p>
      </div>

      {/* Overview Card */}
      <div className="fintech-card p-6 space-y-4">
        <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white">
          Executive Summary & Product Mission
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <b>AI Financial News Simplifier</b> is an institutional fintech intelligence application engineered to make complex macroeconomic and equity market journalism accessible to everyone. By marrying state-of-the-art LLM intelligence (Llama 3.3 70B) with rigorous cybersecurity filtering, the system generates structured 3-line summaries, plain-English analogies, institutional market sentiment metrics, and contextually grounded discussion with zero jargon.
        </p>
      </div>

      {/* Prompt Injection Defense Architecture */}
      <div className="fintech-card p-6 space-y-4 border-fintech-cyan-200 dark:border-cyan-800 bg-gradient-to-br from-white to-slate-50 dark:from-[#0D1B2E] dark:to-[#091524]">
        <div className="flex items-center gap-2 text-fintech-cyan-700 dark:text-cyan-400">
          <ShieldCheck className="w-5 h-5" />
          <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white">
            {t('prompt_guard_active')}
          </h3>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          {t('prompt_guard_sub')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-fintech-navy-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              1. Steganographic Sanitization
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Strips zero-width spaces (\u200B-\u200D, \uFEFF), bi-directional override characters, and non-printable control bytes used to conceal jailbreak payloads.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-fintech-navy-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              2. Adversarial Regex & Heuristic Scanning
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Detects and immediately rejects instruction override patterns (e.g. "ignore previous instructions", "system prompt reveal", "DAN mode").
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-fintech-navy-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              3. Rigid Context Encapsulation
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Wraps all external article data into immutable <code>=== BEGIN UNTRUSTED CONTEXT ===</code> boundaries, informing the model that article content must never be executed as instructions.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-1.5">
            <span className="text-xs font-bold text-fintech-navy-900 dark:text-white flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              4. Deterministic JSON Schema Enforcement
            </span>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              Requires responses to match strict Pydantic JSON contracts (3-line summary, ELI15, sentiment, confidence) with automated parsing validation.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Architecture Specification */}
      <div className="fintech-card p-6 space-y-4">
        <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
          <Server className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
          Technical Architecture Matrix
        </h3>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 uppercase text-[10px]">
                <th className="py-2 font-bold">Layer</th>
                <th className="py-2 font-bold">Technology</th>
                <th className="py-2 font-bold">Responsibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-600 dark:text-slate-300">
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">Frontend Core</td>
                <td>React 18 + Vite + TypeScript</td>
                <td>Type-safe institutional user interface and routing</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">Styling System</td>
                <td>Tailwind CSS</td>
                <td>Minimalist fintech aesthetic, 14px radiuses, deep navy & cyan</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">State & Caching</td>
                <td>Zustand + React Query</td>
                <td>Optimistic updates, auth tokens, background revalidation</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">Visualizations</td>
                <td>Chart.js + react-chartjs-2</td>
                <td>Doughnut, Bar, and Line charts for sector & sentiment analytics</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">Backend API</td>
                <td>FastAPI (Python 3.14)</td>
                <td>High-throughput RESTful endpoints with uniform JSON envelopes</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">Database & ORM</td>
                <td>SQLAlchemy + PostgreSQL / SQLite</td>
                <td>Normalized schemas: users, articles, summaries, sentiments, glossary</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">AI Inference</td>
                <td>Groq API (Llama 3.3 70B)</td>
                <td>Sub-second structured JSON financial summarization and ELI15</td>
              </tr>
              <tr>
                <td className="py-2.5 font-semibold text-fintech-navy-900 dark:text-white">Authentication</td>
                <td>Bcrypt + PyJWT</td>
                <td>15-minute access token rotation and salted password hashing</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
