/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Router, type Request, type Response } from 'express';
import { systemSpecsService } from '../services/systemSpecsService.ts';

export const systemRouter = Router();

/**
 * GET /api/v1/system/architecture
 * Returns full architectural specifications, monorepo breakdown, Prisma schema specs, and MV3 extension details.
 */
systemRouter.get('/architecture', (_req: Request, res: Response) => {
  const specs = systemSpecsService.getArchitectureSpecs();
  res.json({
    success: true,
    data: specs,
    meta: {
      generatedAt: new Date().toISOString(),
      server: 'FOCUSFLOW Unified Production Runtime',
      nodeEnv: process.env.NODE_ENV || 'development'
    }
  });
});

/**
 * GET /api/v1/system/specs
 * Returns structured monorepo specs and data safety guarantees.
 */
systemRouter.get('/specs', (_req: Request, res: Response) => {
  const breakdown = systemSpecsService.getMonorepoBreakdown();
  res.json(breakdown);
});
