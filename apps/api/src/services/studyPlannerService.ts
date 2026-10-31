/**
 * @file apps/api/src/services/studyPlannerService.ts
 * @description Adaptive study planning engine generating personalized, energy-aware schedules with persistent daily tasks
 */
import type {
  SubjectWorkload,
  AdaptiveDailySchedule,
  StudyTimeSlot,
} from '../../../../packages/shared-types/src/index.ts';
import type { StudySlotCreateInput } from '../../../../packages/validation/src/index.ts';

class StudyPlannerService {
  private subjects: SubjectWorkload[] = [
    {
      id: 'sub-1',
      name: 'Mathematics — Vector Calculus & Linear Algebra',
      targetHoursPerWeek: 12,
      completedHoursThisWeek: 8.5,
      urgencyLevel: 'CRITICAL',
      examDate: '2026-05-18',
      color: '#079669',
    },
    {
      id: 'sub-2',
      name: 'Physics — Electromagnetism & Wave Optics',
      targetHoursPerWeek: 8,
      completedHoursThisWeek: 5.0,
      urgencyLevel: 'HIGH',
      examDate: '2026-05-24',
      color: '#438CF5',
    },
    {
      id: 'sub-3',
      name: 'Chemistry — Organic Reaction Mechanisms',
      targetHoursPerWeek: 6,
      completedHoursThisWeek: 4.0,
      urgencyLevel: 'MEDIUM',
      examDate: '2026-06-02',
      color: '#7C5CFC',
    },
    {
      id: 'sub-4',
      name: 'Computer Science — Data Structures Revision',
      targetHoursPerWeek: 6,
      completedHoursThisWeek: 5.0,
      urgencyLevel: 'LOW',
      examDate: '2026-06-15',
      color: '#F59E0B',
    },
  ];

  private activeSchedule: AdaptiveDailySchedule | null = null;

  constructor() {
    this.activeSchedule = this.buildSchedule('AFTERNOON_BALANCED', 6);
  }

  public getSubjects(): SubjectWorkload[] {
    return this.subjects;
  }

  public addOrUpdateSubject(subject: Partial<SubjectWorkload> & { name: string }): SubjectWorkload {
    const existingIndex = this.subjects.findIndex(s => s.id === subject.id || s.name === subject.name);
    if (existingIndex >= 0) {
      this.subjects[existingIndex] = { ...this.subjects[existingIndex], ...subject };
      return this.subjects[existingIndex];
    }
    const newSubject: SubjectWorkload = {
      id: `sub-${Date.now()}`,
      name: subject.name,
      targetHoursPerWeek: subject.targetHoursPerWeek || 6,
      completedHoursThisWeek: subject.completedHoursThisWeek || 0,
      urgencyLevel: subject.urgencyLevel || 'MEDIUM',
      examDate: subject.examDate,
      color: subject.color || '#079669',
    };
    this.subjects.push(newSubject);
    return newSubject;
  }

  public getCurrentSchedule(): AdaptiveDailySchedule {
    if (!this.activeSchedule) {
      this.activeSchedule = this.buildSchedule('AFTERNOON_BALANCED', 6);
    }
    return this.activeSchedule;
  }

  public generateAdaptiveSchedule(
    energyArchetype: 'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL' = 'AFTERNOON_BALANCED',
    targetHours: number = 6
  ): AdaptiveDailySchedule {
    if (
      this.activeSchedule &&
      this.activeSchedule.energyArchetype === energyArchetype &&
      this.activeSchedule.recommendedFocusHours === targetHours
    ) {
      return this.activeSchedule;
    }
    this.activeSchedule = this.buildSchedule(energyArchetype, targetHours);
    return this.activeSchedule;
  }

  public regenerateSchedule(
    energyArchetype: 'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL' = 'AFTERNOON_BALANCED',
    targetHours: number = 6
  ): AdaptiveDailySchedule {
    this.activeSchedule = this.buildSchedule(energyArchetype, targetHours);
    return this.activeSchedule;
  }

