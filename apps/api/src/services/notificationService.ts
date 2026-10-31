/**
 * @file apps/api/src/services/notificationService.ts
 * @description Centralized notifications engine for achievements, level ups, streaks, and social interactions
 */
import type { AppNotification, NotificationType } from '../../../../packages/shared-types/src/index.ts';

class NotificationStore {
  private notificationsMap: Map<string, AppNotification[]> = new Map([
    [
      'current-user',
      [
        {
          id: 'notif-1',
          userId: 'current-user',
          type: 'LEVEL_UP',
          title: 'Level Up! Deep Worker Reached',
          message: 'Congratulations! You unlocked Level 4 (Deep Worker) with 840 total XP.',
          isRead: false,
          createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        },
        {
          id: 'notif-2',
          userId: 'current-user',
          type: 'STREAK_MILESTONE',
          title: '5-Day Streak Milestone Active',
          message: 'You have sustained your focus habit for 5 consecutive days. 2 days left to earn Unbreakable Week!',
          isRead: false,
          createdAt: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
        },
        {
          id: 'notif-3',
          userId: 'current-user',
          type: 'FRIEND_REQUEST',
          title: 'New Friend Request',
          message: 'Elena Rostova (@elena_rostova) wants to connect as study accountability partners.',
          isRead: false,
          dataRefId: 'user-elena',
          createdAt: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
        },
        {
          id: 'notif-4',
          userId: 'current-user',
          type: 'CHALLENGE_COMPLETE',
          title: 'Daily Challenge Ready to Claim',
          message: 'You completed "Complete 2 Focus Sessions". Claim +20 XP now!',
          isRead: true,
          dataRefId: 'chal-d1',
          createdAt: new Date(Date.now() - 14 * 3600 * 1000).toISOString(),
        },
        {
          id: 'notif-5',
          userId: 'current-user',
          type: 'BADGE_UNLOCKED',
          title: 'Badge Unlocked: Focus Practitioner',
          message: 'You earned the Focus Practitioner badge and +50 XP reward!',
          isRead: true,
          dataRefId: 'ach-4',
          createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        },
      ],
    ],
  ]);

  public getNotifications(userId: string = 'current-user'): AppNotification[] {
    return this.notificationsMap.get(userId) || [];
  }

  public getUnreadCount(userId: string = 'current-user'): number {
    const list = this.getNotifications(userId);
    return list.filter(n => !n.isRead).length;
  }

  public markAsRead(
    userId: string = 'current-user',
    notificationId: string
  ): { success: boolean; message: string } {
    const list = this.getNotifications(userId);
    const target = list.find(n => n.id === notificationId);
    if (!target) {
      return { success: false, message: 'Notification not found' };
    }
    target.isRead = true;
    this.notificationsMap.set(userId, [...list]);
    return { success: true, message: 'Notification marked as read' };
  }

  public markAllAsRead(userId: string = 'current-user'): { success: boolean; message: string } {
    const list = this.getNotifications(userId);
    const updated = list.map(n => ({ ...n, isRead: true }));
    this.notificationsMap.set(userId, updated);
    return { success: true, message: 'All notifications marked as read' };
  }

  public emitNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    dataRefId?: string
  ): AppNotification {
    const list = this.getNotifications(userId);
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      userId,
      type,
      title,
      message,
      isRead: false,
      dataRefId,
      createdAt: new Date().toISOString(),
    };
    this.notificationsMap.set(userId, [newNotif, ...list]);
    return newNotif;
  }
}

export const notificationService = new NotificationStore();
