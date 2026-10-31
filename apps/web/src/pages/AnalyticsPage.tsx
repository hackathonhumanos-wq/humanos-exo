/**
 * @file apps/web/src/pages/AnalyticsPage.tsx
 * @description Light-theme Screen Time & Focus Balance Analytics Page connected to live APIs
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Monitor, Clock, Sparkles, ShieldCheck, ArrowRight, Activity } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  DashboardOverviewData,
  WellbeingHealthScore,
} from '../../../../packages/shared-types/src/index.ts';
import { MetricCard } from '../components/ui/MetricCard.tsx';
import { WeeklyFocusAreaChart } from '../components/ui/AnalyticsCharts.tsx';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface AnalyticsPageProps {
  onNavigate?: (page: string) => void;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ onNavigate }) => {
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null);
  const [health, setHealth] = useState<WellbeingHealthScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ov, hs] = await Promise.all([
        apiClient.getOverview(),
        apiClient.getWellbeingHealthScore(),
      ]);
      setOverview(ov);
      setHealth(hs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load screen time analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Screen Time Analytics"
        description="Calculating focus-to-screen ratio and weekly wellbeing balance..."
      />
    );
  }

  if (error || !overview || !health) {
    return (
      <EmptyState
        variant="error"
        title="Screen Time data unavailable"
        description={error || 'Unable to connect to analytics service.'}
        actionLabel="Retry"
        onAction={loadData}
      />
    );
  }

  const productiveRatio = Math.min(
    100,
    Math.round((overview.focusMinutesToday / Math.max(overview.screenMinutesToday, 1)) * 100)
  );
  const weeklyFocusTotalHours = overview.weeklyOverview
    .reduce((acc, d) => acc + d.focusHours, 0)
    .toFixed(1);
  const weeklyScreenTotalHours = overview.weeklyOverview
    .reduce((acc, d) => acc + d.screenHours, 0)
    .toFixed(1);

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Screen Time &amp; Focus Balance
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Compare intentional study sessions against overall browser screen exposure across the week.
          </p>
        </div>
        {onNavigate && (
          <button
            type="button"
            onClick={() => onNavigate('reels')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#E9F9F2] border border-[#E1EEE9] text-xs font-bold text-[#079669] cursor-pointer self-start"
          >
            <span>Open Reels &amp; Shorts Breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Screen Time Today"
          value={`${Math.floor(overview.screenMinutesToday / 60)}h ${overview.screenMinutesToday % 60}m`}
          subtitle="vs last week"
          icon={<Monitor className="w-5 h-5" />}
          iconBgClass="bg-[#EBF3FF] text-[#438CF5]"
          trendText={`↓ ${Math.abs(overview.screenVsLastWeekPercent)}%`}
          trendTone="info"
          sparklineValues={overview.screenSparkline7d}
          sparklineType="bars"
          sparklineColor="#438CF5"
        />

        <MetricCard
          title="Productive Focus Time"
          value={`${Math.floor(overview.focusMinutesToday / 60)}h ${overview.focusMinutesToday % 60}m`}
          subtitle={`${overview.completedSessionsToday} focus sessions today`}
          icon={<Clock className="w-5 h-5" />}
          iconBgClass="bg-[#E9F9F2] text-[#079669]"
          trendText={`↑ ${Math.abs(overview.focusVsLastWeekPercent)}%`}
          trendTone="positive"
          sparklineValues={overview.focusSparkline7d}
          sparklineType="bars"
          sparklineColor="#079669"
        />

        <MetricCard
          title="Focus-to-Screen Share"
          value={`${productiveRatio}%`}
          subtitle="Intentional study share"
          icon={<Activity className="w-5 h-5" />}
          iconBgClass="bg-[#E9F9F2] text-[#079669]"
          progressPercent={productiveRatio}
        />

        <MetricCard
          title="Digital Wellbeing Score"
          value={`${health.overallScore}/100`}
          subtitle="Healthy study rhythm"
          icon={<ShieldCheck className="w-5 h-5" />}
          iconBgClass="bg-[#E9F9F2] text-[#079669]"
          progressPercent={health.overallScore}
        />
      </div>

      {/* Main Weekly Chart */}
      <div className="ff-card p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-[#142647]">
              7-Day Focus Time vs. Total Screen Time
            </h2>
            <p className="text-xs text-[#5A708D] tabular-nums">
              Weekly totals: {weeklyFocusTotalHours}h Focus Time • {weeklyScreenTotalHours}h Screen Time
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-[#334B68]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#079669]" /> Focus Time
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#438CF5]" /> Screen Time
            </span>
          </div>
        </div>
        <WeeklyFocusAreaChart data={overview.weeklyOverview} />
      </div>

      {/* Wellbeing Sub-pillars + Risk Windows */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-6 ff-card p-6 space-y-4">
          <h2 className="font-display text-lg font-bold text-[#142647]">
            Screen Quality Breakdown
          </h2>
          <div className="space-y-4">
            <ProgressBar
              value={health.focusResilience}
              label="Focus Session Continuity"
              tone="emerald"
              showValueLabel
            />
            <ProgressBar
              value={health.shortFormDiscipline}
              label="Short-Form Scroll Restraint"
              tone="blue"
              showValueLabel
            />
            <ProgressBar
              value={health.restorativeSleepHygiene}
              label="Late-Night Screen Wind-Down"
              tone="purple"
              showValueLabel
            />
          </div>
        </div>

        <div className="lg:col-span-6 ff-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#079669]" />
            <h2 className="font-display text-lg font-bold text-[#142647]">
              High-Distraction Time Windows
            </h2>
          </div>
          <div className="space-y-3">
            {health.riskWindows.map((win) => (
              <div
                key={win.timeWindow}
                className="p-3.5 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#142647] tabular-nums">
                    {win.timeWindow}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                    {win.riskLevel} RISK
                  </span>
                </div>
                <p className="text-xs text-[#4A607A]">{win.triggerContext}</p>
                <p className="text-xs font-semibold text-[#079669]">
                  Suggested action: {win.recommendedShield}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
