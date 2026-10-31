/**
 * @file apps/api/src/controllers/notificationController.ts
 * @description Controller for in-app notifications
 */
import type { Request, Response } from 'express';
import { notificationService } from '../services/notificationService.ts';
import type { ApiResponse } from '../../../../packages/shared-types/src/index.ts';

export class NotificationController {
  public static getNotifications(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const notifications = notificationService.getNotifications(userId);
    const unreadCount = notificationService.getUnreadCount(userId);

    const response: ApiResponse = {
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    };
    res.json(response);
  }

  public static markAsRead(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const { id } = req.params;

    const result = notificationService.markAsRead(userId, id);
    res.status(result.success ? 200 : 400).json(result);
  }

  public static markAllAsRead(req: Request, res: Response): void {
    const userId = (req.query.userId as string) || 'current-user';
    const result = notificationService.markAllAsRead(userId);
    res.json(result);
  }
}
