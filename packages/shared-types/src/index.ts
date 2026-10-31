/**
 * @file packages/shared-types/src/index.ts
 * @description Central shared TypeScript types and data contracts for FOCUSFLOW
 */

export type UserRole = 'STUDENT' | 'PARENT' | 'COUNSELLOR' | 'ADMIN';

export interface UserSummary {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
}

export type PlatformType = 'INSTAGRAM_REELS' | 'YOUTUBE_SHORTS' | 'FACEBOOK_REELS' | 'OTHER';

export interface ReelEstimateEvent {
  platform: PlatformType;
  estimatedCount: number;
  durationSeconds: number;
  detectedAt: string;
  domain: string;
}

export interface FocusSessionData {
  id: string;
  userId: string;
  startTime: string;
  endTime?: string;
  plannedDurationMinutes: number;
  actualDurationMinutes?: number;
  mode: 'POMODORO' | 'DEEP_WORK' | 'EXAM_PREP';
  completed: boolean;
  notes?: string;
}

export interface DailySummaryData {
  date: string;
  userId: string;
  totalScreenTimeMinutes: number;
  distractingTimeMinutes: number;
  productiveTimeMinutes: number;
  reelsEstimatedTotal: number;
  focusSessionsCompleted: number;
  xpEarned: number;
}

export interface BlockedWebsiteRule {
  id: string;
  domain: string;
  category: 'SOCIAL_MEDIA' | 'GAMING' | 'STREAMING' | 'CUSTOM';
  enabled: boolean;
  scheduleStart?: string; // HH:mm
  scheduleEnd?: string;   // HH:mm
}

export interface AIRecommendationItem {
  id: string;
  category: 'SLEEP_ROUTINE' | 'STUDY_BREAK' | 'REEL_INTERVENTION' | 'FOCUS_PACING';
  title: string;
  content: string;
  actionableStep: string;
  confidenceScore: number;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, unknown>;
  error?: {
    code: string;
    details?: unknown;
  };
}

export interface ExtensionState {
  isActive: boolean;
  trackingEnabled: boolean;
  activeFocusSessionId: string | null;
  todayReelsEstimate: number;
  todayScreenTimeMinutes: number;
  blockedDomains: string[];
}

// -------------------------------------------------------------
// Phase 6: Gamification, Streaks, Challenges, Social & Study Groups
// -------------------------------------------------------------

export type XPActivityType =
  | 'FOCUS_SESSION_25M'
  | 'FOCUS_SESSION_50M'
  | 'DAILY_GOAL_MET'
  | 'DAILY_CHALLENGE_COMPLETED'
  | 'STREAK_3_DAYS'
  | 'STREAK_7_DAYS'
  | 'WEEKLY_CHALLENGE_COMPLETED'
  | 'STUDY_GROUP_SESSION'
  | 'ZERO_REELS_BONUS';

export interface XPTransactionRecord {
  id: string;
  userId: string;
  amount: number;
  activityType: XPActivityType;
  description: string;
  referenceId?: string; // ID of focus session, challenge, or goal to prevent duplicate rewards
  createdAt: string;
}

export interface StudentLevel {
  levelNumber: number;
  title: string;
  minXp: number;
  maxXp: number;
  badgeIcon: string;
}

export interface LevelProgress {
  currentLevel: StudentLevel;
  nextLevel: StudentLevel | null;
  totalXp: number;
  currentLevelXp: number;
  requiredXpForNext: number;
  progressPercent: number;
}

export type BadgeRarity = 'COMMON' | 'RARE' | 'EPIC' | 'LEGENDARY';
export type BadgeCategory = 'FOCUS' | 'CONSISTENCY' | 'WELLBEING' | 'SOCIAL';

export interface AchievementItem {
  id: string;
  code: string;
  title: string;
  description: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  xpReward: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  progressCurrent?: number;
  progressTotal?: number;
}

export type DayStreakStatus = 'COMPLETED' | 'MISSED' | 'TODAY' | 'FUTURE';

export interface StreakDayRecord {
  date: string; // YYYY-MM-DD
  status: DayStreakStatus;
  focusMinutes: number;
  sessionsCount: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  isActiveToday: boolean;
  streakFreezeAvailable: boolean;
  history: StreakDayRecord[];
}

