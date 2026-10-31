/**
 * @file apps/api/src/routes/institutionalRoutes.ts
 * @description API routes for Institutional Counsellor Portal with strict k-anonymity
 */
import { Router, type Request, type Response } from 'express';
import { institutionalService } from '../services/institutionalService.ts';

export const institutionalRouter = Router();

institutionalRouter.get('/cohorts', (_req: Request, res: Response) => {
  const cohorts = institutionalService.getCohorts();
  res.json({ success: true, data: cohorts });
});

institutionalRouter.get('/cohorts/:id', (req: Request, res: Response) => {
  const cohort = institutionalService.getCohortById(req.params.id);
  if (!cohort) {
    res.status(404).json({ success: false, error: { code: 'COHORT_NOT_FOUND' } });
    return;
  }
  res.json({ success: true, data: cohort });
});
