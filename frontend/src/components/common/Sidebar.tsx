import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Newspaper,
  Sparkles,
  TrendingUp,
  Bookmark,
  BarChart3,
  BookOpen,
  User,
  Settings,
  ShieldCheck,
  Grid,
} from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  const navItems = [
    { to: '/dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { to: '/news', label: t('news_feed'), icon: Newspaper },
    { to: '/ai-summaries', label: t('ai_summaries'), icon: Sparkles },
    { to: '/categories', label: t('categories'), icon: Grid },
    { to: '/trending', label: t('market_pulse'), icon: TrendingUp },
    { to: '/bookmarks', label: t('bookmarks'), icon: Bookmark },
    { to: '/analytics', label: t('analytics'), icon: BarChart3 },
    { to: '/glossary', label: t('glossary'), icon: BookOpen },
  ];

  const secondaryItems = [
    { to: '/profile', label: t('profile'), icon: User },
    { to: '/settings', label: t('settings'), icon: Settings },
    { to: '/about', label: t('security_specs'), icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-24 left-0 z-50 lg:z-10 w-64 h-full lg:h-[calc(100vh-6rem)] bg-white dark:bg-[#0B1728] border-r border-slate-200 dark:border-slate-800 p-4 flex flex-col justify-between transition-colors duration-150 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
              {t('intelligence_platform')}
            </span>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {/* Secondary Navigation */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-2">
              {t('specs_config')}
            </span>
            <nav className="space-y-1">
              {secondaryItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950 shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Security & System Info Pill */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#0E1A2D] border border-slate-200 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-fintech-cyan-700 dark:text-cyan-400 font-bold mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[11px]">{t('prompt_guard_active')}</span>
          </div>
          <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
            {t('prompt_guard_sub')}
          </p>
        </div>
      </aside>
    </>
  );
};