  private buildSchedule(
    energyArchetype: 'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL',
    targetHours: number
  ): AdaptiveDailySchedule {
    const todayStr = new Date().toISOString().split('T')[0];
    const slots: StudyTimeSlot[] = [];

    if (energyArchetype === 'MORNING_LARK') {
      slots.push(
        {
          id: 'slot-1',
          timeSlot: '07:30 – 08:15 (45 min)',
          subject: 'Mathematics',
          topic: '45 min — Vector Calculus & Eigenvalues',
          recommendedMode: 'DEEP_WORK',
          energyLevelRequired: 'HIGH',
          isCompleted: true,
          aiRationale: 'Peak morning cognitive bandwidth allocated to highest-priority exam topic.',
        },
        {
          id: 'slot-2',
          timeSlot: '09:30 – 10:15 (45 min)',
          subject: 'Physics',
          topic: '45 min — Gauss Law & Field Practice',
          recommendedMode: 'POMODORO',
          energyLevelRequired: 'HIGH',
          isCompleted: false,
          aiRationale: 'High-focus analytical problem set scheduled before midday fatigue.',
        },
        {
          id: 'slot-3',
          timeSlot: '14:00 – 14:30 (30 min)',
          subject: 'Chemistry',
          topic: '30 min — Reaction Mechanisms Flashcards',
          recommendedMode: 'ACTIVE_RECALL',
          energyLevelRequired: 'MEDIUM',
          isCompleted: false,
          aiRationale: 'Interactive active-recall format prevents post-lunch attention dip.',
        },
        {
          id: 'slot-4',
          timeSlot: '17:00 – 17:20 (20 min)',
          subject: 'Revision',
          topic: '20 min — Formula Sheet & Error Log Recap',
          recommendedMode: 'POMODORO',
          energyLevelRequired: 'LOW',
          isCompleted: false,
          aiRationale: 'Low-friction evening consolidation to lock in memory retention.',
        }
      );
    } else if (energyArchetype === 'NIGHT_OWL') {
      slots.push(
        {
          id: 'slot-1',
          timeSlot: '11:00 – 11:45 (45 min)',
          subject: 'Physics',
          topic: '45 min — Wave Interference Problems',
          recommendedMode: 'POMODORO',
          energyLevelRequired: 'MEDIUM',
          isCompleted: true,
          aiRationale: 'Gentle late-morning warm-up session to build study momentum.',
        },
        {
          id: 'slot-2',
          timeSlot: '15:30 – 16:00 (30 min)',
          subject: 'Chemistry',
          topic: '30 min — Stereochemistry Synthesis',
          recommendedMode: 'ACTIVE_RECALL',
          energyLevelRequired: 'MEDIUM',
          isCompleted: false,
          aiRationale: 'Structured afternoon sprint with distraction shield active.',
        },
        {
          id: 'slot-3',
          timeSlot: '20:00 – 20:45 (45 min)',
          subject: 'Mathematics',
          topic: '45 min — Differential Equations Deep Dive',
          recommendedMode: 'DEEP_WORK',
          energyLevelRequired: 'HIGH',
          isCompleted: false,
          aiRationale: 'Evening alertness peak paired with your highest-weight subject.',
        },
        {
          id: 'slot-4',
          timeSlot: '21:15 – 21:35 (20 min)',
          subject: 'Revision',
          topic: '20 min — Quick Summary Notes before Wind-Down',
          recommendedMode: 'POMODORO',
          energyLevelRequired: 'LOW',
          isCompleted: false,
          aiRationale: 'Wraps up screen exposure well before sleep window.',
        }
      );
    } else {
      slots.push(
        {
          id: 'slot-1',
          timeSlot: '09:00 – 09:45 (45 min)',
          subject: 'Mathematics',
          topic: '45 min — Multivariable Integration',
          recommendedMode: 'DEEP_WORK',
          energyLevelRequired: 'HIGH',
          isCompleted: true,
          aiRationale: 'Morning momentum builder tackling critical analytical problem sets.',
        },
        {
          id: 'slot-2',
          timeSlot: '11:15 – 12:00 (45 min)',
          subject: 'Physics',
          topic: '45 min — Electromagnetism Numericals',
          recommendedMode: 'POMODORO',
          energyLevelRequired: 'MEDIUM',
          isCompleted: false,
          aiRationale: 'Focused sprint with a 5-minute eye-rest break afterward.',
        },
        {
          id: 'slot-3',
          timeSlot: '15:00 – 15:30 (30 min)',
          subject: 'Chemistry',
          topic: '30 min — Organic Mechanisms Active Recall',
          recommendedMode: 'ACTIVE_RECALL',
          energyLevelRequired: 'MEDIUM',
          isCompleted: false,
          aiRationale: 'Active recall practice sustains afternoon engagement.',
        },
        {
          id: 'slot-4',
          timeSlot: '17:30 – 17:50 (20 min)',
          subject: 'Revision',
          topic: '20 min — Key Mistake Journal Review',
          recommendedMode: 'POMODORO',
          energyLevelRequired: 'LOW',
          isCompleted: false,
          aiRationale: 'Light recap closing out your study plan without evening burnout.',
        }
      );
    }

    return {
      date: todayStr,
      energyArchetype,
      recommendedFocusHours: targetHours,
      scheduledSlots: slots,
      readinessScore: 89,
      aiAdvice: `Your circadian focus readiness is 89%. High-priority Mathematics and Physics blocks are scheduled in your sharpest windows, followed by lighter active recall and 20-minute revision.`,
    };
  }

  public toggleSlotComplete(slotId: string): AdaptiveDailySchedule {
    const schedule = this.getCurrentSchedule();
    schedule.scheduledSlots = schedule.scheduledSlots.map(slot =>
      slot.id === slotId ? { ...slot, isCompleted: !slot.isCompleted } : slot
    );
    return schedule;
  }

  public addCustomSlot(input: StudySlotCreateInput): AdaptiveDailySchedule {
    const schedule = this.getCurrentSchedule();
    const newSlot: StudyTimeSlot = {
      id: `slot-${Date.now()}`,
      timeSlot: input.timeSlot || `Flexible (${input.durationMinutes} min)`,
      subject: input.subject,
      topic: `${input.durationMinutes} min — ${input.topic}`,
      recommendedMode: input.recommendedMode,
      energyLevelRequired: input.durationMinutes >= 45 ? 'HIGH' : 'MEDIUM',
      isCompleted: false,
      aiRationale: 'Added directly by student to today’s study agenda.',
    };
    schedule.scheduledSlots.push(newSlot);
    return schedule;
  }
}

export const studyPlannerService = new StudyPlannerService();
