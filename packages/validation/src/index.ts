/**
 * @file packages/validation/src/index.ts
 * @description Central Zod validation schemas for FOCUSFLOW request payloads and data validation
 */
import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email({ message: 'Valid student or institutional email required' }),
  password: z.string().min(8, { message: 'Password must be at least 8 characters long' }),
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  role: z.enum(['STUDENT', 'PARENT', 'COUNSELLOR', 'ADMIN']).default('STUDENT'),
});

export const loginSchema = z.object({
  email: z.string().email({ message: 'Valid email required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export const reelStatIngestSchema = z.object({
  platform: z.enum(['INSTAGRAM_REELS', 'YOUTUBE_SHORTS', 'FACEBOOK_REELS', 'OTHER']),
  estimatedCount: z.number().int().min(1).max(5000),
  durationSeconds: z.number().int().min(1),
  detectedAt: z.string().datetime(),
  domain: z.string().min(3),
});

export const focusSessionStartSchema = z.object({
  plannedDurationMinutes: z.number().int().min(5).max(240),
  mode: z.enum(['POMODORO', 'DEEP_WORK', 'EXAM_PREP']).default('POMODORO'),
  notes: z.string().max(500).optional(),
});

export const focusSessionEndSchema = z.object({
  actualDurationMinutes: z.number().int().min(1),
  completed: z.boolean(),
  notes: z.string().max(500).optional(),
});

export const privacyConsentSchema = z.object({
  consentShareWithParent: z.boolean().default(false),
  consentShareWithCounsellor: z.boolean().default(false),
  consentExtensionTelemetry: z.boolean().default(true),
  consentAiProductivityAnalysis: z.boolean().default(true),
});

// Phase 9 & 10 Validation Schemas
export const feedbackSchema = z.object({
  category: z.enum(['BUG', 'FEATURE_REQUEST', 'UI_UX', 'ACCESSIBILITY', 'PRAISE']),
  rating: z.number().int().min(1).max(5),
  title: z.string().min(3).max(120),
  description: z.string().min(10).max(1500),
});

export const studyPlanGenerateSchema = z.object({
  energyArchetype: z.enum(['MORNING_LARK', 'AFTERNOON_BALANCED', 'NIGHT_OWL']).default('AFTERNOON_BALANCED'),
  targetHours: z.number().min(1).max(16).default(6),
  subjects: z.array(
    z.object({
      name: z.string().min(1),
      urgencyLevel: z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']),
      targetHoursPerWeek: z.number().min(1).max(40),
    })
  ).min(1),
});

export const subscriptionCheckoutSchema = z.object({
  tier: z.enum(['STUDENT_FREE', 'STUDENT_PLUS', 'PRO_CAMPUS']),
  billingInterval: z.enum(['MONTHLY', 'ANNUAL']).default('MONTHLY'),
});

export const automationRuleSchema = z.object({
  name: z.string().min(3).max(100),
  description: z.string().min(5).max(250),
  trigger: z.enum([
    'REEL_COUNT_EXCEEDED',
    'DAILY_GOAL_MET',
    'STREAK_AT_RISK',
    'BEDTIME_APPROACHING',
    'FOCUS_SESSION_COMPLETED',
  ]),
  triggerThreshold: z.number().min(1),
  action: z.enum([
    'SEND_DISMISSABLE_NUDGE',
    'ACTIVATE_STRICT_BLOCKER',
    'AWARD_BONUS_XP',
    'SCHEDULE_CALENDAR_BREAK',
    'NOTIFY_COACH',
  ]),
  isEnabled: z.boolean().default(true),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ReelStatIngestInput = z.infer<typeof reelStatIngestSchema>;
export type FocusSessionStartInput = z.infer<typeof focusSessionStartSchema>;
export type PrivacyConsentInput = z.infer<typeof privacyConsentSchema>;
export type FeedbackInput = z.infer<typeof feedbackSchema>;
export type StudyPlanGenerateInput = z.infer<typeof studyPlanGenerateSchema>;
export type SubscriptionCheckoutInput = z.infer<typeof subscriptionCheckoutSchema>;
export type AutomationRuleInput = z.infer<typeof automationRuleSchema>;
