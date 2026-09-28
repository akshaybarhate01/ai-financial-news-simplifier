import { create } from 'zustand';
import { BookmarkItem } from '../types';
import { api } from '../services/api';

interface BookmarkState {
  bookmarks: BookmarkItem[];
  bookmarkedIds: Set<number>;
  isLoading: boolean;
  fetchBookmarks: () => Promise<void>;
  toggleBookmark: (articleId: number, folder?: string) => Promise<boolean>;
  removeBookmark: (articleId: number) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  bookmarks: [],
  bookmarkedIds: new Set(),
  isLoading: false,

  fetchBookmarks: async () => {
    set({ isLoading: true });
    try {
      const data = await api.get<BookmarkItem[]>('/bookmarks');
      const ids = new Set(data.map((b) => b.article_id));
      set({ bookmarks: data, bookmarkedIds: ids, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  toggleBookmark: async (articleId: number, folder: string = 'General') => {
    const { bookmarkedIds } = get();
    const isBookmarked = bookmarkedIds.has(articleId);

    if (isBookmarked) {
      await get().removeBookmark(articleId);
      return false;
    } else {
      try {
        await api.post('/bookmarks', { article_id: articleId, folder });
        const newIds = new Set(bookmarkedIds);
        newIds.add(articleId);
        set({ bookmarkedIds: newIds });
        get().fetchBookmarks();
        return true;
      } catch {
        return false;
      }
    }
  },

  removeBookmark: async (articleId: number) => {
    try {
      await api.delete(`/bookmarks/${articleId}`);
      const newIds = new Set(get().bookmarkedIds);
      newIds.delete(articleId);
      set({
        bookmarkedIds: newIds,
        bookmarks: get().bookmarks.filter((b) => b.article_id !== articleId),
      });
    } catch (err) {
      console.error('Failed to remove bookmark:', err);
    }
  },
}));
