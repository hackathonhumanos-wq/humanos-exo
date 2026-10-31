/**
 * @file apps/api/src/services/socialService.ts
 * @description Social module engine: Friends, Study Groups, Group Sessions, and Multi-scope Leaderboards
 */
import type {
  FriendSummary,
  StudyGroupItem,
  GroupMemberSummary,
  LeaderboardEntry,
  LeaderboardMetric,
  LeaderboardScope,
  GroupRole,
} from '../../../../packages/shared-types/src/index.ts';

class SocialStore {
  // In-Memory state for friends
  private friendsMap: Map<string, FriendSummary[]> = new Map([
    [
      'current-user',
      [
        {
          id: 'user-alex',
          username: 'alex_chen',
          displayName: 'Alex Chen',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          streakDays: 8,
          totalXp: 1420,
          level: 6,
          weeklyFocusHours: 14.5,
          isOnline: true,
          status: 'ACCEPTED',
        },
        {
          id: 'user-priya',
          username: 'priya_patel',
          displayName: 'Priya Patel',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          streakDays: 14,
          totalXp: 2150,
          level: 7,
          weeklyFocusHours: 19.0,
          isOnline: false,
          status: 'ACCEPTED',
        },
        {
          id: 'user-marcus',
          username: 'marcus_v',
          displayName: 'Marcus Vance',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
          streakDays: 4,
          totalXp: 620,
          level: 4,
          weeklyFocusHours: 8.2,
          isOnline: true,
          status: 'ACCEPTED',
        },
        {
          id: 'user-elena',
          username: 'elena_rostova',
          displayName: 'Elena Rostova',
          avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=120&auto=format&fit=crop&q=80',
          streakDays: 3,
          totalXp: 490,
          level: 3,
          weeklyFocusHours: 5.5,
          isOnline: false,
          status: 'PENDING_INCOMING',
        },
        {
          id: 'user-jordan',
          username: 'jordan_lee',
          displayName: 'Jordan Lee',
          avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
          streakDays: 0,
          totalXp: 180,
          level: 2,
          weeklyFocusHours: 2.0,
          isOnline: false,
          status: 'PENDING_OUTGOING',
        },
      ],
    ],
  ]);

  // In-Memory state for Study Groups
  private groups: StudyGroupItem[] = [
    {
      id: 'grp-gate-2027',
      name: 'GATE & Placement Algorithms',
      description: 'Daily 2-hour deep work sprint for Data Structures, Algorithms, and OS preparation.',
      inviteCode: 'GATE2027',
      isPrivate: false,
      memberCount: 18,
      totalWeeklyFocusMinutes: 4860,
      groupStreak: 12,
      userRole: 'MEMBER',
      members: [
        {
          userId: 'user-priya',
          displayName: 'Priya Patel',
          username: 'priya_patel',
          avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
          role: 'OWNER',
          joinedAt: '2026-10-01T00:00:00Z',
          weeklyFocusMinutes: 1140,
        },
        {
          userId: 'current-user',
          displayName: 'Aarav Sharma',
          username: 'aarav_sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          role: 'MEMBER',
          joinedAt: '2026-10-12T00:00:00Z',
          weeklyFocusMinutes: 620,
        },
        {
          userId: 'user-alex',
          displayName: 'Alex Chen',
          username: 'alex_chen',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
          role: 'ADMIN',
          joinedAt: '2026-10-05T00:00:00Z',
          weeklyFocusMinutes: 870,
        },
      ],
    },
    {
      id: 'grp-monk-mode',
      name: 'Monk Mode Study Club',
      description: 'Zero social media distractions, strict phone-away focus sessions, morning & night check-ins.',
      inviteCode: 'MONK99',
      isPrivate: true,
      memberCount: 7,
      totalWeeklyFocusMinutes: 3200,
      groupStreak: 19,
      userRole: 'OWNER',
      members: [
        {
          userId: 'current-user',
          displayName: 'Aarav Sharma',
          username: 'aarav_sharma',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
          role: 'OWNER',
          joinedAt: '2026-10-01T00:00:00Z',
          weeklyFocusMinutes: 620,
        },
        {
          userId: 'user-marcus',
          displayName: 'Marcus Vance',
          username: 'marcus_v',
          avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
          role: 'MEMBER',
          joinedAt: '2026-10-08T00:00:00Z',
          weeklyFocusMinutes: 490,
        },
      ],
    },
    {
      id: 'grp-med-prep',
      name: 'NEET & Medical Aspirants',
      description: 'Biology, Organic Chemistry revisions and test series question solving marathons.',
      inviteCode: 'MEDFOCUS',
      isPrivate: false,
      memberCount: 34,
      totalWeeklyFocusMinutes: 8940,
      groupStreak: 25,
      userRole: undefined,
      members: [],
    },
  ];

