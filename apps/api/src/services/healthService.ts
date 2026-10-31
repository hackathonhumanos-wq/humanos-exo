export interface HealthStatus {
  success: boolean;
  message: string;
  timestamp?: string;
  version?: string;
  uptimeSeconds?: number;
}

export class HealthService {
  public static getHealth(): HealthStatus {
    return {
      success: true,
      message: 'FOCUSFLOW API is running',
      timestamp: new Date().toISOString(),
      version: '0.1.0-alpha',
      uptimeSeconds: Math.floor(process.uptime()),
    };
  }
}
