/**
 * @file apps/web/src/pages/WellbeingInsightsPage.tsx
 * @description Light-theme Wellbeing Intelligence page connected to /api/v1/wellbeing/health-score
 */
import React, { useState, useEffect, useCallback } from 'react';
import { HeartHandshake, ShieldCheck, ArrowRight, Info } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { WellbeingHealthScore } from '../../../../packages/shared-types/src/index.ts';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface WellbeingInsightsPageProps {
  onNavigate?: (page: string) => void;
}

export const WellbeingInsightsPage: React.FC<WellbeingInsightsPageProps> = ({ onNavigate }) => {
  const [score, setScore] = useState<WellbeingHealthScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadScore = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.getWellbeingHealthScore();
      setScore(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load wellbeing insights.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadScore();
  }, [loadScore]);

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Wellbeing Insights"
        description="Evaluating focus resilience, rest hygiene, and short-form discipline..."
      />
    );
  }

  if (error || !score) {
    return (
      <EmptyState
        variant="error"
        title="Wellbeing insights unavailable"
        description={error || 'Could not calculate digital wellbeing score.'}
        actionLabel="Retry"
        onAction={loadScore}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Digital Wellbeing Insights
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Holistic balance across study endurance, sleep wind-down, and mindful feed habits.
          </p>
        </div>

        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('reels')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-[#E1EEE9] text-xs font-bold text-[#079669] cursor-pointer self-start"
          >
            <span>Reels &amp; Shorts Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      <div className="ff-card-mint p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-[#079669]">
            <HeartHandshake className="w-4 h-4" />
            <span>Overall Student Wellbeing Index</span>
          </div>
          <div className="font-display text-4xl font-extrabold text-[#142647] tabular-nums">
            {score.overallScore} / 100
          </div>
          <p className="text-xs text-[#334B68] leading-relaxed">{score.disclaimer}</p>
        </div>

        <div className="w-full md:w-72 space-y-3 bg-white/80 p-4 rounded-2xl border border-[#CBEFE0]">
          <ProgressBar
            value={score.focusResilience}
            label="Focus Resilience"
            tone="emerald"
            size="sm"
            showValueLabel
          />
          <ProgressBar
            value={score.restorativeSleepHygiene}
            label="Restorative Sleep Hygiene"
            tone="blue"
            size="sm"
            showValueLabel
          />
          <ProgressBar
            value={score.shortFormDiscipline}
            label="Short-Form Discipline"
            tone="purple"
            size="sm"
            showValueLabel
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="ff-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#142647]">
            Detected Distraction Risk Windows
          </h2>
          <div className="space-y-3">
            {score.riskWindows.map((w) => (
              <div
                key={w.timeWindow}
                className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142647] tabular-nums">{w.timeWindow}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {w.riskLevel}
                  </span>
                </div>
                <p className="text-xs text-[#4A607A]">{w.triggerContext}</p>
                <p className="text-xs font-semibold text-[#079669]">
                  Guardrail: {w.recommendedShield}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="ff-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#142647]">
            Evidence-Based Habit Adjustments
          </h2>
          <div className="space-y-3">
            {score.interventions.map((tip, i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-[#F2FAF6] border border-[#CBEFE0] flex items-start gap-3"
              >
                <ShieldCheck className="w-4 h-4 text-[#079669] shrink-0 mt-0.5" />
                <p className="text-xs text-[#142647] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] flex items-center gap-2 text-[11px] text-[#5A708D]">
            <Info className="w-4 h-4 text-[#079669] shrink-0" />
            <span>Weekly short-form interactions are estimated locally and never exact view counts.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
