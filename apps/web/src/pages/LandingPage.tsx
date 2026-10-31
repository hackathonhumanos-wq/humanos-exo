import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, Brain, Clock } from 'lucide-react';

export const LandingPage: React.FC<{ onNavigate?: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 py-8 max-w-5xl mx-auto">
      {/* Hero */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 border border-[#b8ff3c]/20">
          <Sparkles className="w-3.5 h-3.5" />
          FOCUSFLOW Phase 1 Foundation
        </div>
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Reclaim Your Focus from the <span className="text-[#f4533f]">Endless Scroll</span>
        </h1>
        <p className="text-base sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          AI-powered digital wellbeing engineered for students. Curb short-form video dopamine loops,
          protect deep work sessions, and build sustainable study habits.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button
            onClick={() => onNavigate?.('dashboard')}
            className="px-6 py-3 bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] font-extrabold rounded-xl text-sm transition-all shadow-lg shadow-[#b8ff3c]/20 flex items-center gap-2 cursor-pointer"
          >
            Launch Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => onNavigate?.('focus')}
            className="px-6 py-3 bg-[#17131f] hover:bg-[#241a31] border border-[#2c2537] text-white font-medium rounded-xl text-sm transition-all cursor-pointer"
          >
            Start Focus Session
          </button>
        </div>
      </div>

      {/* Feature Pillar Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#f4533f]/10 border border-[#f4533f]/30 flex items-center justify-center text-[#f4533f]">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Short-Form Intervention</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Privacy-preserving estimation of Instagram Reels, YouTube Shorts, and Facebook Reels. Detects doomscrolling sessions before they ruin study blocks.
          </p>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#b8ff3c]/10 border border-[#b8ff3c]/30 flex items-center justify-center text-[#b8ff3c]">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Adaptive Focus Timers</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Pomodoro, Deep Work, and Exam-Prep pacing backed by Declarative Net Request website blockers to protect student cognitive flow.
          </p>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-[#49e6ff]/10 border border-[#49e6ff]/30 flex items-center justify-center text-[#49e6ff]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">Ethical Accountability</h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Consent-governed sharing with parents and campus counsellors. Raw keystrokes, personal messages, and browser history are strictly never collected.
          </p>
        </div>
      </div>
    </div>
  );
};
