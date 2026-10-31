/**
 * @file apps/api/src/routes/analyticsRoutes.ts
 * @description API routes for overview metrics, screen-time & focus analytics, session logs, and daily goals
 */
import { Router, type Request, type Response } from 'express';
import { analyticsService } from '../services/analyticsService.ts';
import {
  focusSessionCompleteSchema,
  goalUpsertSchema,
} from '../../../../packages/validation/src/index.ts';

export const analyticsRouter = Router();

analyticsRouter.get('/overview', (_req: Request, res: Response) => {
  const overview = analyticsService.getOverview();
  res.json({ success: true, data: overview });
});

analyticsRouter.post('/focus-sessions', (req: Request, res: Response) => {
  const parsed = focusSessionCompleteSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid focus session payload',
      error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
    });
    return;
  }
  const result = analyticsService.logFocusSession(parsed.data);
  res.status(201).json({
    success: true,
    message: `Logged ${parsed.data.durationMinutes}m focus session (+${result.xpEarned} XP)!`,
    data: result,
  });
});

analyticsRouter.get('/goals', (_req: Request, res: Response) => {
  const goals = analyticsService.getGoals();
  res.json({ success: true, data: goals });
});

analyticsRouter.post('/goals', (req: Request, res: Response) => {
  const parsed = goalUpsertSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid goal payload',
      error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
    });
    return;
  }
  const goals = analyticsService.upsertGoal(parsed.data);
  res.status(201).json({ success: true, message: 'Goal saved.', data: goals });
});

analyticsRouter.delete('/goals/:id', (req: Request, res: Response) => {
  const goals = analyticsService.deleteGoal(req.params.id);
  res.json({ success: true, message: 'Goal removed.', data: goals });
});

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
  const event = analyticsService.trackEvent('current-user', eventType, metadata || {});
  res.status(201).json({ success: true, data: event });
});

analyticsRouter.get('/retention', (_req: Request, res: Response) => {
  const stats = analyticsService.getRetentionStats();
  res.json({ success: true, data: stats });
});
