/**
 * @file apps/web/src/pages/StudyPlannerPage.tsx
 * @description Light-theme Adaptive Study Planner connected to /api/v1/planner/*
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Sparkles, BookOpen, Plus } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  SubjectWorkload,
  AdaptiveDailySchedule,
} from '../../../../packages/shared-types/src/index.ts';
import { StudyTaskList } from '../components/ui/StudyTaskList.tsx';
import { ProgressBar } from '../components/ui/ProgressBar.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const StudyPlannerPage: React.FC = () => {
  const [subjects, setSubjects] = useState<SubjectWorkload[]>([]);
  const [schedule, setSchedule] = useState<AdaptiveDailySchedule | null>(null);
  const [archetype, setArchetype] = useState<'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL'>(
    'MORNING_LARK'
  );
  const [targetHours, setTargetHours] = useState(4);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add subject form
  const [subjectName, setSubjectName] = useState('');
  const [weeklyTarget, setWeeklyTarget] = useState(6);
  const [urgency, setUrgency] = useState<'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'>('HIGH');

  const fetchPlanner = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [subjRes, schedRes] = await Promise.all([
        apiClient.getPlannerSubjects(),
        apiClient.getCurrentSchedule(),
      ]);
      setSubjects(subjRes);
      setSchedule(schedRes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load study planner.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlanner();
  }, [fetchPlanner]);

  const handleRegenerate = async () => {
    try {
      setRegenerating(true);
      const updated = await apiClient.generateSchedule({
        energyArchetype: archetype,
        targetHours,
        regenerate: true,
      });
      setSchedule(updated);
    } finally {
      setRegenerating(false);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectName.trim()) return;
    const created = await apiClient.addPlannerSubject({
      name: subjectName.trim(),
      targetHoursPerWeek: weeklyTarget,
      urgencyLevel: urgency,
    });
    setSubjects((prev) => [...prev, created]);
    setSubjectName('');
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Adaptive Study Planner"
        description="Preparing your subject workloads and daily time blocks..."
      />
    );
  }

  if (error || !schedule) {
    return (
      <EmptyState
        variant="error"
        title="Study Planner unavailable"
        description={error || 'Could not load study schedule.'}
        actionLabel="Retry"
        onAction={fetchPlanner}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
            Adaptive Study Planner
          </h1>
          <p className="text-sm text-[#4A607A] mt-1">
            Organize daily study blocks around your peak cognitive energy windows and exam urgency.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#E9F9F2] border border-[#CBEFE0] text-[#079669] text-xs font-bold tabular-nums self-start">
          <Calendar className="w-4 h-4" />
          <span>Readiness Score: {schedule.readinessScore}/100</span>
        </div>
      </div>

      {/* Schedule Generator Bar */}
      <div className="ff-card p-5 sm:p-6 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
          <div>
            <label htmlFor="energy-archetype" className="block text-xs font-bold text-[#334B68] mb-1.5">
              Peak Energy Rhythm
            </label>
            <select
              id="energy-archetype"
              value={archetype}
              onChange={(e) =>
                setArchetype(e.target.value as 'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL')
              }
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-sm font-semibold text-[#142647]"
            >
              <option value="MORNING_LARK">Morning Lark (Peak 08:00 – 12:00)</option>
              <option value="AFTERNOON_BALANCED">Afternoon Balanced (Peak 13:00 – 18:00)</option>
              <option value="NIGHT_OWL">Evening Scholar (Peak 18:30 – 22:30)</option>
            </select>
          </div>

          <div>
            <label htmlFor="target-hours" className="block text-xs font-bold text-[#334B68] mb-1.5">
              Daily Study Target ({targetHours} hours)
            </label>
            <input
              id="target-hours"
              type="range"
              min={1}
              max={8}
              step={0.5}
              value={targetHours}
              onChange={(e) => setTargetHours(Number(e.target.value))}
              className="w-full accent-[#079669] mt-2"
            />
          </div>
        </div>

        <button
          type="button"
          disabled={regenerating}
          onClick={handleRegenerate}
          className="px-5 py-2.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>{regenerating ? 'Rebalancing Plan...' : 'Regenerate Optimal Plan'}</span>
        </button>
      </div>

      {/* Main Grid: Study Tasks Checklist + Subject Workloads */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 space-y-4">
          <StudyTaskList
            slots={schedule.scheduledSlots}
            onToggleSlot={async (slotId) => {
              const updated = await apiClient.toggleStudySlot(slotId);
              setSchedule(updated);
            }}
            onAddSlot={async ({ subject, durationMinutes }) => {
              const updated = await apiClient.addStudySlot({
                subject,
                topic: `${durationMinutes} min`,
                durationMinutes,
                recommendedMode: 'POMODORO',
              });
              setSchedule(updated);
            }}
          />

          <div className="p-4 rounded-2xl bg-[#EAF9F2] border border-[#CBEFE0] text-xs text-[#142647] leading-relaxed">
            <strong className="font-bold text-[#079669]">Coach Rationale: </strong>
            {schedule.aiAdvice}
          </div>
        </div>

        <div className="lg:col-span-5 ff-card p-6 space-y-5">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#079669]" />
            <h2 className="font-display text-lg font-bold text-[#142647]">Subject Workloads</h2>
          </div>

          <div className="space-y-3.5">
            {subjects.map((subj) => {
              const pct = Math.round(
                (subj.completedHoursThisWeek / Math.max(subj.targetHoursPerWeek, 1)) * 100
              );
              return (
                <div
                  key={subj.id}
                  className="p-3.5 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-bold text-[#142647]">{subj.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669]">
                      {subj.urgencyLevel}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-[#5A708D] tabular-nums">
                    <span>Weekly Progress</span>
                    <span>
                      {subj.completedHoursThisWeek}h / {subj.targetHoursPerWeek}h
                    </span>
                  </div>
                  <ProgressBar value={pct} label={subj.name} tone="emerald" size="sm" />
                </div>
              );
            })}
          </div>

          <form onSubmit={handleAddSubject} className="pt-3 border-t border-[#E1EEE9] space-y-3">
            <div className="text-xs font-bold text-[#142647]">Add New Course / Subject</div>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder="e.g., Linear Algebra"
              className="w-full px-3.5 py-2 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs text-[#142647]"
              required
            />
            <div className="grid grid-cols-2 gap-2">
              <select
                value={weeklyTarget}
                onChange={(e) => setWeeklyTarget(Number(e.target.value))}
                aria-label="Weekly target hours"
                className="px-3 py-2 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-semibold text-[#142647]"
              >
                <option value={4}>4 hrs / week</option>
                <option value={6}>6 hrs / week</option>
                <option value={8}>8 hrs / week</option>
                <option value={10}>10 hrs / week</option>
              </select>
              <select
                value={urgency}
                onChange={(e) =>
                  setUrgency(e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL')
                }
                aria-label="Subject urgency"
                className="px-3 py-2 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-semibold text-[#142647]"
              >
                <option value="MEDIUM">Medium Priority</option>
                <option value="HIGH">High Priority</option>
                <option value="CRITICAL">Exam Urgent</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[#E9F9F2] hover:bg-[#DDF7EC] border border-[#BCEAD7] text-[#079669] text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Subject to Planner</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
