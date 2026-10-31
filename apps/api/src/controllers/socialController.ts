/**
 * @file apps/api/src/controllers/socialController.ts
 * @description Controllers for Friends, Study Groups, and Leaderboards
 */
import type { Request, Response } from 'express';
import { socialService } from '../services/socialService.ts';
import { notificationService } from '../services/notificationService.ts';
import type { LeaderboardMetric, LeaderboardScope, ApiResponse } from '../../../../packages/shared-types/src/index.ts';

export class SocialController {
  // Friends
  public static getFriends(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const friends = socialService.getFriends(userId);
    const accepted = friends.filter(f => f.status === 'ACCEPTED');
    const pendingIncoming = friends.filter(f => f.status === 'PENDING_INCOMING');
    const pendingOutgoing = friends.filter(f => f.status === 'PENDING_OUTGOING');

    const response: ApiResponse = {
      success: true,
      data: {
        all: friends,
        accepted,
        pendingIncoming,
        pendingOutgoing,
      },
    };
    res.json(response);
  }

  public static sendFriendRequest(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { username } = req.body;

    if (!username) {
      res.status(400).json({ success: false, message: 'Username is required' });
      return;
    }

    const result = socialService.sendFriendRequest(userId, username);
    res.status(result.success ? 201 : 400).json(result);
  }

  public static acceptFriendRequest(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { id } = req.params;

    const result = socialService.acceptFriendRequest(userId, id);
    if (result.success) {
      notificationService.emitNotification(
        userId,
        'FRIEND_ACCEPTED',
        'Friend Request Accepted',
        result.message
      );
    }
    res.status(result.success ? 200 : 400).json(result);
  }

  public static rejectFriendRequest(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { id } = req.params;

    const result = socialService.rejectFriendRequest(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }

  public static removeFriend(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { id } = req.params;

    const result = socialService.removeFriend(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }

  // Study Groups
  public static getStudyGroups(req: Request, res: Response): void {
    const groups = socialService.getGroups();
    const myGroups = groups.filter(g => Boolean(g.userRole));

    const response: ApiResponse = {
      success: true,
      data: {
        groups,
        myGroups,
      },
    };
    res.json(response);
  }

  public static getStudyGroup(req: Request, res: Response): void {
    const { id } = req.params;
    const group = socialService.getGroupById(id);

    if (!group) {
      res.status(404).json({ success: false, message: 'Study group not found' });
      return;
    }

    res.json({ success: true, data: group });
  }

  public static createStudyGroup(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { name, description, isPrivate } = req.body;

    const result = socialService.createGroup(userId, {
      name,
      description: description || '',
      isPrivate: Boolean(isPrivate),
    });

    res.status(result.success ? 201 : 400).json(result);
  }

  public static joinStudyGroup(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { inviteCode } = req.body;

    if (!inviteCode) {
      res.status(400).json({ success: false, message: 'Invite code is required' });
      return;
    }

    const result = socialService.joinGroupByCode(userId, inviteCode);
    res.status(result.success ? 200 : 400).json(result);
  }

  public static leaveStudyGroup(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { id } = req.params;

    const result = socialService.leaveGroup(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }

  // Leaderboards
  public static getLeaderboards(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const scope = ((req.query.scope as string)?.toUpperCase() as LeaderboardScope) || 'GLOBAL';
    const metric = ((req.query.metric as string)?.toUpperCase() as LeaderboardMetric) || 'WEEKLY_XP';

    const entries = socialService.getLeaderboard(scope, metric, userId);
    const isOptedIn = socialService.getLeaderboardPrivacy(userId);

    const response: ApiResponse = {
      success: true,
      data: {
        scope,
        metric,
        entries,
        isOptedIn,
        topPodium: entries.slice(0, 3),
      },
    };
    res.json(response);
  }

  public static updateLeaderboardPrivacy(req: Request, res: Response): void {
    const userId = req.body.userId || 'current-user';
    const { showOnLeaderboard } = req.body;

    const result = socialService.setLeaderboardPrivacy(userId, Boolean(showOnLeaderboard));
    res.json({ success: true, data: result });
  }
}
