import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useTranslation } from '../hooks/useTranslation';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuthStore();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/dashboard');
    }
  };

  const fillDemoAccount = () => {
    setEmail('analyst@fintechnews.com');
    setPassword('Analyst123!');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-fintech-navy-900 dark:text-white">
          {t('sign_in')}
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {t('welcome_sub')}
        </p>
      </div>

      {/* Demo Credentials Quick-Fill Banner */}
      <div className="p-3 rounded-xl bg-fintech-cyan-50/70 dark:bg-cyan-950/40 border border-fintech-cyan-200/80 dark:border-cyan-800/60 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs text-fintech-cyan-900 dark:text-cyan-200">
          <Sparkles className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400 flex-shrink-0" />
          <span>Demo Analyst Access Available</span>
        </div>
        <button
          type="button"
          onClick={fillDemoAccount}
          className="text-xs font-semibold px-2.5 py-1 rounded bg-white dark:bg-slate-900 text-fintech-cyan-700 dark:text-cyan-400 border border-fintech-cyan-300 dark:border-cyan-700 hover:bg-fintech-cyan-100 dark:hover:bg-cyan-950 transition-colors shadow-2xs"
        >
          Auto-fill
        </button>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            {t('email_address')}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
              {t('current_password')}
            </label>
            <button
              type="button"
              onClick={() => alert('Password reset instructions dispatched to your email address.')}
              className="text-[11px] text-fintech-cyan-700 dark:text-cyan-400 hover:underline"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 px-4 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 font-semibold text-xs hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isLoading ? 'Verifying...' : t('sign_in')}
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-4">
        Don't have an account?{' '}
        <Link to="/register" className="font-semibold text-fintech-cyan-700 dark:text-cyan-400 hover:underline">
          {t('get_started')}
        </Link>
      </div>
    </div>
  );
};
