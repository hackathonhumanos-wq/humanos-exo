/**
 * @file apps/web/src/pages/SettingsPage.tsx
 * @description Light-theme Privacy, Consent & Tracking Settings Page with easy-to-find pause controls
 */
import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Lock, CheckCircle2, Sliders } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  PrivacyConsentState,
  ReelsSettingsState,
} from '../../../../packages/shared-types/src/index.ts';
import { ToggleSwitch, NumberStepper } from '../components/ui/SettingsControls.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface SettingsPageProps {
  onSettingsUpdated?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onSettingsUpdated }) => {
  const [privacy, setPrivacy] = useState<PrivacyConsentState | null>(null);
  const [reelsSettings, setReelsSettings] = useState<ReelsSettingsState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [priv, reels] = await Promise.all([
        apiClient.getPrivacyConsent(),
        apiClient.getReelsAnalytics(),
      ]);
      setPrivacy(priv);
      setReelsSettings(reels.settings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load privacy settings.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const handleSaveAll = async () => {
    if (!privacy || !reelsSettings) return;
    try {
      setSaving(true);
      await Promise.all([
        apiClient.updatePrivacyConsent({
          consentShareWithParent: privacy.consentShareWithParent,
          consentShareWithCounsellor: privacy.consentShareWithCounsellor,
          consentExtensionTelemetry: privacy.consentExtensionTelemetry,
          consentAiProductivityAnalysis: privacy.consentAiProductivityAnalysis,
          trackingPaused: privacy.trackingPaused,
        }),
        apiClient.updateReelsSettings({
          dailyInteractionLimit: reelsSettings.dailyInteractionLimit,
          dailyMinutesLimit: reelsSettings.dailyMinutesLimit,
          gentleNudgeThreshold: reelsSettings.gentleNudgeThreshold,
          trackingPaused: privacy.trackingPaused,
        }),
      ]);
      setSavedNotice('Your privacy preferences and tracking controls have been saved.');
      onSettingsUpdated?.();
    } catch (err) {
      setSavedNotice(err instanceof Error ? err.message : 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Privacy & Settings"
        description="Fetching your student consent and tracking preferences..."
      />
    );
  }

  if (error || !privacy || !reelsSettings) {
    return (
      <EmptyState
        variant="error"
        title="Settings temporarily unavailable"
        description={error || 'Could not load privacy preferences.'}
        actionLabel="Retry"
        onAction={loadSettings}
      />
    );
  }

  return (
    <div className="max-w-4xl space-y-6 pb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          Privacy &amp; App Settings
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          You own your study data. Pause activity estimation anytime or customize opt-in sharing permissions.
        </p>
      </div>

      {savedNotice && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-[#E9F9F2] border border-[#BCEAD7] text-[#067652] text-xs font-semibold flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#079669]" />
            <span>{savedNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => setSavedNotice(null)}
            className="underline font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Master Pause Tracking Card */}
      <section className="ff-card p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[#142647]">
              Activity Tracking &amp; Pause Control
            </h2>
            <p className="text-xs text-[#5A708D]">
              Pause all short-form scroll and screen-time estimation immediately whenever you want private downtime.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#E1EEE9] pt-2">
          <ToggleSwitch
            id="pause-all-tracking"
            checked={privacy.trackingPaused}
            onChange={(paused) => setPrivacy({ ...privacy, trackingPaused: paused })}
            label="Pause All Activity Tracking"
            badge={privacy.trackingPaused ? 'CURRENTLY PAUSED' : 'TRACKING ACTIVE'}
            description="When enabled, FOCUSFLOW pauses browser extension telemetry and short-form estimation until you resume."
          />

          <ToggleSwitch
            id="extension-telemetry"
            checked={privacy.consentExtensionTelemetry}
            onChange={(val) => setPrivacy({ ...privacy, consentExtensionTelemetry: val })}
            label="Allow Local Browser Route Estimation"
            description="Estimates time spent on distracting domains without recording URLs, messages, screenshots, or keystrokes."
          />

          <ToggleSwitch
            id="ai-analysis-consent"
            checked={privacy.consentAiProductivityAnalysis}
            onChange={(val) => setPrivacy({ ...privacy, consentAiProductivityAnalysis: val })}
            label="Personalized AI Coach Study Suggestions"
            description="Allows FOCUSFLOW to recommend study breaks and focus session lengths using your daily aggregates."
          />
        </div>
      </section>

      {/* Explicit Student Opt-In Sharing (AGENTS.md Rule 10) */}
      <section className="ff-card p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EBF3FF] text-[#438CF5] flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[#142647]">
              Parent &amp; Counsellor Sharing (Explicit Opt-In)
            </h2>
            <p className="text-xs text-[#5A708D]">
              Disabled by default. Only weekly high-level focus totals are shared if you explicitly opt in.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#E1EEE9] pt-2">
          <ToggleSwitch
            id="share-parent"
            checked={privacy.consentShareWithParent}
            onChange={(val) => setPrivacy({ ...privacy, consentShareWithParent: val })}
            label="Share Weekly Focus Summary with Parent / Guardian"
            description="Shares weekly study hours and streak milestones only. Browsing history is never shared."
          />

          <ToggleSwitch
            id="share-counsellor"
            checked={privacy.consentShareWithCounsellor}
            onChange={(val) => setPrivacy({ ...privacy, consentShareWithCounsellor: val })}
            label="Contribute Anonymized Aggregates to Campus Counsellor Cohort"
            description="Protected by k-anonymity thresholds so individual student activity cannot be singled out."
          />
        </div>
      </section>

      {/* Short-Form Limits */}
      <section className="ff-card p-6 space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-display text-lg font-bold text-[#142647]">
              Short-Form Video Daily Guardrails
            </h2>
            <p className="text-xs text-[#5A708D]">
              Adjust your daily Reels &amp; Shorts interaction threshold and time budget.
            </p>
          </div>
        </div>

        <div className="divide-y divide-[#E1EEE9] pt-2">
          <NumberStepper
            label="Daily Estimated Interactions Limit"
            value={reelsSettings.dailyInteractionLimit}
            min={5}
            max={300}
            step={5}
            unit="est."
            onChange={(val) => setReelsSettings({ ...reelsSettings, dailyInteractionLimit: val })}
          />
          <NumberStepper
            label="Daily Short-Form Time Limit"
            value={reelsSettings.dailyMinutesLimit}
            min={5}
            max={180}
            step={5}
            unit="min"
            onChange={(val) => setReelsSettings({ ...reelsSettings, dailyMinutesLimit: val })}
          />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="button"
          disabled={saving}
          onClick={handleSaveAll}
          className="px-6 py-3 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-sm font-bold cursor-pointer shadow-xs disabled:opacity-50"
        >
          {saving ? 'Saving Preferences...' : 'Save Privacy & App Settings'}
        </button>
      </div>
    </div>
  );
};
