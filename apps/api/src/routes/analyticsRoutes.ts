/**
 * @file apps/api/src/routes/analyticsRoutes.ts
 * @description API routes for product analytics and telemetry
 */
import { Router, type Request, type Response } from 'express';
import { analyticsService } from '../services/analyticsService.ts';

export const analyticsRouter = Router();

analyticsRouter.get('/events', (_req: Request, res: Response) => {
  const events = analyticsService.getRecentEvents();
  res.json({ success: true, data: events });
});

analyticsRouter.post('/events', (req: Request, res: Response) => {
  const { eventType, metadata } = req.body;
  if (!eventType) {
    res.status(400).json({ success: false, error: { code: 'INVALID_EVENT', message: 'eventType is required' } });
    return;
  }
  const event = analyticsService.trackEvent('usr-student-demo', eventType, metadata || {});
  res.status(201).json({ success: true, data: event });
});

analyticsRouter.get('/retention', (_req: Request, res: Response) => {
  const stats = analyticsService.getRetentionStats();
  res.json({ success: true, data: stats });
});
