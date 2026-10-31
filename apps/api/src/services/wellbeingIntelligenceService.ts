/**
 * @file apps/api/src/services/wellbeingIntelligenceService.ts
 * @description Digital wellbeing intelligence service evaluating doomscrolling patterns, ethical short-form video estimates, and student privacy consent
 */
import type {
  WellbeingHealthScore,
  DoomscrollRiskWindow,
  ReelsAnalyticsSummary,
  ReelsSettingsState,
  ReelsTrackingHistoryItem,
  ReelsDailyTrendPoint,
  ReelsPlatformBreakdown,
  PrivacyConsentState,
} from '../../../../packages/shared-types/src/index.ts';
import type {
  ReelsSettingsUpdateInput,
  ReelsDataCorrectionInput,
  PrivacyConsentInput,
} from '../../../../packages/validation/src/index.ts';

class WellbeingIntelligenceService {
  private reelsSettings: ReelsSettingsState = {
    dailyInteractionLimit: 60,
    dailyMinutesLimit: 35,
    trackingPaused: false,
    gentleNudgeThreshold: 25,
    updatedAt: new Date().toISOString(),
  };

  private privacyConsent: PrivacyConsentState = {
    consentShareWithParent: false,
    consentShareWithCounsellor: false,
    consentExtensionTelemetry: true,
    consentAiProductivityAnalysis: true,
    trackingPaused: false,
    updatedAt: new Date().toISOString(),
  };

  private history: ReelsTrackingHistoryItem[] = [
    {
      id: 'rh-1',
      platform: 'INSTAGRAM_REELS',
      platformLabel: 'Instagram Reels',
      estimatedInteractions: 19,
      estimatedMinutes: 11,
      detectedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      confidence: 'HIGH',
      detectionSignal: 'History API /reels/ route transition observer',
      isDemo: true,
    },
    {
      id: 'rh-2',
      platform: 'YOUTUBE_SHORTS',
      platformLabel: 'YouTube Shorts',
      estimatedInteractions: 17,
      estimatedMinutes: 10,
      detectedAt: new Date(Date.now() - 2.5 * 3600 * 1000).toISOString(),
      confidence: 'HIGH',
      detectionSignal: 'Navigation /shorts/ video container observer',
      isDemo: true,
    },
    {
      id: 'rh-3',
      platform: 'FACEBOOK_REELS',
      platformLabel: 'Facebook Reels',
      estimatedInteractions: 12,
      estimatedMinutes: 7,
      detectedAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
      confidence: 'MEDIUM',
      detectionSignal: 'Viewport /reel/ URL state transition heuristic',
      isDemo: true,
    },
    {
      id: 'rh-4',
      platform: 'INSTAGRAM_REELS',
      platformLabel: 'Instagram Reels',
      estimatedInteractions: 24,
      estimatedMinutes: 14,
      detectedAt: new Date(Date.now() - 22 * 3600 * 1000).toISOString(),
      confidence: 'HIGH',
      detectionSignal: 'History API /reels/ route transition observer',
      isDemo: true,
    },
    {
      id: 'rh-5',
      platform: 'YOUTUBE_SHORTS',
      platformLabel: 'YouTube Shorts',
      estimatedInteractions: 18,
      estimatedMinutes: 11,
      detectedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      confidence: 'HIGH',
      detectionSignal: 'Navigation /shorts/ video container observer',
      isDemo: true,
    },
  ];

