/**
 * @file apps/web/src/pages/ReelsPage.tsx
 * @description Dedicated Reels & Shorts Analytics Page with ethical estimation disclosure, platform breakdown, user limits, pause controls, coverage status, and data correction
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  PlaySquare,
  Clock,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  PauseCircle,
  Edit3,
  Trash2,
  Info,
  AlertCircle,
  EyeOff,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  ReelsAnalyticsSummary,
  ReelsTrackingHistoryItem,
} from '../../../../packages/shared-types/src/index.ts';
import { MetricCard } from '../components/ui/MetricCard.tsx';
import { PlatformDonutChart, ReelsWeeklyBarChart } from '../components/ui/AnalyticsCharts.tsx';
import { ToggleSwitch, NumberStepper } from '../components/ui/SettingsControls.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.tsx';

interface ReelsPageProps {
  onSettingsChanged?: () => void;
}

export const ReelsPage: React.FC<ReelsPageProps> = ({ onSettingsChanged }) => {
  const [data, setData] = useState<ReelsAnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editable limit form state
  const [dailyInteractionLimit, setDailyInteractionLimit] = useState(60);
  const [dailyMinutesLimit, setDailyMinutesLimit] = useState(35);
  const [gentleNudgeThreshold, setGentleNudgeThreshold] = useState(20);
  const [savingLimits, setSavingLimits] = useState(false);
  const [statusToast, setStatusToast] = useState<string | null>(null);

  // Data correction controls state
  const [editingEntry, setEditingEntry] = useState<ReelsTrackingHistoryItem | null>(null);
  const [adjustedCount, setAdjustedCount] = useState<number>(0);
  const [correctionReason, setCorrectionReason] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<ReelsTrackingHistoryItem | null>(null);

  const fetchReelsAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await apiClient.getReelsAnalytics();
      setData(summary);
      setDailyInteractionLimit(summary.settings.dailyInteractionLimit);
      setDailyMinutesLimit(summary.settings.dailyMinutesLimit);
      setGentleNudgeThreshold(summary.settings.gentleNudgeThreshold);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load Reels & Shorts analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReelsAnalytics();
  }, [fetchReelsAnalytics]);

  const handleSaveSettings = async () => {
    try {
      setSavingLimits(true);
      const res = await apiClient.updateReelsSettings({
        dailyInteractionLimit,
        dailyMinutesLimit,
        gentleNudgeThreshold,
      });
      setStatusToast(res.message || 'Daily limits saved.');
      await fetchReelsAnalytics();
      onSettingsChanged?.();
    } catch (err) {
      setStatusToast(err instanceof Error ? err.message : 'Could not update settings.');
    } finally {
      setSavingLimits(false);
    }
  };

  const handleToggleTracking = async (nextActive: boolean) => {
    const nextPaused = !nextActive;
    try {
      const currentConsent = await apiClient.getPrivacyConsent();
      await Promise.all([
        apiClient.updateReelsSettings({ trackingPaused: nextPaused }),
        apiClient.updatePrivacyConsent({ ...currentConsent, trackingPaused: nextPaused }),
      ]);
      setStatusToast(
        nextPaused
          ? 'Short-form estimation paused. No new scroll interactions will be logged.'
          : 'Short-form estimation resumed.'
      );
      await fetchReelsAnalytics();
      onSettingsChanged?.();
    } catch (err) {
      setStatusToast(err instanceof Error ? err.message : 'Unable to toggle tracking.');
    }
  };

  const handleApplyAdjustment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry) return;
    try {
      const res = await apiClient.correctReelsHistory({
        historyId: editingEntry.id,
        action: 'ADJUST',
        adjustedInteractions: Math.max(0, adjustedCount),
        reason: correctionReason.trim() || undefined,
      });
      setData(res.data);
      setStatusToast(res.message || 'Interaction estimate corrected.');
      setEditingEntry(null);
      setCorrectionReason('');
    } catch (err) {
      setStatusToast(err instanceof Error ? err.message : 'Failed to adjust record.');
    }
  };

  const handleConfirmDeleteHistory = async () => {
    if (!deleteTarget) return;
    try {
      const res = await apiClient.correctReelsHistory({
        historyId: deleteTarget.id,
        action: 'DELETE',
      });
      setData(res.data);
      setStatusToast(res.message || 'Tracking history entry removed.');
      setDeleteTarget(null);
    } catch (err) {
      setStatusToast(err instanceof Error ? err.message : 'Failed to remove entry.');
    }
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Reels & Shorts Analytics"
        description="Retrieving platform-wise short-form scroll estimations, daily limits, and coverage status..."
      />
    );
  }

  if (error || !data) {
    return (
      <EmptyState
        variant="error"
        title="Unable to load Reels & Shorts analytics"
        description={error || 'Analytics endpoint did not respond.'}
        actionLabel="Retry Sync"
        onAction={fetchReelsAnalytics}
      />
    );
  }

  const totalReelsEst = data.todayEstimatedReels + data.todayEstimatedFacebookReels;
  const limitPercent = Math.min(
    100,
    Math.round((data.todayTotalEstimatedInteractions / Math.max(data.settings.dailyInteractionLimit, 1)) * 100)
  );

  return (
    <div className="space-y-6 pb-6">
      {/* Page Header & Ethical Estimation Disclosure */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E9F9F2] border border-[#CBEFE0] text-[#079669] text-xs font-bold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ethical Non-Intrusive Estimation • Never Exact Video Views</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647] tracking-tight">
            Reels &amp; Shorts Analytics
          </h1>
          <p className="text-sm text-[#4A607A] mt-1 max-w-2xl">
            Understand short-form scroll patterns across Instagram Reels, YouTube Shorts, and Facebook Reels without invasive screen recording or private API scraping.
          </p>
        </div>

        {/* Immediate Pause / Resume Tracking Switch */}
        <div className="ff-card px-4 py-3 flex items-center gap-4 self-start">
          <div>
            <div className="text-xs font-bold text-[#142647]">
              {data.settings.trackingPaused ? 'Estimation Paused' : 'Estimation Active'}
            </div>
            <div className="text-[11px] text-[#5A708D]">
              {data.settings.trackingPaused
                ? 'Paused by you — zero events recorded'
                : 'Local URL & scroll cadence estimation'}
            </div>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={!data.settings.trackingPaused}
            aria-label="Toggle short-form video estimation"
            onClick={() => handleToggleTracking(data.settings.trackingPaused)}
            className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent transition-colors cursor-pointer ${
              !data.settings.trackingPaused ? 'bg-[#079669]' : 'bg-amber-400'
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                !data.settings.trackingPaused ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Status Feedback Toast */}
      {statusToast && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-[#E9F9F2] border border-[#BCEAD7] text-[#067652] text-xs font-semibold flex items-center justify-between gap-3"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#079669] shrink-0" />
            <span>{statusToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setStatusToast(null)}
            className="text-[#079669] font-bold underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Unavailable / Paused State Banner */}
      {data.settings.trackingPaused && (
        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <PauseCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h2 className="text-sm font-bold text-amber-900">
                Live Short-Form Estimation is Currently Paused
              </h2>
              <p className="text-xs text-amber-800 mt-0.5">
                Historical summaries remain visible below, and no new browser route transitions are being counted while paused.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleToggleTracking(true)}
            className="px-4 py-2 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold shrink-0 cursor-pointer"
          >
            Resume Estimation
          </button>
        </div>
      )}

      {/* Top 4 KPI Summary Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Estimated Reels Interactions"
          value={String(totalReelsEst)}
          subtitle={`IG (${data.todayEstimatedReels}) + FB (${data.todayEstimatedFacebookReels}) today`}
          infoTooltip="Estimated from /reels/* URL navigation and vertical scroll cadence. Not exact video views."
          icon={<PlaySquare className="w-5 h-5" />}
          iconBgClass="bg-violet-50 text-[#7C5CFC]"
          trendText={`↓ ${Math.abs(data.vsLastWeekPercent)}%`}
          trendTone="positive"
          sparklineValues={data.sparkline7d}
          sparklineType="line"
          sparklineColor="#7C5CFC"
        />

        <MetricCard
          title="Estimated Shorts Interactions"
          value={String(data.todayEstimatedShorts)}
          subtitle="YouTube /shorts/* transitions today"
          infoTooltip="Estimated when navigating between YouTube /shorts/* URLs in desktop browser tabs."
          icon={<PlaySquare className="w-5 h-5" />}
          iconBgClass="bg-rose-50 text-rose-600"
          sparklineValues={data.dailyTrends.map((d) => d.shortsEstimated)}
          sparklineType="bars"
          sparklineColor="#EF4444"
        />

        <MetricCard
          title="Estimated Time Spent"
          value={`~${data.todayEstimatedMinutes}m`}
          subtitle={`~${data.weeklyEstimatedMinutes}m across last 7 days`}
          icon={<Clock className="w-5 h-5" />}
          iconBgClass="bg-[#EBF3FF] text-[#438CF5]"
          sparklineValues={data.dailyTrends.map((d) => d.estimatedMinutes)}
          sparklineType="bars"
          sparklineColor="#438CF5"
        />

        <MetricCard
          title="Daily Limit Progress"
          value={`${data.todayTotalEstimatedInteractions} / ${data.settings.dailyInteractionLimit}`}
          subtitle={
            limitPercent < 85
              ? `${100 - limitPercent}% headroom remaining`
              : 'Approaching your daily cap'
          }
          icon={<Sliders className="w-5 h-5" />}
          iconBgClass="bg-[#E9F9F2] text-[#079669]"
          progressPercent={limitPercent}
        />
      </section>

      {/* Trends & Platform Breakdown */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 ff-card p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="font-display text-lg font-bold text-[#142647]">
                Daily &amp; Weekly Interaction Trends
              </h2>
              <p className="text-xs text-[#5A708D]">
                Click any day bar to inspect platform-specific estimated interactions and time spent.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold text-[#4A607A]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#7C5CFC]" /> Instagram
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]" /> YouTube
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#438CF5]" /> Facebook
              </span>
            </div>
          </div>

          <ReelsWeeklyBarChart
            trends={data.dailyTrends}
            dailyLimit={data.settings.dailyInteractionLimit}
          />
        </div>

        {/* Platform-wise Breakdown + Detection Confidence */}
        <div className="lg:col-span-5 ff-card p-6 space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-[#142647]">
                Platform Breakdown &amp; Confidence
              </h2>
              <p className="text-xs text-[#5A708D]">
                Share of today&apos;s {data.todayTotalEstimatedInteractions} estimated interactions
              </p>
            </div>
            <PlatformDonutChart platforms={data.platformBreakdown} size={86} />
          </div>

          <div className="space-y-3">
            {data.platformBreakdown.map((p) => (
              <div
                key={p.platform}
                className="p-3.5 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full shrink-0"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="text-sm font-bold text-[#142647]">{p.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      p.confidence === 'HIGH'
                        ? 'bg-[#DDF7EC] text-[#079669]'
                        : 'bg-[#EBF3FF] text-[#2563EB]'
                    }`}
                  >
                    {p.confidence} CONFIDENCE
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-[#334B68] tabular-nums">
                  <span>
                    <strong>{p.estimatedInteractions}</strong> est. interactions (~{p.estimatedMinutes}m)
                  </span>
                  <span className="font-bold text-[#142647]">{p.sharePercent}% share</span>
                </div>

                <p className="text-[11px] text-[#5A708D]">Signal: {p.detectionMethod}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* User-Defined Limits + Coverage & Permission Status */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* User-Defined Daily Limits */}
        <div className="lg:col-span-6 ff-card p-6 space-y-4">
          <div>
            <h2 className="font-display text-lg font-bold text-[#142647]">
              User-Defined Daily Limits
            </h2>
            <p className="text-xs text-[#5A708D]">
              Configure gentle study nudges and daily short-form caps tailored to your schedule.
            </p>
          </div>

          <div className="divide-y divide-[#E1EEE9]">
            <NumberStepper
              label="Daily Interaction Cap"
              description="Estimated Reels + Shorts interactions before soft study shield activates."
              value={dailyInteractionLimit}
              min={5}
              max={300}
              step={5}
              unit="est."
              onChange={setDailyInteractionLimit}
            />
            <NumberStepper
              label="Daily Time Budget"
              description="Target maximum minutes spent on short-form feeds per day."
              value={dailyMinutesLimit}
              min={5}
              max={180}
              step={5}
              unit="min"
              onChange={setDailyMinutesLimit}
            />
            <NumberStepper
              label="Gentle Nudge Cadence"
              description="Show a friendly breathing prompt every N estimated transitions."
              value={gentleNudgeThreshold}
              min={5}
              max={100}
              step={5}
              unit="est."
              onChange={setGentleNudgeThreshold}
            />
            <ToggleSwitch
              id="reels-pause-toggle"
              checked={!data.settings.trackingPaused}
              onChange={(active) => handleToggleTracking(active)}
              label="Enable Browser Short-Form Estimation"
              description="You can pause or resume local route estimation at any moment."
            />
          </div>

          <button
            type="button"
            disabled={savingLimits}
            onClick={handleSaveSettings}
            className="w-full py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
          >
            {savingLimits ? 'Saving Limits...' : 'Save Daily Limits'}
          </button>
        </div>

        {/* Tracking Coverage & Permission Status */}
        <div className="lg:col-span-6 ff-card p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-display text-lg font-bold text-[#142647]">
                  Tracking Coverage &amp; Permission Status
                </h2>
                <p className="text-xs text-[#5A708D]">
                  Transparent visibility into where estimation works and what is never collected.
                </p>
              </div>
              <span
                className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${
                  data.coverage.permissionStatus === 'PAUSED_BY_USER'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-[#E9F9F2] text-[#079669] border border-[#CBEFE0]'
                }`}
              >
                {data.coverage.permissionStatus === 'PAUSED_BY_USER'
                  ? 'PAUSED BY USER'
                  : 'DEMO + EXTENSION READY'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-2xl bg-[#F2FAF6] border border-[#CBEFE0] space-y-1.5">
                <div className="text-xs font-bold text-[#079669]">Supported Browser Contexts</div>
                <ul className="space-y-1 text-xs text-[#253858]">
                  {data.coverage.supportedPlatforms.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#079669] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] space-y-1.5">
                <div className="text-xs font-bold text-[#4A607A]">Not Tracked (Privacy Boundary)</div>
                <ul className="space-y-1 text-xs text-[#5A708D]">
                  {data.coverage.unsupportedContexts.map((item) => (
                    <li key={item} className="flex items-start gap-1.5">
                      <EyeOff className="w-3.5 h-3.5 text-[#6C819C] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] flex items-start gap-3">
            <Info className="w-4 h-4 text-[#079669] shrink-0 mt-0.5" />
            <p className="text-xs text-[#4A607A] leading-relaxed">
              {data.coverage.ethicalDisclaimer}
            </p>
          </div>
        </div>
      </section>

      {/* Tracking History & Data Correction Controls */}
      <section className="ff-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-lg font-bold text-[#142647]">
              Tracking History &amp; Data Correction Controls
            </h2>
            <p className="text-xs text-[#5A708D]">
              Left a tab open in the background? Adjust or delete any estimated interaction batch so your analytics stay fair and accurate.
            </p>
          </div>
          <span className="text-xs font-semibold text-[#5A708D] tabular-nums">
            {data.history.length} recent batches
          </span>
        </div>

        {/* Inline Adjustment Form when an entry is selected */}
        {editingEntry && (
          <form
            onSubmit={handleApplyAdjustment}
            className="p-4 rounded-2xl bg-[#F2FAF6] border border-[#BCEAD7] space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#079669]">
                Correcting Estimate: {editingEntry.platformLabel} ({editingEntry.estimatedInteractions} est.)
              </span>
              <button
                type="button"
                onClick={() => setEditingEntry(null)}
                className="text-xs font-semibold text-[#4A607A] hover:text-[#142647] cursor-pointer"
              >
                Cancel
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label htmlFor="adjust-count-input" className="block text-[11px] font-bold text-[#334B68] mb-1">
                  Corrected Estimated Interactions
                </label>
                <input
                  id="adjust-count-input"
                  type="number"
                  min={0}
                  max={500}
                  value={adjustedCount}
                  onChange={(e) => setAdjustedCount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-[#CBEFE0] text-sm font-bold text-[#142647] tabular-nums"
                  required
                />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="adjust-reason-input" className="block text-[11px] font-bold text-[#334B68] mb-1">
                  Optional Note (e.g., Tab left idle while taking notes)
                </label>
                <div className="flex gap-2">
                  <input
                    id="adjust-reason-input"
                    type="text"
                    value={correctionReason}
                    onChange={(e) => setCorrectionReason(e.target.value)}
                    placeholder="Reason for correction (optional)"
                    className="flex-1 px-3 py-2 rounded-xl bg-white border border-[#CBEFE0] text-xs text-[#142647]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold cursor-pointer"
                  >
                    Apply Correction
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}

        {data.history.length === 0 ? (
          <EmptyState
            variant="empty"
            title="No short-form sessions recorded"
            description="You have zero estimated short-form batches in your log. Great focus consistency!"
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E1EEE9] text-[11px] font-bold uppercase tracking-wider text-[#5A708D]">
                  <th className="py-3 pr-4">Platform</th>
                  <th className="py-3 px-4">Detection Signal</th>
                  <th className="py-3 px-4">Confidence</th>
                  <th className="py-3 px-4 text-right">Est. Interactions</th>
                  <th className="py-3 px-4 text-right">Est. Time</th>
                  <th className="py-3 pl-4 text-right">Correction Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E1EEE9] text-xs">
                {data.history.map((item) => (
                  <tr key={item.id} className="hover:bg-[#F7FCFA]">
                    <td className="py-3.5 pr-4 font-semibold text-[#142647]">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>{item.platformLabel}</span>
                        {item.isDemo && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EBF3FF] text-[#2563EB]">
                            [DEMO]
                          </span>
                        )}
                        {item.correctedByUser && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#DDF7EC] text-[#079669]">
                            Corrected
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-[#6C819C] font-normal tabular-nums mt-0.5">
                        {new Date(item.detectedAt).toLocaleString([], {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-[#4A607A] max-w-xs">{item.detectionSignal}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.confidence === 'HIGH'
                            ? 'bg-[#DDF7EC] text-[#079669]'
                            : 'bg-[#EBF3FF] text-[#2563EB]'
                        }`}
                      >
                        {item.confidence}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#142647] tabular-nums">
                      {item.estimatedInteractions} est.
                    </td>
                    <td className="py-3.5 px-4 text-right text-[#4A607A] tabular-nums">
                      ~{item.estimatedMinutes}m
                    </td>
                    <td className="py-3.5 pl-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingEntry(item);
                            setAdjustedCount(item.estimatedInteractions);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#E9F9F2] border border-[#E1EEE9] text-[#079669] font-semibold cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Adjust</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(item)}
                          aria-label={`Delete ${item.platformLabel} entry`}
                          className="p-1.5 rounded-lg bg-white hover:bg-rose-50 border border-[#E1EEE9] text-rose-600 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pt-2 flex items-center gap-2 text-[11px] text-[#6C819C]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>
            Entries marked [DEMO] represent baseline sample events seeded for web preview when the Chrome Extension is not actively streaming tab route updates.
          </span>
        </div>
      </section>

      <ConfirmDialog
        isOpen={Boolean(deleteTarget)}
        title="Remove Estimated Tracking Batch?"
        description={
          deleteTarget
            ? `This will remove the ${deleteTarget.platformLabel} batch (${deleteTarget.estimatedInteractions} estimated interactions) from your daily analytics total.`
            : ''
        }
        confirmLabel="Remove Batch"
        tone="danger"
        onConfirm={handleConfirmDeleteHistory}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};
