/**
 * @file apps/api/src/controllers/gamificationController.ts
 * @description API controllers handling gamification, XP progression, badges, streaks, and challenges
 */
import type { Request, Response } from 'express';
import { gamificationService, STUDENT_LEVELS, XP_RULES } from '../services/gamificationService.ts';
import { notificationService } from '../services/notificationService.ts';
import type { ApiResponse } from '../../../../packages/shared-types/src/index.ts';

export class GamificationController {
  public static getProfile(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const levelProgress = gamificationService.getLevelProgress(userId);
    const streakInfo = gamificationService.getStreakInfo(userId);
    const achievements = gamificationService.getAchievements();
    const unlockedBadges = achievements.filter(a => a.isUnlocked).length;

    const response: ApiResponse = {
      success: true,
      data: {
        userId,
        levelProgress,
        streakInfo,
        totalBadges: achievements.length,
        unlockedBadges,
        levelsReference: STUDENT_LEVELS,
        xpRulesReference: XP_RULES,
      },
    };
    res.json(response);
  }

  public static getXp(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const totalXp = gamificationService.getXp(userId);
    const levelProgress = gamificationService.getLevelProgress(userId);

    const response: ApiResponse = {
      success: true,
      data: {
        totalXp,
        levelProgress,
      },
    };
    res.json(response);
  }

  public static getXpHistory(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const transactions = gamificationService.getTransactions(userId);

    const response: ApiResponse = {
      success: true,
      data: {
        transactions,
        count: transactions.length,
      },
    };
    res.json(response);
  }

  public static awardXp(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { activityType, customDescription, referenceId } = req.body;

    if (!activityType) {
      res.status(400).json({ success: false, message: 'activityType is required' });
      return;
    }

    const previousLevel = gamificationService.getLevelProgress(userId).currentLevel.levelNumber;
    const result = gamificationService.awardXp(userId, activityType, customDescription, referenceId);

    if (result.awarded) {
      const newLevel = gamificationService.getLevelProgress(userId).currentLevel;
      // Trigger level-up notification if level elevated
      if (newLevel.levelNumber > previousLevel) {
        notificationService.emitNotification(
          userId,
          'LEVEL_UP',
          `Level Up! You reached ${newLevel.title}`,
          `Amazing work! You unlocked Level ${newLevel.levelNumber}: ${newLevel.title}. Keep pushing your focus goals!`
        );
      }
    }

    res.json({
      success: result.awarded,
      message: result.message,
      data: {
        xpEarned: result.xpEarned,
        newTotalXp: result.newTotalXp,
      },
    });
  }

  public static getAchievements(req: Request, res: Response): void {
    const achievements = gamificationService.getAchievements();
    const unlockedCount = achievements.filter(a => a.isUnlocked).length;

    const response: ApiResponse = {
      success: true,
      data: {
        achievements,
        unlockedCount,
        totalCount: achievements.length,
      },
    };
    res.json(response);
  }

  public static getStreaks(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const streakInfo = gamificationService.getStreakInfo(userId);

    const response: ApiResponse = {
      success: true,
      data: streakInfo,
    };
    res.json(response);
  }

  public static getChallenges(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const challenges = gamificationService.getChallenges(userId);

    const response: ApiResponse = {
      success: true,
      data: {
        challenges,
        daily: challenges.filter(c => c.type === 'DAILY'),
        weekly: challenges.filter(c => c.type === 'WEEKLY'),
      },
    };
    res.json(response);
  }

  public static claimChallenge(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { challengeId } = req.params;

    if (!challengeId) {
      res.status(400).json({ success: false, message: 'Challenge ID is required' });
      return;
    }

    const result = gamificationService.claimChallengeReward(userId, challengeId);

    if (result.success) {
      notificationService.emitNotification(
        userId,
        'XP_EARNED',
        'Challenge Reward Claimed',
        result.message
      );
    }

    res.status(result.success ? 200 : 400).json(result);
  }
}
