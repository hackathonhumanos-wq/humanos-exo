/**
 * @file apps/api/src/routes/plannerRoutes.ts
 * @description API routes for Adaptive Study Planner
 */
import { Router, type Request, type Response } from 'express';
import { studyPlannerService } from '../services/studyPlannerService.ts';
import { studyPlanGenerateSchema } from '../../../../packages/validation/src/index.ts';

export const plannerRouter = Router();

plannerRouter.get('/subjects', (req: Request, res: Response) => {
  const subjects = studyPlannerService.getSubjects();
  res.json({ success: true, data: subjects });
});

plannerRouter.post('/schedule', (req: Request, res: Response) => {
  const energyArchetype = req.body.energyArchetype || 'AFTERNOON_BALANCED';
  const targetHours = req.body.targetHours || 6;
  const schedule = studyPlannerService.generateAdaptiveSchedule(energyArchetype, targetHours);
  res.json({ success: true, data: schedule });
});

plannerRouter.post('/subjects', (req: Request, res: Response) => {
  const newSubject = studyPlannerService.addOrUpdateSubject(req.body);
  res.status(201).json({ success: true, data: newSubject });
});

plannerRouter.patch('/slots/:id/toggle', (req: Request, res: Response) => {
  const updated = studyPlannerService.toggleSlotComplete(req.params.id);
  res.json({ success: true, data: updated });
});