  private baselinePast6Days: Omit<ReelsDailyTrendPoint, 'date'>[] = [
    { dayLabel: 'Mon', reelsEstimated: 26, shortsEstimated: 20, facebookEstimated: 12, totalEstimated: 58, estimatedMinutes: 34 },
    { dayLabel: 'Tue', reelsEstimated: 22, shortsEstimated: 18, facebookEstimated: 11, totalEstimated: 51, estimatedMinutes: 30 },
    { dayLabel: 'Wed', reelsEstimated: 28, shortsEstimated: 22, facebookEstimated: 14, totalEstimated: 64, estimatedMinutes: 37 },
    { dayLabel: 'Thu', reelsEstimated: 20, shortsEstimated: 16, facebookEstimated: 10, totalEstimated: 46, estimatedMinutes: 27 },
    { dayLabel: 'Fri', reelsEstimated: 24, shortsEstimated: 19, facebookEstimated: 12, totalEstimated: 55, estimatedMinutes: 32 },
    { dayLabel: 'Sat', reelsEstimated: 21, shortsEstimated: 17, facebookEstimated: 13, totalEstimated: 51, estimatedMinutes: 29 },
  ];

  public getReelsAnalytics(): ReelsAnalyticsSummary {
    const startOfToday = Date.now() - 18 * 3600 * 1000;
    const todayItems = this.history.filter(h => new Date(h.detectedAt).getTime() >= startOfToday);

    const todayEstimatedReels = todayItems
      .filter(h => h.platform === 'INSTAGRAM_REELS')
      .reduce((acc, item) => acc + item.estimatedInteractions, 0);
    const todayEstimatedShorts = todayItems
      .filter(h => h.platform === 'YOUTUBE_SHORTS')
      .reduce((acc, item) => acc + item.estimatedInteractions, 0);
    const todayEstimatedFacebookReels = todayItems
      .filter(h => h.platform === 'FACEBOOK_REELS')
      .reduce((acc, item) => acc + item.estimatedInteractions, 0);

    const todayTotal = todayEstimatedReels + todayEstimatedShorts + todayEstimatedFacebookReels;
    const todayEstimatedMinutes = todayItems.reduce((acc, item) => acc + item.estimatedMinutes, 0);

    const safeTotal = Math.max(1, todayTotal);
    const instaShare = todayTotal === 0 ? 0 : Math.round((todayEstimatedReels / safeTotal) * 100);
    const ytShare = todayTotal === 0 ? 0 : Math.round((todayEstimatedShorts / safeTotal) * 100);
    const fbShare = todayTotal === 0 ? 0 : Math.max(0, 100 - instaShare - ytShare);

    const platformBreakdown: ReelsPlatformBreakdown[] = [
      {
        platform: 'INSTAGRAM_REELS',
        label: 'Instagram Reels',
        shortLabel: 'Instagram',
        estimatedInteractions: todayEstimatedReels,
        estimatedMinutes: todayItems
          .filter(h => h.platform === 'INSTAGRAM_REELS')
          .reduce((a, b) => a + b.estimatedMinutes, 0),
        sharePercent: instaShare,
        color: '#8152E8',
        detectionMethod: 'Client-side /reels/ URL route transitions',
        confidence: 'HIGH',
      },
      {
        platform: 'YOUTUBE_SHORTS',
        label: 'YouTube Shorts',
        shortLabel: 'YouTube',
        estimatedInteractions: todayEstimatedShorts,
        estimatedMinutes: todayItems
          .filter(h => h.platform === 'YOUTUBE_SHORTS')
          .reduce((a, b) => a + b.estimatedMinutes, 0),
        sharePercent: ytShare,
        color: '#EF4444',
        detectionMethod: 'Client-side /shorts/ feed navigation observer',
        confidence: 'HIGH',
      },
      {
        platform: 'FACEBOOK_REELS',
        label: 'Facebook Reels',
        shortLabel: 'Facebook',
        estimatedInteractions: todayEstimatedFacebookReels,
        estimatedMinutes: todayItems
          .filter(h => h.platform === 'FACEBOOK_REELS')
          .reduce((a, b) => a + b.estimatedMinutes, 0),
        sharePercent: fbShare,
        color: '#2878F0',
        detectionMethod: 'Feed /reel/ state transition heuristic',
        confidence: 'MEDIUM',
      },
    ];

    const now = new Date();
    const dailyTrends: ReelsDailyTrendPoint[] = this.baselinePast6Days.map((pt, idx) => {
      const d = new Date(now);
      d.setDate(now.getDate() - (6 - idx));
      return {
        ...pt,
        date: d.toISOString().slice(0, 10),
      };
    });

    dailyTrends.push({
      date: now.toISOString().slice(0, 10),
      dayLabel: 'Sun',
      reelsEstimated: todayEstimatedReels,
      shortsEstimated: todayEstimatedShorts,
      facebookEstimated: todayEstimatedFacebookReels,
      totalEstimated: todayTotal,
      estimatedMinutes: todayEstimatedMinutes,
    });

    const weeklyTotal = dailyTrends.reduce((sum, d) => sum + d.totalEstimated, 0);
    const weeklyMinutes = dailyTrends.reduce((sum, d) => sum + d.estimatedMinutes, 0);
    const priorWeekBaselineTotal = 439;
    const vsLastWeekPercent = Math.round(
      ((weeklyTotal - priorWeekBaselineTotal) / Math.max(1, priorWeekBaselineTotal)) * 100
    );

    const isPaused = this.reelsSettings.trackingPaused || !this.privacyConsent.consentExtensionTelemetry;

    return {
      todayTotalEstimatedInteractions: todayTotal,
      todayEstimatedReels,
      todayEstimatedShorts,
      todayEstimatedFacebookReels,
      todayEstimatedMinutes,
      vsLastWeekPercent,
      weeklyTotalEstimatedInteractions: weeklyTotal,
      weeklyEstimatedMinutes: weeklyMinutes,
      sparkline7d: dailyTrends.map(d => d.totalEstimated),
      platformBreakdown,
      dailyTrends,
      settings: {
        ...this.reelsSettings,
        trackingPaused: isPaused,
      },
      coverage: {
        supportedPlatforms: [
          'Instagram Web (/reels/*)',
          'YouTube Web (/shorts/*)',
          'Facebook Web (/reel/*)',
        ],
        unsupportedContexts: [
          'Native iOS / Android mobile apps outside desktop browser',
          'Incognito / Private windows without extension permission',
          'Embedded third-party video iframes without URL state changes',
        ],
        browserExtensionConnected: true,
        permissionStatus: isPaused ? 'PAUSED_BY_USER' : 'GRANTED',
        coveragePercentEstimate: isPaused ? 0 : 88,
        ethicalDisclaimer:
          'All short-form metrics are non-intrusive client-side route transition estimates. FOCUSFLOW never claims exact video view telemetry from private APIs and never inspects captions, messages, keystrokes, or screenshots.',
      },
      history: this.history,
    };
  }