export type ChallengeType = 'DAILY' | 'WEEKLY';
export type ChallengeDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type ChallengeStatus = 'IN_PROGRESS' | 'COMPLETED' | 'CLAIMED';

export interface ChallengeItem {
  id: string;
  title: string;
  description: string;
  type: ChallengeType;
  difficulty: ChallengeDifficulty;
  targetValue: number;
  currentValue: number;
  unit: string;
  xpReward: number;
  status: ChallengeStatus;
  expiresAt: string;
}

export interface FriendSummary {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  streakDays: number;
  totalXp: number;
  level: number;
  weeklyFocusHours: number;
  isOnline: boolean;
  status: 'ACCEPTED' | 'PENDING_INCOMING' | 'PENDING_OUTGOING';
}

export type GroupRole = 'OWNER' | 'ADMIN' | 'MEMBER';

export interface GroupMemberSummary {
  userId: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  role: GroupRole;
  joinedAt: string;
  weeklyFocusMinutes: number;
}

export interface StudyGroupItem {
  id: string;
  name: string;
  description: string;
  inviteCode: string;
  isPrivate: boolean;
  memberCount: number;
  totalWeeklyFocusMinutes: number;
  groupStreak: number;
  userRole?: GroupRole;
  members?: GroupMemberSummary[];
}

export type LeaderboardMetric = 'WEEKLY_XP' | 'MONTHLY_FOCUS' | 'DAILY_SESSIONS' | 'STREAK_DAYS';
export type LeaderboardScope = 'GLOBAL' | 'FRIENDS' | 'GROUPS';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  username: string;
  avatarUrl?: string;
  score: number;
  unit: string;
  isCurrentUser: boolean;
  level: number;
}

export type NotificationType =
  | 'XP_EARNED'
  | 'LEVEL_UP'
  | 'BADGE_UNLOCKED'
  | 'STREAK_MILESTONE'
  | 'CHALLENGE_COMPLETE'
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'GROUP_INVITE'
  | 'REEL_LIMIT_WARNING';

export interface AppNotification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  dataRefId?: string;
  createdAt: string;
}

// -------------------------------------------------------------
// Phase 9: Advanced AI Personalization, Adaptive Study Planner,
// Wellbeing Intelligence, Analytics, Feedback, & SaaS Monetization
// -------------------------------------------------------------

export interface SubjectWorkload {
  id: string;
  name: string;
  targetHoursPerWeek: number;
  completedHoursThisWeek: number;
  urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  examDate?: string;
  color: string;
}

export interface StudyTimeSlot {
  id: string;
  timeSlot: string; // e.g. "09:00 - 10:30"
  subject: string;
  topic: string;
  recommendedMode: 'POMODORO' | 'DEEP_WORK' | 'ACTIVE_RECALL';
  energyLevelRequired: 'HIGH' | 'MEDIUM' | 'LOW';
  isCompleted: boolean;
  aiRationale: string;
}

export interface AdaptiveDailySchedule {
  date: string;
  energyArchetype: 'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL';
  recommendedFocusHours: number;
  scheduledSlots: StudyTimeSlot[];
  readinessScore: number; // 0-100
  aiAdvice: string;
}

export interface DoomscrollRiskWindow {
  timeWindow: string; // e.g. "22:00 - 00:30"
  riskLevel: 'LOW' | 'MODERATE' | 'ELEVATED' | 'HIGH';
  triggerContext: string;
  recommendedShield: string;
}

export interface WellbeingHealthScore {
  overallScore: number; // 0-100
  focusResilience: number; // 0-100
  restorativeSleepHygiene: number; // 0-100
  shortFormDiscipline: number; // 0-100
  weeklyReelsEstimated: number;
  reelsTrendPercent: number; // -18% vs last week
  estimatedTransitions: number;
  disclaimer: string;
  riskWindows: DoomscrollRiskWindow[];
  interventions: string[];
}

export type AnalyticsEventType =
  | 'FOCUS_SESSION_STARTED'
  | 'FOCUS_SESSION_FINISHED'
  | 'REEL_INTERVENTION_TRIGGERED'
  | 'CHALLENGE_ACCEPTED'
  | 'STREAK_PRESERVED'
  | 'AI_RECOMMENDATION_VIEWED'
  | 'AUTOMATION_EXECUTED'
  | 'FEEDBACK_SUBMITTED';

export interface AnalyticsEventRecord {
  id: string;
  userId: string;
  eventType: AnalyticsEventType;
  metadata: Record<string, unknown>;
  timestamp: string;
}

