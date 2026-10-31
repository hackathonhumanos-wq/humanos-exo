/**
 * @file apps/web/src/pages/LeaderboardPage.tsx
 * @description Competitive & Peer Leaderboards with Scope and Metric Filters
 */
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Crown,
  Users,
  Globe,
  Flame,
  Clock,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import {
  LeaderboardEntry,
  LeaderboardMetric,
  LeaderboardScope,
} from '../../../../packages/shared-types/src/index.ts';

export function LeaderboardPage() {
  const [scope, setScope] = useState<LeaderboardScope>('GLOBAL');
  const [metric, setMetric] = useState<LeaderboardMetric>('WEEKLY_XP');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [topPodium, setTopPodium] = useState<LeaderboardEntry[]>([]);
  const [isOptedIn, setIsOptedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [privacyToast, setPrivacyToast] = useState<string | null>(null);

  useEffect(() => {
    loadLeaderboard();
  }, [scope, metric]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await apiClient.getLeaderboard(scope, metric);
      setEntries(res.entries);
      setTopPodium(res.topPodium);
      setIsOptedIn(res.isOptedIn);
    } catch (err) {
      console.error('Failed to load leaderboard:', err);
    } finally {
      setLoading(false);
    }
  };

  const togglePrivacy = async () => {
    const nextVal = !isOptedIn;
    try {
      await apiClient.setLeaderboardPrivacy(nextVal);
      setIsOptedIn(nextVal);
      setPrivacyToast(
        nextVal
          ? 'Profile is now visible on competitive leaderboards.'
          : 'Profile hidden from public leaderboards (Incognito mode enabled).'
      );
      await loadLeaderboard();
      setTimeout(() => setPrivacyToast(null), 3500);
    } catch (err) {
      console.error('Failed to update privacy:', err);
    }
  };

  const getMetricLabel = (m: LeaderboardMetric) => {
    switch (m) {
      case 'MONTHLY_FOCUS':
        return 'Monthly Focus (Hours)';
      case 'DAILY_SESSIONS':
        return 'Daily Focus Sessions';
      case 'STREAK_DAYS':
        return 'Consecutive Streaks';
      case 'WEEKLY_XP':
      default:
        return 'Weekly XP Sprints';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2537] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-1 rounded-full border border-[#b8ff3c]/20 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Phase 6 Competitive Leaderboards
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Academic Focus Leaderboard
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Track healthy competition and study discipline without exposing private URLs or browsing data.
          </p>
        </div>

        {/* Privacy Opt-out Toggle */}
        <button
          onClick={togglePrivacy}
          className={`px-4 py-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 border transition-all cursor-pointer ${
            isOptedIn
              ? 'bg-[#17131f] border-[#2c2537] text-zinc-300 hover:text-white'
              : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
          }`}
        >
          {isOptedIn ? <Eye className="w-4 h-4 text-[#b8ff3c]" /> : <EyeOff className="w-4 h-4 text-amber-400" />}
          <span>{isOptedIn ? 'Visible on Board' : 'Hidden (Incognito)'}</span>
        </button>
      </div>

      {privacyToast && (
        <div className="p-4 rounded-xl bg-[#b8ff3c]/10 border border-[#b8ff3c]/30 text-[#b8ff3c] text-xs font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{privacyToast}</span>
        </div>
      )}

      {/* Scope and Metric Selectors */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        {/* Scope Tabs */}
        <div className="flex bg-[#17131f] p-1.5 rounded-2xl border border-[#2c2537] gap-1">
          {[
            { id: 'GLOBAL', label: 'Global Ranking', icon: Globe },
            { id: 'FRIENDS', label: 'Friends Circle', icon: Users },
            { id: 'GROUPS', label: 'My Study Groups', icon: Trophy },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setScope(item.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  scope === item.id
                    ? 'bg-[#b8ff3c] text-[#07060a]'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex bg-[#17131f] p-1.5 rounded-2xl border border-[#2c2537] gap-1 overflow-x-auto">
          {[
            { id: 'WEEKLY_XP', label: 'Weekly XP' },
            { id: 'MONTHLY_FOCUS', label: 'Monthly Hours' },
            { id: 'DAILY_SESSIONS', label: 'Daily Sessions' },
            { id: 'STREAK_DAYS', label: 'Streak Days' },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMetric(m.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer whitespace-nowrap ${
                metric === m.id
                  ? 'bg-white/10 text-white font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Top 3 Podium Visual */}
      {topPodium.length >= 3 && (
        <div className="grid grid-cols-3 gap-3 sm:gap-6 pt-4 items-end max-w-2xl mx-auto">
          {/* #2 Silver (Left) */}
          <div className="flex flex-col items-center space-y-2 order-1">
            <div className="relative">
              <img
                src={topPodium[1].avatarUrl}
                alt={topPodium[1].displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-slate-300"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-slate-300 text-black font-extrabold text-xs font-mono flex items-center justify-center">
                2
              </span>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] sm:max-w-none">
                {topPodium[1].displayName}
              </div>
              <div className="text-[11px] font-mono text-[#49e6ff] font-bold">
                {topPodium[1].score} {topPodium[1].unit}
              </div>
            </div>
            <div className="w-full h-24 sm:h-28 rounded-t-2xl bg-gradient-to-t from-[#141824] to-[#1e2436] border-t-2 border-slate-300 flex items-center justify-center font-mono font-black text-slate-300">
              #2
            </div>
          </div>

          {/* #1 Gold (Center, Elevated) */}
          <div className="flex flex-col items-center space-y-2 order-2">
            <Crown className="w-6 h-6 text-amber-400 animate-bounce" />
            <div className="relative">
              <img
                src={topPodium[0].avatarUrl}
                alt={topPodium[0].displayName}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-amber-400 ring-4 ring-amber-400/20"
              />
              <span className="absolute -bottom-2 -right-1 w-7 h-7 rounded-full bg-amber-400 text-black font-black text-xs font-mono flex items-center justify-center">
                1
              </span>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[120px] sm:max-w-none">
                {topPodium[0].displayName}
              </div>
              <div className="text-xs font-mono text-[#b8ff3c] font-black">
                {topPodium[0].score} {topPodium[0].unit}
              </div>
            </div>
            <div className="w-full h-32 sm:h-36 rounded-t-2xl bg-gradient-to-t from-[#1a1710] to-[#2e2617] border-t-2 border-amber-400 flex items-center justify-center font-mono font-black text-amber-400 text-lg">
              #1
            </div>
          </div>

          {/* #3 Bronze (Right) */}
          <div className="flex flex-col items-center space-y-2 order-3">
            <div className="relative">
              <img
                src={topPodium[2].avatarUrl}
                alt={topPodium[2].displayName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-amber-700"
              />
              <span className="absolute -bottom-2 -right-1 w-6 h-6 rounded-full bg-amber-700 text-white font-extrabold text-xs font-mono flex items-center justify-center">
                3
              </span>
            </div>
            <div className="text-center">
              <div className="text-xs sm:text-sm font-bold text-white truncate max-w-[100px] sm:max-w-none">
                {topPodium[2].displayName}
              </div>
              <div className="text-[11px] font-mono text-zinc-300 font-bold">
                {topPodium[2].score} {topPodium[2].unit}
              </div>
            </div>
            <div className="w-full h-20 sm:h-24 rounded-t-2xl bg-gradient-to-t from-[#161214] to-[#251a1d] border-t-2 border-amber-700 flex items-center justify-center font-mono font-black text-amber-700">
              #3
            </div>
          </div>
        </div>
      )}

      {/* Complete Rankings Table */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-4 sm:p-5 border-b border-[#2c2537] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-[#b8ff3c]" />
            Full Rankings • {getMetricLabel(metric)}
          </h3>
          <span className="text-xs font-mono text-zinc-500">{entries.length} Participants</span>
        </div>

        <div className="divide-y divide-[#2c2537]/50">
          {entries.map((entry) => (
            <div
              key={entry.userId}
              className={`p-4 flex items-center justify-between gap-4 transition-colors ${
                entry.isCurrentUser
                  ? 'bg-[#1f1b2b] border-l-4 border-l-[#b8ff3c]'
                  : 'hover:bg-white/[0.02]'
              }`}
            >
              <div className="flex items-center gap-4 min-w-0">
                <span
                  className={`w-7 text-center font-mono font-black text-sm ${
                    entry.rank === 1
                      ? 'text-amber-400'
                      : entry.rank === 2
                      ? 'text-slate-300'
                      : entry.rank === 3
                      ? 'text-amber-700'
                      : 'text-zinc-500'
                  }`}
                >
                  #{entry.rank}
                </span>

                <img
                  src={entry.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
                  alt={entry.displayName}
                  className="w-10 h-10 rounded-full object-cover shrink-0"
                />

                <div className="min-w-0">
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="truncate">{entry.displayName}</span>
                    {entry.isCurrentUser && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#b8ff3c] text-black font-extrabold shrink-0">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-zinc-400">
                    @{entry.username} • Level {entry.level}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-base font-black font-mono tabular-nums text-white">
                  {entry.score} <span className="text-xs text-zinc-400 font-normal">{entry.unit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
