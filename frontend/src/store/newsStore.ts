import { create } from 'zustand';

interface NewsState {
  activeCategory: string | null;
  searchQuery: string;
  selectedTicker: string | null;
  activeLanguage: 'en' | 'hi' | 'mr';
  setActiveCategory: (cat: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedTicker: (ticker: string | null) => void;
  setActiveLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  resetFilters: () => void;
}

export const useNewsStore = create<NewsState>((set) => ({
  activeCategory: null,
  searchQuery: '',
  selectedTicker: null,
  activeLanguage: (localStorage.getItem('fintech_lang') as any) || 'en',

  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setSelectedTicker: (selectedTicker) => set({ selectedTicker }),
  setActiveLanguage: (activeLanguage) => {
    localStorage.setItem('fintech_lang', activeLanguage);
    set({ activeLanguage });
  },
  resetFilters: () => set({ activeCategory: null, searchQuery: '', selectedTicker: null }),
}));
