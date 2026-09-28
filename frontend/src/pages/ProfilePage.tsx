import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { usePreferencesStore } from '../store/preferencesStore';
import { User, Lock, Mail, Shield, CheckCircle2, Save } from 'lucide-react';
import { api } from '../services/api';

import { useTranslation } from '../hooks/useTranslation';

export const ProfilePage: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  const { preferences, setLanguage } = usePreferencesStore();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [msg, setMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/user/profile', { full_name: fullName });
      updateUser({ full_name: fullName });
      setMsg({ text: 'Profile name successfully updated.', type: 'success' });
    } catch (err: any) {
      setMsg({ text: err.message || 'Failed to update profile.', type: 'error' });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      setMsg({ text: 'New password must be at least 8 characters long.', type: 'error' });
      return;
    }
    try {
      await api.post('/auth/change-password', {
        old_password: oldPassword,
        new_password: newPassword,
      });
      setOldPassword('');
      setNewPassword('');
      setMsg({ text: 'Password successfully changed.', type: 'success' });
    } catch (err: any) {
      setMsg({ text: err.message || 'Failed to change password.', type: 'error' });
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-3xl">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
        <h1 className="text-2xl font-extrabold text-fintech-navy-900 dark:text-white tracking-tight">
          {t('analyst_profile')}
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
          {t('analyst_profile_sub')}
        </p>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center gap-2 ${
            msg.type === 'success'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Account Info Form */}
      <div className="fintech-card p-6 space-y-4">
        <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
          <User className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
          {t('personal_details')}
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('full_name')}
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('email_address')}
              </label>
              <input
                type="email"
                disabled
                value={user?.email || 'analyst@fintechnews.com'}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850 text-slate-500 dark:text-slate-400 cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 text-xs font-semibold hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Save className="w-3.5 h-3.5" />
            {t('update_profile')}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="fintech-card p-6 space-y-4">
        <h3 className="text-base font-bold text-fintech-navy-900 dark:text-white flex items-center gap-2">
          <Lock className="w-4 h-4 text-fintech-cyan-600 dark:text-cyan-400" />
          {t('change_password')}
        </h3>

        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('current_password')}
              </label>
              <input
                type="password"
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                {t('new_password')}
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-fintech-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-fintech-navy-900 dark:bg-cyan-600 text-white dark:text-slate-950 text-xs font-semibold hover:bg-fintech-navy-800 dark:hover:bg-cyan-500 transition-colors shadow-2xs flex items-center gap-1.5"
          >
            <Shield className="w-3.5 h-3.5" />
            {t('update_password_btn')}
          </button>
        </form>
      </div>
    </div>
  );
};
