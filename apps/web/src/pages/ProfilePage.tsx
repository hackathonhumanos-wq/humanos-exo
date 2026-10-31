/**
 * @file apps/web/src/pages/ProfilePage.tsx
 * @description Light-theme Student Profile page connected to live overview and gamification APIs
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Award, Flame, Clock, ShieldCheck, Settings } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  DashboardOverviewData,
  LevelProgress,
  StreakInfo,
} from '../../../../packages/shared-types/src/index.ts';
import { StudentAvatar } from '../components/ui/BrandIllustrations.tsx';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null);
  const [levelProgress, setLevelProgress] = useState<LevelProgress | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ov, gam] = await Promise.all([
        apiClient.getOverview(),
        apiClient.getGamificationProfile(),
      ]);
      setOverview(ov);
      setLevelProgress(gam.levelProgress);
      setStreak(gam.streakInfo);
      setUnlockedBadges(gam.unlockedBadges);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load student profile.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Student Profile"
        description="Retrieving your scholar rank, streak record, and focus totals..."
      />
    );
  }

  if (error || !overview || !levelProgress || !streak) {
    return (
      <EmptyState
        variant="error"
        title="Student profile unavailable"
        description={error || 'Could not load profile summary.'}
        actionLabel="Retry"
        onAction={loadProfile}
      />
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-6">
      <div className="ff-card p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <StudentAvatar name={overview.studentFullName} size="xl" isOnline illustratedPortrait />
          <div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669]">
              {overview.studentRoleLabel}
            </span>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647] mt-1">
              {overview.studentFullName}
            </h1>
            <p className="text-xs text-[#5A708D]">
              @adarsh_sharma • Privacy-First Student Account
            </p>
          </div>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('settings')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F2FAF6] hover:bg-[#DDF7EC] border border-[#CBEFE0] text-xs font-bold text-[#079669] cursor-pointer self-start"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Privacy &amp; Settings</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="ff-card p-5 space-y-1">
          <div className="w-9 h-9 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center mb-2">
            <Clock className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl font-extrabold text-[#142647] tabular-nums">
            {Math.floor(overview.focusMinutesToday / 60)}h {overview.focusMinutesToday % 60}m
          </div>
          <div className="text-xs text-[#5A708D]">Focus Logged Today</div>
        </div>

        <div className="ff-card p-5 space-y-1">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2">
            <Flame className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl font-extrabold text-[#142647] tabular-nums">
            {streak.currentStreak} Days
          </div>
          <div className="text-xs text-[#5A708D]">Active Study Streak</div>
        </div>

        <div className="ff-card p-5 space-y-1">
          <div className="w-9 h-9 rounded-xl bg-[#EBF3FF] text-[#438CF5] flex items-center justify-center mb-2">
            <Award className="w-4 h-4" />
          </div>
          <div className="font-display text-2xl font-extrabold text-[#142647] tabular-nums">
            {unlockedBadges} Badges
          </div>
          <div className="text-xs text-[#5A708D]">Milestones Earned</div>
        </div>
      </div>

      <div className="ff-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-[#142647]">
              Scholar XP Progression
            </h2>
            <p className="text-xs text-[#52627D]">
              Level {levelProgress.currentLevel.levelNumber} •{' '}
              {levelProgress.totalXp.toLocaleString()} XP earned
            </p>
          </div>
          <ShieldCheck className="w-5 h-5 text-[#079669]" />
        </div>
        <ProgressBar
          value={levelProgress.progressPercent}
          label="Level XP Progress"
          tone="emerald"
          size="lg"
          showValueLabel
        />
      </div>
    </div>
  );
};
