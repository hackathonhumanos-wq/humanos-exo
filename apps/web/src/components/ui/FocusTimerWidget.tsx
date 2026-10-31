/**
 * @file apps/web/src/components/ui/FocusTimerWidget.tsx
 * @description Reusable Focus Timer component with Pomodoro/Deep Work/Exam Prep presets, Distraction Shield toggle, and real API session logging
 */
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { apiClient } from '../../services/apiClient.ts';

type FocusModeKey = 'POMODORO' | 'DEEP_WORK' | 'EXAM_PREP';

const PRESETS: Record<
  FocusModeKey,
  { label: string; minutes: number; xpHint: string; description: string }
> = {
  POMODORO: {
    label: 'Pomodoro (25m)',
    minutes: 25,
    xpHint: '+50 XP',
    description: 'Balanced 25-minute sprint followed by a 5-minute restorative break.',
  },
  DEEP_WORK: {
    label: 'Deep Study (50m)',
    minutes: 50,
    xpHint: '+120 XP',
    description: 'Sustained problem-solving block for Mathematics, Physics, or Coding.',
  },
  EXAM_PREP: {
    label: 'Exam Mock (90m)',
    minutes: 90,
    xpHint: '+150 XP',
    description: 'Full distraction lockdown simulating uninterrupted exam conditions.',
  },
};

interface FocusTimerWidgetProps {
  onSessionLogged?: () => void;
  autoStart?: boolean;
  onAutoStartConsumed?: () => void;
}

