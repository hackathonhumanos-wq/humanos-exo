/**
 * @file apps/web/src/pages/WellbeingInsightsPage.tsx
 * @description Phase 9: Digital Wellbeing Intelligence & Doomscrolling Risk Prevention
 */
import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  Moon,
  Sparkles,
  TrendingDown,
  Info,
  Clock,
  HeartHandshake,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
} from 'lucide-react';
import { WellbeingHealthScore } from '../../../../packages/shared-types/src/index.ts';

export const WellbeingInsightsPage: React.FC = () => {
  const [data, setData] = useState<WellbeingHealthScore | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch('/api/v1/wellbeing/health-score')
      .then(res => res.json())
      .then(res => {
        if (res.success) setData(res.data);
      })
      .catch(e => console.error('Error fetching wellbeing data', e))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#14121e] via-[#1a1727] to-[#12101b] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#49e6ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#49e6ff]/10 text-[#49e6ff] border border-[#49e6ff]/20 text-xs font-mono font-semibold rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Phase 9: Wellbeing Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Digital Wellbeing & Focus Health
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Ethical, non-judgmental habits analysis. Designed to protect sleep, reduce mindless scrolling, and restore cognitive energy without guilt.
            </p>
          </div>

          {/* Overall Health Score Card */}
          <div className="bg-[#0b0a12]/80 border border-[#2c2537] rounded-2xl p-5 flex items-center gap-5 backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#b8ff3c] to-[#49e6ff] p-[2px]">
              <div className="w-full h-full bg-[#0c0a10] rounded-[14px] flex flex-col items-center justify-center">
                <span className="text-xl font-black text-[#b8ff3c] font-mono leading-none">
                  {data?.overallScore || 84}
                </span>
                <span className="text-[9px] font-mono text-zinc-400 mt-0.5">/ 100</span>
              </div>
            </div>
            <div>
              <div className="text-xs text-zinc-400">Habit Health Index</div>
              <div className="text-sm font-bold text-white mt-0.5">Optimal Balance</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
                <TrendingDown className="w-3.5 h-3.5" />
                <span>{data?.reelsTrendPercent || -24.5}% Distraction vs baseline</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Gauges */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#12101a] border border-[#2c2537] rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400">FOCUS RESILIENCE</span>
            <span className="text-xl font-black text-[#b8ff3c] font-mono">
              {data?.focusResilience || 87}%
            </span>
          </div>
          <div className="w-full bg-[#1c1828] h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#b8ff3c] rounded-full transition-all duration-700"
              style={{ width: `${data?.focusResilience || 87}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Measures your ability to sustain 25m+ uninterrupted study sprints without context-switching.
          </p>
        </div>

        <div className="bg-[#12101a] border border-[#2c2537] rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400">SLEEP RECOVERY HYGIENE</span>
            <span className="text-xl font-black text-[#49e6ff] font-mono">
              {data?.restorativeSleepHygiene || 79}%
            </span>
          </div>
          <div className="w-full bg-[#1c1828] h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#49e6ff] rounded-full transition-all duration-700"
              style={{ width: `${data?.restorativeSleepHygiene || 79}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Tracks screen-time cutoffs within 60 minutes of your target bedtime to protect melatonin onset.
          </p>
        </div>

        <div className="bg-[#12101a] border border-[#2c2537] rounded-3xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-mono text-zinc-400">SHORT-FORM DISCIPLINE</span>
            <span className="text-xl font-black text-[#d480ff] font-mono">
              {data?.shortFormDiscipline || 86}%
            </span>
          </div>
          <div className="w-full bg-[#1c1828] h-2.5 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-[#d480ff] rounded-full transition-all duration-700"
              style={{ width: `${data?.shortFormDiscipline || 86}%` }}
            />
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Evaluates how quickly you exit Reels / Shorts feeds when intervention prompts appear.
          </p>
        </div>
      </div>

      {/* Ethical Telemetry Notice Pill */}
      <div className="bg-[#161224] border border-[#3c3150] rounded-2xl p-4 flex items-start gap-3.5">
        <Info className="w-5 h-5 text-[#49e6ff] shrink-0 mt-0.5" />
        <div className="text-xs text-zinc-300 leading-relaxed">
          <strong className="text-white">Ethical Telemetry Guarantee:</strong> {data?.disclaimer}
        </div>
      </div>

      {/* Risk Windows & Compassionate Interventions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Doomscroll Risk Windows (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> High-Risk Distraction Windows
          </h2>
          <p className="text-xs text-zinc-400">
            Detected vulnerability times where autopilot scrolling is most likely to replace rest.
          </p>

          <div className="space-y-3">
            {data?.riskWindows.map((rw, i) => {
              const badgeStyle =
                rw.riskLevel === 'HIGH'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : rw.riskLevel === 'ELEVATED'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';

              return (
                <div
                  key={i}
                  className="bg-[#12101a] border border-[#2c2537] rounded-2xl p-5 space-y-2 hover:border-[#3d344d] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-1 rounded-md">
                      {rw.timeWindow}
                    </span>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                      {rw.riskLevel} RISK
                    </span>
                  </div>

                  <p className="text-xs text-zinc-300 font-medium">{rw.triggerContext}</p>

                  <div className="pt-2 border-t border-[#231e30] flex items-start gap-2 text-xs text-emerald-400">
                    <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                    <span>Shield: {rw.recommendedShield}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Mindful Interventions (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <HeartHandshake className="w-5 h-5 text-[#b8ff3c]" /> Mindful Habit Substitutes
          </h2>
          <p className="text-xs text-zinc-400">
            Gentle micro-habits to rewire the cue-craving-reward scrolling loop.
          </p>

          <div className="space-y-3">
            {data?.interventions.map((item, i) => (
              <div
                key={i}
                className="bg-[#12101a] border border-[#2c2537] rounded-2xl p-4 flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-[#b8ff3c]/10 border border-[#b8ff3c]/20 text-[#b8ff3c] flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5">
                  {i + 1}
                </div>
                <div className="text-xs text-zinc-300 leading-relaxed">{item}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
