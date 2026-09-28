import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Search,
  User as UserIcon,
  LogOut,
  Menu,
  Bookmark,
  Settings,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useNewsStore } from '../../store/newsStore';
import { useTranslation } from '../../hooks/useTranslation';
import { SearchBar } from './SearchBar';
import { LanguageSwitcher } from '../article/LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC<{ onToggleSidebar?: () => void }> = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { activeLanguage, setActiveLanguage } = useNewsStore();
  const { t } = useTranslation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const marketTickers = [
    { ticker: 'S&P 500', value: '5,718.50', change: '+0.42%' },
    { ticker: 'NASDAQ', value: '18,110.20', change: '+0.78%' },
    { ticker: 'NVDA', value: '$128.40', change: '+3.18%' },
    { ticker: 'AAPL', value: '$228.60', change: '+0.85%' },
    { ticker: '10Y YIELD', value: '3.82%', change: '-0.04%' },
    { ticker: 'BRENT', value: '$78.40', change: '-0.65%' },
    { ticker: 'BTC', value: '$63,800', change: '+2.10%' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white dark:bg-[#0B1728] border-b border-slate-200/80 dark:border-slate-800 shadow-xs transition-colors duration-150">
      {/* Real-time Institutional Market Ticker Bar */}
      <div className="bg-fintech-navy-950 dark:bg-[#050C17] text-slate-300 text-[11px] py-1 px-4 border-b border-fintech-navy-900 dark:border-slate-800/80 overflow-x-auto no-scrollbar font-mono">
        <div className="flex items-center gap-6 whitespace-nowrap max-w-7xl mx-auto">
          <span className="flex items-center gap-1.5 text-fintech-cyan-500 font-bold uppercase tracking-wider text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            {t('live_markets')}
          </span>
          {marketTickers.map((tItem) => (
            <div key={tItem.ticker} className="flex items-center gap-2">
              <span className="font-semibold text-slate-200">{tItem.ticker}</span>
              <span className="text-slate-400">{tItem.value}</span>
              <span
                className={`text-[10px] font-semibold ${
                  tItem.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {tItem.change}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle & Logo */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-fintech-navy-900 dark:bg-cyan-500 text-fintech-cyan-500 dark:text-slate-950 flex items-center justify-center font-bold text-base shadow-sm">
              <TrendingUp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <span className="text-base font-bold text-fintech-navy-900 dark:text-white tracking-tight block leading-none">
                {t('brand_name')}<span className="text-fintech-cyan-600 dark:text-cyan-400">{t('brand_suffix')}</span>
              </span>
              <span className="text-[10px] text-slate-400 dark:text-slate-400 tracking-wider font-semibold uppercase block mt-0.5">
                {t('brand_tagline')}
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Search Bar */}
        <div className="hidden md:block flex-1 max-w-md mx-4">
          <SearchBar />
        </div>

        {/* Right: Language, Theme Toggle, Auth & Actions */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />

          <LanguageSwitcher
            currentLanguage={activeLanguage}
            onChange={(l) => setActiveLanguage(l)}
          />

          {isAuthenticated && user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
              >
                <div className="w-7 h-7 rounded-lg bg-fintech-navy-900 dark:bg-cyan-600 text-white flex items-center justify-center text-xs font-bold uppercase">
                  {user.full_name?.charAt(0) || 'A'}
                </div>
                <div className="hidden sm:block text-left pr-1">
                  <div className="text-xs font-semibold text-fintech-navy-900 dark:text-white leading-tight">
                    {user.full_name?.split(' ')[0]}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono capitalize leading-none">
                    {user.role}
                  </div>
                </div>
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#0E1A2D] rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-50">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-xs font-bold text-fintech-navy-900 dark:text-white truncate">
                      {user.full_name}
                    </p>
                    <p className="text-[11px] text-slate-400 truncate font-mono">
                      {user.email}
                    </p>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t('profile')}
                  </Link>
                  <Link
                    to="/bookmarks"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t('bookmarks')}
                  </Link>
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="block px-3 py-2 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    {t('settings')}
                  </Link>

                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                        navigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      {t('sign_out')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-fintech-navy-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                {t('sign_in')}
              </Link>
              <Link
                to="/register"
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-fintech-navy-900 dark:bg-cyan-500 text-white dark:text-slate-950 hover:bg-fintech-navy-800 dark:hover:bg-cyan-400 transition-colors shadow-sm"
              >
                {t('get_started')}
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