  public updateReelsSettings(input: ReelsSettingsUpdateInput): ReelsSettingsState {
    if (typeof input.dailyInteractionLimit === 'number') {
      this.reelsSettings.dailyInteractionLimit = input.dailyInteractionLimit;
    }
    if (typeof input.dailyMinutesLimit === 'number') {
      this.reelsSettings.dailyMinutesLimit = input.dailyMinutesLimit;
    }
    if (typeof input.gentleNudgeThreshold === 'number') {
      this.reelsSettings.gentleNudgeThreshold = input.gentleNudgeThreshold;
    }
    if (typeof input.trackingPaused === 'boolean') {
      this.reelsSettings.trackingPaused = input.trackingPaused;
      this.privacyConsent.trackingPaused = input.trackingPaused;
      this.privacyConsent.consentExtensionTelemetry = !input.trackingPaused;
    }
    this.reelsSettings.updatedAt = new Date().toISOString();
    return this.reelsSettings;
  }

  public correctReelsHistory(input: ReelsDataCorrectionInput): {
    updated: boolean;
    message: string;
    summary: ReelsAnalyticsSummary;
  } {
    const idx = this.history.findIndex(item => item.id === input.historyId);
    if (idx === -1) {
      return {
        updated: false,
        message: 'Tracking entry not found.',
        summary: this.getReelsAnalytics(),
      };
    }

    if (input.action === 'DELETE') {
      this.history.splice(idx, 1);
      return {
        updated: true,
        message: 'Estimated tracking session removed from your log.',
        summary: this.getReelsAnalytics(),
      };
    }

    const nextCount = Math.max(0, input.adjustedInteractions ?? 0);
    if (nextCount === 0) {
      this.history.splice(idx, 1);
      return {
        updated: true,
        message: 'Estimated count set to 0 and entry cleared.',
        summary: this.getReelsAnalytics(),
      };
    }

    const current = this.history[idx];
    const ratio = current.estimatedInteractions > 0 ? nextCount / current.estimatedInteractions : 1;
    this.history[idx] = {
      ...current,
      estimatedInteractions: nextCount,
      estimatedMinutes: Math.max(1, Math.round(current.estimatedMinutes * ratio)),
      correctedByUser: true,
    };

    return {
      updated: true,
      message: `Estimated interactions adjusted to ${nextCount}.`,
      summary: this.getReelsAnalytics(),
    };
  }

