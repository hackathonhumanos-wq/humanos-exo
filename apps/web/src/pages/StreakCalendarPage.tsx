/**
 * @file apps/web/src/pages/StreakCalendarPage.tsx
 * @description Streak Tracking, Calendar Grid, and Continuity Mechanics
 */
import React, { useState, useEffect } from 'react';
import {
  Flame,
  Calendar,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Info,
  Zap,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import { StreakInfo, StreakDayRecord } from '../../../../packages/shared-types/src/index.ts';

export function StreakCalendarPage() {
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDay, setSelectedDay] = useState<StreakDayRecord | null>(null);

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getStreaks();
      setStreakInfo(data);
      if (data.history && data.history.length > 0) {
        setSelectedDay(data.history[data.history.length - 1]);
      }
    } catch (err) {
      console.error('Failed to load streak info:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !streakInfo) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
          <div className="w-4 h-4 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          Loading Streak Calendar...
        </div>
      </div>
    );
  }

  const history = streakInfo?.history || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2537] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20 mb-2">
            <Flame className="w-3.5 h-3.5" />
            Phase 6 Consistency Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Streak Calendar & Habit Discipline
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Build unshakeable study habits by meeting the 25-minute minimum daily focus threshold.
          </p>
        </div>

        {/* Streak Freeze Badge */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Active Streak</div>
            <div className="text-2xl font-black font-mono tabular-nums text-white flex items-center gap-2">
              <span>{streakInfo?.currentStreak ?? 0}</span>
              <span className="text-xs text-amber-400 font-bold uppercase">Days</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-400" />
            Current Habit Run
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-white">
            {streakInfo?.currentStreak} <span className="text-sm font-normal text-zinc-400">Days</span>
          </div>
          <div className="text-[11px] text-zinc-400">
            {streakInfo?.isActiveToday ? 'Daily quota completed today' : 'Study 25m to protect today'}
          </div>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#49e6ff]" />
            Personal Best
          </div>
          <div className="text-3xl font-black font-mono tabular-nums text-white">
            {streakInfo?.longestStreak} <span className="text-sm font-normal text-zinc-400">Days</span>
          </div>
          <div className="text-[11px] text-zinc-400">Achieved during midterm preparation sprint</div>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-2">
          <div className="text-xs font-mono text-zinc-400 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Streak Freeze Safeguard
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-center gap-2">
            <span>1 Available</span>
          </div>
          <div className="text-[11px] text-zinc-400">Auto-protects 1 emergency missed day per week</div>
        </div>
      </div>

      {/* Calendar Grid Representation */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2c2537] pb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              14-Day Focus Continuity Grid
            </h2>
            <p className="text-xs text-zinc-400">Click any day node to view verified study minutes</p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-500/80 inline-block" />
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-500/80 inline-block" />
              <span>Missed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-[#b8ff3c] inline-block" />
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {history.map((record) => {
            const isSelected = selectedDay?.date === record.date;
            const isToday = record.status === 'TODAY';
            const isCompleted = record.status === 'COMPLETED';
            const isMissed = record.status === 'MISSED';

            return (
              <button
                key={record.date}
                onClick={() => setSelectedDay(record)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#b8ff3c] ring-2 ring-[#b8ff3c]/30 bg-[#221a31]'
                    : isToday
                    ? 'bg-[#1b1726] border-[#b8ff3c]/60'
                    : isCompleted
                    ? 'bg-[#14121d] border-amber-500/30 hover:border-amber-500/60'
                    : isMissed
                    ? 'bg-[#181119] border-rose-500/30'
                    : 'bg-[#100d17] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-zinc-400">
                    {new Date(record.date).toLocaleDateString([], { weekday: 'short' })}
                  </span>
                  <span className="font-bold text-white">
                    {new Date(record.date).getDate()}
                  </span>
                </div>

                <div className="my-2 flex items-center justify-center">
                  {isToday ? (
                    <div className="w-8 h-8 rounded-full bg-[#b8ff3c]/20 border border-[#b8ff3c] flex items-center justify-center text-[#b8ff3c]">
                      <Flame className="w-4 h-4 fill-current" />
                    </div>
                  ) : isCompleted ? (
                    <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400">
                      <Flame className="w-4 h-4 fill-current" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                <div className="text-center font-mono text-[11px] text-zinc-300">
                  {record.focusMinutes}m study
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Day Details Panel */}
        {selectedDay && (
          <div className="p-4 rounded-2xl bg-[#0c0a10] border border-[#2c2537] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-mono text-zinc-400">
                  {new Date(selectedDay.date).toLocaleDateString([], {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>{selectedDay.focusMinutes} Minutes Focused</span>
                  <span>•</span>
                  <span>{selectedDay.sessionsCount} Sessions Logged</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span
                className={`text-xs font-mono px-3 py-1 rounded-full font-bold ${
                  selectedDay.status === 'COMPLETED' || selectedDay.status === 'TODAY'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                }`}
              >
                {selectedDay.status === 'TODAY'
                  ? 'TODAY (STREAK SAFE)'
                  : selectedDay.status === 'COMPLETED'
                  ? 'STREAK PRESERVED'
                  : 'MISSED'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Streak Mechanics & Rules Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-[#49e6ff]" />
            Streak Qualifying Rules
          </h3>
          <ul className="text-xs text-zinc-400 space-y-2 list-disc list-inside leading-relaxed">
            <li>Minimum requirement: Complete at least 25 minutes of verified study time per calendar day.</li>
            <li>Tracking resets automatically at 00:00 local midnight.</li>
            <li>Pomodoro blocks and Deep Work intervals count toward the daily quota.</li>
            <li>Background idle time or pause states are not credited toward streak qualification.</li>
          </ul>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Streak Milestone XP Multipliers
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-[#0c0a10] border border-white/5 flex justify-between">
              <span className="text-zinc-400">3 Days</span>
              <span className="text-[#b8ff3c] font-bold">+25 XP</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0c0a10] border border-white/5 flex justify-between">
              <span className="text-zinc-400">7 Days</span>
              <span className="text-[#b8ff3c] font-bold">+75 XP</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0c0a10] border border-white/5 flex justify-between">
              <span className="text-zinc-400">14 Days</span>
              <span className="text-[#b8ff3c] font-bold">+150 XP</span>
            </div>
            <div className="p-2.5 rounded-xl bg-[#0c0a10] border border-white/5 flex justify-between">
              <span className="text-zinc-400">30 Days</span>
              <span className="text-[#b8ff3c] font-bold">+350 XP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
