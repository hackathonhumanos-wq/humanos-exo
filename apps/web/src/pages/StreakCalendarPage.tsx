/**
 * @file apps/web/src/pages/StreakCalendarPage.tsx
 * @description Light-theme Streak Calendar page connected to /api/v1/gamification/streaks
 */
import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Calendar } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { StreakInfo } from '../../../../packages/shared-types/src/index.ts';
import { TrophyBadgeIllustration } from '../components/ui/BrandIllustrations.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const StreakCalendarPage: React.FC = () => {
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStreaks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getStreaks();
      setStreak(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load streak calendar.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStreaks();
  }, [loadStreaks]);

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Streak Calendar"
        description="Retrieving your 28-day study consistency log..."
      />
    );
  }

  if (error || !streak) {
    return (
      <EmptyState
        variant="error"
        title="Streak calendar unavailable"
        description={error || 'Could not load study streak history.'}
        actionLabel="Retry"
        onAction={loadStreaks}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          Study Streak Calendar
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          Consistent daily sessions compound into lasting academic momentum.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="ff-card p-6 flex items-center gap-4">
          <TrophyBadgeIllustration kind="streak_flame" className="w-14 h-14" />
          <div>
            <div className="font-display text-3xl font-extrabold text-[#142647] tabular-nums">
              {streak.currentStreak} Days
            </div>
            <div className="text-xs font-semibold text-[#5A708D]">Current Active Streak</div>
          </div>
        </div>

        <div className="ff-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-3xl font-extrabold text-[#142647] tabular-nums">
              {streak.longestStreak} Days
            </div>
            <div className="text-xs font-semibold text-[#5A708D]">Personal Best Streak</div>
          </div>
        </div>

        <div className="ff-card p-6 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#EBF3FF] text-[#438CF5] flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-lg font-extrabold text-[#142647]">
              {streak.streakFreezeAvailable ? '1 Freeze Ready' : 'Used This Week'}
            </div>
            <div className="text-xs font-semibold text-[#5A708D]">Exam Rest-Day Protection</div>
          </div>
        </div>
      </div>

      <div className="ff-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold text-[#142647]">Last 28 Days Activity</h2>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#5A708D]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#079669]" /> Completed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-[#EBF4F0]" /> Rest / Missed
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {streak.history.map((day) => {
            const completed = day.status === 'COMPLETED' || day.status === 'TODAY';
            return (
              <div
                key={day.date}
                className={`p-3 rounded-2xl border text-center space-y-1 ${
                  completed
                    ? 'bg-[#E9F9F2] border-[#BCEAD7] text-[#079669]'
                    : 'bg-[#F7FCFA] border-[#E1EEE9] text-[#6C819C]'
                }`}
              >
                <div className="text-[11px] font-bold tabular-nums">{day.date.slice(5)}</div>
                <div className="font-display text-sm font-extrabold tabular-nums">
                  {day.focusMinutes}m
                </div>
                <div className="text-[10px]">{day.sessionsCount} sessions</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
