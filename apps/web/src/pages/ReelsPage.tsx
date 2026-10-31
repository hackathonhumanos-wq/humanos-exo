import React from 'react';
import { Eye, ShieldAlert, Sparkles, Smartphone, ArrowDown } from 'lucide-react';

export const ReelsPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#2c2537]">
        <div>
          <h2 className="text-2xl font-extrabold text-white">Short-Form Video Interventions</h2>
          <p className="text-xs text-zinc-400">Ethical tracking estimates for Instagram Reels, YouTube Shorts & Facebook Reels</p>
        </div>
      </div>

      <div className="p-4 bg-amber-950/40 border border-amber-500/30 rounded-2xl flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200">
          <strong>Privacy Transparency:</strong> FOCUSFLOW does not scrape captions, comments, keystrokes or direct messages.
          Counts are non-intrusive estimates based on observable navigation feed changes to help students notice scrolling momentum.
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Instagram Reels</span>
          <div className="text-3xl font-extrabold font-mono text-pink-400">22 est.</div>
          <p className="text-[11px] text-zinc-500">Detected from /reels/ transitions</p>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">YouTube Shorts</span>
          <div className="text-3xl font-extrabold font-mono text-red-400">14 est.</div>
          <p className="text-[11px] text-zinc-500">Detected from /shorts/ navigation</p>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <span className="text-xs text-zinc-400 font-mono">Facebook Reels</span>
          <div className="text-3xl font-extrabold font-mono text-blue-400">2 est.</div>
          <p className="text-[11px] text-zinc-500">Detected from /reel/ state observer</p>
        </div>
      </div>
    </div>
  );
};
