import { Router } from 'express';
import { healthRouter } from './healthRoutes.ts';
import { gamificationRouter } from './gamificationRoutes.ts';
import { socialRouter } from './socialRoutes.ts';
import { notificationRouter } from './notificationRoutes.ts';
import { plannerRouter } from './plannerRoutes.ts';
import { wellbeingRouter } from './wellbeingRoutes.ts';
import { analyticsRouter } from './analyticsRoutes.ts';
import { feedbackRouter } from './feedbackRoutes.ts';
import { subscriptionRouter } from './subscriptionRoutes.ts';
import { agentRouter } from './agentRoutes.ts';
import { automationRouter } from './automationRoutes.ts';
import { institutionalRouter } from './institutionalRoutes.ts';
import { systemRouter } from './systemRoutes.ts';

export const apiRouter = Router();

// Mount API v1 endpoints
apiRouter.use('/v1', healthRouter);
apiRouter.use('/v1/system', systemRouter);
apiRouter.use('/v1/gamification', gamificationRouter);
apiRouter.use('/v1', socialRouter);
apiRouter.use('/v1/notifications', notificationRouter);
apiRouter.use('/v1/planner', plannerRouter);
apiRouter.use('/v1/wellbeing', wellbeingRouter);
apiRouter.use('/v1/analytics', analyticsRouter);
apiRouter.use('/v1/feedback', feedbackRouter);
apiRouter.use('/v1/subscriptions', subscriptionRouter);
apiRouter.use('/v1/ai-agents', agentRouter);
apiRouter.use('/v1/automations', automationRouter);
apiRouter.use('/v1/institutions', institutionalRouter);

