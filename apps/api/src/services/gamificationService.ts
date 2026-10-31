/**
 * @file apps/api/src/services/gamificationService.ts
 * @description Core gamification engine: XP calculations, 8-level progression, badges, streaks, and challenges
 */
import type {
  StudentLevel,
  LevelProgress,
  AchievementItem,
  XPTransactionRecord,
  StreakInfo,
  StreakDayRecord,
  ChallengeItem,
  XPActivityType,
} from '../../../../packages/shared-types/src/index.ts';

// 8 Level Progression Scale
export const STUDENT_LEVELS: StudentLevel[] = [
  { levelNumber: 1, title: 'Beginner', minXp: 0, maxXp: 99, badgeIcon: '🌱' },
  { levelNumber: 2, title: 'Focus Explorer', minXp: 100, maxXp: 249, badgeIcon: '🧭' },
  { levelNumber: 3, title: 'Consistency Builder', minXp: 250, maxXp: 499, badgeIcon: '⚡' },
  { levelNumber: 4, title: 'Deep Worker', minXp: 500, maxXp: 899, badgeIcon: '🛡️' },
  { levelNumber: 5, title: 'Productivity Pro', minXp: 900, maxXp: 1399, badgeIcon: '🎯' },
  { levelNumber: 6, title: 'Focus Master', minXp: 1400, maxXp: 1999, badgeIcon: '🔮' },
  { levelNumber: 7, title: 'Discipline Champion', minXp: 2000, maxXp: 2799, badgeIcon: '👑' },
  { levelNumber: 8, title: 'Productivity Legend', minXp: 2800, maxXp: 99999, badgeIcon: '🏆' },
];

export const XP_RULES: Record<XPActivityType, { amount: number; label: string }> = {
  FOCUS_SESSION_25M: { amount: 10, label: 'Completed 25-minute Pomodoro session' },
  FOCUS_SESSION_50M: { amount: 25, label: 'Completed 50-minute Deep Work session' },
  DAILY_GOAL_MET: { amount: 30, label: 'Achieved daily focus study quota' },
  DAILY_CHALLENGE_COMPLETED: { amount: 20, label: 'Finished daily challenge' },
  STREAK_3_DAYS: { amount: 25, label: 'Maintained 3-day consistency streak' },
  STREAK_7_DAYS: { amount: 75, label: 'Maintained 7-day consistency streak' },
  WEEKLY_CHALLENGE_COMPLETED: { amount: 100, label: 'Mastered weekly milestone challenge' },
  STUDY_GROUP_SESSION: { amount: 15, label: 'Participated in group study session' },
  ZERO_REELS_BONUS: { amount: 20, label: 'Zero short-form video distraction bonus' },
};

