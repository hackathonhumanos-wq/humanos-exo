/**
 * @file apps/web/src/services/apiClient.ts
 * @description Frontend API Client for FOCUSFLOW Backend Services
 */
import {
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
} from '../../../../packages/shared-types/src/index.ts';

const BASE_URL = '/api/v1';

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.message || `HTTP ${res.status}: ${res.statusText}`);
  }

  return res.json();
}

export const apiClient = {
  // Gamification & XP
  async getGamificationProfile(): Promise<{
    userId: string;
    levelProgress: LevelProgress;
    streakInfo: StreakInfo;
    totalBadges: number;
    unlockedBadges: number;
    levelsReference: StudentLevel[];
  }> {
    const res = await request<{ data: any }>('/gamification/profile');
    return res.data;
  },

  async getXp(): Promise<{ totalXp: number; levelProgress: LevelProgress }> {
    const res = await request<{ data: any }>('/gamification/xp');
    return res.data;
  },

  async getXpHistory(): Promise<{ transactions: XPTransactionRecord[]; count: number }> {
    const res = await request<{ data: any }>('/gamification/xp/history');
    return res.data;
  },

  async awardXp(activityType: XPActivityType, customDescription?: string, referenceId?: string): Promise<{
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
    const res = await request<{ data: any }>('/gamification/achievements');
    return res.data;
  },

  async getStreaks(): Promise<StreakInfo> {
    const res = await request<{ data: StreakInfo }>('/gamification/streaks');
    return res.data;
  },

  async getChallenges(): Promise<{
    challenges: ChallengeItem[];
    daily: ChallengeItem[];
    weekly: ChallengeItem[];
  }> {
    const res = await request<{ data: any }>('/gamification/challenges');
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
    const res = await request<{ data: any }>('/friends');
    return res.data;
  },

  async sendFriendRequest(username: string): Promise<{ success: boolean; message: string; friend?: FriendSummary }> {
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
    const res = await request<{ data: any }>('/groups');
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
    const res = await request<{ data: any }>(`/leaderboards?scope=${scope}&metric=${metric}`);
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
    const res = await request<{ data: any }>('/notifications');
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
};
