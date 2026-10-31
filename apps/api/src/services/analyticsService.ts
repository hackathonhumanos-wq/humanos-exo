/**
 * @file apps/api/src/services/analyticsService.ts
 * @description Internal product analytics, overview metrics, focus session history, and daily goals engine
 */
import type {
  AnalyticsEventRecord,
  AnalyticsEventType,
  DashboardOverviewData,
  FocusSessionLogRecord,
  UserGoalItem,
  WeeklyFocusDayPoint,
} from '../../../../packages/shared-types/src/index.ts';
import type {
  FocusSessionCompleteInput,
  GoalUpsertInput,
} from '../../../../packages/validation/src/index.ts';
import { gamificationService } from './gamificationService.ts';
import { wellbeingIntelligenceService } from './wellbeingIntelligenceService.ts';

class AnalyticsService {
  private focusMinutesToday = 155; // 2h 35m
  private screenMinutesToday = 192; // 3h 12m
  private dailyFocusTargetMinutes = 215; // ~72% progress at 155m

  private recentSessions: FocusSessionLogRecord[] = [
    {
      id: 'fs-101',
      subject: 'Mathematics — Vector Calculus',
      mode: 'DEEP_WORK',
      durationMinutes: 50,
      xpEarned: 25,
      completedAt: new Date(Date.now() - 2.2 * 3600 * 1000).toISOString(),
      isDemo: true,
    },
    {
      id: 'fs-102',
      subject: 'Physics — Electromagnetism',
      mode: 'POMODORO',
      durationMinutes: 45,
      xpEarned: 20,
      completedAt: new Date(Date.now() - 4.5 * 3600 * 1000).toISOString(),
      isDemo: true,
    },
    {
      id: 'fs-103',
      subject: 'Computer Science — Graph Algorithms',
      mode: 'DEEP_WORK',
      durationMinutes: 60,
      xpEarned: 30,
      completedAt: new Date(Date.now() - 6.8 * 3600 * 1000).toISOString(),
      isDemo: true,
    },
  ];

  private goals: UserGoalItem[] = [
    {
      id: 'goal-focus-daily',
      title: 'Daily Deep Focus Target',
      category: 'FOCUS_MINUTES',
      currentValue: 155,
      targetValue: 215,
      unit: 'min',
      isInverseCap: false,
      isActive: true,
    },
    {
      id: 'goal-reels-cap',
      title: 'Daily Short-Form Interaction Cap',
      category: 'REELS_CAP',
      currentValue: 48,
      targetValue: 60,
      unit: 'interactions',
      isInverseCap: true,
      isActive: true,
    },
    {
      id: 'goal-screen-cap',
      title: 'Total Browser Screen Time Budget',
      category: 'SCREEN_TIME_CAP',
      currentValue: 192,
      targetValue: 240,
      unit: 'min',
      isInverseCap: true,
      isActive: true,
    },
    {
      id: 'goal-sessions-daily',
      title: 'Uninterrupted Study Sessions',
      category: 'STUDY_SESSIONS',
      currentValue: 3,
      targetValue: 4,
      unit: 'sessions',
      isInverseCap: false,
      isActive: true,
    },
  ];

  private past6Days: Omit<WeeklyFocusDayPoint, 'date'>[] = [
    { dayLabel: 'Mon', focusHours: 1.0, screenHours: 2.3, focusMinutes: 60, screenMinutes: 138 },
    { dayLabel: 'Tue', focusHours: 1.9, screenHours: 2.85, focusMinutes: 114, screenMinutes: 171 },
    { dayLabel: 'Wed', focusHours: 1.6, screenHours: 2.75, focusMinutes: 96, screenMinutes: 165 },
    { dayLabel: 'Thu', focusHours: 2.0, screenHours: 3.15, focusMinutes: 120, screenMinutes: 189 },
    { dayLabel: 'Fri', focusHours: 2.3, screenHours: 3.2, focusMinutes: 138, screenMinutes: 192 },
    { dayLabel: 'Sat', focusHours: 2.75, screenHours: 3.55, focusMinutes: 165, screenMinutes: 213 },
  ];