// 16 Standard Achievements
export const INITIAL_ACHIEVEMENTS: AchievementItem[] = [
  // Focus Badges
  {
    id: 'ach-1',
    code: 'FIRST_FOCUS_SESSION',
    title: 'Focus Master',
    description: 'Complete verified uninterrupted Pomodoro & Deep Study intervals.',
    category: 'FOCUS',
    rarity: 'RARE',
    xpReward: 50,
    isUnlocked: true,
    unlockedAt: '2026-10-29T14:30:00Z',
    progressCurrent: 10,
    progressTotal: 10,
  },
  {
    id: 'ach-2',
    code: 'FOCUS_STARTER',
    title: 'Study Champion',
    description: 'Log 5 consecutive days of structured subject study blocks.',
    category: 'CONSISTENCY',
    rarity: 'RARE',
    xpReward: 60,
    isUnlocked: true,
    unlockedAt: '2026-10-28T18:00:00Z',
    progressCurrent: 5,
    progressTotal: 5,
  },
  {
    id: 'ach-3',
    code: 'DEEP_WORK_CHAMPION',
    title: 'Productivity Star',
    description: 'Complete three 50-minute deep work intervals while keeping short-form limits intact.',
    category: 'WELLBEING',
    rarity: 'EPIC',
    xpReward: 80,
    isUnlocked: true,
    unlockedAt: '2026-10-27T21:15:00Z',
    progressCurrent: 3,
    progressTotal: 3,
  },
  {
    id: 'ach-4',
    code: '10_FOCUS_SESSIONS',
    title: 'Focus Practitioner',
    description: 'Complete 10 total focus sessions.',
    category: 'FOCUS',
    rarity: 'COMMON',
    xpReward: 50,
    isUnlocked: true,
    unlockedAt: '2026-10-29T10:00:00Z',
    progressCurrent: 10,
    progressTotal: 10,
  },
  {
    id: 'ach-5',
    code: '50_FOCUS_SESSIONS',
    title: 'Centurion of Focus',
    description: 'Accumulate 50 completed focus study sessions.',
    category: 'FOCUS',
    rarity: 'EPIC',
    xpReward: 150,
    isUnlocked: false,
    progressCurrent: 28,
    progressTotal: 50,
  },
  {
    id: 'ach-6',
    code: '100_FOCUS_SESSIONS',
    title: 'Monk Mode Master',
    description: 'Reach 100 verified focus sessions.',
    category: 'FOCUS',
    rarity: 'LEGENDARY',
    xpReward: 300,
    isUnlocked: false,
    progressCurrent: 28,
    progressTotal: 100,
  },

  // Consistency Badges
  {
    id: 'ach-7',
    code: '3_DAY_STREAK',
    title: 'Consistency Spark',
    description: 'Maintain study focus for 3 consecutive days.',
    category: 'CONSISTENCY',
    rarity: 'COMMON',
    xpReward: 25,
    isUnlocked: true,
    unlockedAt: '2026-10-27T23:59:00Z',
    progressCurrent: 3,
    progressTotal: 3,
  },
  {
    id: 'ach-8',
    code: '7_DAY_STREAK',
    title: 'Unbreakable Week',
    description: 'Achieve a 7-day unbroken study streak.',
    category: 'CONSISTENCY',
    rarity: 'RARE',
    xpReward: 75,
    isUnlocked: false,
    progressCurrent: 5,
    progressTotal: 7,
  },
  {
    id: 'ach-9',
    code: '14_DAY_STREAK',
    title: 'Habit Architect',
    description: 'Maintain a 14-day study streak.',
    category: 'CONSISTENCY',
    rarity: 'EPIC',
    xpReward: 150,
    isUnlocked: false,
    progressCurrent: 5,
    progressTotal: 14,
  },
  {
    id: 'ach-10',
    code: '30_DAY_STREAK',
    title: 'Iron Will',
    description: 'Surpass 30 consecutive days of study dedication.',
    category: 'CONSISTENCY',
    rarity: 'LEGENDARY',
    xpReward: 350,
    isUnlocked: false,
    progressCurrent: 5,
    progressTotal: 30,
  },

  // Digital Wellbeing Badges
  {
    id: 'ach-11',
    code: 'SCREEN_TIME_REDUCER',
    title: 'Screen Time Reducer',
    description: 'Reduce daily distracting screen time by at least 25%.',
    category: 'WELLBEING',
    rarity: 'COMMON',
    xpReward: 40,
    isUnlocked: true,
    unlockedAt: '2026-10-28T19:20:00Z',
    progressCurrent: 1,
    progressTotal: 1,
  },
  {
    id: 'ach-12',
    code: 'REELS_REDUCER',
    title: 'Doomscroll Defeater',
    description: 'Keep estimated short-form video swipes under 25 for 3 consecutive days.',
    category: 'WELLBEING',
    rarity: 'RARE',
    xpReward: 80,
    isUnlocked: true,
    unlockedAt: '2026-10-29T23:00:00Z',
    progressCurrent: 3,
    progressTotal: 3,
  },
  {
    id: 'ach-13',
    code: 'DIGITAL_BALANCE_CHAMPION',
    title: 'Digital Balance Champion',
    description: 'Achieve 4 hours of focus with zero short-form video transitions.',
    category: 'WELLBEING',
    rarity: 'EPIC',
    xpReward: 120,
    isUnlocked: false,
    progressCurrent: 2,
    progressTotal: 4,
  },

  // Social Badges
  {
    id: 'ach-14',
    code: 'FIRST_STUDY_GROUP',
    title: 'Fellow Scholar',
    description: 'Join or create your first peer study group.',
    category: 'SOCIAL',
    rarity: 'COMMON',
    xpReward: 20,
    isUnlocked: true,
    unlockedAt: '2026-10-26T11:00:00Z',
    progressCurrent: 1,
    progressTotal: 1,
  },
  {
    id: 'ach-15',
    code: 'ACCOUNTABILITY_PARTNER',
    title: 'Accountability Partner',
    description: 'Connect with a study friend and share weekly focus progress.',
    category: 'SOCIAL',
    rarity: 'RARE',
    xpReward: 45,
    isUnlocked: true,
    unlockedAt: '2026-10-28T15:45:00Z',
    progressCurrent: 1,
    progressTotal: 1,
  },
  {
    id: 'ach-16',
    code: 'GROUP_CHALLENGE_CHAMPION',
    title: 'Group Champion',
    description: 'Finish in the top 3 in a study group weekly sprint.',
    category: 'SOCIAL',
    rarity: 'EPIC',
    xpReward: 100,
    isUnlocked: false,
    progressCurrent: 0,
    progressTotal: 1,
  },
];

