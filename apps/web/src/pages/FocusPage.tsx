import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { formatTimerSeconds } from '../../../../packages/shared-utils/src/index.ts';

export const FocusPage: React.FC = () => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'POMODORO' | 'DEEP_WORK' | 'EXAM_PREP'>('POMODORO');

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      setIsRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, secondsLeft]);

  const handleModeChange = (newMode: 'POMODORO' | 'DEEP_WORK' | 'EXAM_PREP') => {
    setMode(newMode);
    setIsRunning(false);
    if (newMode === 'POMODORO') setSecondsLeft(25 * 60);
    if (newMode === 'DEEP_WORK') setSecondsLeft(50 * 60);
    if (newMode === 'EXAM_PREP') setSecondsLeft(90 * 60);
  };

  const handleReset = () => {
    setIsRunning(false);
    handleModeChange(mode);
  };

  return (
    <div className="max-w-xl mx-auto py-8 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-white">Focus Session</h2>
        <p className="text-xs text-zinc-400">Lock distractions and synchronize study intervals with the Chrome companion</p>
      </div>

      {/* Mode Selector */}
      <div className="flex justify-center gap-2">
        {(['POMODORO', 'DEEP_WORK', 'EXAM_PREP'] as const).map(m => (
          <button
            key={m}
            onClick={() => handleModeChange(m)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              mode === m
                ? 'bg-[#b8ff3c] text-[#07060a] border-[#b8ff3c]'
                : 'bg-[#17131f] text-zinc-400 border-[#2c2537] hover:text-white'
            }`}
          >
            {m === 'POMODORO' ? 'Pomodoro (25m)' : m === 'DEEP_WORK' ? 'Deep Work (50m)' : 'Exam Prep (90m)'}
          </button>
        ))}
      </div>

      {/* Timer Circle Container */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-10 flex flex-col items-center justify-center space-y-6 shadow-2xl relative">
        <div className="text-7xl sm:text-8xl font-bold font-mono text-white tracking-tight">
          {formatTimerSeconds(secondsLeft)}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all shadow-lg ${
              isRunning
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a]'
            }`}
          >
            {isRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isRunning ? 'Pause' : 'Start Focus'}
          </button>

          <button
            onClick={handleReset}
            className="p-3.5 bg-[#241a31] hover:bg-[#2d213e] text-zinc-300 rounded-2xl border border-white/10 cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

        {/* Protection Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0c0a10] border border-white/5 text-xs text-zinc-400">
          <ShieldCheck className="w-4 h-4 text-[#b8ff3c]" />
          <span>Distraction Shield Active: Instagram & YouTube Shorts blocked</span>
        </div>
      </div>
    </div>
  );
};
