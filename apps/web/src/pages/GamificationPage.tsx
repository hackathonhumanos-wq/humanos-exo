/**
 * @file apps/web/src/pages/GamificationPage.tsx
 * @description Light-theme XP & Level Progression page connected to /api/v1/gamification/*
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Star, Sparkles } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  LevelProgress,
  StudentLevel,
  XPTransactionRecord,
} from '../../../../packages/shared-types/src/index.ts';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface GamificationPageProps {
  onXpUpdated?: () => void;
}

export const GamificationPage: React.FC<GamificationPageProps> = ({ onXpUpdated }) => {
  const [levelProgress, setLevelProgress] = useState<LevelProgress | null>(null);
  const [levels, setLevels] = useState<StudentLevel[]>([]);
  const [history, setHistory] = useState<XPTransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profile, tx] = await Promise.all([
        apiClient.getGamificationProfile(),
        apiClient.getXpHistory(),
      ]);
      setLevelProgress(profile.levelProgress);
      setLevels(profile.levelsReference);
      setHistory(tx.transactions);
      onXpUpdated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load XP progression.');
    } finally {
      setLoading(false);
    }
  }, [onXpUpdated]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading XP & Level Progression"
        description="Retrieving your student XP ledger and level roadmap..."
      />
    );
  }

  if (error || !levelProgress) {
    return (
      <EmptyState
        variant="error"
        title="XP profile unavailable"
        description={error || 'Could not load student XP ledger.'}
        actionLabel="Retry"
        onAction={loadData}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          XP &amp; Level Progression
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          Every completed focus session, daily goal, and mindful short-form day builds your scholar rank.
        </p>
      </div>

      <div className="ff-card-mint p-6 sm:p-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#CBEFE0] flex items-center justify-center">
              <Star className="w-6 h-6 fill-amber-400 text-amber-500" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#079669] uppercase tracking-wider">
                Current Rank
              </div>
              <h2 className="font-display text-2xl font-extrabold text-[#142447]">
                Level {levelProgress.currentLevel.levelNumber} •{' '}
                {levelProgress.currentLevel.title}
              </h2>
            </div>
          </div>
          <div className="text-right tabular-nums">
            <div className="font-display text-2xl font-extrabold text-[#079669]">
              {levelProgress.totalXp.toLocaleString()} XP
            </div>
            <div className="text-xs text-[#52627D]">
              {levelProgress.nextLevel
                ? `Next tier at ${levelProgress.nextLevel.minXp.toLocaleString()} XP`
                : 'Maximum tier reached'}
            </div>
          </div>
        </div>

        <ProgressBar
          value={levelProgress.progressPercent}
          label="Level XP Progress"
          tone="emerald"
          size="lg"
          showValueLabel
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 ff-card p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-[#142647]">Recent XP Activity</h3>
          <div className="divide-y divide-[#E1EEE9]">
            {history.map((tx) => (
              <div key={tx.id} className="py-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#142647]">{tx.description}</div>
                    <div className="text-[11px] text-[#6C819C] tabular-nums">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#079669] tabular-nums shrink-0">
                  +{tx.amount} XP
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 ff-card p-6 space-y-4">
          <h3 className="font-display text-lg font-bold text-[#142647]">Scholar Level Tiers</h3>
          <div className="space-y-2.5">
            {levels.map((lvl) => {
              const unlocked = levelProgress.totalXp >= lvl.minXp;
              return (
                <div
                  key={lvl.levelNumber}
                  className={`p-3 rounded-2xl border flex items-center justify-between ${
                    unlocked
                      ? 'bg-[#F2FAF6] border-[#CBEFE0]'
                      : 'bg-[#F7FCFA] border-[#E1EEE9] opacity-75'
                  }`}
                >
                  <div>
                    <div className="text-xs font-bold text-[#142647]">
                      Tier {lvl.levelNumber}: {lvl.title}
                    </div>
                    <div className="text-[11px] text-[#5A708D] tabular-nums">
                      {lvl.minXp.toLocaleString()} XP required
                    </div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      unlocked ? 'bg-[#079669] text-white' : 'bg-white text-[#6C819C]'
                    }`}
                  >
                    {unlocked ? 'Reached' : 'Locked'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
