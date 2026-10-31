/**
 * @file apps/extension/src/services/api-client.ts
 * @description Extension client for sending batched, privacy-preserving estimates to the FOCUSFLOW API
 */

export interface SyncPayload {
  platform: 'INSTAGRAM_REELS' | 'YOUTUBE_SHORTS' | 'FACEBOOK_REELS';
  estimatedCount: number;
  durationSeconds: number;
  detectedAt: string;
}

export class ExtensionApiClient {
  private static apiBase = 'http://localhost:4000/api/v1';

  public static async pingHealth(): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiBase}/health`);
      const json = await res.json();
      return json.success === true;
    } catch {
      return false;
    }
  }

  public static async syncTelemetry(payload: SyncPayload, token?: string): Promise<boolean> {
    try {
      const res = await fetch(`${this.apiBase}/telemetry/reels`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(payload),
      });
      return res.ok;
    } catch (err) {
      console.warn('[FOCUSFLOW Extension] Sync failed (server offline or unauthenticated):', err);
      return false;
    }
  }
}
