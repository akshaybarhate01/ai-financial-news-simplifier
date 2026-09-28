import React, { useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useBookmarkStore } from '../../store/bookmarkStore';
import { useAuthStore } from '../../store/authStore';

interface BookmarkButtonProps {
  articleId: number;
  initialBookmarked?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

export const BookmarkButton: React.FC<BookmarkButtonProps> = ({
  articleId,
  initialBookmarked = false,
  className = '',
  size = 'md',
}) => {
  const { isAuthenticated } = useAuthStore();
  const { bookmarkedIds, toggleBookmark } = useBookmarkStore();
  const isBookmarked = bookmarkedIds.has(articleId) || initialBookmarked;
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert('Please log in or register to save bookmarks and build your reading history.');
      return;
    }
    setIsAnimating(true);
    await toggleBookmark(articleId);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const iconSize = size === 'sm' ? 'w-4 h-4' : 'w-4 h-4';
  const padding = size === 'sm' ? 'p-1.5' : 'p-2';

  return (
    <button
      onClick={handleClick}
      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark article'}
      className={`rounded-lg transition-all duration-150 flex items-center justify-center ${padding} ${
        isBookmarked
          ? 'text-fintech-cyan-600 dark:text-cyan-400 bg-fintech-cyan-50 dark:bg-cyan-950/60 hover:bg-fintech-cyan-100 dark:hover:bg-cyan-900/60'
          : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
      } ${isAnimating ? 'scale-110' : 'scale-100'} ${className}`}
    >
      <Bookmark className={`${iconSize} ${isBookmarked ? 'fill-current' : ''}`} />
    </button>
  );
};
