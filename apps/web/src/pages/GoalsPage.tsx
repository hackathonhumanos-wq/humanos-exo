import React from 'react';
import { Target, Plus, CheckCircle, Flame } from 'lucide-react';

export const GoalsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#2c2537]">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Focus & Reel Caps</h2>
          <p className="text-xs text-zinc-400">Establish daily deep work quotas and strict short-form distraction limits</p>
        </div>
        <button className="px-4 py-2 bg-[#b8ff3c] text-[#07060a] font-bold text-xs rounded-xl flex items-center gap-1.5 self-start sm:self-auto cursor-pointer">
          <Plus className="w-4 h-4" />
          Create New Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Daily 3-Hour Deep Work Quota</h4>
            <span className="text-[10px] font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2 py-0.5 rounded">Active</span>
          </div>
          <div className="w-full bg-[#0c0a10] h-2 rounded-full overflow-hidden">
            <div className="bg-[#b8ff3c] h-full w-[75%]" />
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Progress: 2h 15m</span>
            <span>Target: 3h 00m</span>
          </div>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Maximum 50 Daily Short-Form Swipes</h4>
            <span className="text-[10px] font-mono text-[#f4533f] bg-[#f4533f]/10 px-2 py-0.5 rounded">Guardrail</span>
          </div>
          <div className="w-full bg-[#0c0a10] h-2 rounded-full overflow-hidden">
            <div className="bg-[#f4533f] h-full w-[64%]" />
          </div>
          <div className="flex justify-between text-xs text-zinc-400">
            <span>Used: 38 estimated swipes</span>
            <span>Limit: 50 swipes</span>
          </div>
        </div>
      </div>
    </div>
  );
};
