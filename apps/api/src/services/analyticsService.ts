/**
 * @file apps/api/src/services/analyticsService.ts
 * @description Internal product analytics and retention telemetry (privacy-preserving, no 3P trackers)
 */
import type {
  AnalyticsEventRecord,
  AnalyticsEventType,
} from '../../../../packages/shared-types/src/index.ts';

class AnalyticsService {
  private events: AnalyticsEventRecord[] = [
    {
      id: 'evt-1',
      userId: 'usr-student-demo',
      eventType: 'FOCUS_SESSION_FINISHED',
      metadata: { durationMinutes: 50, mode: 'DEEP_WORK', xpGained: 120 },
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'evt-2',
      userId: 'usr-student-demo',
      eventType: 'REEL_INTERVENTION_TRIGGERED',
      metadata: { platform: 'INSTAGRAM_REELS', actionTaken: 'NAVIGATED_AWAY' },
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    },
    {
      id: 'evt-3',
      userId: 'usr-student-demo',
      eventType: 'STREAK_PRESERVED',
      metadata: { currentStreak: 7, milestone: true },
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  public trackEvent(
    userId: string,
    eventType: AnalyticsEventType,
    metadata: Record<string, unknown> = {}
  ): AnalyticsEventRecord {
    const record: AnalyticsEventRecord = {
      id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
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
      avgDailyFocusMinutes: 114,
      sessionCompletionRate: 91.3,
      interventionsFollowedRate: 78.6,
    };
  }
}

export const analyticsService = new AnalyticsService();
