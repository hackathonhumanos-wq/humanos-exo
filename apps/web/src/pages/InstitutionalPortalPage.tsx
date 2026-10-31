/**
 * @file apps/web/src/pages/InstitutionalPortalPage.tsx
 * @description Phase 10: Institutional Counsellor & Department Portal with strict K-Anonymity privacy safeguards
 */
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  ShieldCheck,
  ShieldAlert,
  Users,
  Clock,
  TrendingDown,
  Sparkles,
  Lock,
  FileCheck,
  CheckCircle2,
} from 'lucide-react';
import { InstitutionalCohortSummary } from '../../../../packages/shared-types/src/index.ts';

export const InstitutionalPortalPage: React.FC = () => {
  const [cohorts, setCohorts] = useState<InstitutionalCohortSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/institutions/cohorts')
      .then(r => r.json())
      .then(res => {
        if (res.success) setCohorts(res.data);
      })
      .catch(e => console.error(e))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#141220] via-[#1a1727] to-[#13111f] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#49e6ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#49e6ff]/10 text-[#49e6ff] border border-[#49e6ff]/20 text-xs font-mono font-semibold rounded-full flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Phase 10: Institutional Guidance
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Institutional Counsellor Portal
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Provides academic advisors and mental health counsellors with aggregate cohort wellbeing indicators. Built with strict k-anonymity (k ≥ 5) and explicit student consent.
            </p>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl text-xs font-mono">
            <ShieldCheck className="w-4 h-4" />
            <span>K-Anonymity Verified (k ≥ 5)</span>
          </div>
        </div>
      </div>

      {/* Privacy Architecture Notice */}
      <div className="bg-[#161224] border border-[#372d4c] rounded-2xl p-5 flex items-start gap-4">
        <Lock className="w-5 h-5 text-[#b8ff3c] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs text-zinc-300 leading-relaxed">
          <div className="font-bold text-white text-sm">Differential Privacy & Ethical Safeguards:</div>
          <div>
            No student's browsing history, individual session timestamps, or private conversations are ever visible to institutions. Only students who have explicitly opted in via <span className="font-mono text-[#b8ff3c]">PrivacyConsent</span> are included in cohort averages. If a cohort contains fewer than 5 opted-in members, all metrics are automatically redacted to prevent identification.
          </div>
        </div>
      </div>

      {/* Cohorts Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Users className="w-5 h-5 text-[#b8ff3c]" /> Department & Course Cohorts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cohorts.map(cohort => {
            return (
              <div
                key={cohort.institutionId}
                className={`rounded-3xl border p-6 flex flex-col justify-between space-y-4 transition-all ${
                  cohort.kAnonymityPassed
                    ? 'bg-[#12101a] border-[#2c2537] hover:border-[#3d344d]'
                    : 'bg-[#180f14] border-rose-500/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-zinc-400 uppercase">
                      {cohort.institutionName}
                    </span>
                    {cohort.kAnonymityPassed ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Protected
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/30 text-[10px] font-mono flex items-center gap-1">
                        <ShieldAlert className="w-3 h-3" /> Redacted
                      </span>
                    )}
                  </div>

                  <h3 className="font-bold text-white text-base leading-snug">{cohort.cohortName}</h3>
                  <div className="text-xs text-zinc-400 mt-1">
                    {cohort.optedInStudentsCount} of {cohort.totalStudentsEnrolled} students consented
                  </div>

                  {cohort.kAnonymityPassed ? (
                    <div className="mt-5 grid grid-cols-3 gap-2 bg-[#0c0a10] p-3 rounded-2xl border border-[#231e30] text-center">
                      <div>
                        <div className="text-[10px] text-zinc-400 font-mono">AVG FOCUS</div>
                        <div className="text-base font-black text-[#b8ff3c] font-mono mt-0.5">
                          {Math.round(cohort.averageWeeklyFocusMinutes / 60)}h
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 font-mono">WELLBEING</div>
                        <div className="text-base font-black text-[#49e6ff] font-mono mt-0.5">
                          {cohort.averageWellbeingScore}%
                        </div>
                      </div>
                      <div>
                        <div className="text-[10px] text-zinc-400 font-mono">REDUCTION</div>
                        <div className="text-base font-black text-emerald-400 font-mono mt-0.5">
                          -{cohort.reelsDistractionReductionPercent}%
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-5 p-4 bg-[#230f14] rounded-2xl border border-rose-500/20 text-xs text-rose-300 leading-relaxed flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                      <span>{cohort.dataPrivacyNote}</span>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#231e30] text-[11px] text-zinc-500 leading-relaxed">
                  {cohort.kAnonymityPassed && cohort.dataPrivacyNote}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
