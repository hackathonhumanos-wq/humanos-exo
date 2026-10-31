/**
 * @file apps/web/src/pages/GoalsPage.tsx
 * @description Light-theme Daily Goals page connected to /api/v1/analytics/goals
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Target, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { UserGoalItem } from '../../../../packages/shared-types/src/index.ts';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.tsx';

interface GoalsPageProps {
  onGoalsChanged?: () => void;
}

export const GoalsPage: React.FC<GoalsPageProps> = ({ onGoalsChanged }) => {
  const [goals, setGoals] = useState<UserGoalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<UserGoalItem['category']>('FOCUS_MINUTES');
  const [targetValue, setTargetValue] = useState(180);
  const [goalToDelete, setGoalToDelete] = useState<UserGoalItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadGoals = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load daily goals.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadGoals();
  }, [loadGoals]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    const res = await apiClient.saveGoal({
      title: title.trim(),
      category,
      targetValue,
      isActive: true,
    });
    setGoals(res.data);
    setTitle('');
    onGoalsChanged?.();
  };

  const handleConfirmDelete = async () => {
    if (!goalToDelete) return;
    const res = await apiClient.deleteGoal(goalToDelete.id);
    setGoals(res.data);
    setGoalToDelete(null);
    onGoalsChanged?.();
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          Daily Study &amp; Wellbeing Goals
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          Set realistic daily study targets and short-form caps tailored to your semester load.
        </p>
      </div>

      {/* Add Goal Card */}
      <form onSubmit={handleCreateGoal} className="ff-card p-6 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        <div className="md:col-span-5">
          <label htmlFor="goal-title" className="block text-xs font-bold text-[#334B68] mb-1.5">
            Goal Title
          </label>
          <input
            id="goal-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Complete 3 Hours of Problem Solving"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-medium text-[#142647]"
            required
          />
        </div>

        <div className="md:col-span-3">
          <label htmlFor="goal-category" className="block text-xs font-bold text-[#334B68] mb-1.5">
            Goal Type
          </label>
          <select
            id="goal-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as UserGoalItem['category'])}
            className="w-full px-3 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-semibold text-[#142647]"
          >
            <option value="FOCUS_MINUTES">Focus Minutes Target</option>
            <option value="STUDY_SESSIONS">Focus Sessions Count</option>
            <option value="REELS_CAP">Reels &amp; Shorts Cap</option>
            <option value="SCREEN_TIME_CAP">Screen Time Cap</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="goal-target" className="block text-xs font-bold text-[#334B68] mb-1.5">
            Target Value
          </label>
          <input
            id="goal-target"
            type="number"
            min={1}
            max={1440}
            value={targetValue}
            onChange={(e) => setTargetValue(Number(e.target.value))}
            className="w-full px-3 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-bold text-[#142647] tabular-nums"
            required
          />
        </div>

        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Goal</span>
          </button>
        </div>
      </form>

      {loading ? (
        <EmptyState
          variant="loading"
          title="Loading Goals"
          description="Syncing your active daily goals..."
        />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Daily goals unavailable"
          description={error}
          actionLabel="Retry"
          onAction={loadGoals}
        />
      ) : goals.length === 0 ? (
        <EmptyState
          variant="empty"
          title="No daily goals configured"
          description="Create your first focus or screen-time goal above."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentValue / Math.max(g.targetValue, 1)) * 100));
            const healthy = g.isInverseCap ? g.currentValue <= g.targetValue : pct >= 70;
            return (
              <div key={g.id} className="ff-card p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-display text-base font-bold text-[#142647]">{g.title}</h2>
                      <div className="text-xs text-[#5A708D] tabular-nums">
                        {g.currentValue} / {g.targetValue} {g.unit}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setGoalToDelete(g)}
                    aria-label={`Delete ${g.title}`}
                    className="p-1.5 rounded-lg text-[#6C819C] hover:text-rose-600 hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <ProgressBar
                  value={pct}
                  label={g.title}
                  tone={healthy ? 'emerald' : 'amber'}
                  showValueLabel
                />

                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#079669]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {g.isInverseCap
                      ? g.currentValue <= g.targetValue
                        ? 'Within healthy daily cap'
                        : 'Over daily cap'
                      : `${pct}% of daily target completed`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(goalToDelete)}
        title="Delete Daily Goal?"
        description={goalToDelete ? `Remove "${goalToDelete.title}" from your active daily goals?` : ''}
        confirmLabel="Delete Goal"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setGoalToDelete(null)}
      />
    </div>
  );
};
