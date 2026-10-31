/**
 * @file apps/web/src/pages/AICoachPage.tsx
 * @description Light-theme AI Focus Coach page with personalized habit guidance and real backend synthesis
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Play, Calendar, ShieldCheck, RefreshCw } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  DashboardOverviewData,
  WellbeingHealthScore,
  MultiAgentSynthesisReport,
} from '../../../../packages/shared-types/src/index.ts';
import { AICoachMascot } from '../components/ui/BrandIllustrations.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface AICoachPageProps {
  onNavigate?: (page: string) => void;
}

export const AICoachPage: React.FC<AICoachPageProps> = ({ onNavigate }) => {
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null);
  const [health, setHealth] = useState<WellbeingHealthScore | null>(null);
  const [synthesis, setSynthesis] = useState<MultiAgentSynthesisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshingBrief, setRefreshingBrief] = useState(false);

  const loadCoach = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ov, hs, report] = await Promise.all([
        apiClient.getOverview(),
        apiClient.getWellbeingHealthScore(),
        apiClient.runSwarmSynthesis(),
      ]);
      setOverview(ov);
      setHealth(hs);
      setSynthesis(report);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load AI Coach briefing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCoach();
  }, [loadCoach]);

  const handleRefreshBrief = async () => {
    try {
      setRefreshingBrief(true);
      const report = await apiClient.runSwarmSynthesis();
      setSynthesis(report);
    } finally {
      setRefreshingBrief(false);
    }
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Preparing your AI Coach Briefing"
        description="Analyzing focus streaks, study pacing, and short-form distraction windows..."
      />
    );
  }

  if (error || !overview || !health) {
    return (
      <EmptyState
        variant="error"
        title="AI Coach temporarily unavailable"
        description={error || 'Unable to load personalized habit guidance.'}
        actionLabel="Retry Briefing"
        onAction={loadCoach}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Coach Hero Card */}
      <div className="ff-card-mint p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-[#CBEFE0] text-[#079669] text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Focus &amp; Habit Coach</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            {overview.coachRecommendation.headline}
          </h1>
          <p className="text-sm text-[#334B68] leading-relaxed">
            {overview.coachRecommendation.detail}
          </p>
          <div className="flex flex-wrap gap-3 pt-1">
            {onNavigate && (
              <>
                <button
                  type="button"
                  onClick={() => onNavigate('focus')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start {overview.coachRecommendation.suggestedDurationMinutes}m Session</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('study-planner')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white hover:bg-[#F7FCFA] border border-[#CBEFE0] text-[#142647] text-xs font-bold cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-[#079669]" />
                  <span>Open Daily Study Plan</span>
                </button>
              </>
            )}
          </div>
        </div>
        <AICoachMascot variant="hero" />
      </div>

      {/* Actionable Habit Interventions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {health.interventions.map((tip, idx) => (
          <div key={idx} className="ff-card p-5 space-y-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-[#079669] uppercase tracking-wider">
              Habit Action #{idx + 1}
            </div>
            <p className="text-sm font-medium text-[#142647] leading-relaxed">{tip}</p>
          </div>
        ))}
      </div>

      {/* Multi-Perspective Study Synthesis */}
      {synthesis && (
        <div className="ff-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-[#142647]">
                Weekly Study &amp; Wellbeing Synthesis (Grade: {synthesis.overallProductivityGrade})
              </h2>
              <p className="text-xs text-[#5A708D] mt-0.5">{synthesis.executiveSummary}</p>
            </div>
            <button
              type="button"
              disabled={refreshingBrief}
              onClick={handleRefreshBrief}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F2FAF6] hover:bg-[#DDF7EC] border border-[#CBEFE0] text-[#079669] text-xs font-bold cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshingBrief ? 'animate-spin' : ''}`} />
              <span>{refreshingBrief ? 'Refreshing...' : 'Refresh Coaching Brief'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {synthesis.agentPerspectives.map((item) => (
              <div
                key={item.agentId}
                className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] space-y-1.5"
              >
                <div className="text-xs font-bold text-[#079669]">{item.agentName}</div>
                <p className="text-xs text-[#334B68] leading-relaxed">{item.keyObservation}</p>
                <p className="text-xs font-semibold text-[#142647] pt-1">
                  Next step: {item.actionableDirective}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
