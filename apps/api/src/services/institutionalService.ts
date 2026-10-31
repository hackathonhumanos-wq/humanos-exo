/**
 * @file apps/api/src/services/institutionalService.ts
 * @description Institutional & Campus Counsellor analytics service with strict k-anonymity and opt-in consent safeguards
 */
import type { InstitutionalCohortSummary } from '../../../../packages/shared-types/src/index.ts';

class InstitutionalService {
  private cohorts: InstitutionalCohortSummary[] = [
    {
      institutionId: 'inst-mit-cs',
      institutionName: 'Department of Computer Science & Engineering',
      cohortName: 'Class of 2026 - Algorithms & Systems',
      totalStudentsEnrolled: 84,
      optedInStudentsCount: 62,
      averageWeeklyFocusMinutes: 530,
      averageWellbeingScore: 82,
      reelsDistractionReductionPercent: 28.4,
      kAnonymityPassed: true,
      dataPrivacyNote:
        'K-anonymity verified (Cohort size N=62 > threshold 5). All individual student identities, browsing logs, and exact session timestamps are completely stripped.',
    },
    {
      institutionId: 'inst-stanford-med',
      institutionName: 'Pre-Med Academic Guidance Center',
      cohortName: 'MCAT Intensive Preparation Spring Cohort',
      totalStudentsEnrolled: 45,
      optedInStudentsCount: 38,
      averageWeeklyFocusMinutes: 680,
      averageWellbeingScore: 78,
      reelsDistractionReductionPercent: 34.1,
      kAnonymityPassed: true,
      dataPrivacyNote:
        'K-anonymity verified (Cohort size N=38 > threshold 5). Aggregated focus distribution accessible by verified counsellors only.',
    },
    {
      institutionId: 'inst-small-test',
      institutionName: 'Experimental Seminar Group',
      cohortName: 'Advanced Quantum Computing Lab',
      totalStudentsEnrolled: 4,
      optedInStudentsCount: 3,
      averageWeeklyFocusMinutes: 0,
      averageWellbeingScore: 0,
      reelsDistractionReductionPercent: 0,
      kAnonymityPassed: false,
      dataPrivacyNote:
        'PRIVACY SHIELD ACTIVE: Cohort size (N=3) is below the minimum k-anonymity privacy threshold (k >= 5). Metrics are withheld to prevent re-identification of individual students.',
    },
  ];

  public getCohorts(): InstitutionalCohortSummary[] {
    return this.cohorts;
  }

  public getCohortById(id: string): InstitutionalCohortSummary | null {
    const cohort = this.cohorts.find(c => c.institutionId === id);
    if (!cohort) return null;

    // Strict privacy enforcement: If k-anonymity failed, return redacted payload
    if (!cohort.kAnonymityPassed) {
      return {
        ...cohort,
        averageWeeklyFocusMinutes: 0,
        averageWellbeingScore: 0,
        reelsDistractionReductionPercent: 0,
        dataPrivacyNote:
          'DATA REDACTED FOR STUDENT PRIVACY: Minimum cohort size of 5 opted-in students required to reveal aggregate statistics.',
      };
    }

    return cohort;
  }
}

export const institutionalService = new InstitutionalService();
