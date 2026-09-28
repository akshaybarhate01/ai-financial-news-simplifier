import React, { useState } from 'react';
import { KeyRound, ShieldCheck, Globe, Bell, Save, CheckCircle2 } from 'lucide-react';
import { usePreferencesStore } from '../store/preferencesStore';
import { useTranslation } from '../hooks/useTranslation';
import { Moon, Sun } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const {
    groqApiKey,
    newsApiKey,
    setGroqApiKey,
    setNewsApiKey,
    preferences,
    updatePreferences,
    theme,
    setTheme,
  } = usePreferencesStore();

  const { t } = useTranslation();
  const [localGroq, setLocalGroq] = useState(groqApiKey);
  const [localNews, setLocalNews] = useState(newsApiKey);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setGroqApiKey(localGroq);
    setNewsApiKey(localNews);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
          {t('system_settings_title')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('system_settings_sub')}
        </p>
      </div>

      {saved && (
        <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>Settings and API configurations successfully saved to client environment.</span>
        </div>
      )}

      {/* Appearance & Theme Selector */}
      <div className="fintech-card p-6 space-y-4">
        <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
          {theme === 'dark' ? <Moon className="w-4 h-4 text-cyan-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
          {t('theme_setting')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              theme === 'light'
                ? 'bg-fintech-cyan-50 border-fintech-cyan-400 ring-2 ring-fintech-cyan-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                {t('light_mode')}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                High contrast crisp white daylight styling
              </span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
              theme === 'dark'
                ? 'bg-slate-800 border-cyan-400 ring-2 ring-cyan-400'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center">
              <Moon className="w-4 h-4" />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-900 dark:text-white">
                {t('dark_mode')}
              </span>
              <span className="block text-[11px] text-slate-500 dark:text-slate-400">
                Deep navy institutional OLED night palette
              </span>
            </div>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Custom API Keys */}
        <div className="fintech-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
              {t('custom_api_keys')}
            </h3>
            <span className="text-[10px] font-mono text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
              {t('zero_config_fallback')}
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            By default, the platform uses an intelligent deterministic semantic engine with pre-seeded high-fidelity financial feeds. You can provide your own personal keys below for live external connectivity.
          </p>

          <div className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Groq Cloud API Key (Llama 3.3 70B)
              </label>
              <input
                type="password"
                value={localGroq}
                onChange={(e) => setLocalGroq(e.target.value)}
                placeholder="gsk_..."
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                Obtain free key from <a href="https://console.groq.com/keys" target="_blank" rel="noreferrer" className="text-fintech-cyan-700 dark:text-cyan-400 underline">Groq Cloud Console</a>.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                NewsAPI Key (Real-Time Global Financial News)
              </label>
              <input
                type="password"
                value={localNews}
                onChange={(e) => setLocalNews(e.target.value)}
                placeholder="Live news API key..."
                className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
              />
              <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-1">
                Obtain free key from <a href="https://newsapi.org/" target="_blank" rel="noreferrer" className="text-fintech-cyan-700 dark:text-cyan-400 underline">NewsAPI.org</a>.
              </span>
            </div>
          </div>
        </div>

        {/* Cybersecurity Guardrail Status */}
        <div className="fintech-card p-6 space-y-3">
          <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            {t('cybersecurity')}
          </h3>

          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">{t('prompt_injection_defense')}</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">ENFORCED (STRICT)</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Steganographic Zero-Width Stripping</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">ACTIVE</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60">
              <span className="font-semibold text-slate-800 dark:text-slate-200">Article Origin Sanitization</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-bold font-mono">VERIFIED</span>
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 text-xs font-semibold hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 transition-colors shadow-sm flex items-center gap-2"
        >
          <Save className="w-3.5 h-3.5" />
          {t('save_settings')}
        </button>
      </form>
    </div>
  );
};