// In-Memory store for demonstration and fast state updates
class GamificationStore {
  private userXp: Map<string, number> = new Map([['current-user', 2450]]);
  private userTransactions: Map<string, XPTransactionRecord[]> = new Map([
    [
      'current-user',
      [
        {
          id: 'xpt-1',
          userId: 'current-user',
          amount: 25,
          activityType: 'FOCUS_SESSION_50M',
          description: 'Completed 50-minute Deep Work session: Computer Systems',
          referenceId: 'sess-101',
          createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        },
        {
          id: 'xpt-2',
          userId: 'current-user',
          amount: 20,
          activityType: 'DAILY_CHALLENGE_COMPLETED',
          description: 'Finished daily challenge: Complete 2 focus sessions',
          referenceId: 'chal-d1',
          createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
        },
        {
          id: 'xpt-3',
          userId: 'current-user',
          amount: 25,
          activityType: 'STREAK_3_DAYS',
          description: 'Maintained 3-day consistency streak',
          referenceId: 'streak-3',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        },
        {
          id: 'xpt-4',
          userId: 'current-user',
          amount: 10,
          activityType: 'FOCUS_SESSION_25M',
          description: 'Completed 25-minute Pomodoro session: Algorithms revision',
          referenceId: 'sess-100',
          createdAt: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
        },
      ],
    ],
  ]);

  private userChallenges: Map<string, ChallengeItem[]> = new Map([
    [
      'current-user',
      [
        {
          id: 'chal-d1',
          title: 'Complete 2 Focus Sessions',
          description: 'Execute at least two uninterrupted focus intervals today.',
          type: 'DAILY',
          difficulty: 'EASY',
          targetValue: 2,
          currentValue: 2,
          unit: 'sessions',
          xpReward: 20,
          status: 'COMPLETED',
          expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        },
        {
          id: 'chal-d2',
          title: 'Study for 60 Minutes',
          description: 'Accumulate one hour of deep focused study today.',
          type: 'DAILY',
          difficulty: 'MEDIUM',
          targetValue: 60,
          currentValue: 60,
          unit: 'minutes',
          xpReward: 25,
          status: 'COMPLETED',
          expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        },
        {
          id: 'chal-d3',
          title: 'Keep Reel Swipes Under 30',
          description: 'Resist doomscrolling and keep estimated feed transitions low.',
          type: 'DAILY',
          difficulty: 'HARD',
          targetValue: 30,
          currentValue: 18,
          unit: 'swipes',
          xpReward: 35,
          status: 'IN_PROGRESS',
          expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
        },
        {
          id: 'chal-w1',
          title: 'Weekly 10-Hour Deep Work',
          description: 'Log 10 hours of verified study time this week.',
          type: 'WEEKLY',
          difficulty: 'MEDIUM',
          targetValue: 600,
          currentValue: 480,
          unit: 'minutes',
          xpReward: 100,
          status: 'IN_PROGRESS',
          expiresAt: new Date(Date.now() + 3 * 86400 * 1000).toISOString(),
        },
        {
          id: 'chal-w2',
          title: 'Participate in 3 Group Sessions',
          description: 'Study alongside your peers in group study rooms.',
          type: 'WEEKLY',
          difficulty: 'HARD',
          targetValue: 3,
          currentValue: 2,
          unit: 'sessions',
          xpReward: 80,
          status: 'IN_PROGRESS',
          expiresAt: new Date(Date.now() + 3 * 86400 * 1000).toISOString(),
        },
      ],
    ],
  ]);

  public getXp(userId: string = 'current-user'): number {
    return this.userXp.get(userId) || 2450;
  }

  public getTransactions(userId: string = 'current-user'): XPTransactionRecord[] {
    return this.userTransactions.get(userId) || [];
  }

  public awardXp(
    userId: string,
    activityType: XPActivityType,
    customDescription?: string,
    referenceId?: string
  ): { awarded: boolean; xpEarned: number; newTotalXp: number; message: string } {
    const rule = XP_RULES[activityType];
    if (!rule) {
      return { awarded: false, xpEarned: 0, newTotalXp: this.getXp(userId), message: 'Unknown activity type' };
    }

    const txs = this.userTransactions.get(userId) || [];
    // Anti-duplicate protection: check referenceId
    if (referenceId && txs.some(t => t.referenceId === referenceId)) {
      return {
        awarded: false,
        xpEarned: 0,
        newTotalXp: this.getXp(userId),
        message: 'Reward already claimed for this activity reference.',
      };
    }

    const currentXp = this.getXp(userId);
    const newTotal = currentXp + rule.amount;
    this.userXp.set(userId, newTotal);

    const newTx: XPTransactionRecord = {
      id: `xpt-${Date.now()}`,
      userId,
      amount: rule.amount,
      activityType,
      description: customDescription || rule.label,
      referenceId,
      createdAt: new Date().toISOString(),
    };

    this.userTransactions.set(userId, [newTx, ...txs]);

    return {
      awarded: true,
      xpEarned: rule.amount,
      newTotalXp: newTotal,
      message: `Awarded +${rule.amount} XP for ${rule.label}!`,
    };
  }

