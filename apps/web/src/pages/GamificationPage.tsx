/**
 * @file apps/web/src/pages/GamificationPage.tsx
 * @description XP Ledger & 8-Level Student Progression Hub
 */
import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Zap,
  TrendingUp,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Shield,
  Layers,
  ChevronRight,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import {
  LevelProgress,
  StudentLevel,
  XPTransactionRecord,
  XPActivityType,
} from '../../../../packages/shared-types/src/index.ts';

export function GamificationPage() {
  const [levelProgress, setLevelProgress] = useState<LevelProgress | null>(null);
  const [levelsList, setLevelsList] = useState<StudentLevel[]>([]);
  const [transactions, setTransactions] = useState<XPTransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [awardingActivity, setAwardingActivity] = useState<string | null>(null);
  const [bannerMessage, setBannerMessage] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileData, txData] = await Promise.all([
        apiClient.getGamificationProfile(),
        apiClient.getXpHistory(),
      ]);
      setLevelProgress(profileData.levelProgress);
      setLevelsList(profileData.levelsReference);
      setTransactions(txData.transactions);
    } catch (err) {
      console.error('Failed to load gamification data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSimulateAward = async (type: XPActivityType, desc: string) => {
    try {
      setAwardingActivity(type);
      const refId = `sim-${Date.now()}`;
      const res = await apiClient.awardXp(type, desc, refId);
      if (res.success) {
        setBannerMessage({
          text: `+${res.data.xpEarned} XP Earned! New Balance: ${res.data.newTotalXp} XP`,
          type: 'success',
        });
        await loadData();
        setTimeout(() => setBannerMessage(null), 4000);
      }
    } catch (err: any) {
      setBannerMessage({ text: err.message || 'Error awarding XP', type: 'info' });
      setTimeout(() => setBannerMessage(null), 4000);
    } finally {
      setAwardingActivity(null);
    }
  };

  if (loading && !levelProgress) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-sm text-zinc-400 font-mono">
          <div className="w-4 h-4 border-2 border-[#b8ff3c] border-t-transparent rounded-full animate-spin" />
          Loading XP Ledger & Progression...
        </div>
      </div>
    );
  }

  const currentLevel = levelProgress?.currentLevel;
  const nextLevel = levelProgress?.nextLevel;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2537] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-1 rounded-full border border-[#b8ff3c]/20 mb-2">
            <Trophy className="w-3.5 h-3.5" />
            Phase 6 Gamification Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            XP Ledger & Level Progression
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Earn experience through disciplined focus intervals, streak milestones, and zero-distraction study sessions.
          </p>
        </div>

        {/* Live XP Counter Badge */}
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-4 flex items-center gap-4 shrink-0 shadow-lg shadow-black/40">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#b8ff3c]/20 to-[#49e6ff]/20 border border-[#b8ff3c]/30 flex items-center justify-center text-2xl">
            {currentLevel?.badgeIcon || '⚡'}
          </div>
          <div>
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Current Balance</div>
            <div className="text-2xl font-black font-mono tabular-nums text-white flex items-center gap-1.5">
              <span>{levelProgress?.totalXp ?? 0}</span>
              <span className="text-xs text-[#b8ff3c] font-bold">XP</span>
            </div>
          </div>
        </div>
      </div>

      {bannerMessage && (
        <div className="p-4 rounded-xl bg-[#b8ff3c]/10 border border-[#b8ff3c]/30 text-[#b8ff3c] text-xs font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{bannerMessage.text}</span>
        </div>
      )}

      {/* Hero Level Progression Banner */}
      <div className="bg-gradient-to-br from-[#17131f] via-[#120f18] to-[#0c0a10] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-400">Current Standing</span>
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-white">
                  Level {currentLevel?.levelNumber}: {currentLevel?.title}
                </span>
                <span className="text-2xl">{currentLevel?.badgeIcon}</span>
              </div>
            </div>

            {nextLevel && (
              <div className="text-left sm:text-right">
                <span className="text-xs font-mono text-zinc-400">Next Milestone</span>
                <div className="text-sm font-bold text-zinc-200">
                  Level {nextLevel.levelNumber}: {nextLevel.title} ({nextLevel.minXp} XP)
                </div>
                <div className="text-xs font-mono text-[#b8ff3c]">
                  {(nextLevel.minXp - (levelProgress?.totalXp ?? 0))} XP remaining
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar with Zero-Pill Design */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>{levelProgress?.currentLevelXp} XP earned in tier</span>
              <span className="text-white font-bold">{levelProgress?.progressPercent}% Complete</span>
            </div>
            <div className="h-3 w-full bg-[#0c0a10] rounded-full overflow-hidden border border-white/10 p-[1px]">
              <div
                className="h-full bg-gradient-to-r from-[#b8ff3c] to-[#49e6ff] rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.max(4, Math.min(100, levelProgress?.progressPercent || 0))}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 8-Level Roadmap Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#b8ff3c]" />
            8-Tier Academic Level Roadmap
          </h2>
          <span className="text-xs font-mono text-zinc-500">Official FocusFlow Scale</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {levelsList.map((lvl) => {
            const isCurrent = lvl.levelNumber === currentLevel?.levelNumber;
            const isPassed = (levelProgress?.totalXp ?? 0) >= lvl.minXp;

            return (
              <div
                key={lvl.levelNumber}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? 'bg-[#1e172a] border-[#b8ff3c] ring-1 ring-[#b8ff3c]/40 shadow-lg'
                    : isPassed
                    ? 'bg-[#13101c] border-emerald-500/30 text-zinc-300'
                    : 'bg-[#100d17] border-[#2c2537]/60 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-2xl">{lvl.badgeIcon}</span>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      isCurrent
                        ? 'bg-[#b8ff3c] text-black font-extrabold'
                        : isPassed
                        ? 'text-emerald-400 bg-emerald-500/10'
                        : 'text-zinc-500 bg-white/5'
                    }`}
                  >
                    {isCurrent ? 'ACTIVE' : isPassed ? 'ACHIEVED' : 'LOCKED'}
                  </span>
                </div>
                <div className="mt-3">
                  <div className="text-xs font-mono text-zinc-400">Level {lvl.levelNumber}</div>
                  <div className="text-sm font-bold text-white truncate">{lvl.title}</div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-1">
                    {lvl.minXp} - {lvl.maxXp > 5000 ? '∞' : `${lvl.maxXp} XP`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Activity Simulators (Working Action Triggers) */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#b8ff3c]" />
            Complete Study Activities & Earn XP
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Test the live backend XP awarding engine. Each award updates your total XP, tier progress, and transaction log.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <button
            onClick={() => handleSimulateAward('FOCUS_SESSION_25M', 'Completed 25-minute Pomodoro: Machine Learning')}
            disabled={awardingActivity !== null}
            className="p-4 rounded-xl bg-[#0c0a10] border border-[#2c2537] hover:border-[#b8ff3c]/50 text-left transition-all hover:bg-[#1a1524] cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-4 h-4 text-[#b8ff3c]" />
              <span className="text-xs font-mono font-bold text-[#b8ff3c]">+10 XP</span>
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#b8ff3c] transition-colors">
              25m Focus Pomodoro
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Single uninterrupted study block</div>
          </button>

          <button
            onClick={() => handleSimulateAward('FOCUS_SESSION_50M', 'Completed 50-minute Deep Work: Algorithms Revision')}
            disabled={awardingActivity !== null}
            className="p-4 rounded-xl bg-[#0c0a10] border border-[#2c2537] hover:border-[#49e6ff]/50 text-left transition-all hover:bg-[#1a1524] cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <Shield className="w-4 h-4 text-[#49e6ff]" />
              <span className="text-xs font-mono font-bold text-[#49e6ff]">+25 XP</span>
            </div>
            <div className="text-xs font-bold text-white group-hover:text-[#49e6ff] transition-colors">
              50m Deep Work Session
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Intense flow state study marathon</div>
          </button>

          <button
            onClick={() => handleSimulateAward('ZERO_REELS_BONUS', 'Zero short-form video distraction day bonus')}
            disabled={awardingActivity !== null}
            className="p-4 rounded-xl bg-[#0c0a10] border border-[#2c2537] hover:border-emerald-400/50 text-left transition-all hover:bg-[#1a1524] cursor-pointer group"
          >
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-mono font-bold text-emerald-400">+20 XP</span>
            </div>
            <div className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
              Zero Reels Shield Bonus
            </div>
            <div className="text-[11px] text-zinc-400 mt-1">Protected study time without doomscrolling</div>
          </button>
        </div>
      </div>

      {/* Transaction History Ledger */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-[#2c2537] pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#b8ff3c]" />
            <h2 className="text-base font-bold text-white">XP Transaction Audit Ledger</h2>
          </div>
          <span className="text-xs font-mono text-zinc-400 tabular-nums">
            {transactions.length} Records Verified
          </span>
        </div>

        <div className="divide-y divide-[#2c2537]/50">
          {transactions.map((tx) => (
            <div key={tx.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#0c0a10] border border-white/10 flex items-center justify-center text-xs text-[#b8ff3c] font-mono shrink-0">
                  +{tx.amount}
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-white truncate">{tx.description}</div>
                  <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-2">
                    <span>{new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span>•</span>
                    <span className="truncate">{tx.activityType}</span>
                  </div>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-mono text-zinc-400">
                  {new Date(tx.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
