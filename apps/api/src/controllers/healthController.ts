import type { Request, Response } from 'express';
import { HealthService } from '../services/healthService.ts';

export class HealthController {
  public static checkHealth(req: Request, res: Response): void {
    const health = HealthService.getHealth();
    res.status(200).json({
      success: true,
      message: 'FOCUSFLOW API is running',
    });
  }
}
