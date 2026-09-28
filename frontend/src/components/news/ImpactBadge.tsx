import React from 'react';
import { Zap } from 'lucide-react';

interface ImpactBadgeProps {
  level?: 'High' | 'Medium' | 'Low' | string;
  category?: string;
}

export const ImpactBadge: React.FC<ImpactBadgeProps> = ({ level = 'Medium', category }) => {
  const norm = level.toLowerCase();
  
  const getBadgeStyle = () => {
    if (norm === 'high') {
      return 'bg-amber-50 text-amber-700 border-amber-200/80';
    }
    if (norm === 'low') {
      return 'bg-slate-50 text-slate-600 border-slate-200';
    }
    return 'bg-fintech-cyan-50 text-fintech-cyan-700 border-fintech-cyan-200/60';
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getBadgeStyle()}`}
    >
      <Zap className="w-2.5 h-2.5 opacity-80" />
      {category || `${level} Market Impact`}
    </span>
  );
};
