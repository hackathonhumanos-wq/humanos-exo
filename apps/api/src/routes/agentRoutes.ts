/**
 * @file apps/api/src/routes/agentRoutes.ts
 * @description API routes for Multi-Agent AI Orchestrator and Agent Control Center
 */
import { Router, type Request, type Response } from 'express';
import { agentOrchestrator } from '../services/ai/agentOrchestrator.ts';
import type { AgentId, AgentAutonomyLevel } from '../../../../packages/shared-types/src/index.ts';

export const agentRouter = Router();

agentRouter.get('/agents', (_req: Request, res: Response) => {
  const agents = agentOrchestrator.getAgents();
  res.json({ success: true, data: agents });
});

agentRouter.patch('/agents/:id/autonomy', (req: Request, res: Response) => {
  const { autonomyLevel } = req.body;
  if (!['SUPERVISED', 'SEMI_AUTONOMOUS', 'FULL_ADVISORY'].includes(autonomyLevel)) {
    res.status(400).json({ success: false, error: { code: 'INVALID_AUTONOMY_LEVEL' } });
    return;
  }
  const updated = agentOrchestrator.updateAgentAutonomy(req.params.id as AgentId, autonomyLevel as AgentAutonomyLevel);
  if (!updated) {
    res.status(404).json({ success: false, error: { code: 'AGENT_NOT_FOUND' } });
    return;
  }
  res.json({ success: true, data: updated });
});

agentRouter.get('/actions', (_req: Request, res: Response) => {
  const logs = agentOrchestrator.getActionLogs();
  res.json({ success: true, data: logs });
});

agentRouter.post('/actions/:id/approve', (req: Request, res: Response) => {
  const approved = agentOrchestrator.approveAction(req.params.id);
  if (!approved) {
    res.status(404).json({ success: false, error: { code: 'ACTION_NOT_FOUND' } });
    return;
  }
  res.json({ success: true, data: approved });
});

agentRouter.post('/synthesis', (_req: Request, res: Response) => {
  const report = agentOrchestrator.runMultiAgentSynthesis();
  res.json({ success: true, data: report });
});