  private events: AnalyticsEventRecord[] = [
    {
      id: 'evt-1',
      userId: 'current-user',
      eventType: 'FOCUS_SESSION_FINISHED',
      metadata: { durationMinutes: 50, mode: 'DEEP_WORK', xpGained: 25 },
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'evt-2',
      userId: 'current-user',
      eventType: 'REEL_INTERVENTION_TRIGGERED',
      metadata: { platform: 'INSTAGRAM_REELS', actionTaken: 'NAVIGATED_AWAY' },
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'evt-3',
      userId: 'current-user',
      eventType: 'STREAK_PRESERVED',
      metadata: { currentStreak: 24, milestone: true },
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  public getOverview(): DashboardOverviewData {
    const reels = wellbeingIntelligenceService.getReelsAnalytics();
    const now = new Date();

    const weeklyOverview: WeeklyFocusDayPoint[] = this.past6Days.map((pt, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      return {
        ...pt,
        date: d.toISOString().slice(0, 10),
      };
    });

    const todayFocusHours = Number((this.focusMinutesToday / 60).toFixed(2));
    const todayScreenHours = Number((this.screenMinutesToday / 60).toFixed(2));

    weeklyOverview.push({
      dayLabel: 'Sun',
      date: now.toISOString().slice(0, 10),
      focusHours: todayFocusHours,
      screenHours: todayScreenHours,
      focusMinutes: this.focusMinutesToday,
      screenMinutes: this.screenMinutesToday,
    });

    const syncedGoals = this.goals.map(g => {
      if (g.category === 'FOCUS_MINUTES') {
        return { ...g, currentValue: this.focusMinutesToday };
      }
      if (g.category === 'REELS_CAP') {
        return {
          ...g,
          currentValue: reels.todayTotalEstimatedInteractions,
          targetValue: reels.settings.dailyInteractionLimit,
        };
      }
      if (g.category === 'SCREEN_TIME_CAP') {
        return { ...g, currentValue: this.screenMinutesToday };
      }
      if (g.category === 'STUDY_SESSIONS') {
        return { ...g, currentValue: this.recentSessions.length };
      }
      return g;
    });

    const focusGoal = syncedGoals.find(g => g.category === 'FOCUS_MINUTES');
    const targetMinutes = focusGoal?.targetValue || this.dailyFocusTargetMinutes;
    const dailyGoalPercent = Math.min(100, Math.round((this.focusMinutesToday / Math.max(1, targetMinutes)) * 100));

    const weeklyFocusMinutes = weeklyOverview.reduce((sum, d) => sum + d.focusMinutes, 0);
    const priorWeekFocusMinutes = 757;
    const focusVsLastWeekPercent = Math.round(
      ((weeklyFocusMinutes - priorWeekFocusMinutes) / priorWeekFocusMinutes) * 100
    );

    const weeklyScreenMinutes = weeklyOverview.reduce((sum, d) => sum + d.screenMinutes, 0);
    const priorWeekScreenMinutes = 1370;
    const screenVsLastWeekPercent = Math.round(
      ((weeklyScreenMinutes - priorWeekScreenMinutes) / priorWeekScreenMinutes) * 100
    );

    const remainingGoalMins = Math.max(0, targetMinutes - this.focusMinutesToday);
    const suggestedDurationMinutes = remainingGoalMins >= 45 ? 50 : 25;
    const coachHeadline =
      focusVsLastWeekPercent > 0
        ? `Your focus time is up by ${focusVsLastWeekPercent}% this week!`
        : focusVsLastWeekPercent === 0
          ? 'Your weekly focus pace is steady!'
          : 'Ready to rebuild your study momentum today?';
    const coachDetail =
      remainingGoalMins > 0
        ? `Keep going! Try a ${suggestedDurationMinutes}-minute focus session before your next study break (${remainingGoalMins}m left to hit today's goal).`
        : 'Daily focus target reached! Take a restorative screen-free break or review flashcards lightly.';

    return {
      studentName: 'Adarsh',
      studentFullName: 'Adarsh Sharma',
      studentRoleLabel: 'B.Tech Computer Science • Year 3',
      focusMinutesToday: this.focusMinutesToday,
      focusVsLastWeekPercent,
      focusSparkline7d: weeklyOverview.map(d => d.focusMinutes),
      screenMinutesToday: this.screenMinutesToday,
      screenVsLastWeekPercent,
      screenSparkline7d: weeklyOverview.map(d => d.screenMinutes),
      dailyGoalPercent,
      dailyFocusTargetMinutes: targetMinutes,
      completedSessionsToday: this.recentSessions.length,
      weeklyOverview,
      coachHeroQuote: 'Small steps every day lead to big changes!',
      coachRecommendation: {
        headline: coachHeadline,
        detail: coachDetail,
        suggestedDurationMinutes,
        confidenceScore: 92,
      },
      recentSessions: this.recentSessions,
      goals: syncedGoals,
    };
  }

  public logFocusSession(input: FocusSessionCompleteInput): {
    session: FocusSessionLogRecord;
    xpEarned: number;
    overview: DashboardOverviewData;
  } {
    this.focusMinutesToday += input.durationMinutes;
    this.screenMinutesToday += Math.round(input.durationMinutes * 0.4);

    const activityType = input.durationMinutes >= 45 ? 'FOCUS_SESSION_50M' : 'FOCUS_SESSION_25M';
    const refId = `focus-log-${Date.now()}`;
    const award = gamificationService.awardXp(
      'current-user',
      activityType,
      `Completed ${input.durationMinutes}m ${input.mode.replace('_', ' ')}: ${input.subject}`,
      refId
    );

    const session: FocusSessionLogRecord = {
      id: refId,
      subject: input.subject,
      mode: input.mode,
      durationMinutes: input.durationMinutes,
      xpEarned: award.xpEarned,
      completedAt: new Date().toISOString(),
      isDemo: false,
    };

    this.recentSessions.unshift(session);
    this.trackEvent('current-user', 'FOCUS_SESSION_FINISHED', {
      subject: input.subject,
      durationMinutes: input.durationMinutes,
      mode: input.mode,
      xpEarned: award.xpEarned,
    });

    return {
      session,
      xpEarned: award.xpEarned,
      overview: this.getOverview(),
    };
  }

  public getGoals(): UserGoalItem[] {
    return this.getOverview().goals;
  }

  public upsertGoal(input: GoalUpsertInput): UserGoalItem[] {
    const unitMap: Record<UserGoalItem['category'], { unit: string; inverse: boolean }> = {
      FOCUS_MINUTES: { unit: 'min', inverse: false },
      REELS_CAP: { unit: 'interactions', inverse: true },
      SCREEN_TIME_CAP: { unit: 'min', inverse: true },
      STUDY_SESSIONS: { unit: 'sessions', inverse: false },
    };

    if (input.category === 'FOCUS_MINUTES') {
      this.dailyFocusTargetMinutes = input.targetValue;
    }
    if (input.category === 'REELS_CAP') {
      wellbeingIntelligenceService.updateReelsSettings({ dailyInteractionLimit: input.targetValue });
    }

    const existingIdx = this.goals.findIndex(
      g => (input.id && g.id === input.id) || g.category === input.category
    );

    if (existingIdx >= 0) {
      this.goals[existingIdx] = {
        ...this.goals[existingIdx],
        title: input.title,
        targetValue: input.targetValue,
        isActive: input.isActive,
      };
    } else {
      const meta = unitMap[input.category];
      this.goals.push({
        id: `goal-${Date.now()}`,
        title: input.title,
        category: input.category,
        currentValue: 0,
        targetValue: input.targetValue,
        unit: meta.unit,
        isInverseCap: meta.inverse,
        isActive: input.isActive,
      });
    }

    return this.getGoals();
  }

  public deleteGoal(goalId: string): UserGoalItem[] {
    this.goals = this.goals.filter(g => g.id !== goalId);
    return this.getGoals();
  }

  public trackEvent(
    userId: string,
    eventType: AnalyticsEventType,
    metadata: Record<string, unknown> = {}
  ): AnalyticsEventRecord {
    const record: AnalyticsEventRecord = {
      id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      userId,
      eventType,
      metadata,
      timestamp: new Date().toISOString(),
    };
    this.events.unshift(record);
    if (this.events.length > 200) {
      this.events = this.events.slice(0, 200);
    }
    return record;
  }

  public getRecentEvents(limit = 20): AnalyticsEventRecord[] {
    return this.events.slice(0, limit);
  }

  public getRetentionStats() {
    return {
      day1RetentionPercent: 88.5,
      day7RetentionPercent: 74.2,
      day30RetentionPercent: 62.8,
      avgDailyFocusMinutes: this.focusMinutesToday,
      sessionCompletionRate: 91.3,
      interventionsFollowedRate: 78.6,
    };
  }
}

export const analyticsService = new AnalyticsService();