  // User Opt-Out preferences for Leaderboard
  private userPrivacySettings: Map<string, { showOnLeaderboard: boolean }> = new Map([
    ['current-user', { showOnLeaderboard: true }],
  ]);

  // --- Friends Methods ---

  public getFriends(userId: string = 'current-user'): FriendSummary[] {
    return this.friendsMap.get(userId) || [];
  }

  public sendFriendRequest(
    userId: string = 'current-user',
    targetUsername: string
  ): { success: boolean; message: string; friend?: FriendSummary } {
    const list = this.getFriends(userId);
    const cleanUsername = targetUsername.trim().toLowerCase().replace(/^@/, '');

    if (!cleanUsername) {
      return { success: false, message: 'Please provide a valid username' };
    }

    if (cleanUsername === 'aarav_sharma') {
      return { success: false, message: 'You cannot send a friend request to yourself' };
    }

    const existing = list.find(f => f.username.toLowerCase() === cleanUsername);
    if (existing) {
      if (existing.status === 'ACCEPTED') {
        return { success: false, message: `You are already friends with @${cleanUsername}` };
      }
      return { success: false, message: `Request is already ${existing.status.toLowerCase()}` };
    }

    const newRequest: FriendSummary = {
      id: `user-${Date.now()}`,
      username: cleanUsername,
      displayName: cleanUsername.charAt(0).toUpperCase() + cleanUsername.slice(1),
      streakDays: 1,
      totalXp: 120,
      level: 2,
      weeklyFocusHours: 3.5,
      isOnline: false,
      status: 'PENDING_OUTGOING',
    };

    this.friendsMap.set(userId, [newRequest, ...list]);
    return { success: true, message: `Friend request sent to @${cleanUsername}`, friend: newRequest };
  }

  public acceptFriendRequest(
    userId: string = 'current-user',
    friendId: string
  ): { success: boolean; message: string } {
    const list = this.getFriends(userId);
    const target = list.find(f => f.id === friendId);
    if (!target) {
      return { success: false, message: 'Friend request not found' };
    }

    target.status = 'ACCEPTED';
    this.friendsMap.set(userId, [...list]);
    return { success: true, message: `Accepted friend request from ${target.displayName}!` };
  }

  public rejectFriendRequest(
    userId: string = 'current-user',
    friendId: string
  ): { success: boolean; message: string } {
    const list = this.getFriends(userId);
    const updated = list.filter(f => f.id !== friendId);
    this.friendsMap.set(userId, updated);
    return { success: true, message: 'Friend request declined' };
  }

  public removeFriend(
    userId: string = 'current-user',
    friendId: string
  ): { success: boolean; message: string } {
    const list = this.getFriends(userId);
    const updated = list.filter(f => f.id !== friendId);
    this.friendsMap.set(userId, updated);
    return { success: true, message: 'Friend removed from your accountability circle' };
  }

  // --- Study Groups Methods ---

