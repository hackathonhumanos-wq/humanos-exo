import React from 'react';
import { BarChart3, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#2c2537]">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Study & Screen Analytics</h2>
          <p className="text-xs text-zinc-400">Weekly breakdown of focus blocks, distraction trends, and cognitive flow</p>
        </div>
        <span className="text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-3 py-1 rounded-full self-start sm:self-auto">
          Last 7 Days
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5">
          <span className="text-xs text-zinc-400 font-mono">Weekly Focus Time</span>
          <div className="text-2xl font-bold font-mono text-white mt-1">16h 40m</div>
          <span className="text-[11px] text-emerald-400 mt-1 block">82% of weekly goal</span>
        </div>
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5">
          <span className="text-xs text-zinc-400 font-mono">Est. Reel Swipes</span>
          <div className="text-2xl font-bold font-mono text-[#f4533f] mt-1">214 Swipes</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">-34% vs previous week</span>
        </div>
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5">
          <span className="text-xs text-zinc-400 font-mono">Completed Sessions</span>
          <div className="text-2xl font-bold font-mono text-[#49e6ff] mt-1">28 Sessions</div>
          <span className="text-[11px] text-zinc-400 mt-1 block">Average: 35m per block</span>
        </div>
      </div>

      <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[#b8ff3c]" />
          Weekly Hour-by-Hour Focus Density
        </h3>
        <p className="text-xs text-zinc-400">
          Visualized time spent in deep study vs. estimated short-form video engagement across days.
        </p>
        <div className="h-40 bg-[#0c0a10] rounded-xl border border-white/5 flex items-center justify-center text-xs text-zinc-500 font-mono">
          [Recharts / Canvas Weekly Analytics Visualization Layer Ready]
        </div>
      </div>
    </div>
  );
};