export type FeedbackCategory = 'BUG' | 'FEATURE_REQUEST' | 'UI_UX' | 'ACCESSIBILITY' | 'PRAISE';
export type FeedbackStatus = 'SUBMITTED' | 'TRIAGED' | 'IN_PROGRESS' | 'RESOLVED';

export interface ProductFeedbackItem {
  id: string;
  userId: string;
  category: FeedbackCategory;
  rating: number; // 1 to 5
  title: string;
  description: string;
  status: FeedbackStatus;
  createdAt: string;
  adminResponse?: string;
}

export type SubscriptionTier = 'STUDENT_FREE' | 'STUDENT_PLUS' | 'PRO_CAMPUS';
export type BillingInterval = 'MONTHLY' | 'ANNUAL';

export interface SubscriptionPlan {
  id: SubscriptionTier;
  name: string;
  priceMonthlyInr: number;
  priceAnnualInr: number;
  priceMonthlyUsd: number;
  description: string;
  features: string[];
  isPopular?: boolean;
}

export interface UserSubscriptionState {
  userId: string;
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: string | null;
  billingInterval?: BillingInterval;
  provider: 'MOCK_RAZORPAY' | 'STRIPE_SANDBOX' | 'INSTITUTIONAL_KEY';
  featuresUnlocked: string[];
}

export interface PaymentOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  tier: SubscriptionTier;
  billingInterval: BillingInterval;
  keyId: string;
  mockGatewayUrl?: string;
}

// -------------------------------------------------------------
// Phase 10: Multi-Agent AI System, Smart Automations & Institutional Portal
// -------------------------------------------------------------

export type AgentId =
  | 'study_planner'
  | 'focus_coach'
  | 'wellbeing_agent'
  | 'productivity_analyst'
  | 'goal_optimizer'
  | 'report_generator';

export type AgentAutonomyLevel = 'SUPERVISED' | 'SEMI_AUTONOMOUS' | 'FULL_ADVISORY';

export interface AgentMetadata {
  id: AgentId;
  name: string;
  role: string;
  description: string;
  avatarIcon: string;
  autonomyLevel: AgentAutonomyLevel;
  status: 'ONLINE' | 'ACTIVE' | 'IDLE';
  lastRunTimestamp: string;
}

export interface AgentActionStep {
  id: string;
  agentId: AgentId;
  action: string;
  inputSummary: string;
  outputSummary: string;
  confidenceScore: number;
  requiresUserApproval: boolean;
  isApproved?: boolean;
  timestamp: string;
}

export interface MultiAgentSynthesisReport {
  id: string;
  generatedAt: string;
  overallProductivityGrade: 'A+' | 'A' | 'B+' | 'B' | 'C';
  executiveSummary: string;
  agentPerspectives: {
    agentId: AgentId;
    agentName: string;
    keyObservation: string;
    actionableDirective: string;
  }[];
  autonomousActionsProposed: AgentActionStep[];
}

export type AutomationTriggerType =
  | 'REEL_COUNT_EXCEEDED'
  | 'DAILY_GOAL_MET'
  | 'STREAK_AT_RISK'
  | 'BEDTIME_APPROACHING'
  | 'FOCUS_SESSION_COMPLETED';

export type AutomationActionType =
  | 'SEND_DISMISSABLE_NUDGE'
  | 'ACTIVATE_STRICT_BLOCKER'
  | 'AWARD_BONUS_XP'
  | 'SCHEDULE_CALENDAR_BREAK'
  | 'NOTIFY_COACH';

export interface AutomationRule {
  id: string;
  userId: string;
  name: string;
  description: string;
  trigger: AutomationTriggerType;
  triggerThreshold: number;
  action: AutomationActionType;
  isEnabled: boolean;
  executionCount: number;
  lastExecutedAt?: string;
}

export interface InstitutionalCohortSummary {
  institutionId: string;
  institutionName: string;
  cohortName: string;
  totalStudentsEnrolled: number;
  optedInStudentsCount: number;
  averageWeeklyFocusMinutes: number;
  averageWellbeingScore: number;
  reelsDistractionReductionPercent: number;
  kAnonymityPassed: boolean;
  dataPrivacyNote: string;
}