  public getLevelProgress(userId: string = 'current-user'): LevelProgress {
    const totalXp = this.getXp(userId);
    let currentLevel = STUDENT_LEVELS[0];

    for (let i = STUDENT_LEVELS.length - 1; i >= 0; i--) {
      if (totalXp >= STUDENT_LEVELS[i].minXp) {
        currentLevel = STUDENT_LEVELS[i];
        break;
      }
    }

    const nextIndex = currentLevel.levelNumber; // 1-based index to next level
    const nextLevel = nextIndex < STUDENT_LEVELS.length ? STUDENT_LEVELS[nextIndex] : null;

    let currentLevelXp = totalXp - currentLevel.minXp;
    let requiredXpForNext = nextLevel ? nextLevel.minXp - currentLevel.minXp : 0;
    let progressPercent = 100;

    if (nextLevel && requiredXpForNext > 0) {
      progressPercent = Math.min(100, Math.round((currentLevelXp / requiredXpForNext) * 100));
    }

    return {
      currentLevel,
      nextLevel,
      totalXp,
      currentLevelXp,
      requiredXpForNext,
      progressPercent,
    };
  }

  public getAchievements(): AchievementItem[] {
    return INITIAL_ACHIEVEMENTS;
  }

  public getStreakInfo(_userId: string = 'current-user'): StreakInfo {
    const today = new Date();
    const history: StreakDayRecord[] = [];
    const priorConsecutiveDaysBeforeWindow = 10;

    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().slice(0, 10);

      const status: 'COMPLETED' | 'MISSED' | 'TODAY' | 'FUTURE' = i === 0 ? 'TODAY' : 'COMPLETED';
      const focusMins = i === 0 ? 155 : 45 + ((i * 7) % 30);

      history.push({
        date: dateStr,
        status,
        focusMinutes: focusMins,
        sessionsCount: Math.max(1, Math.ceil(focusMins / 25)),
      });
    }

    let consecutiveInWindow = 0;
    for (let idx = history.length - 1; idx >= 0; idx--) {
      if (history[idx].status === 'COMPLETED' || history[idx].status === 'TODAY') {
        consecutiveInWindow += 1;
      } else {
        break;
      }
    }

    const currentStreak =
      consecutiveInWindow === history.length
        ? consecutiveInWindow + priorConsecutiveDaysBeforeWindow
        : consecutiveInWindow;

    return {
      currentStreak,
      longestStreak: Math.max(28, currentStreak),
      lastActiveDate: today.toISOString().slice(0, 10),
      isActiveToday: history[history.length - 1]?.focusMinutes > 0,
      streakFreezeAvailable: true,
      history,
    };
  }

  public getChallenges(userId: string = 'current-user'): ChallengeItem[] {
    return this.userChallenges.get(userId) || [];
  }

  public claimChallengeReward(
    userId: string,
    challengeId: string
  ): { success: boolean; xpEarned: number; message: string } {
    const list = this.userChallenges.get(userId) || [];
    const target = list.find(c => c.id === challengeId);

    if (!target) {
      return { success: false, xpEarned: 0, message: 'Challenge not found' };
    }

    if (target.status === 'CLAIMED') {
      return { success: false, xpEarned: 0, message: 'Challenge reward has already been claimed' };
    }

    if (target.currentValue < target.targetValue) {
      return { success: false, xpEarned: 0, message: 'Challenge objectives not yet completed' };
    }

    target.status = 'CLAIMED';

    const awardResult = this.awardXp(
      userId,
      target.type === 'DAILY' ? 'DAILY_CHALLENGE_COMPLETED' : 'WEEKLY_CHALLENGE_COMPLETED',
      `Challenge Reward: ${target.title}`,
      `chal-claim-${challengeId}`
    );

    return {
      success: true,
      xpEarned: target.xpReward,
      message: `Claimed +${target.xpReward} XP for completing "${target.title}"!`,
    };
  }
}

export const gamificationService = new GamificationStore();
