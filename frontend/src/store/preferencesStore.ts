import { create } from 'zustand';
import { UserPreferences } from '../types';
import { api } from '../services/api';

interface PreferencesState {
  preferences: UserPreferences;
  theme: 'light' | 'dark';
  groqApiKey: string;
  newsApiKey: string;
  setGroqApiKey: (key: string) => void;
  setNewsApiKey: (key: string) => void;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleTheme: () => void;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  fetchPreferences: () => Promise<void>;
}

const getInitialTheme = (): 'light' | 'dark' => {
  const saved = localStorage.getItem('fintech_theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const applyThemeToDOM = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('fintech_theme', theme);
};

// Apply on file load
const initialTheme = getInitialTheme();
applyThemeToDOM(initialTheme);

export const usePreferencesStore = create<PreferencesState>((set, get) => ({
  preferences: {
    preferred_language: 'en',
    preferred_categories: ['macroeconomics', 'equities'],
    watchlist_companies: ['NVDA', 'AAPL', 'MSFT'],
    email_brief_frequency: 'daily',
    theme_mode: initialTheme,
  },
  theme: initialTheme,
  groqApiKey: localStorage.getItem('fintech_groq_key') || '',
  newsApiKey: localStorage.getItem('fintech_news_key') || '',

  setTheme: (theme: 'light' | 'dark') => {
    applyThemeToDOM(theme);
    set({ theme });
    get().updatePreferences({ theme_mode: theme });
  },

  toggleTheme: () => {
    const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
    applyThemeToDOM(nextTheme);
    set({ theme: nextTheme });
    get().updatePreferences({ theme_mode: nextTheme });
  },

  setGroqApiKey: (key: string) => {
    localStorage.setItem('fintech_groq_key', key);
    set({ groqApiKey: key });
  },

  setNewsApiKey: (key: string) => {
    localStorage.setItem('fintech_news_key', key);
    set({ newsApiKey: key });
  },

  setLanguage: (preferred_language) => {
    const prefs = { ...get().preferences, preferred_language };
    set({ preferences: prefs });
    localStorage.setItem('fintech_lang', preferred_language);
    get().updatePreferences({ preferred_language });
  },

  fetchPreferences: async () => {
    try {
      const data = await api.get<UserPreferences>('/user/preferences');
      if (data) {
        set({ preferences: data });
        if (data.theme_mode === 'dark' || data.theme_mode === 'light') {
          applyThemeToDOM(data.theme_mode);
          set({ theme: data.theme_mode });
        }
      }
    } catch {
      // unauthenticated or default
    }
  },

  updatePreferences: async (updates) => {
    const current = get().preferences;
    const merged = { ...current, ...updates };
    set({ preferences: merged });
    try {
      await api.put('/user/preferences', updates);
    } catch {
      // offline/guest mode fallback
    }
  },
}));