// -------------------------------------------------------------
// Light Theme Redesign: Overview, Screen Time, Reels & Shorts
// Analytics, User Goals, Focus Session Logs & Privacy Consent
// -------------------------------------------------------------

export type DetectionConfidence = 'HIGH' | 'MEDIUM' | 'LOW';

export interface ReelsPlatformBreakdown {
  platform: 'INSTAGRAM_REELS' | 'YOUTUBE_SHORTS' | 'FACEBOOK_REELS';
  label: string;
  shortLabel: string;
  estimatedInteractions: number;
  estimatedMinutes: number;
  sharePercent: number;
  color: string;
  detectionMethod: string;
  confidence: DetectionConfidence;
}

export interface ReelsDailyTrendPoint {
  date: string;
  dayLabel: string;
  reelsEstimated: number;
  shortsEstimated: number;
  facebookEstimated: number;
  totalEstimated: number;
  estimatedMinutes: number;
}

export interface ReelsTrackingHistoryItem {
  id: string;
  platform: 'INSTAGRAM_REELS' | 'YOUTUBE_SHORTS' | 'FACEBOOK_REELS';
  platformLabel: string;
  estimatedInteractions: number;
  estimatedMinutes: number;
  detectedAt: string;
  confidence: DetectionConfidence;
  detectionSignal: string;
  isDemo?: boolean;
  correctedByUser?: boolean;
}

export interface ReelsSettingsState {
  dailyInteractionLimit: number;
  dailyMinutesLimit: number;
  trackingPaused: boolean;
  gentleNudgeThreshold: number;
  updatedAt: string;
}

export interface ReelsAnalyticsSummary {
  todayTotalEstimatedInteractions: number;
  todayEstimatedReels: number;
  todayEstimatedShorts: number;
  todayEstimatedFacebookReels: number;
  todayEstimatedMinutes: number;
  vsLastWeekPercent: number;
  weeklyTotalEstimatedInteractions: number;
  weeklyEstimatedMinutes: number;
  sparkline7d: number[];
  platformBreakdown: ReelsPlatformBreakdown[];
  dailyTrends: ReelsDailyTrendPoint[];
  settings: ReelsSettingsState;
  coverage: {
    supportedPlatforms: string[];
    unsupportedContexts: string[];
    browserExtensionConnected: boolean;
    permissionStatus: 'GRANTED' | 'PAUSED_BY_USER' | 'EXTENSION_NOT_DETECTED';
    coveragePercentEstimate: number;
    ethicalDisclaimer: string;
  };
  history: ReelsTrackingHistoryItem[];
}

export interface WeeklyFocusDayPoint {
  dayLabel: string;
  date: string;
  focusHours: number;
  screenHours: number;
  focusMinutes: number;
  screenMinutes: number;
}

export interface UserGoalItem {
  id: string;
  title: string;
  category: 'FOCUS_MINUTES' | 'REELS_CAP' | 'SCREEN_TIME_CAP' | 'STUDY_SESSIONS';
  currentValue: number;
  targetValue: number;
  unit: string;
  isInverseCap: boolean;
  isActive: boolean;
}

export interface PrivacyConsentState {
  consentShareWithParent: boolean;
  consentShareWithCounsellor: boolean;
  consentExtensionTelemetry: boolean;
  consentAiProductivityAnalysis: boolean;
  trackingPaused: boolean;
  updatedAt: string;
}

export interface FocusSessionLogRecord {
  id: string;
  subject: string;
  mode: 'POMODORO' | 'DEEP_WORK' | 'EXAM_PREP';
  durationMinutes: number;
  xpEarned: number;
  completedAt: string;
  isDemo?: boolean;
}

export interface DashboardOverviewData {
  studentName: string;
  studentFullName: string;
  studentRoleLabel: string;
  focusMinutesToday: number;
  focusVsLastWeekPercent: number;
  focusSparkline7d: number[];
  screenMinutesToday: number;
  screenVsLastWeekPercent: number;
  screenSparkline7d: number[];
  dailyGoalPercent: number;
  dailyFocusTargetMinutes: number;
  completedSessionsToday: number;
  weeklyOverview: WeeklyFocusDayPoint[];
  coachHeroQuote: string;
  coachRecommendation: {
    headline: string;
    detail: string;
    suggestedDurationMinutes: number;
    confidenceScore: number;
  };
  recentSessions: FocusSessionLogRecord[];
  goals: UserGoalItem[];
}

