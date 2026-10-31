import React from 'react';
import { BRAIN_STAGES, BrainStage } from '../types/brainrot';
import { BrainCharacter } from './BrainCharacter';
import { Sparkles, Droplets, Flame, AlertCircle } from 'lucide-react';

interface StageViewerProps {
  currentCount: number;
  onSetCount: (count: number) => void;
  onIncrement: () => void;
}

export const StageViewer: React.FC<StageViewerProps> = ({
  currentCount,
  onSetCount,
  onIncrement,
}) => {
  // Find current active stage
  let activeStageIndex = 0;
  for (let i = BRAIN_STAGES.length - 1; i >= 0; i--) {
    if (currentCount >= BRAIN_STAGES[i].threshold) {
      activeStageIndex = i;
      break;
    }
  }
  const stage = BRAIN_STAGES[activeStageIndex];
  const nextStage = activeStageIndex < BRAIN_STAGES.length - 1 ? BRAIN_STAGES[activeStageIndex + 1] : null;
  const remaining = nextStage ? nextStage.threshold - currentCount : null;

  return (
    <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
      {/* Background ambient glow according to stage */}
      <div
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: stage.glow }}
      />
      <div
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700"
        style={{ backgroundColor: stage.isSlimy ? 'rgba(184, 255, 60, 0.15)' : 'rgba(255, 79, 216, 0.12)' }}
      />

      <div className="relative z-10">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-[#2c2537]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono tracking-wider uppercase text-[#b8ff3c] bg-[#b8ff3c]/10 px-2.5 py-0.5 rounded-full border border-[#b8ff3c]/20">
                Stage {stage.stage} of 6
              </span>
              {stage.isSlimy && (
                <span className="text-xs flex items-center gap-1 font-mono text-[#b8ff3c] bg-black/40 px-2 py-0.5 rounded-full">
                  <Droplets className="w-3 h-3 text-[#b8ff3c]" /> Slime Active
                </span>
              )}
              {stage.isSmoking && (
                <span className="text-xs flex items-center gap-1 font-mono text-orange-400 bg-black/40 px-2 py-0.5 rounded-full">
                  <Flame className="w-3 h-3 text-orange-400" /> Smoking
                </span>
              )}
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white flex items-center gap-3">
              {stage.name}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">{stage.tagline}</p>
          </div>

          {/* Quick Counter Display */}
          <div className="bg-[#120f18] px-5 py-3 rounded-2xl border border-white/5 flex items-center gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono">Today's Total</div>
              <div className="text-3xl font-bold font-mono-numbers text-white flex items-baseline gap-1">
                {currentCount}
                <span className="text-xs font-normal text-zinc-400">reels</span>
              </div>
            </div>
            <button
              onClick={onIncrement}
              className="px-4 py-2 bg-[#f4533f] hover:bg-[#ff6957] active:scale-95 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-[#f4533f]/30 cursor-pointer flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4" />
              +1 Reel
            </button>
          </div>
        </div>

        {/* Center Display: Brain Avatar & Physics */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4">
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#0c0a10]/60 rounded-2xl border border-white/5">
            <div className="py-6">
              <BrainCharacter count={currentCount} size="xl" interactive={true} />
            </div>
            <p className="text-xs text-zinc-500 mt-2 flex items-center gap-1">
              <span>Tap the brain to squish & drop</span>
              {stage.isSlimy ? 'green slime' : 'sweat'}
            </p>
          </div>

          {/* Stage Details & Symptoms */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-5">
            <div className="bg-[#1f1a29]/80 border border-white/5 rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase tracking-wider mb-2">
                <AlertCircle className="w-3.5 h-3.5 text-[#f4533f]" />
                Cognitive Diagnostic
              </div>
              <p className="text-zinc-200 text-base leading-relaxed">{stage.description}</p>
            </div>

            {/* Symptoms list */}
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2.5">
                Observed Behavioral Symptoms
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {stage.symptoms.map((symptom, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-xs bg-[#120f18] text-zinc-300 px-3 py-2 rounded-xl border border-white/5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#b8ff3c]" />
                    {symptom}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Stage Countdown */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#241c2c] to-[#1a1524] border border-white/5 flex items-center justify-between">
              <div>
                <span className="text-xs text-zinc-400">Next Rot Milestone:</span>
                <div className="text-sm font-semibold text-white">
                  {nextStage ? (
                    <span>
                      {nextStage.name} <span className="text-zinc-400 font-normal">at {nextStage.threshold} reels</span>
                    </span>
                  ) : (
                    <span className="text-red-400">Maximum rot achieved</span>
                  )}
                </div>
              </div>
              {remaining !== null ? (
                <div className="text-right">
                  <span className="font-mono-numbers text-lg font-bold text-[#b8ff3c]">{remaining}</span>
                  <span className="text-xs text-zinc-400 ml-1">reels left</span>
                </div>
              ) : (
                <span className="text-xs text-zinc-500 font-mono">Terminal stage</span>
              )}
            </div>
          </div>
        </div>

        {/* Rot Slider (Interactive Scrubber) */}
        <div className="mt-8 pt-6 border-t border-[#2c2537]">
          <div className="flex items-center justify-between text-xs font-mono text-zinc-400 mb-2">
            <span>DRAG ROT SCRUBBER (0 – 300+ REELS)</span>
            <span className="text-[#b8ff3c] font-bold">{currentCount} REELS</span>
          </div>
          <input
            type="range"
            min="0"
            max="300"
            value={currentCount}
            onChange={e => onSetCount(Number(e.target.value))}
            className="w-full h-3 bg-[#120f18] rounded-lg appearance-none cursor-pointer accent-[#b8ff3c]"
          />

          {/* Stage Quick Jump Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-2 mt-4">
            {BRAIN_STAGES.map((s, idx) => {
              const isSelected = activeStageIndex === idx;
              return (
                <button
                  key={s.stage}
                  onClick={() => onSetCount(s.threshold)}
                  className={`flex flex-col items-center p-2 rounded-xl border text-center transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#241a31] border-[#b8ff3c] shadow-lg shadow-[#b8ff3c]/10 text-white'
                      : 'bg-[#120f18] border-white/5 hover:border-white/20 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <img
                    src={s.sprite}
                    alt={s.name}
                    className="w-8 h-7 object-contain mb-1 transition-transform group-hover:scale-105"
                  />
                  <span className="text-[11px] font-semibold truncate w-full">{s.name}</span>
                  <span className="text-[10px] font-mono opacity-60">
                    {idx === BRAIN_STAGES.length - 1 ? `${s.threshold}+` : s.threshold}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
