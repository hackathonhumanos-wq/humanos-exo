import React from 'react';
import { User, Award, Shield, BookOpen, Clock } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-[#0c0a10] border border-[#b8ff3c]/30 flex items-center justify-center text-3xl font-extrabold text-[#b8ff3c]">
          AR
        </div>
        <div className="text-center sm:text-left space-y-1">
          <h2 className="text-2xl font-bold text-white">Alex Rivera</h2>
          <p className="text-xs text-zinc-400">B.Tech Computer Science • Year 3 • National Institute of Tech</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
            <span className="text-xs font-mono bg-[#b8ff3c]/10 text-[#b8ff3c] px-2.5 py-0.5 rounded-full border border-[#b8ff3c]/20">
              Level 3: Focus Novice
            </span>
            <span className="text-xs font-mono bg-[#241a31] text-zinc-300 px-2.5 py-0.5 rounded-full border border-white/5">
              840 XP
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Lifetime Focus Hours</span>
          <div className="text-2xl font-bold font-mono text-white">142h 30m</div>
          <span className="text-[11px] text-zinc-500">Across 188 registered sessions</span>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Distraction Free Days</span>
          <div className="text-2xl font-bold font-mono text-[#b8ff3c]">24 Days</div>
          <span className="text-[11px] text-zinc-500">Days with short-form time &lt; 20m</span>
        </div>
      </div>
    </div>
  );
};