  public getGroups(): StudyGroupItem[] {
    return this.groups;
  }

  public getGroupById(groupId: string): StudyGroupItem | undefined {
    return this.groups.find(g => g.id === groupId);
  }

  public createGroup(
    userId: string = 'current-user',
    data: { name: string; description: string; isPrivate: boolean }
  ): { success: boolean; group?: StudyGroupItem; message: string } {
    if (!data.name || data.name.trim().length < 3) {
      return { success: false, message: 'Group name must be at least 3 characters long' };
    }

    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    const newGroup: StudyGroupItem = {
      id: `grp-${Date.now()}`,
      name: data.name.trim(),
      description: data.description.trim() || 'Collaborative focus study circle.',
      inviteCode: randomCode,
      isPrivate: data.isPrivate,
      memberCount: 1,
      totalWeeklyFocusMinutes: 0,
      groupStreak: 1,
      userRole: 'OWNER',
      members: [
        {
          userId,
          displayName: 'Aarav Sharma',
          username: 'aarav_sharma',
          role: 'OWNER',
          joinedAt: new Date().toISOString(),
          weeklyFocusMinutes: 0,
        },
      ],
    };

    this.groups.unshift(newGroup);
    return { success: true, group: newGroup, message: `Study Group "${newGroup.name}" created successfully!` };
  }

  public joinGroupByCode(
    userId: string = 'current-user',
    code: string
  ): { success: boolean; group?: StudyGroupItem; message: string } {
    const cleanCode = code.trim().toUpperCase();
    const targetGroup = this.groups.find(g => g.inviteCode === cleanCode);

    if (!targetGroup) {
      return { success: false, message: 'Invalid study group invite code' };
    }

    if (targetGroup.userRole) {
      return { success: false, message: 'You are already a member of this study group' };
    }

    targetGroup.memberCount += 1;
    targetGroup.userRole = 'MEMBER';

    if (!targetGroup.members) {
      targetGroup.members = [];
    }

    targetGroup.members.push({
      userId,
      displayName: 'Aarav Sharma',
      username: 'aarav_sharma',
      role: 'MEMBER',
      joinedAt: new Date().toISOString(),
      weeklyFocusMinutes: 0,
    });

    return {
      success: true,
      group: targetGroup,
      message: `Successfully joined "${targetGroup.name}"!`,
    };
  }

  public leaveGroup(
    userId: string = 'current-user',
    groupId: string
  ): { success: boolean; message: string } {
    const target = this.groups.find(g => g.id === groupId);
    if (!target) {
      return { success: false, message: 'Study group not found' };
    }

    if (!target.userRole) {
      return { success: false, message: 'You are not a member of this group' };
    }

    target.userRole = undefined;
    target.memberCount = Math.max(0, target.memberCount - 1);
    if (target.members) {
      target.members = target.members.filter(m => m.userId !== userId);
    }

    return { success: true, message: `You left "${target.name}"` };
  }

  // --- Leaderboards Engine ---