  public getPrivacyConsent(): PrivacyConsentState {
    return this.privacyConsent;
  }

  public updatePrivacyConsent(input: PrivacyConsentInput): PrivacyConsentState {
    const trackingPaused =
      typeof input.trackingPaused === 'boolean'
        ? input.trackingPaused
        : !input.consentExtensionTelemetry;

    this.privacyConsent = {
      consentShareWithParent: input.consentShareWithParent,
      consentShareWithCounsellor: input.consentShareWithCounsellor,
      consentExtensionTelemetry: !trackingPaused,
      consentAiProductivityAnalysis: input.consentAiProductivityAnalysis,
      trackingPaused,
      updatedAt: new Date().toISOString(),
    };
    this.reelsSettings.trackingPaused = trackingPaused;
    return this.privacyConsent;
  }

  public calculateHealthScore(): WellbeingHealthScore {
    const reels = this.getReelsAnalytics();
    const riskWindows: DoomscrollRiskWindow[] = [
      {
        timeWindow: '22:15 - 00:30',
        riskLevel: 'HIGH',
        triggerContext: 'Late-night bedtime procrastination; dopamine-seeking response to day fatigue.',
        recommendedShield: 'Auto-activate Bedtime Focus Lock at 22:00 with gentle warm-screen prompt.',
      },
      {
        timeWindow: '13:30 - 14:15',
        riskLevel: 'MODERATE',
        triggerContext: 'Post-lunch cognitive dip causing mindless 15-minute scroll loops.',
        recommendedShield: 'Schedule a 10-minute sunlight walk or hydration break instead.',
      },
      {
        timeWindow: '18:00 - 18:45',
        riskLevel: 'ELEVATED',
        triggerContext: 'Study-to-leisure context switch vulnerability.',
        recommendedShield: 'Switch to ambient instrumental study room or short stretch break.',
      },
    ];

    const interventions: string[] = [
      'Mindful friction pause: 5-second breath countdown when opening short-form feed.',
      'Study environment anchor: keep phone in another room during 50-minute deep work blocks.',
      'Evening dopamine replacement: replace bedtime reels with 10 pages of light reading or journaling.',
    ];

    return {
      overallScore: 86,
      focusResilience: 88,
      restorativeSleepHygiene: 81,
      shortFormDiscipline: 87,
      weeklyReelsEstimated: reels.weeklyTotalEstimatedInteractions,
      reelsTrendPercent: reels.vsLastWeekPercent,
      estimatedTransitions: reels.weeklyTotalEstimatedInteractions,
      disclaimer: reels.coverage.ethicalDisclaimer,
      riskWindows,
      interventions,
    };
  }
}

export const wellbeingIntelligenceService = new WellbeingIntelligenceService();
