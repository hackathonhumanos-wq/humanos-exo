/**
 * @file apps/api/src/routes/wellbeingRoutes.ts
 * @description API routes for Digital Wellbeing intelligence, Reels & Shorts analytics, and student privacy controls
 */
import { Router, type Request, type Response } from 'express';
import { wellbeingIntelligenceService } from '../services/wellbeingIntelligenceService.ts';
import {
  reelsSettingsUpdateSchema,
  reelsDataCorrectionSchema,
  privacyConsentSchema,
} from '../../../../packages/validation/src/index.ts';

export const wellbeingRouter = Router();

wellbeingRouter.get('/health-score', (_req: Request, res: Response) => {
  const score = wellbeingIntelligenceService.calculateHealthScore();
  res.json({ success: true, data: score });
});

wellbeingRouter.get('/reels', (_req: Request, res: Response) => {
  const summary = wellbeingIntelligenceService.getReelsAnalytics();
  res.json({ success: true, data: summary });
});

wellbeingRouter.patch('/reels/settings', (req: Request, res: Response) => {
  const parsed = reelsSettingsUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid Reels settings payload',
      error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
    });
    return;
  }
  const updated = wellbeingIntelligenceService.updateReelsSettings(parsed.data);
  res.json({ success: true, message: 'Short-form limits and tracking controls updated.', data: updated });
});

wellbeingRouter.post('/reels/correct', (req: Request, res: Response) => {
  const parsed = reelsDataCorrectionSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid correction request',
      error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
    });
    return;
  }
  const result = wellbeingIntelligenceService.correctReelsHistory(parsed.data);
  if (!result.updated) {
    res.status(404).json({ success: false, message: result.message });
    return;
  }
  res.json({ success: true, message: result.message, data: result.summary });
});

wellbeingRouter.get('/privacy', (_req: Request, res: Response) => {
  const privacy = wellbeingIntelligenceService.getPrivacyConsent();
  res.json({ success: true, data: privacy });
});

wellbeingRouter.put('/privacy', (req: Request, res: Response) => {
  const parsed = privacyConsentSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid privacy settings payload',
      error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
    });
    return;
  }
  const updated = wellbeingIntelligenceService.updatePrivacyConsent(parsed.data);
  res.json({ success: true, message: 'Privacy consent preferences saved.', data: updated });
});
