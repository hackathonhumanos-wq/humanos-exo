/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Clock,
  Play,
  Brain,
  ShieldCheck,
  Flame,
  Award,
  Sparkles,
  ArrowUpRight,
  Target,
  BookOpen,
  HeartPulse,
  TrendingUp,
  Zap,
  Users,
  ChevronRight,
  ShieldAlert,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Bot
} from 'lucide-react';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [apiHealth, setApiHealth] = useState<'checking' | 'online' | 'offline'>('checking');
  const [selectedSubject, setSelectedSubject] = useState<'Computer Science' | 'Calculus' | 'Physics' | 'Literature'>('Computer Science');

  useEffect(() => {
    fetch('/api/v1/health')
      .then(res => res.json())
      .then(json => {
        if (json.success) setApiHealth('online');
        else setApiHealth('offline');
      })
      .catch(() => setApiHealth('offline'));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#17131f] via-[#1a1426] to-[#13111c] border border-[#2c2537] rounded-3xl p-6 sm:p-7 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#b8ff3c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-64 h-64 bg-[#49e6ff]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-[#b8ff3c]/10 text-[#b8ff3c] border border-[#b8ff3c]/20 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Circadian Prime: Peak Focus Window (10:00 AM – 12:30 PM)
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-semibold flex items-center gap-1.5 ${
                  apiHealth === 'online'
                    ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                    : 'bg-amber-950/70 text-amber-300 border border-amber-500/30'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${apiHealth === 'online' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                {apiHealth === 'online' ? 'System Sync Online' : 'Connecting Engine...'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-[#b8ff3c]">Alex</span> 👋
            </h1>
            <p className="text-sm text-zinc-400 max-w-2xl leading-relaxed">
              You are currently on a <strong className="text-white">5-day study streak</strong>. You have completed <strong className="text-white">2h 15m</strong> of focused deep work today with <strong className="text-[#b8ff3c]">78% distraction shields</strong> holding strong.
            </p>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
            <button
              onClick={() => onNavigate?.('focus')}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-[#b8ff3c] hover:bg-[#a6ec31] text-[#07060a] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#b8ff3c]/10 cursor-pointer active:scale-95"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Focus Session
            </button>
            <button
              onClick={() => onNavigate?.('study-planner')}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-[#241a31] hover:bg-[#2e213e] text-white border border-[#3b324a] font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Calendar className="w-4 h-4 text-[#49e6ff]" />
              Today's Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Deep Work */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-5 hover:border-[#b8ff3c]/30 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Deep Work Today</span>
            <div className="w-8 h-8 rounded-xl bg-[#b8ff3c]/10 text-[#b8ff3c] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-white">2h 15m</div>
            <div className="text-xs text-zinc-400 mt-1 flex items-center justify-between">
              <span>Goal: 3h 30m</span>
              <span className="text-[#b8ff3c] font-semibold">64%</span>
            </div>
          </div>
          <div className="w-full bg-[#0c0a10] h-2 rounded-full overflow-hidden border border-white/5">
            <div className="bg-[#b8ff3c] h-full rounded-full transition-all duration-500" style={{ width: '64%' }} />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-[#b8ff3c]">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+45m vs yesterday (Peak efficiency)</span>
          </div>
        </div>

        {/* Metric 2: Reels Shield */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-5 hover:border-[#f4533f]/30 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Reels & Shorts</span>
            <div className="w-8 h-8 rounded-xl bg-[#f4533f]/10 text-[#f4533f] flex items-center justify-center">
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#f4533f] flex items-baseline gap-1.5">
              38
              <span className="text-xs font-normal text-zinc-400">swipes est.</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 flex items-center justify-between">
              <span>Cap: 50 max / day</span>
              <span className="text-amber-400 font-semibold">12 left</span>
            </div>
          </div>
          <div className="w-full bg-[#0c0a10] h-2 rounded-full overflow-hidden border border-white/5">
            <div className="bg-gradient-to-r from-amber-500 to-[#f4533f] h-full rounded-full" style={{ width: '76%' }} />
          </div>
          <p className="text-[10px] text-zinc-500 truncate" title="Ethical non-invasive estimation from MV3 browser extension">
            *Non-intrusive client-side URL estimation
          </p>
        </div>

        {/* Metric 3: Study Streak */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-5 hover:border-amber-400/30 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Study Streak</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-amber-400 flex items-baseline gap-1.5">
              5 Days
            </div>
            <div className="text-xs text-zinc-400 mt-1 flex items-center justify-between">
              <span>Freezes: 1 available</span>
              <span className="text-white font-semibold">Target: 7d</span>
            </div>
          </div>
          <div className="w-full bg-[#0c0a10] h-2 rounded-full overflow-hidden border border-white/5">
            <div className="bg-amber-400 h-full rounded-full" style={{ width: '71%' }} />
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center gap-1">
            <span>2 more days to unlock</span>
            <strong className="text-amber-300">"Week Warrior"</strong>
          </div>
        </div>

        {/* Metric 4: Gamification XP & Level */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-5 hover:border-[#49e6ff]/30 transition-all space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase text-zinc-400 tracking-wider">Level 4 Scholar</span>
            <div className="w-8 h-8 rounded-xl bg-[#49e6ff]/10 text-[#49e6ff] flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-extrabold font-mono text-[#49e6ff] flex items-baseline gap-1.5">
              840 <span className="text-xs text-zinc-400">/ 1,000 XP</span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 flex items-center justify-between">
              <span>Next: Level 5 Deep Thinker</span>
              <span className="text-[#49e6ff] font-semibold">160 XP left</span>
            </div>
          </div>
          <div className="w-full bg-[#0c0a10] h-2 rounded-full overflow-hidden border border-white/5">
            <div className="bg-[#49e6ff] h-full rounded-full" style={{ width: '84%' }} />
          </div>
          <div className="text-[11px] text-zinc-400 flex items-center justify-between">
            <span>Tier: Focus Adept</span>
            <span className="text-[#b8ff3c]">+60 XP next session</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Focus Launcher + AI Coach Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Quick Focus Launcher & Daily Circadian Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Focus Session Launcher */}
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-[#b8ff3c]" />
                  Launch Focus Block
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Select a session format and subject. Declarative Net Request site shielding activates automatically.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-1 rounded-full border border-[#b8ff3c]/20 self-start sm:self-auto">
                Distraction Shield Armed
              </span>
            </div>

            {/* Subject Tag Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-zinc-400 font-mono mr-1">Subject:</span>
              {(['Computer Science', 'Calculus', 'Physics', 'Literature'] as const).map(sub => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubject(sub)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    selectedSubject === sub
                      ? 'bg-[#b8ff3c] text-[#07060a] font-bold'
                      : 'bg-[#0c0a10] text-zinc-300 hover:text-white border border-[#2c2537]'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Preset Session Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <button
                onClick={() => onNavigate?.('focus')}
                className="p-4 bg-[#0c0a10] hover:bg-[#20182b] border border-[#2c2537] hover:border-[#b8ff3c] rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2 py-0.5 rounded-md">25 MIN</span>
                  <Play className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#b8ff3c] transition-colors" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-[#b8ff3c]">Classic Pomodoro</div>
                <p className="text-xs text-zinc-400 mt-1">25m study • 5m rest buffer. Great for quick assignments.</p>
                <div className="mt-3 text-[11px] font-mono text-zinc-500">+25 XP reward</div>
              </button>

              <button
                onClick={() => onNavigate?.('focus')}
                className="p-4 bg-[#0c0a10] hover:bg-[#20182b] border border-[#2c2537] hover:border-[#49e6ff] rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#49e6ff] bg-[#49e6ff]/10 px-2 py-0.5 rounded-md">50 MIN</span>
                  <Play className="w-3.5 h-3.5 text-zinc-500 group-hover:text-[#49e6ff] transition-colors" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-[#49e6ff]">Deep Work Block</div>
                <p className="text-xs text-zinc-400 mt-1">50m uninterrupted focus • 10m pause. Ideal for coding & math.</p>
                <div className="mt-3 text-[11px] font-mono text-zinc-500">+60 XP reward</div>
              </button>

              <button
                onClick={() => onNavigate?.('focus')}
                className="p-4 bg-[#0c0a10] hover:bg-[#20182b] border border-[#2c2537] hover:border-amber-400 rounded-2xl text-left transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-md">90 MIN</span>
                  <Play className="w-3.5 h-3.5 text-zinc-500 group-hover:text-amber-400 transition-colors" />
                </div>
                <div className="text-sm font-bold text-white group-hover:text-amber-400">Exam Sprint</div>
                <p className="text-xs text-zinc-400 mt-1">90m high-intensity flow. Best for mock tests and papers.</p>
                <div className="mt-3 text-[11px] font-mono text-zinc-500">+120 XP reward</div>
              </button>
            </div>
          </div>

          {/* Today's Adaptive Circadian Schedule (Phase 9 integration) */}
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <BookOpen className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Today's Adaptive Study Plan</h3>
                  <p className="text-xs text-zinc-400">Personalized schedule generated from your peak circadian rhythms</p>
                </div>
              </div>
              <button
                onClick={() => onNavigate?.('study-planner')}
                className="text-xs font-semibold text-[#b8ff3c] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Full Plan <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="p-3.5 bg-[#0c0a10] border border-[#2c2537] rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full bg-emerald-400" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>09:00 AM – 10:30 AM</span>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        COMPLETED
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">Algorithms: Graph Traversals & Trees • 1h 30m</div>
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>

              <div className="p-3.5 bg-[#1f192b] border border-[#b8ff3c]/30 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full bg-[#b8ff3c] animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-2">
                      <span>11:00 AM – 12:30 PM</span>
                      <span className="text-[10px] font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2 py-0.5 rounded-full border border-[#b8ff3c]/20">
                        CURRENT WINDOW
                      </span>
                    </div>
                    <div className="text-xs text-zinc-300 mt-0.5 font-medium">Calculus III: Vector Fields & Green's Theorem • 1h 30m</div>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate?.('focus')}
                  className="px-3 py-1.5 bg-[#b8ff3c] text-[#07060a] font-bold text-xs rounded-xl cursor-pointer hover:bg-[#a6ec31] transition-colors"
                >
                  Start Block
                </button>
              </div>

              <div className="p-3.5 bg-[#0c0a10] border border-[#2c2537] rounded-2xl flex items-center justify-between opacity-80">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-10 rounded-full bg-zinc-600" />
                  <div>
                    <div className="text-xs font-bold text-zinc-300 flex items-center gap-2">
                      <span>03:30 PM – 05:00 PM</span>
                      <span className="text-[10px] font-mono text-zinc-400 bg-zinc-800 px-2 py-0.5 rounded-full">
                        SCHEDULED
                      </span>
                    </div>
                    <div className="text-xs text-zinc-400 mt-0.5">Physics Lab Revision: Optics & Wave Interference</div>
                  </div>
                </div>
                <span className="text-xs text-zinc-500 font-mono">In 3 hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): AI Coach, Wellbeing, Study Pod */}
        <div className="space-y-6">
          {/* AI Focus Coach Nudge */}
          <div className="bg-gradient-to-b from-[#1a1426] to-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#b8ff3c] uppercase flex items-center gap-1.5 font-bold">
                <Sparkles className="w-4 h-4" />
                AI Focus Coach
              </span>
              <span className="text-[10px] font-mono text-zinc-400">Gemini 2.5 Flash</span>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-bold text-white">Pre-Sleep Distraction Forecast</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                You logged <strong className="text-amber-300">24 reel transitions</strong> after 11 PM yesterday. Your cognitive focus score was 22% higher today during morning sessions.
              </p>
              <div className="p-3 bg-[#0c0a10] rounded-xl border border-white/5 text-xs text-zinc-400">
                💡 <em>"Setting a hard 10:45 PM app lock tonight could preserve your 5-day streak and boost tomorrow's Calculus retention."</em>
              </div>
            </div>

            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => onNavigate?.('ai-coach')}
                className="w-full py-2.5 bg-[#b8ff3c] hover:bg-[#a6ec31] text-[#07060a] text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Bot className="w-4 h-4" />
                Chat with AI Focus Coach
              </button>
              <button
                onClick={() => onNavigate?.('ai-agents')}
                className="w-full py-2 bg-[#241a31] hover:bg-[#2e213e] text-zinc-300 hover:text-white text-xs font-medium rounded-xl border border-white/5 transition-colors cursor-pointer"
              >
                View Autonomous Agent Swarm →
              </button>
            </div>
          </div>

          {/* Wellbeing & Burnout Safeguard */}
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartPulse className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Wellbeing Index</h4>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-500/20">
                Optimal (28%)
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed">
              Cognitive fatigue is low. Next 20-20-20 eye strain interval recommended after 25 more focus minutes.
            </p>

            <button
              onClick={() => onNavigate?.('wellbeing-insights')}
              className="w-full py-2 bg-[#0c0a10] hover:bg-[#20182b] text-zinc-300 hover:text-white text-xs font-semibold rounded-xl border border-[#2c2537] transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              Open Wellbeing Intelligence
            </button>
          </div>

          {/* Study Pod Quick Status */}
          <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#49e6ff]" />
                <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400">Study Pod</h4>
              </div>
              <span className="text-[11px] font-mono text-zinc-400">MIT Aspirants '26</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5">
                <span className="text-white font-medium">1. Maya K.</span>
                <span className="font-mono text-[#49e6ff] font-bold">920 XP</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1 border-b border-white/5 bg-[#b8ff3c]/5 px-2 rounded-lg -mx-2">
                <span className="text-[#b8ff3c] font-bold">2. You (Alex)</span>
                <span className="font-mono text-[#b8ff3c] font-bold">840 XP</span>
              </div>
              <div className="flex items-center justify-between text-xs py-1">
                <span className="text-zinc-400">3. Rohan S.</span>
                <span className="font-mono text-zinc-400">790 XP</span>
              </div>
            </div>

            <button
              onClick={() => onNavigate?.('groups')}
              className="w-full py-2 bg-[#0c0a10] hover:bg-[#20182b] text-zinc-300 hover:text-white text-xs font-semibold rounded-xl border border-[#2c2537] transition-all cursor-pointer"
            >
              Enter Study Pod Room →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
