/**
 * @file apps/api/src/routes/notificationRoutes.ts
 * @description Routes for In-app Notifications
 */
import { Router } from 'express';
import { NotificationController } from '../controllers/notificationController.ts';

const router = Router();

router.get('/', NotificationController.getNotifications);
router.patch('/read-all', NotificationController.markAllAsRead);
router.patch('/:id/read', NotificationController.markAsRead);

export const notificationRouter = router;
