/**
 * @file apps/web/src/pages/LoginPage.tsx
 * @description Light-theme Student Sign-In page with form validation
 */
import React, { useState } from 'react';
import { ArrowRight, Lock, Mail } from 'lucide-react';
import { FocusFlowLogo } from '../components/ui/BrandIllustrations.tsx';

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('adarsh@student.edu');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.includes('@')) {
      setError('Please enter a valid student email address.');
      return;
    }
    if (password.trim().length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center py-8">
      <div className="ff-card max-w-md w-full p-7 sm:p-9 space-y-6">
        <div className="space-y-2">
          <FocusFlowLogo />
          <h1 className="font-display text-2xl font-extrabold text-[#142647] pt-3">
            Welcome back, Scholar
          </h1>
          <p className="text-xs text-[#5A708D]">
            Sign in to continue your focus streak and daily study plan.
          </p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="login-email" className="block text-xs font-bold text-[#334B68] mb-1.5">
              Student Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#6C819C] absolute left-3.5 top-3" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-sm text-[#142647] focus:bg-white focus:border-[#079669] focus:outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-xs font-bold text-[#334B68] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#6C819C] absolute left-3.5 top-3" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-sm text-[#142647] focus:bg-white focus:border-[#079669] focus:outline-none"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-[#5A708D] pt-2 border-t border-[#E1EEE9]">
          New to FOCUSFLOW?{' '}
          <button
            type="button"
            onClick={() => onNavigate('register')}
            className="font-bold text-[#079669] hover:underline cursor-pointer"
          >
            Create Student Account
          </button>
        </div>
      </div>
    </div>
  );
};
