/**
 * @file apps/extension/src/tracking/usage-manager.ts
 * @description Coordinates domain-level usage accumulation and periodic storage synchronization
 */
import { ExtensionStorage } from '../storage/extension-storage.ts';

export class UsageManager {
  private activeDomain: string | null = null;
  private domainAccumulator: Map<string, number> = new Map();

  public switchActiveDomain(rawUrl?: string): void {
    if (!rawUrl) {
      this.activeDomain = null;
      return;
    }
    try {
      const parsed = new URL(rawUrl);
      this.activeDomain = parsed.hostname.replace(/^www\./, '').toLowerCase();
    } catch {
      this.activeDomain = null;
    }
  }

  public recordTick(seconds: number): void {
    if (!this.activeDomain || seconds <= 0) return;
    const current = this.domainAccumulator.get(this.activeDomain) || 0;
    this.domainAccumulator.set(this.activeDomain, current + seconds);
  }

  public async flush(): Promise<void> {
    const prefs = await ExtensionStorage.getPreferences();
    let totalSecs = 0;
    for (const secs of this.domainAccumulator.values()) {
      totalSecs += secs;
    }
    const addedMinutes = Math.floor(totalSecs / 60);
    if (addedMinutes > 0) {
      prefs.todayEstimate.totalActiveMinutes += addedMinutes;
      await ExtensionStorage.setPreferences({ todayEstimate: prefs.todayEstimate });
      this.domainAccumulator.clear();
    }
  }
}
