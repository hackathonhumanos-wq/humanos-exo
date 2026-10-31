/**
 * @file apps/web/src/pages/ChallengesPage.tsx
 * @description Light-theme Daily & Weekly Focus Challenges page connected to /api/v1/gamification/challenges
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, CheckCircle2, Sparkles, Clock } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { ChallengeItem } from '../../../../packages/shared-types/src/index.ts';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface ChallengesPageProps {
  onChallengeClaimed?: () => void;
}

export const ChallengesPage: React.FC<ChallengesPageProps> = ({ onChallengeClaimed }) => {
  const [daily, setDaily] = useState<ChallengeItem[]>([]);
  const [weekly, setWeekly] = useState<ChallengeItem[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'DAILY' | 'WEEKLY'>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [claimingId, setClaimingId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const loadChallenges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getChallenges();
      setDaily(data.daily);
      setWeekly(data.weekly);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load challenges.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const handleClaim = async (id: string) => {
    try {
      setClaimingId(id);
      const res = await apiClient.claimChallenge(id);
      setToast(res.message || `Claimed +${res.xpEarned} XP!`);
      await loadChallenges();
      onChallengeClaimed?.();
    } catch (err) {
      setToast(err instanceof Error ? err.message : 'Unable to claim reward.');
    } finally {
      setClaimingId(null);
    }
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Focus Challenges"
        description="Fetching your daily and weekly study quests..."
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Challenges unavailable"
        description={error}
        actionLabel="Retry"
        onAction={loadChallenges}
      />
    );
  }

  const displayed =
    activeTab === 'DAILY' ? daily : activeTab === 'WEEKLY' ? weekly : [...daily, ...weekly];

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Focus Challenges
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Complete structured study quests to earn bonus XP and reinforce healthy screen habits.
          </p>
        </div>

        <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E1EEE9] self-start">
          {(['ALL', 'DAILY', 'WEEKLY'] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                activeTab === tab
                  ? 'bg-[#079669] text-white'
                  : 'text-[#5A708D] hover:text-[#142647]'
              }`}
            >
              {tab === 'ALL' ? 'All Quests' : tab === 'DAILY' ? 'Daily' : 'Weekly'}
            </button>
          ))}
        </div>
      </div>

      {toast && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-[#E9F9F2] border border-[#BCEAD7] text-[#067652] text-xs font-semibold flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#079669]" />
            <span>{toast}</span>
          </div>
          <button type="button" onClick={() => setToast(null)} className="underline font-bold cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {displayed.length === 0 ? (
        <EmptyState
          variant="empty"
          title="No active challenges in this filter"
          description="Check back tomorrow for fresh daily study challenges."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayed.map((ch) => {
            const pct = Math.min(100, Math.round((ch.currentValue / Math.max(ch.targetValue, 1)) * 100));
            return (
              <div key={ch.id} className="ff-card p-6 flex flex-col justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#E9F9F2] text-[#079669]">
                      {ch.type} • {ch.difficulty}
                    </span>
                    <span className="text-xs font-bold text-[#079669] tabular-nums">
                      +{ch.xpReward} XP
                    </span>
                  </div>
                  <h2 className="font-display text-lg font-bold text-[#142647]">{ch.title}</h2>
                  <p className="text-xs text-[#5A708D] leading-relaxed">{ch.description}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs font-semibold text-[#334B68] mb-1.5 tabular-nums">
                      <span>Progress</span>
                      <span>
                        {ch.currentValue} / {ch.targetValue} {ch.unit}
                      </span>
                    </div>
                    <ProgressBar
                      value={pct}
                      label={ch.title}
                      tone={ch.status === 'CLAIMED' ? 'blue' : 'emerald'}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#6C819C] tabular-nums">
                      <Clock className="w-3.5 h-3.5" />
                      Expires {new Date(ch.expiresAt).toLocaleDateString()}
                    </span>

                    {ch.status === 'COMPLETED' ? (
                      <button
                        type="button"
                        disabled={claimingId === ch.id}
                        onClick={() => handleClaim(ch.id)}
                        className="px-4 py-2 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>{claimingId === ch.id ? 'Claiming...' : `Claim +${ch.xpReward} XP`}</span>
                      </button>
                    ) : ch.status === 'CLAIMED' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#079669]">
                        <CheckCircle2 className="w-4 h-4" />
                        Reward Claimed
                      </span>
                    ) : (
                      <span className="text-xs font-semibold text-[#5A708D]">In Progress</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
