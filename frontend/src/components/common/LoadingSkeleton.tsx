import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="fintech-card p-5 animate-pulse space-y-3 bg-white dark:bg-[#0E1A2D] border border-slate-100 dark:border-slate-800"
        >
          <div className="flex items-center gap-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
          </div>
          <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-full" />
          <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded w-5/6" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-16" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const CardGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="fintech-card p-5 animate-pulse space-y-3 bg-white dark:bg-[#0E1A2D] border border-slate-100 dark:border-slate-800 h-64 flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24" />
              <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-6" />
            </div>
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-5/6" />
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-full mt-4" />
            <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-4/5" />
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-14" />
          </div>
        </div>
      ))}
    </div>
  );
};
