/**
 * @file apps/web/src/pages/InstitutionalPortalPage.tsx
 * @description Light-theme Campus & Counsellor Aggregate Portal with k-anonymity privacy safeguards
 */
import React, { useState, useEffect, useCallback } from 'react';
import { GraduationCap, ShieldCheck, Users } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { InstitutionalCohortSummary } from '../../../../packages/shared-types/src/index.ts';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const InstitutionalPortalPage: React.FC = () => {
  const [cohorts, setCohorts] = useState<InstitutionalCohortSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCohorts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.getInstitutionalCohorts();
      setCohorts(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load cohort aggregates.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCohorts();
  }, [loadCohorts]);

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Campus Cohort Aggregates"
        description="Verifying k-anonymity thresholds for opted-in student cohorts..."
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Cohort portal unavailable"
        description={error}
        actionLabel="Retry"
        onAction={loadCohorts}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E9F9F2] border border-[#CBEFE0] text-[#079669] text-xs font-bold mb-2">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Strict Opt-In &amp; k-Anonymity Protected</span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          Campus Counsellor Aggregate View
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          High-level cohort wellbeing trends for academic advisors. Individual student browsing is never accessible.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {cohorts.map((c) => (
          <div key={c.cohortName} className="ff-card p-6 space-y-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="font-display text-base font-bold text-[#142647]">{c.cohortName}</h2>
                  <div className="text-xs text-[#5A708D]">{c.institutionName}</div>
                </div>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669]">
                k-Anonymity Passed
              </span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9]">
                <div className="font-display text-lg font-extrabold text-[#142647] tabular-nums">
                  {c.optedInStudentsCount}
                </div>
                <div className="text-[11px] text-[#5A708D] inline-flex items-center gap-1">
                  <Users className="w-3 h-3" /> Opted In
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9]">
                <div className="font-display text-lg font-extrabold text-[#079669] tabular-nums">
                  {Math.round(c.averageWeeklyFocusMinutes / 60)}h
                </div>
                <div className="text-[11px] text-[#5A708D]">Avg Focus/Wk</div>
              </div>
              <div className="p-3 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9]">
                <div className="font-display text-lg font-extrabold text-[#438CF5] tabular-nums">
                  -{c.reelsDistractionReductionPercent}%
                </div>
                <div className="text-[11px] text-[#5A708D]">Scroll Drop</div>
              </div>
            </div>

            <p className="text-xs text-[#5A708D] leading-relaxed">{c.dataPrivacyNote}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
