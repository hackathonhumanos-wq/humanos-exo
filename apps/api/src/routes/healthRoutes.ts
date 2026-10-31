import { Router } from 'express';
import { HealthController } from '../controllers/healthController.ts';

export const healthRouter = Router();

healthRouter.get('/health', HealthController.checkHealth);