export const FocusTimerWidget: React.FC<FocusTimerWidgetProps> = ({
  onSessionLogged,
  autoStart = false,
  onAutoStartConsumed,
}) => {
  const [mode, setMode] = useState<FocusModeKey>('POMODORO');
  const [subject, setSubject] = useState('Mathematics');
  const [secondsLeft, setSecondsLeft] = useState(PRESETS.POMODORO.minutes * 60);
  const [isRunning, setIsRunning] = useState(autoStart);
  const [shieldActive, setShieldActive] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  useEffect(() => {
    if (autoStart) {
      setIsRunning(true);
      onAutoStartConsumed?.();
    }
  }, [autoStart, onAutoStartConsumed]);

  const totalSeconds = PRESETS[mode].minutes * 60;
  const elapsedMinutes = Math.max(1, Math.round((totalSeconds - secondsLeft) / 60));
  const progressPct = Math.min(100, Math.max(0, ((totalSeconds - secondsLeft) / totalSeconds) * 100));

  useEffect(() => {
    if (!isRunning) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isRunning]);

  const selectPreset = (nextMode: FocusModeKey) => {
    setIsRunning(false);
    setMode(nextMode);
    setSecondsLeft(PRESETS[nextMode].minutes * 60);
    setFeedbackBanner(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(PRESETS[mode].minutes * 60);
  };

  const handleCompleteAndLog = async (durationOverride?: number) => {
    const minutesToLog = durationOverride ?? (secondsLeft === 0 ? PRESETS[mode].minutes : Math.max(5, elapsedMinutes));
    try {
      setIsSaving(true);
      setIsRunning(false);
      const res = await apiClient.logFocusSession({
        subject: subject.trim() || 'General Study',
        mode,
        durationMinutes: minutesToLog,
      });
      setFeedbackBanner(res.message || `Logged ${minutesToLog}m focus session! +${res.data.xpEarned} XP`);
      setSecondsLeft(PRESETS[mode].minutes * 60);
      onSessionLogged?.();
    } catch (err) {
      setFeedbackBanner(err instanceof Error ? err.message : 'Unable to save session right now.');
    } finally {
      setIsSaving(false);
    }
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const formattedClock = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const circleSize = 236;
  const strokeWidth = 12;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPct / 100) * circumference;

  return (
    <div className="ff-card p-6 sm:p-8 space-y-6">
      {/* Mode Selector Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl bg-[#F2F9F6] border border-[#E1EEE9]">
          {(Object.keys(PRESETS) as FocusModeKey[]).map((key) => {
            const active = mode === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => selectPreset(key)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                  active
                    ? 'bg-[#079669] text-white shadow-xs'
                    : 'text-[#4A607A] hover:text-[#142647] hover:bg-white'
                }`}
              >
                {PRESETS[key].label}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setShieldActive((s) => !s)}
          className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border cursor-pointer ${
            shieldActive
              ? 'bg-[#E9F9F2] border-[#BCEAD7] text-[#079669]'
              : 'bg-white border-[#E1EEE9] text-[#5A708D]'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>{shieldActive ? 'Short-Form Shield ON' : 'Short-Form Shield Paused'}</span>
        </button>
      </div>

      {/* Subject Selector + Circular Timer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-6 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg width={circleSize} height={circleSize} className="-rotate-90" aria-hidden="true">
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke="#E6F4EE"
                strokeWidth={strokeWidth}
              />
              <circle
                cx={circleSize / 2}
                cy={circleSize / 2}
                r={radius}
                fill="none"
                stroke="#079669"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#079669]">
                {isRunning ? 'Focusing Now' : 'Ready to Focus'}
              </span>
              <span
                className="font-display text-5xl font-extrabold text-[#142647] tabular-nums tracking-tight mt-1"
                aria-live="polite"
              >
                {formattedClock}
              </span>
              <span className="text-xs font-semibold text-[#5A708D] mt-1">
                {subject} • {PRESETS[mode].xpHint}
              </span>
            </div>
          </div>
        </div>

        <div className="md:col-span-6 space-y-4">
          <div>
            <label htmlFor="focus-subject-input" className="block text-xs font-bold text-[#334B68] mb-1.5">
              Study Subject or Topic
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'Revision'].map((presetSubj) => (
                <button
                  key={presetSubj}
                  type="button"
                  onClick={() => setSubject(presetSubj)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                    subject === presetSubj
                      ? 'bg-[#DDF7EC] border-[#A7E6CB] text-[#079669]'
                      : 'bg-[#F7FCFA] border-[#E1EEE9] text-[#4A607A] hover:text-[#142647]'
                  }`}
                >
                  {presetSubj}
                </button>
              ))}
            </div>
            <input
              id="focus-subject-input"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter subject (e.g., Organic Chemistry)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-sm font-medium text-[#142647] focus:bg-white focus:border-[#079669] focus:outline-none"
            />
          </div>

          <p className="text-xs text-[#5A708D] leading-relaxed">{PRESETS[mode].description}</p>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <button
              type="button"
              onClick={() => setIsRunning((r) => !r)}
              className="flex-1 min-w-[140px] py-3 px-5 rounded-2xl bg-[#079669] hover:bg-[#057A55] text-white font-bold text-sm inline-flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunning ? 'Pause Session' : 'Start Focus Session'}</span>
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label="Reset timer"
              className="p-3 rounded-2xl bg-[#F7FCFA] hover:bg-[#EBF6F1] border border-[#E1EEE9] text-[#334B68] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            disabled={isSaving}
            onClick={() => handleCompleteAndLog(PRESETS[mode].minutes)}
            className="w-full py-2.5 px-4 rounded-xl bg-[#EEF8F4] hover:bg-[#DDF7EC] border border-[#CBEFE0] text-[#079669] text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {isSaving
                ? 'Logging Session & Awarding XP...'
                : `Complete & Log ${PRESETS[mode].minutes}m Session Now (${PRESETS[mode].xpHint})`}
            </span>
          </button>
        </div>
      </div>

      {feedbackBanner && (
        <div
          role="status"
          className="p-3.5 rounded-2xl bg-[#E9F9F2] border border-[#BCEAD7] text-[#067652] text-xs font-semibold flex items-center justify-between gap-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#079669] shrink-0" />
            <span>{feedbackBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackBanner(null)}
            className="text-[#079669] underline font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
