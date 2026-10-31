/**
 * @file apps/api/src/routes/gamificationRoutes.ts
 * @description Routes for XP ledger, badges, streaks, and challenges
 */
import { Router } from 'express';
import { GamificationController } from '../controllers/gamificationController.ts';

const router = Router();

// Gamification Overview & Levels
router.get('/profile', GamificationController.getProfile);

// XP Engine
router.get('/xp', GamificationController.getXp);
router.get('/xp/history', GamificationController.getXpHistory);
router.post('/xp/award', GamificationController.awardXp);

// Badges & Achievements
router.get('/achievements', GamificationController.getAchievements);

// Streaks
router.get('/streaks', GamificationController.getStreaks);

// Challenges
router.get('/challenges', GamificationController.getChallenges);
router.post('/challenges/:challengeId/claim', GamificationController.claimChallenge);

export const gamificationRouter = router;
