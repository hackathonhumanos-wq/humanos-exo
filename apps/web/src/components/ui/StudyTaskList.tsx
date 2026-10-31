/**
 * @file apps/web/src/components/ui/StudyTaskList.tsx
 * @description Reusable Daily Study Plan checklist with duplicate prevention, task toggle persistence, and quick-add form
 */
import React, { useState } from 'react';
import { Calendar, Check, Plus } from 'lucide-react';
import type { StudyTimeSlot } from '../../../../../packages/shared-types/src/index.ts';

interface StudyTaskListProps {
  dateLabel?: string;
  slots: StudyTimeSlot[];
  onToggleSlot: (slotId: string) => Promise<void> | void;
  onAddSlot?: (input: { subject: string; durationMinutes: number }) => Promise<void> | void;
  onUpdatePlanClick?: () => void;
  compact?: boolean;
}

export const StudyTaskList: React.FC<StudyTaskListProps> = ({
  dateLabel,
  slots,
  onToggleSlot,
  onAddSlot,
  onUpdatePlanClick,
  compact = false,
}) => {
  const [addingTask, setAddingTask] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newDuration, setNewDuration] = useState(30);
  const [submitting, setSubmitting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const formattedToday =
    dateLabel ||
    `Today • ${new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })}`;

  const handleToggle = async (slotId: string) => {
    if (togglingId === slotId) return;
    try {
      setTogglingId(slotId);
      await onToggleSlot(slotId);
    } finally {
      setTogglingId(null);
    }
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddSlot || submitting) return;

    const cleanSubject = newSubject.trim();
    if (!cleanSubject) {
      setValidationError('Please enter a subject name.');
      return;
    }

    const duplicate = slots.some(
      (s) => s.subject.trim().toLowerCase() === cleanSubject.toLowerCase() && !s.isCompleted
    );
    if (duplicate) {
      setValidationError(`"${cleanSubject}" is already in your active study plan today.`);
      return;
    }

    try {
      setSubmitting(true);
      setValidationError(null);
      await onAddSlot({ subject: cleanSubject, durationMinutes: newDuration });
      setNewSubject('');
      setAddingTask(false);
    } catch (err) {
      setValidationError(err instanceof Error ? err.message : 'Could not add task right now.');
    } finally {
      setSubmitting(false);
    }
  };

  const displayedSlots = compact ? slots.slice(0, 4) : slots;

  return (
    <div className="ff-card p-5 sm:p-6 flex flex-col justify-between h-full">
      <div>
        <div className="flex items-center justify-between gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#E9F9F2] text-[#079669] flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <h3 className="font-display text-[15px] font-bold text-[#142447]">
              Your Daily Study Plan
            </h3>
          </div>
          <span className="text-[11px] font-medium text-[#8290A5] tabular-nums">
            {formattedToday}
          </span>
        </div>

        {displayedSlots.length === 0 ? (
          <div className="py-5 text-center text-xs text-[#8290A5]">
            No study blocks scheduled yet today. Add your first subject below!
          </div>
        ) : (
          <ul className="space-y-2.5" aria-label="Daily study tasks">
            {displayedSlots.map((slot) => {
              const labelText = `${slot.subject} – ${slot.topic}`;
              const isBusy = togglingId === slot.id;

              return (
                <li key={slot.id} className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={isBusy}
                    onClick={() => handleToggle(slot.id)}
                    className="flex items-center gap-3 text-left group cursor-pointer py-0.5 flex-1 min-w-0 disabled:opacity-60"
                    aria-pressed={slot.isCompleted}
                  >
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-colors shrink-0 ${
                        slot.isCompleted
                          ? 'bg-[#079669] border-[#079669] text-white'
                          : 'bg-white border-[#CBDCE2] group-hover:border-[#079669]'
                      }`}
                    >
                      {slot.isCompleted && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </span>
                    <span
                      className={`text-[13px] font-medium truncate ${
                        slot.isCompleted
                          ? 'line-through text-[#8290A5]'
                          : 'text-[#142447] group-hover:text-[#079669]'
                      }`}
                    >
                      {labelText}
                    </span>
                  </button>
                  {!compact && (
                    <span className="text-[11px] font-semibold text-[#8290A5] tabular-nums shrink-0">
                      {slot.timeSlot}
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        {addingTask && onAddSlot && (
          <form onSubmit={handleQuickAdd} className="mt-3 pt-3 border-t border-[#DFEBF0] space-y-2">
            <div className="flex flex-wrap gap-2">
              <input
                type="text"
                value={newSubject}
                onChange={(e) => {
                  setNewSubject(e.target.value);
                  if (validationError) setValidationError(null);
                }}
                placeholder="Subject (e.g. Biology)"
                aria-label="Study task subject"
                className="flex-1 min-w-[125px] px-3 py-1.5 rounded-xl bg-[#F8FCFA] border border-[#DFEBF0] text-xs text-[#142447] focus:outline-none focus:border-[#079669]"
                required
              />
              <select
                value={newDuration}
                onChange={(e) => setNewDuration(Number(e.target.value))}
                aria-label="Duration in minutes"
                className="px-2.5 py-1.5 rounded-xl bg-[#F8FCFA] border border-[#DFEBF0] text-xs font-semibold text-[#142447]"
              >
                <option value={20}>20 min</option>
                <option value={30}>30 min</option>
                <option value={45}>45 min</option>
                <option value={60}>60 min</option>
              </select>
              <button
                type="submit"
                disabled={submitting}
                className="px-3 py-1.5 rounded-xl bg-[#079669] hover:bg-[#087A54] text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add'}
              </button>
            </div>
            {validationError && (
              <p role="alert" className="text-[11px] font-medium text-[#EF4444]">
                {validationError}
              </p>
            )}
          </form>
        )}
      </div>

      <div className="mt-4 pt-2 flex items-center justify-between gap-2">
        {onAddSlot ? (
          <button
            type="button"
            onClick={() => {
              setAddingTask((v) => !v);
              setValidationError(null);
            }}
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#079669] hover:text-[#087A54] cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{addingTask ? 'Cancel' : 'Add Task'}</span>
          </button>
        ) : (
          <span />
        )}

        {onUpdatePlanClick && (
          <button
            type="button"
            onClick={onUpdatePlanClick}
            className="px-3.5 py-1.5 rounded-full bg-[#E9F9F2] hover:bg-[#DDF7EC] border border-[#BCEAD7] text-[#079669] text-xs font-bold cursor-pointer"
          >
            Update Plan
          </button>
        )}
      </div>
    </div>
  );
};
