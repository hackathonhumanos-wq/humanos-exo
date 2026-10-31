/**
 * @file apps/api/src/routes/socialRoutes.ts
 * @description Routes for Friends, Study Groups, and Leaderboards
 */
import { Router } from 'express';
import { SocialController } from '../controllers/socialController.ts';

const router = Router();

// Friends Endpoints
router.get('/friends', SocialController.getFriends);
router.post('/friends/request', SocialController.sendFriendRequest);
router.post('/friends/:id/accept', SocialController.acceptFriendRequest);
router.post('/friends/:id/reject', SocialController.rejectFriendRequest);
router.delete('/friends/:id', SocialController.removeFriend);

// Study Groups Endpoints
router.get('/groups', SocialController.getStudyGroups);
router.get('/groups/:id', SocialController.getStudyGroup);
router.post('/groups', SocialController.createStudyGroup);
router.post('/groups/join', SocialController.joinStudyGroup);
router.post('/groups/:id/leave', SocialController.leaveStudyGroup);

// Leaderboards
router.get('/leaderboards', SocialController.getLeaderboards);
router.post('/leaderboards/privacy', SocialController.updateLeaderboardPrivacy);

export const socialRouter = router;
