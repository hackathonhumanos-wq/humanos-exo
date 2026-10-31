/**
 * @file apps/web/src/services/apiClient.ts
 * @description Strictly typed Frontend API Client for FOCUSFLOW Backend Services
 */
import type {
  LevelProgress,
  StudentLevel,
  AchievementItem,
  StreakInfo,
  ChallengeItem,
  XPTransactionRecord,
  FriendSummary,
  StudyGroupItem,
  LeaderboardEntry,
  LeaderboardMetric,
  LeaderboardScope,
  AppNotification,
  XPActivityType,
  DashboardOverviewData,
  FocusSessionLogRecord,
  UserGoalItem,
  ReelsAnalyticsSummary,
  ReelsSettingsState,
  PrivacyConsentState,
  SubjectWorkload,
  AdaptiveDailySchedule,
  WellbeingHealthScore,
  ProductFeedbackItem,
  FeedbackCategory,
  SubscriptionPlan,
  UserSubscriptionState,
  SubscriptionTier,
  BillingInterval,
  PaymentOrderResponse,
  AgentMetadata,
  AgentActionStep,
  MultiAgentSynthesisReport,
  AgentId,
  AgentAutonomyLevel,
  AutomationRule,
  InstitutionalCohortSummary,
} from '../../../../packages/shared-types/src/index.ts';
import type {
  ReelsSettingsUpdateInput,
  ReelsDataCorrectionInput,
  FocusSessionCompleteInput,
  GoalUpsertInput,
  StudySlotCreateInput,
  PrivacyConsentInput,
  AutomationRuleInput,
} from '../../../../packages/validation/src/index.ts';

interface ApiEnvelope<T> {
  success: boolean;
  message?: string;
  data: T;
}

function getApiBaseUrl(): string {
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin}/api/v1`;
  }
  return '/api/v1';
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${getApiBaseUrl()}${endpoint}`;
  const method = (options?.method || 'GET').toUpperCase();
  const maxAttempts = method === 'GET' ? 3 : 2;

  const headers: Record<string, string> = {
    Accept: 'application/json',
  };
  if (options?.body) {
    headers['Content-Type'] = 'application/json';
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await fetch(url, {
        ...options,
        credentials: 'same-origin',
        headers: {
          ...headers,
          ...(options?.headers as Record<string, string> | undefined),
        },
      });

      if (res.status === 502 || res.status === 503 || res.status === 504) {
        if (attempt < maxAttempts) {
          await delay(attempt * 350);
          continue;
        }
      }

      if (!res.ok) {
        const errorBody = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(errorBody.message || `HTTP ${res.status}: ${res.statusText}`);
      }

      return (await res.json()) as T;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error('Network request failed');
      const isTransientNetworkError =
        lastError.name === 'TypeError' || /failed to fetch|network/i.test(lastError.message);

      if (isTransientNetworkError && attempt < maxAttempts) {
        await delay(attempt * 400);
        continue;
      }
      throw lastError;
    }
  }

  throw lastError || new Error('Unable to reach FOCUSFLOW server.');
}

