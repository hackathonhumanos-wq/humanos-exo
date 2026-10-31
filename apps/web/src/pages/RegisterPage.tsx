import React, { useState } from 'react';
import { UserPlus, Lock, Mail, User, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'STUDENT' | 'PARENT' | 'COUNSELLOR'>('STUDENT');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate?.('dashboard');
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4">
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white">Create Account</h2>
          <p className="text-xs text-zinc-400">Join FOCUSFLOW to build distraction-free study habits</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Alex Rivera"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0c0a10] border border-[#2c2537] rounded-xl text-sm text-white focus:outline-none focus:border-[#b8ff3c]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@university.edu"
                className="w-full pl-9 pr-3 py-2.5 bg-[#0c0a10] border border-[#2c2537] rounded-xl text-sm text-white focus:outline-none focus:border-[#b8ff3c]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 block mb-1">Role</label>
            <div className="grid grid-cols-3 gap-2">
              {(['STUDENT', 'PARENT', 'COUNSELLOR'] as const).map(r => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                    role === r
                      ? 'bg-[#b8ff3c] text-[#07060a] border-[#b8ff3c]'
                      : 'bg-[#0c0a10] text-zinc-400 border-[#2c2537] hover:text-white'
                  }`}
                >
                  {r}
                </button>
              ))}
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
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400">
          Already registered?{' '}
          <button
            onClick={() => onNavigate?.('login')}
            className="text-[#b8ff3c] hover:underline font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};
