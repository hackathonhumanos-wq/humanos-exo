/**
 * @file apps/api/src/routes/feedbackRoutes.ts
 * @description API routes for student product feedback and ratings
 */
import { Router, type Request, type Response } from 'express';
import { feedbackService } from '../services/feedbackService.ts';
import { feedbackSchema } from '../../../../packages/validation/src/index.ts';

export const feedbackRouter = Router();

feedbackRouter.get('/', (_req: Request, res: Response) => {
  const items = feedbackService.getAllFeedback();
  res.json({ success: true, data: items });
});

feedbackRouter.post('/', (req: Request, res: Response) => {
  const parsed = feedbackSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', details: parsed.error.format() },
    });
    return;
  }

  const created = feedbackService.submitFeedback({
    userId: 'usr-student-demo',
    ...parsed.data,
  });

  res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: created });
});
