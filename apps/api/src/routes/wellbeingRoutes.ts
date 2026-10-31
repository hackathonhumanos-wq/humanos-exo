/**
 * @file apps/api/src/routes/wellbeingRoutes.ts
 * @description API routes for Digital Wellbeing intelligence & focus health
 */
import { Router, type Request, type Response } from 'express';
import { wellbeingIntelligenceService } from '../services/wellbeingIntelligenceService.ts';

export const wellbeingRouter = Router();

wellbeingRouter.get('/health-score', (_req: Request, res: Response) => {
  const score = wellbeingIntelligenceService.calculateHealthScore();
  res.json({ success: true, data: score });
});
