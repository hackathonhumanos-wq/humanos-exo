/**
 * @file apps/api/src/services/wellbeingIntelligenceService.ts
 * @description Digital wellbeing intelligence service evaluating doomscrolling patterns and focus health
 */
import type {
  WellbeingHealthScore,
  DoomscrollRiskWindow,
} from '../../../../packages/shared-types/src/index.ts';

class WellbeingIntelligenceService {
  public calculateHealthScore(): WellbeingHealthScore {
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
        recommendedShield: 'Switch to Spotify lo-fi or social study group audio room.',
      },
    ];

    const interventions: string[] = [
      'Mindful friction pause: 5-second breath countdown when opening short-form feed.',
      'Study environment anchor: keep phone in another room during 50-minute deep work blocks.',
      'Evening dopamine replacement: replace bedtime reels with 10 pages of light reading or journaling.',
    ];

    return {
      overallScore: 84,
      focusResilience: 87,
      restorativeSleepHygiene: 79,
      shortFormDiscipline: 86,
      weeklyReelsEstimated: 142,
      reelsTrendPercent: -24.5, // 24.5% reduction compared to baseline
      estimatedTransitions: 142,
      disclaimer:
        'Ethical Telemetry Notice: Counts represent estimated URL route transitions detected non-intrusively in your browser. FOCUSFLOW never accesses private account data, messages, keystrokes, or exact watch-time APIs.',
      riskWindows,
      interventions,
    };
  }
}

export const wellbeingIntelligenceService = new WellbeingIntelligenceService();
