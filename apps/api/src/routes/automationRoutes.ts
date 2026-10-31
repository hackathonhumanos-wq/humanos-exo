/**
 * @file apps/api/src/routes/automationRoutes.ts
 * @description API routes for smart focus automations and triggers
 */
import { Router, type Request, type Response } from 'express';
import { automationService } from '../services/automationService.ts';
import { automationRuleSchema } from '../../../../packages/validation/src/index.ts';

export const automationRouter = Router();

automationRouter.get('/', (_req: Request, res: Response) => {
  const rules = automationService.getRules();
  res.json({ success: true, data: rules });
});

automationRouter.post('/', (req: Request, res: Response) => {
  const parsed = automationRuleSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', details: parsed.error.format() },
    });
    return;
  }

  const created = automationService.createRule(parsed.data);
  res.status(201).json({ success: true, data: created });
});

automationRouter.patch('/:id/toggle', (req: Request, res: Response) => {
  const updated = automationService.toggleRule(req.params.id);
  if (!updated) {
    res.status(404).json({ success: false, error: { code: 'RULE_NOT_FOUND' } });
    return;
  }
  res.json({ success: true, data: updated });
});

automationRouter.delete('/:id', (req: Request, res: Response) => {
  const deleted = automationService.deleteRule(req.params.id);
  if (!deleted) {
    res.status(404).json({ success: false, error: { code: 'RULE_NOT_FOUND' } });
    return;
  }
  res.json({ success: true, message: 'Automation rule deleted' });
});
