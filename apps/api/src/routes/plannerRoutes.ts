/**
 * @file apps/api/src/routes/plannerRoutes.ts
 * @description API routes for Adaptive Study Planner & Daily Study Tasks
 */
import { Router, type Request, type Response } from 'express';
import { studyPlannerService } from '../services/studyPlannerService.ts';
import { studySlotCreateSchema } from '../../../../packages/validation/src/index.ts';

export const plannerRouter = Router();

plannerRouter.get('/subjects', (_req: Request, res: Response) => {
  const subjects = studyPlannerService.getSubjects();
  res.json({ success: true, data: subjects });
});

plannerRouter.get('/schedule', (_req: Request, res: Response) => {
  const schedule = studyPlannerService.getCurrentSchedule();
  res.json({ success: true, data: schedule });
});

plannerRouter.post('/schedule', (req: Request, res: Response) => {
  const energyArchetype = req.body.energyArchetype || 'AFTERNOON_BALANCED';
  const targetHours = Number(req.body.targetHours) || 6;
  const forceRegenerate = Boolean(req.body.regenerate);
  const schedule = forceRegenerate
    ? studyPlannerService.regenerateSchedule(energyArchetype, targetHours)
    : studyPlannerService.generateAdaptiveSchedule(energyArchetype, targetHours);
  res.json({ success: true, data: schedule });
});

plannerRouter.post('/subjects', (req: Request, res: Response) => {
  if (!req.body?.name || typeof req.body.name !== 'string') {
    res.status(400).json({ success: false, message: 'Subject name is required' });
    return;
  }
  const newSubject = studyPlannerService.addOrUpdateSubject(req.body);
  res.status(201).json({ success: true, data: newSubject });
});

plannerRouter.post('/slots', (req: Request, res: Response) => {
  const parsed = studySlotCreateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: parsed.error.issues[0]?.message || 'Invalid study task payload',
      error: { code: 'VALIDATION_ERROR', details: parsed.error.flatten() },
    });
    return;
  }
  const updatedSchedule = studyPlannerService.addCustomSlot(parsed.data);
  res.status(201).json({ success: true, message: 'Study task added to today’s plan.', data: updatedSchedule });
});

plannerRouter.patch('/slots/:id/toggle', (req: Request, res: Response) => {
  const updatedSchedule = studyPlannerService.toggleSlotComplete(req.params.id);
  res.json({ success: true, data: updatedSchedule });
});
