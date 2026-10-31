/**
 * @file apps/web/src/pages/RegisterPage.tsx
 * @description Light-theme Student Account Registration page with validation and opt-in privacy notice
 */
import React, { useState } from 'react';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { FocusFlowLogo } from '../components/ui/BrandIllustrations.tsx';

interface RegisterPageProps {
  onNavigate: (page: string) => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [consentTerms, setConsentTerms] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError('Please enter your full name.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid student email address.');
      return;
    }
    if (password.length < 8) {
      setError('Choose a password with at least 8 characters.');
      return;
    }
    if (!consentTerms) {
      setError('Please confirm the privacy-first student data terms.');
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
            Create Your Student Account
          </h1>
          <p className="text-xs text-[#5A708D]">
            Build healthier focus habits with full control over your privacy.
          </p>
        </div>

        {error && (
          <div role="alert" className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label htmlFor="reg-name" className="block text-xs font-bold text-[#334B68] mb-1">
              Full Name
            </label>
            <input
              id="reg-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Adarsh Sharma"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-sm text-[#142647] focus:bg-white focus:border-[#079669] focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold text-[#334B68] mb-1">
              University or School Email
            </label>
            <input
              id="reg-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@university.edu"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-sm text-[#142647] focus:bg-white focus:border-[#079669] focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-bold text-[#334B68] mb-1">
              Password (min. 8 characters)
            </label>
            <input
              id="reg-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-sm text-[#142647] focus:bg-white focus:border-[#079669] focus:outline-none"
              required
            />
          </div>

          <label className="flex items-start gap-2.5 text-xs text-[#4A607A] cursor-pointer">
            <input
              type="checkbox"
              checked={consentTerms}
              onChange={(e) => setConsentTerms(e.target.checked)}
              className="mt-0.5 accent-[#079669]"
            />
            <span>
              I understand FOCUSFLOW uses local, pauseable activity estimation and never shares data with parents or counsellors without explicit opt-in.
            </span>
          </label>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-sm font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Start Studying Smarter</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 rounded-xl bg-[#EAF9F2] border border-[#CBEFE0] flex items-center gap-2 text-[11px] text-[#067652]">
          <ShieldCheck className="w-4 h-4 text-[#079669] shrink-0" />
          <span>Zero keystrokes, screenshots, or private messages are ever collected.</span>
        </div>

        <div className="text-center text-xs text-[#5A708D] pt-1">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => onNavigate('login')}
            className="font-bold text-[#079669] hover:underline cursor-pointer"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
