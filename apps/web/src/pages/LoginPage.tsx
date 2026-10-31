import React, { useState } from 'react';
import { LogIn, Lock, Mail, ShieldAlert } from 'lucide-react';

export const LoginPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate?.('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">Student Sign In</h2>
          <p className="text-xs text-zinc-400">Enter your credentials to access FOCUSFLOW</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="student@university.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0c0a10] border border-[#2c2537] rounded-xl text-sm text-white focus:outline-none focus:border-[#b8ff3c]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0c0a10] border border-[#2c2537] rounded-xl text-sm text-white focus:outline-none focus:border-[#b8ff3c]"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] font-bold rounded-xl text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Sign In to Focus
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          New to FOCUSFLOW?{' '}
          <button
            onClick={() => onNavigate?.('register')}
            className="text-[#b8ff3c] hover:underline font-semibold"
          >
            Create an Account
          </button>
        </div>
      </div>
    </div>
  );
};