  public getLeaderboard(
    scope: LeaderboardScope = 'GLOBAL',
    metric: LeaderboardMetric = 'WEEKLY_XP',
    userId: string = 'current-user'
  ): LeaderboardEntry[] {
    const isOptedIn = this.userPrivacySettings.get(userId)?.showOnLeaderboard ?? true;

    // Base entries pool representing active students
    const pool = [
      {
        userId: 'user-priya',
        displayName: 'Priya Patel',
        username: 'priya_patel',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
        level: 7,
        scores: {
          WEEKLY_XP: 580,
          MONTHLY_FOCUS: 84, // hours
          DAILY_SESSIONS: 6, // sessions today
          STREAK_DAYS: 14,
        },
        isFriend: true,
        inMyGroup: true,
      },
      {
        userId: 'user-alex',
        displayName: 'Alex Chen',
        username: 'alex_chen',
        avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        level: 6,
        scores: {
          WEEKLY_XP: 440,
          MONTHLY_FOCUS: 62,
          DAILY_SESSIONS: 4,
          STREAK_DAYS: 8,
        },
        isFriend: true,
        inMyGroup: true,
      },
      {
        userId: 'user-tanya',
        displayName: 'Tanya Mehta',
        username: 'tanya_m',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        level: 7,
        scores: {
          WEEKLY_XP: 510,
          MONTHLY_FOCUS: 78,
          DAILY_SESSIONS: 5,
          STREAK_DAYS: 21,
        },
        isFriend: false,
        inMyGroup: false,
      },
      {
        userId: 'user-rohit',
        displayName: 'Rohit Verma',
        username: 'rohit_v',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
        level: 5,
        scores: {
          WEEKLY_XP: 380,
          MONTHLY_FOCUS: 48,
          DAILY_SESSIONS: 3,
          STREAK_DAYS: 9,
        },
        isFriend: false,
        inMyGroup: false,
      },
      {
        userId: 'user-marcus',
        displayName: 'Marcus Vance',
        username: 'marcus_v',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=120&auto=format&fit=crop&q=80',
        level: 4,
        scores: {
          WEEKLY_XP: 290,
          MONTHLY_FOCUS: 36,
          DAILY_SESSIONS: 2,
          STREAK_DAYS: 4,
        },
        isFriend: true,
        inMyGroup: true,
      },
      {
        userId: 'user-sophia',
        displayName: 'Sophia Alvarez',
        username: 'sophia_alv',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&auto=format&fit=crop&q=80',
        level: 6,
        scores: {
          WEEKLY_XP: 410,
          MONTHLY_FOCUS: 55,
          DAILY_SESSIONS: 4,
          STREAK_DAYS: 11,
        },
        isFriend: false,
        inMyGroup: false,
      },
    ];

    // Current user scores
    const currentUserScore = {
      WEEKLY_XP: 320,
      MONTHLY_FOCUS: 42,
      DAILY_SESSIONS: 3,
      STREAK_DAYS: 5,
    };

    let filtered = [...pool];

    if (scope === 'FRIENDS') {
      filtered = filtered.filter(u => u.isFriend);
    } else if (scope === 'GROUPS') {
      filtered = filtered.filter(u => u.inMyGroup);
    }

    // Add current user if opted in
    const combined = isOptedIn
      ? [
          ...filtered,
          {
            userId: 'current-user',
            displayName: 'Aarav Sharma (You)',
            username: 'aarav_sharma',
            avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
            level: 4,
            scores: currentUserScore,
            isFriend: false,
            inMyGroup: true,
          },
        ]
      : filtered;

    // Sort descending by selected metric score
    combined.sort((a, b) => b.scores[metric] - a.scores[metric]);

    const unitMap: Record<LeaderboardMetric, string> = {
      WEEKLY_XP: 'XP',
      MONTHLY_FOCUS: 'hrs',
      DAILY_SESSIONS: 'sessions',
      STREAK_DAYS: 'days',
    };

    return combined.map((entry, index) => ({
      rank: index + 1,
      userId: entry.userId,
      displayName: entry.displayName,
      username: entry.username,
      avatarUrl: entry.avatarUrl,
      score: entry.scores[metric],
      unit: unitMap[metric],
      isCurrentUser: entry.userId === 'current-user',
      level: entry.level,
    }));
  }

  public setLeaderboardPrivacy(
    userId: string = 'current-user',
    showOnLeaderboard: boolean
  ): { success: boolean; showOnLeaderboard: boolean } {
    this.userPrivacySettings.set(userId, { showOnLeaderboard });
    return { success: true, showOnLeaderboard };
  }

  public getLeaderboardPrivacy(userId: string = 'current-user'): boolean {
    return this.userPrivacySettings.get(userId)?.showOnLeaderboard ?? true;
  }
}

export const socialService = new SocialStore();
