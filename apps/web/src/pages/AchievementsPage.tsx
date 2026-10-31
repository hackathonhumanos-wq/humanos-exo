/**
 * @file apps/web/src/pages/AchievementsPage.tsx
 * @description Light-theme Achievements & Badges Gallery using reusable AchievementBadge
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Award } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { AchievementItem, BadgeCategory } from '../../../../packages/shared-types/src/index.ts';
import { AchievementBadge } from '../components/ui/AchievementBadge.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const AchievementsPage: React.FC = () => {
  const [achievements, setAchievements] = useState<AchievementItem[]>([]);
  const [unlockedCount, setUnlockedCount] = useState(0);
  const [category, setCategory] = useState<'ALL' | BadgeCategory>('ALL');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBadges = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getAchievements();
      setAchievements(data.achievements);
      setUnlockedCount(data.unlockedCount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load achievements.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBadges();
  }, [loadBadges]);

  const filtered =
    category === 'ALL' ? achievements : achievements.filter((a) => a.category === category);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Achievements &amp; Milestones
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Earn badges for sustained study sessions, multi-day streaks, and mindful digital habits.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#E9F9F2] border border-[#CBEFE0] text-[#079669] text-xs font-bold tabular-nums self-start">
          <Award className="w-4 h-4" />
          <span>
            {unlockedCount} / {achievements.length} Badges Unlocked
          </span>
        </div>
      </div>

      <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-white border border-[#E1EEE9]">
        {(['ALL', 'FOCUS', 'CONSISTENCY', 'WELLBEING', 'SOCIAL'] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
              category === cat ? 'bg-[#079669] text-white' : 'text-[#5A708D] hover:text-[#142647]'
            }`}
          >
            {cat === 'ALL' ? 'All Badges' : cat.charAt(0) + cat.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {loading ? (
        <EmptyState
          variant="loading"
          title="Loading Achievements"
          description="Checking your unlocked badges and milestone progress..."
        />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Achievements unavailable"
          description={error}
          actionLabel="Retry"
          onAction={loadBadges}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <AchievementBadge key={item.id} achievement={item} />
          ))}
        </div>
      )}
    </div>
  );
};