export const apiClient = {
  // Health
  async getHealth(): Promise<{ status: string; timestamp: string }> {
    const res = await request<ApiEnvelope<{ status: string; timestamp: string }>>('/health');
    return res.data;
  },

  // Dashboard Overview, Focus Sessions & Goals
  async getOverview(): Promise<DashboardOverviewData> {
    const res = await request<ApiEnvelope<DashboardOverviewData>>('/analytics/overview');
    return res.data;
  },

  async logFocusSession(input: FocusSessionCompleteInput): Promise<{
    success: boolean;
    message: string;
    data: {
      session: FocusSessionLogRecord;
      xpEarned: number;
      overview: DashboardOverviewData;
    };
  }> {
    return request('/analytics/focus-sessions', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async getGoals(): Promise<UserGoalItem[]> {
    const res = await request<ApiEnvelope<UserGoalItem[]>>('/analytics/goals');
    return res.data;
  },

  async saveGoal(input: GoalUpsertInput): Promise<{ success: boolean; message: string; data: UserGoalItem[] }> {
    return request('/analytics/goals', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  async deleteGoal(goalId: string): Promise<{ success: boolean; message: string; data: UserGoalItem[] }> {
    return request(`/analytics/goals/${goalId}`, {
      method: 'DELETE',
    });
  },

  // Reels & Shorts Analytics, Limits, Pause Tracking & Data Correction
  async getReelsAnalytics(): Promise<ReelsAnalyticsSummary> {
    const res = await request<ApiEnvelope<ReelsAnalyticsSummary>>('/wellbeing/reels');
    return res.data;
  },

  async updateReelsSettings(
    input: ReelsSettingsUpdateInput
  ): Promise<{ success: boolean; message: string; data: ReelsSettingsState }> {
    return request('/wellbeing/reels/settings', {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },

  async correctReelsHistory(
    input: ReelsDataCorrectionInput
  ): Promise<{ success: boolean; message: string; data: ReelsAnalyticsSummary }> {
    return request('/wellbeing/reels/correct', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // Privacy Consent & Wellbeing Health Score
  async getPrivacyConsent(): Promise<PrivacyConsentState> {
    const res = await request<ApiEnvelope<PrivacyConsentState>>('/wellbeing/privacy');
    return res.data;
  },

  async updatePrivacyConsent(
    input: PrivacyConsentInput
  ): Promise<{ success: boolean; message: string; data: PrivacyConsentState }> {
    return request('/wellbeing/privacy', {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  async getWellbeingHealthScore(): Promise<WellbeingHealthScore> {
    const res = await request<ApiEnvelope<WellbeingHealthScore>>('/wellbeing/health-score');
    return res.data;
  },

  // Adaptive Study Planner
  async getPlannerSubjects(): Promise<SubjectWorkload[]> {
    const res = await request<ApiEnvelope<SubjectWorkload[]>>('/planner/subjects');
    return res.data;
  },

  async addPlannerSubject(input: {
    name: string;
    targetHoursPerWeek: number;
    urgencyLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    examDate?: string;
    color?: string;
  }): Promise<SubjectWorkload> {
    const res = await request<ApiEnvelope<SubjectWorkload>>('/planner/subjects', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return res.data;
  },

  async getCurrentSchedule(): Promise<AdaptiveDailySchedule> {
    const res = await request<ApiEnvelope<AdaptiveDailySchedule>>('/planner/schedule');
    return res.data;
  },

  async generateSchedule(params: {
    energyArchetype: 'MORNING_LARK' | 'AFTERNOON_BALANCED' | 'NIGHT_OWL';
    targetHours: number;
    regenerate?: boolean;
  }): Promise<AdaptiveDailySchedule> {
    const res = await request<ApiEnvelope<AdaptiveDailySchedule>>('/planner/schedule', {
      method: 'POST',
      body: JSON.stringify(params),
    });
    return res.data;
  },

  async toggleStudySlot(slotId: string): Promise<AdaptiveDailySchedule> {
    const res = await request<ApiEnvelope<AdaptiveDailySchedule>>(`/planner/slots/${slotId}/toggle`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async addStudySlot(input: StudySlotCreateInput): Promise<AdaptiveDailySchedule> {
    const res = await request<ApiEnvelope<AdaptiveDailySchedule>>('/planner/slots', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    return res.data;
  },

  // Gamification & XP
  async getGamificationProfile(): Promise<{
    userId: string;
    levelProgress: LevelProgress;
    streakInfo: StreakInfo;
    totalBadges: number;
    unlockedBadges: number;
    levelsReference: StudentLevel[];
  }> {
    const res = await request<
      ApiEnvelope<{
        userId: string;
        levelProgress: LevelProgress;
        streakInfo: StreakInfo;
        totalBadges: number;
        unlockedBadges: number;
        levelsReference: StudentLevel[];
      }>
    >('/gamification/profile');
    return res.data;
  },

  async getXp(): Promise<{ totalXp: number; levelProgress: LevelProgress }> {
    const res = await request<ApiEnvelope<{ totalXp: number; levelProgress: LevelProgress }>>('/gamification/xp');
    return res.data;
  },

  async getXpHistory(): Promise<{ transactions: XPTransactionRecord[]; count: number }> {
    const res = await request<ApiEnvelope<{ transactions: XPTransactionRecord[]; count: number }>>(
      '/gamification/xp/history'
    );
    return res.data;
  },

  async awardXp(
    activityType: XPActivityType,
    customDescription?: string,
    referenceId?: string
  ): Promise<{
    success: boolean;
    message: string;
    data: { xpEarned: number; newTotalXp: number };
  }> {
    return request('/gamification/xp/award', {
      method: 'POST',
      body: JSON.stringify({ activityType, customDescription, referenceId }),
    });
  },

  async getAchievements(): Promise<{
    achievements: AchievementItem[];
    unlockedCount: number;
    totalCount: number;
  }> {
    const res = await request<
      ApiEnvelope<{
        achievements: AchievementItem[];
        unlockedCount: number;
        totalCount: number;
      }>
    >('/gamification/achievements');
    return res.data;
  },

  async getStreaks(): Promise<StreakInfo> {
    const res = await request<ApiEnvelope<StreakInfo>>('/gamification/streaks');
    return res.data;
  },

  async getChallenges(): Promise<{
    challenges: ChallengeItem[];
    daily: ChallengeItem[];
    weekly: ChallengeItem[];
  }> {
    const res = await request<
      ApiEnvelope<{
        challenges: ChallengeItem[];
        daily: ChallengeItem[];
        weekly: ChallengeItem[];
      }>
    >('/gamification/challenges');
    return res.data;
  },

  async claimChallenge(challengeId: string): Promise<{ success: boolean; xpEarned: number; message: string }> {
    return request(`/gamification/challenges/${challengeId}/claim`, {
      method: 'POST',
    });
  },

  // Friends
  async getFriends(): Promise<{
    all: FriendSummary[];
    accepted: FriendSummary[];
    pendingIncoming: FriendSummary[];
    pendingOutgoing: FriendSummary[];
  }> {
    const res = await request<
      ApiEnvelope<{
        all: FriendSummary[];
        accepted: FriendSummary[];
        pendingIncoming: FriendSummary[];
        pendingOutgoing: FriendSummary[];
      }>
    >('/friends');
    return res.data;
  },

  async sendFriendRequest(
    username: string
  ): Promise<{ success: boolean; message: string; friend?: FriendSummary }> {
    return request('/friends/request', {
      method: 'POST',
      body: JSON.stringify({ username }),
    });
  },

  async acceptFriendRequest(friendId: string): Promise<{ success: boolean; message: string }> {
    return request(`/friends/${friendId}/accept`, {
      method: 'POST',
    });
  },

  async rejectFriendRequest(friendId: string): Promise<{ success: boolean; message: string }> {
    return request(`/friends/${friendId}/reject`, {
      method: 'POST',
    });
  },

  async removeFriend(friendId: string): Promise<{ success: boolean; message: string }> {
    return request(`/friends/${friendId}`, {
      method: 'DELETE',
    });
  },

  // Study Groups
  async getStudyGroups(): Promise<{ groups: StudyGroupItem[]; myGroups: StudyGroupItem[] }> {
    const res = await request<ApiEnvelope<{ groups: StudyGroupItem[]; myGroups: StudyGroupItem[] }>>('/groups');
    return res.data;
  },

  async createStudyGroup(data: { name: string; description: string; isPrivate: boolean }): Promise<{
    success: boolean;
    group?: StudyGroupItem;
    message: string;
  }> {
    return request('/groups', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async joinStudyGroup(inviteCode: string): Promise<{
    success: boolean;
    group?: StudyGroupItem;
    message: string;
  }> {
    return request('/groups/join', {
      method: 'POST',
      body: JSON.stringify({ inviteCode }),
    });
  },

  async leaveStudyGroup(groupId: string): Promise<{ success: boolean; message: string }> {
    return request(`/groups/${groupId}/leave`, {
      method: 'POST',
    });
  },

  // Leaderboards
  async getLeaderboard(
    scope: LeaderboardScope = 'GLOBAL',
    metric: LeaderboardMetric = 'WEEKLY_XP'
  ): Promise<{
    scope: LeaderboardScope;
    metric: LeaderboardMetric;
    entries: LeaderboardEntry[];
    isOptedIn: boolean;
    topPodium: LeaderboardEntry[];
  }> {
    const res = await request<
      ApiEnvelope<{
        scope: LeaderboardScope;
        metric: LeaderboardMetric;
        entries: LeaderboardEntry[];
        isOptedIn: boolean;
        topPodium: LeaderboardEntry[];
      }>
    >(`/leaderboards?scope=${scope}&metric=${metric}`);
    return res.data;
  },

  async setLeaderboardPrivacy(showOnLeaderboard: boolean): Promise<{ success: boolean }> {
    return request('/leaderboards/privacy', {
      method: 'POST',
      body: JSON.stringify({ showOnLeaderboard }),
    });
  },

  // Notifications
  async getNotifications(): Promise<{
    notifications: AppNotification[];
    unreadCount: number;
  }> {
    const res = await request<
      ApiEnvelope<{
        notifications: AppNotification[];
        unreadCount: number;
      }>
    >('/notifications');
    return res.data;
  },

  async markNotificationRead(id: string): Promise<{ success: boolean; message: string }> {
    return request(`/notifications/${id}/read`, {
      method: 'PATCH',
    });
  },

  async markAllNotificationsRead(): Promise<{ success: boolean; message: string }> {
    return request('/notifications/read-all', {
      method: 'PATCH',
    });
  },

  // Feedback
  async getFeedback(): Promise<ProductFeedbackItem[]> {
    const res = await request<ApiEnvelope<ProductFeedbackItem[]>>('/feedback');
    return res.data;
  },

  async submitFeedback(payload: {
    category: FeedbackCategory;
    rating: number;
    title: string;
    description: string;
  }): Promise<ProductFeedbackItem> {
    const res = await request<ApiEnvelope<ProductFeedbackItem>>('/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // Subscriptions
  async getSubscriptionPlans(): Promise<SubscriptionPlan[]> {
    const res = await request<ApiEnvelope<SubscriptionPlan[]>>('/subscriptions/plans');
    return res.data;
  },

  async getCurrentSubscription(): Promise<UserSubscriptionState> {
    const res = await request<ApiEnvelope<UserSubscriptionState>>('/subscriptions/current');
    return res.data;
  },

  async createCheckoutOrder(payload: {
    tier: SubscriptionTier;
    billingInterval: BillingInterval;
  }): Promise<PaymentOrderResponse> {
    const res = await request<ApiEnvelope<PaymentOrderResponse>>('/subscriptions/checkout', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  async verifySubscriptionPayment(payload: {
    tier: SubscriptionTier;
    orderId: string;
    paymentId: string;
    signature: string;
    billingInterval: BillingInterval;
  }): Promise<UserSubscriptionState> {
    const res = await request<ApiEnvelope<UserSubscriptionState>>('/subscriptions/verify', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  },

  // AI Agent Swarm
  async getAgents(): Promise<AgentMetadata[]> {
    const res = await request<ApiEnvelope<AgentMetadata[]>>('/ai-agents/agents');
    return res.data;
  },

  async getAgentActions(): Promise<AgentActionStep[]> {
    const res = await request<ApiEnvelope<AgentActionStep[]>>('/ai-agents/actions');
    return res.data;
  },

  async runSwarmSynthesis(): Promise<MultiAgentSynthesisReport> {
    const res = await request<ApiEnvelope<MultiAgentSynthesisReport>>('/ai-agents/synthesis', {
      method: 'POST',
    });
    return res.data;
  },

  async updateAgentAutonomy(agentId: AgentId, autonomyLevel: AgentAutonomyLevel): Promise<AgentMetadata> {
    const res = await request<ApiEnvelope<AgentMetadata>>(`/ai-agents/agents/${agentId}/autonomy`, {
      method: 'PATCH',
      body: JSON.stringify({ autonomyLevel }),
    });
    return res.data;
  },

  async approveAgentAction(actionId: string): Promise<{ success: boolean }> {
    return request(`/ai-agents/actions/${actionId}/approve`, {
      method: 'POST',
    });
  },

  // Smart Automations
  async getAutomations(): Promise<AutomationRule[]> {
    const res = await request<ApiEnvelope<AutomationRule[]>>('/automations');
    return res.data;
  },

  async toggleAutomation(ruleId: string): Promise<AutomationRule> {
    const res = await request<ApiEnvelope<AutomationRule>>(`/automations/${ruleId}/toggle`, {
      method: 'PATCH',
    });
    return res.data;
  },

  async deleteAutomation(ruleId: string): Promise<{ success: boolean }> {
    return request(`/automations/${ruleId}`, {
      method: 'DELETE',
    });
  },

  async createAutomation(payload: Omit<AutomationRuleInput, 'isEnabled'>): Promise<AutomationRule> {
    const res = await request<ApiEnvelope<AutomationRule>>('/automations', {
      method: 'POST',
      body: JSON.stringify({ ...payload, isEnabled: true }),
    });
    return res.data;
  },

  // Institutional Cohorts
  async getInstitutionalCohorts(): Promise<InstitutionalCohortSummary[]> {
    const res = await request<ApiEnvelope<InstitutionalCohortSummary[]>>('/institutions/cohorts');
    return res.data;
  },
};
