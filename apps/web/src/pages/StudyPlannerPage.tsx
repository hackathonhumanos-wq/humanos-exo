/**
 * @file apps/web/src/pages/StudyPlannerPage.tsx
 * @description Phase 9: Adaptive AI Study Planner & Daily Agenda Generator
 */
import React, { useState, useEffect } from 'react';
import {
  Calendar,
  Sparkles,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Zap,
  Sun,
  Moon,
  BatteryMedium,
  BookOpen,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  SubjectWorkload,
  AdaptiveDailySchedule,
  StudyTimeSlot,
} from '../../../../packages/shared-types/src/index.ts';

export const StudyPlannerPage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectWorkload[]>([]);
  const [schedule, setSchedule] = useState<AdaptiveDailySchedule | null>(null);
  const [energyArchetype, setEnergyArchetype] = useState<'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL'>('AFTERNOON_BALANCED');
  const [targetHours, setTargetHours] = useState<number>(6);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  useEffect(() => {
    fetchPlannerData();
  }, []);

  const fetchPlannerData = async () => {
    try {
      setIsLoading(true);
      const [subRes, schedRes] = await Promise.all([
        fetch('/api/v1/planner/subjects').then(r => r.json()),
        fetch('/api/v1/planner/schedule', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ energyArchetype, targetHours }),
        }).then(r => r.json()),
      ]);

      if (subRes.success) setSubjects(subRes.data);
      if (schedRes.success) setSchedule(schedRes.data);
    } catch (e) {
      console.error('Failed to load study planner data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async (archetype = energyArchetype, hours = targetHours) => {
    try {
      setIsGenerating(true);
      const res = await fetch('/api/v1/planner/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ energyArchetype: archetype, targetHours: hours }),
      }).then(r => r.json());
      if (res.success) {
        setSchedule(res.data);
      }
    } catch (e) {
      console.error('Failed to regenerate schedule', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleToggleSlot = (slotId: string) => {
    if (!schedule) return;
    const updatedSlots = schedule.scheduledSlots.map(s =>
      s.id === slotId ? { ...s, isCompleted: !s.isCompleted } : s
    );
    setSchedule({ ...schedule, scheduledSlots: updatedSlots });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#171424] via-[#1c182d] to-[#141220] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#b8ff3c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#b8ff3c]/10 text-[#b8ff3c] border border-[#b8ff3c]/20 text-xs font-mono font-semibold rounded-full flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Phase 9: Adaptive Study Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              AI Adaptive Study Planner
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Dynamically maps your exam priorities and syllabus targets against your natural circadian energy curve. No rigid static timetables.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-4 bg-[#0c0a10]/60 border border-[#2c2537] rounded-2xl p-4 backdrop-blur-sm">
            <div>
              <div className="text-xs text-zinc-400 font-medium">Cognitive Readiness</div>
              <div className="text-2xl font-black text-[#b8ff3c] font-mono">
                {schedule?.readinessScore || 88}%
              </div>
            </div>
            <div className="h-8 w-px bg-[#2c2537]" />
            <div>
              <div className="text-xs text-zinc-400 font-medium">Target Load</div>
              <div className="text-2xl font-black text-white font-mono">{targetHours}h</div>
            </div>
          </div>
        </div>
      </div>

      {/* Energy Archetype Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            id: 'MORNING_LARK',
            label: 'Morning Lark',
            desc: 'Peak alertness: 07:00 – 11:30 AM',
            icon: Sun,
            color: 'text-amber-400',
          },
          {
            id: 'AFTERNOON_BALANCED',
            label: 'Balanced Afternoon',
            desc: 'Peak alertness: 09:30 AM – 04:30 PM',
            icon: BatteryMedium,
            color: 'text-[#b8ff3c]',
          },
          {
            id: 'NIGHT_OWL',
            label: 'Night Owl',
            desc: 'Peak alertness: 07:00 PM – 01:00 AM',
            icon: Moon,
            color: 'text-[#49e6ff]',
          },
        ].map(item => {
          const Icon = item.icon;
          const isSelected = energyArchetype === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                const next = item.id as any;
                setEnergyArchetype(next);
                handleRegenerate(next, targetHours);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-[#1b172a] border-[#b8ff3c] shadow-[0_0_20px_rgba(184,255,60,0.15)]'
                  : 'bg-[#12101a] border-[#2c2537] hover:border-[#3d344d]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-5 h-5 ${item.color}`} />
                {isSelected && (
                  <span className="w-2 h-2 rounded-full bg-[#b8ff3c] shadow-[0_0_8px_#b8ff3c]" />
                )}
              </div>
              <div className="font-bold text-white text-sm">{item.label}</div>
              <div className="text-xs text-zinc-400 mt-0.5">{item.desc}</div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Subjects vs Daily Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Subject Workload (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#b8ff3c]" /> Subject Workloads & Deadlines
            </h2>
            <span className="text-xs font-mono text-zinc-400">{subjects.length} Active Courses</span>
          </div>

          <div className="space-y-3">
            {subjects.map(subj => {
              const progress = Math.min(100, Math.round((subj.completedHoursThisWeek / subj.targetHoursPerWeek) * 100));
              const urgencyColor =
                subj.urgencyLevel === 'CRITICAL'
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                  : subj.urgencyLevel === 'HIGH'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';

              return (
                <div
                  key={subj.id}
                  className="bg-[#12101a] border border-[#2c2537] rounded-2xl p-4 hover:border-[#3d344d] transition-colors"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-bold text-sm text-zinc-200 line-clamp-1">{subj.name}</h3>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${urgencyColor}`}>
                      {subj.urgencyLevel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
                    <span>
                      {subj.completedHoursThisWeek}h of {subj.targetHoursPerWeek}h target
                    </span>
                    <span className="font-mono text-zinc-300">{progress}%</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#1b1728] h-2 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${progress}%`, backgroundColor: subj.color }}
                    />
                  </div>

                  {subj.examDate && (
                    <div className="mt-3 flex items-center gap-1.5 text-[11px] text-zinc-400">
                      <Clock className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Exam Target: {subj.examDate}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: AI Generated Daily Timetable (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#49e6ff]" /> Today's Adaptive Focus Plan
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Automatically paced around fatigue resistance and active recall pauses.
              </p>
            </div>
            <button
              onClick={() => handleRegenerate()}
              disabled={isGenerating}
              className="px-3 py-1.5 bg-[#b8ff3c] hover:bg-[#a8eb34] text-[#07060a] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Zap className="w-3.5 h-3.5" /> {isGenerating ? 'Optimizing...' : 'Regenerate Plan'}
            </button>
          </div>

          {/* AI Advice Callout */}
          {schedule?.aiAdvice && (
            <div className="bg-[#191526] border border-[#b8ff3c]/20 rounded-2xl p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-[#b8ff3c] shrink-0 mt-0.5" />
              <div className="text-xs text-zinc-300 leading-relaxed">{schedule.aiAdvice}</div>
            </div>
          )}

          {/* Time Slots List */}
          <div className="space-y-3">
            {schedule?.scheduledSlots.map((slot, idx) => {
              return (
                <div
                  key={slot.id}
                  onClick={() => handleToggleSlot(slot.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                    slot.isCompleted
                      ? 'bg-[#100e18]/60 border-[#221e2d] opacity-75'
                      : 'bg-[#141120] border-[#2c2537] hover:border-[#423854]'
                  }`}
                >
                  <button className="mt-0.5 text-zinc-400 hover:text-[#b8ff3c] transition-colors">
                    {slot.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-[#b8ff3c]" />
                    ) : (
                      <Circle className="w-5 h-5" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                      <span className="text-xs font-mono font-bold text-[#b8ff3c] bg-[#b8ff3c]/10 px-2 py-0.5 rounded-md">
                        {slot.timeSlot}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[#231d32] text-zinc-300 border border-[#342b4a]">
                        {slot.recommendedMode}
                      </span>
                    </div>

                    <h4
                      className={`text-sm font-bold ${
                        slot.isCompleted ? 'line-through text-zinc-400' : 'text-white'
                      }`}
                    >
                      {slot.subject} — <span className="font-normal text-zinc-300">{slot.topic}</span>
                    </h4>

                    <p className="text-xs text-zinc-400 mt-1 italic leading-relaxed">
                      💡 {slot.aiRationale}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
