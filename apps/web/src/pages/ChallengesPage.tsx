/**
 * @file apps/web/src/pages/ChallengesPage.tsx
 * @description Daily & Weekly Focus Challenges with Claimable XP Rewards
 */
import React, { useState, useEffect } from 'react';
import {
  Target,
  Clock,
  Sparkles,
  CheckCircle2,
  Calendar,
  Zap,
  Flame,
  ArrowRight,
  Shield,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import {
  ChallengeItem,
  ChallengeDifficulty,
} from '../../../../packages/shared-types/src/index.ts';

export function ChallengesPage() {
  const [dailyChallenges, setDailyChallenges] = useState<ChallengeItem[]>([]);
  const [weeklyChallenges, setWeeklyChallenges] = useState<ChallengeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [claimToast, setClaimToast] = useState<string | null>(null);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const data = await apiClient.getChallenges();
      setDailyChallenges(data.daily);
      setWeeklyChallenges(data.weekly);
    } catch (err) {
      console.error('Failed to load challenges:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async (challengeId: string) => {
    try {
      setClaimingId(challengeId);
      const res = await apiClient.claimChallenge(challengeId);
      if (res.success) {
        setClaimToast(res.message);
        await loadChallenges();
        setTimeout(() => setClaimToast(null), 4000);
      }
    } catch (err: any) {
      setClaimToast(err.message || 'Error claiming challenge reward');
      setTimeout(() => setClaimToast(null), 4000);
    } finally {
      setClaimingId(null);
    }
  };

  const getDifficultyColor = (diff: ChallengeDifficulty) => {
    switch (diff) {
      case 'HARD':
        return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
      case 'MEDIUM':
        return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
      case 'EASY':
      default:
        return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#2c2537] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-1 rounded-full border border-[#b8ff3c]/20 mb-2">
            <Target className="w-3.5 h-3.5" />
            Phase 6 Quest System
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Daily & Weekly Focus Challenges
          </h1>
          <p className="text-zinc-400 text-sm mt-1">
            Complete targeted study milestones to earn high-yield XP and accelerate level progression.
          </p>
        </div>
      </div>

      {claimToast && (
        <div className="p-4 rounded-xl bg-[#b8ff3c]/10 border border-[#b8ff3c]/30 text-[#b8ff3c] text-xs font-mono flex items-center gap-2">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{claimToast}</span>
        </div>
      )}

      {/* Daily Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#b8ff3c]" />
            <h2 className="text-lg font-bold text-white">Today's Daily Quests</h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">Resets in 8h 15m</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dailyChallenges.map((chal) => {
            const isCompleted = chal.currentValue >= chal.targetValue;
            const isClaimed = chal.status === 'CLAIMED';
            const percent = Math.min(100, Math.round((chal.currentValue / chal.targetValue) * 100));

            return (
              <div
                key={chal.id}
                className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-white/20 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getDifficultyColor(
                        chal.difficulty
                      )}`}
                    >
                      {chal.difficulty}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#b8ff3c]">
                      +{chal.xpReward} XP
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">{chal.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {chal.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Progress</span>
                    <span className="text-white font-bold">
                      {chal.currentValue} / {chal.targetValue} {chal.unit}
                    </span>
                  </div>

                  <div className="h-2 w-full bg-[#0c0a10] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isCompleted ? 'bg-gradient-to-r from-[#b8ff3c] to-emerald-400' : 'bg-[#b8ff3c]'
                      }`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {isClaimed ? (
                    <div className="w-full py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      XP Claimed
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(chal.id)}
                      disabled={claimingId === chal.id}
                      className="w-full py-2.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#b8ff3c]/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{claimingId === chal.id ? 'Claiming...' : `Claim +${chal.xpReward} XP`}</span>
                    </button>
                  ) : (
                    <div className="text-center text-[11px] font-mono text-zinc-500 py-1">
                      In progress ({percent}%)
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weekly Challenges Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#49e6ff]" />
            <h2 className="text-lg font-bold text-white">Weekly Focus Sprints</h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">Resets in 3 days</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {weeklyChallenges.map((chal) => {
            const isCompleted = chal.currentValue >= chal.targetValue;
            const isClaimed = chal.status === 'CLAIMED';
            const percent = Math.min(100, Math.round((chal.currentValue / chal.targetValue) * 100));

            return (
              <div
                key={chal.id}
                className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 flex flex-col justify-between space-y-4 shadow-lg hover:border-white/20 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${getDifficultyColor(
                        chal.difficulty
                      )}`}
                    >
                      WEEKLY • {chal.difficulty}
                    </span>
                    <span className="text-xs font-mono font-bold text-[#49e6ff]">
                      +{chal.xpReward} XP
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">{chal.title}</h3>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {chal.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                    <span>Progress</span>
                    <span className="text-white font-bold">
                      {chal.currentValue} / {chal.targetValue} {chal.unit}
                    </span>
                  </div>

                  <div className="h-2.5 w-full bg-[#0c0a10] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#49e6ff] to-indigo-400 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>

                  {isClaimed ? (
                    <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold text-center flex items-center justify-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      Weekly Sprint XP Claimed
                    </div>
                  ) : isCompleted ? (
                    <button
                      onClick={() => handleClaim(chal.id)}
                      disabled={claimingId === chal.id}
                      className="w-full py-2.5 rounded-xl bg-[#49e6ff] hover:bg-[#3cd0e6] text-[#07060a] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-[#49e6ff]/20"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{claimingId === chal.id ? 'Claiming...' : `Claim +${chal.xpReward} XP`}</span>
                    </button>
                  ) : (
                    <div className="text-center text-xs font-mono text-zinc-400 py-1">
                      {chal.targetValue - chal.currentValue} {chal.unit} left to complete
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
