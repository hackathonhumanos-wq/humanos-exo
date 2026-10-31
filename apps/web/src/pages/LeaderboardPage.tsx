/**
 * @file apps/web/src/pages/LeaderboardPage.tsx
 * @description Light-theme Student Leaderboards with Global/Friends/Groups scopes and opt-in privacy toggle
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Medal, Crown, ShieldCheck } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  LeaderboardEntry,
  LeaderboardMetric,
  LeaderboardScope,
} from '../../../../packages/shared-types/src/index.ts';
import { StudentAvatar } from '../components/ui/BrandIllustrations.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const LeaderboardPage: React.FC = () => {
  const [scope, setScope] = useState<LeaderboardScope>('GLOBAL');
  const [metric, setMetric] = useState<LeaderboardMetric>('WEEKLY_XP');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isOptedIn, setIsOptedIn] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBoard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getLeaderboard(scope, metric);
      setEntries(data.entries);
      setIsOptedIn(data.isOptedIn);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load leaderboard.');
    } finally {
      setLoading(false);
    }
  }, [scope, metric]);

  useEffect(() => {
    fetchBoard();
  }, [fetchBoard]);

  const handleToggleOptIn = async () => {
    const next = !isOptedIn;
    setIsOptedIn(next);
    await apiClient.setLeaderboardPrivacy(next);
    await fetchBoard();
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Focus Leaderboards
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Celebrate study consistency across peers. Participation is 100% opt-in.
          </p>
        </div>

        <button
          type="button"
          onClick={handleToggleOptIn}
          className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-bold cursor-pointer self-start ${
            isOptedIn
              ? 'bg-[#E9F9F2] border-[#CBEFE0] text-[#079669]'
              : 'bg-white border-[#E1EEE9] text-[#5A708D]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{isOptedIn ? 'Visible on Leaderboard (Opted In)' : 'Hidden from Leaderboard'}</span>
        </button>
      </div>

      {/* Scope + Metric Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E1EEE9]">
          {(['GLOBAL', 'FRIENDS', 'GROUPS'] as LeaderboardScope[]).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setScope(s)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                scope === s ? 'bg-[#079669] text-white' : 'text-[#5A708D] hover:text-[#142647]'
              }`}
            >
              {s === 'GLOBAL' ? 'Campus Global' : s === 'FRIENDS' ? 'Friends' : 'Study Groups'}
            </button>
          ))}
        </div>

        <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E1EEE9]">
          {(
            [
              { id: 'WEEKLY_XP', label: 'Weekly XP' },
              { id: 'MONTHLY_FOCUS', label: 'Focus Hours' },
              { id: 'STREAK_DAYS', label: 'Streak Days' },
            ] as { id: LeaderboardMetric; label: string }[]
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMetric(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                metric === m.id
                  ? 'bg-[#DDF7EC] text-[#079669]'
                  : 'text-[#5A708D] hover:text-[#142647]'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <EmptyState
          variant="loading"
          title="Loading Leaderboard"
          description="Ranking opted-in students for this period..."
        />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Leaderboard unavailable"
          description={error}
          actionLabel="Retry"
          onAction={fetchBoard}
        />
      ) : entries.length === 0 ? (
        <EmptyState
          variant="empty"
          title="No entries in this view"
          description="Opt in above or connect with friends to populate this leaderboard."
        />
      ) : (
        <div className="ff-card overflow-hidden">
          <div className="divide-y divide-[#E1EEE9]">
            {entries.map((entry) => (
              <div
                key={entry.userId}
                className={`px-5 py-4 flex items-center justify-between gap-4 ${
                  entry.isCurrentUser ? 'bg-[#EAF9F2]' : 'bg-white hover:bg-[#F7FCFA]'
                }`}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-8 text-center font-display font-extrabold text-sm tabular-nums text-[#142647] shrink-0">
                    {entry.rank === 1 ? (
                      <Crown className="w-5 h-5 text-amber-500 mx-auto" />
                    ) : entry.rank <= 3 ? (
                      <Medal className="w-5 h-5 text-[#438CF5] mx-auto" />
                    ) : (
                      `#${entry.rank}`
                    )}
                  </div>
                  <StudentAvatar name={entry.displayName} avatarUrl={entry.avatarUrl} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#142647] truncate">
                        {entry.displayName}
                      </span>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#079669] text-white">
                          You
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5A708D] truncate">
                      @{entry.username} • Level {entry.level}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-display text-base font-extrabold text-[#079669] tabular-nums">
                    {entry.score.toLocaleString()} {entry.unit}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
