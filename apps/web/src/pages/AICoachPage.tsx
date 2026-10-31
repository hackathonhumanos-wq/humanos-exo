import React from 'react';
import { Sparkles, Brain, Bot, Lightbulb, ArrowRight } from 'lucide-react';

export const AICoachPage: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#2c2537]">
        <div>
          <h2 className="text-2xl font-extrabold text-white">AI Focus Coach</h2>
          <p className="text-xs text-zinc-400">Structured cognitive pacing recommendations based on your study cycles</p>
        </div>
        <span className="text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-3 py-1 rounded-full self-start sm:self-auto">
          Gemini / OpenAI Architecture
        </span>
      </div>

      <div className="space-y-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#b8ff3c]">
            <Lightbulb className="w-4 h-4" />
            Recommended Habit Modification
          </div>
          <h3 className="text-lg font-bold text-white">Post-Lunch Focus Dip Mitigation</h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Data indicates your short-form video engagement peaks between 1:30 PM and 2:30 PM.
            Actionable tip: Replace the 15-minute scroll break with a 10-minute natural daylight walk before starting afternoon revision.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono text-zinc-400 bg-[#0c0a10] px-2.5 py-1 rounded-lg border border-white/5">
              Confidence Score: 92% • Category: FOCUS_PACING
            </span>
          </div>
        </div>

        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#49e6ff]">
            <Brain className="w-4 h-4" />
            Cognitive Load Optimization
          </div>
          <h3 className="text-lg font-bold text-white">Exam Cramming Interval Adjustment</h3>
          <p className="text-xs text-zinc-300 leading-relaxed">
            Switching from 90-minute unbroken blocks to 50/10 Pomodoro intervals reduces task abandonment rates by 24% during difficult math or coding assignments.
          </p>
          <div className="pt-2">
            <span className="text-[11px] font-mono text-zinc-400 bg-[#0c0a10] px-2.5 py-1 rounded-lg border border-white/5">
              Confidence Score: 88% • Category: STUDY_BREAK
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
