/**
 * @file apps/extension/src/storage/extension-storage.ts
 * @description Type-safe wrapper for Chrome Storage API (local and sync)
 */

export interface ExtensionPreferences {
  trackingEnabled: boolean;
  dailyReelLimit: number;
  blockDistractingSites: boolean;
  blockedDomains: string[];
  activeFocusSessionId: string | null;
  todayEstimate: {
    instagramReels: number;
    youtubeShorts: number;
    facebookReels: number;
    totalActiveMinutes: number;
    lastResetDate: string; // YYYY-MM-DD
  };
}

const DEFAULT_PREFERENCES: ExtensionPreferences = {
  trackingEnabled: true,
  dailyReelLimit: 50,
  blockDistractingSites: false,
  blockedDomains: ['instagram.com', 'tiktok.com', 'facebook.com'],
  activeFocusSessionId: null,
  todayEstimate: {
    instagramReels: 0,
    youtubeShorts: 0,
    facebookReels: 0,
    totalActiveMinutes: 0,
    lastResetDate: new Date().toISOString().slice(0, 10),
  },
};

export class ExtensionStorage {
  public static async getPreferences(): Promise<ExtensionPreferences> {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) {
      return DEFAULT_PREFERENCES;
    }
    const data = await chrome.storage.local.get('focusflow_prefs');
    return data.focusflow_prefs ? { ...DEFAULT_PREFERENCES, ...data.focusflow_prefs } : DEFAULT_PREFERENCES;
  }

  public static async setPreferences(prefs: Partial<ExtensionPreferences>): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.storage?.local) return;
    const current = await this.getPreferences();
    await chrome.storage.local.set({
      focusflow_prefs: { ...current, ...prefs },
    });
  }

  public static async incrementReelEstimate(platform: 'instagramReels' | 'youtubeShorts' | 'facebookReels'): Promise<number> {
    const prefs = await this.getPreferences();
    const today = new Date().toISOString().slice(0, 10);

    // Reset counts at local midnight
    if (prefs.todayEstimate.lastResetDate !== today) {
      prefs.todayEstimate = {
        instagramReels: 0,
        youtubeShorts: 0,
        facebookReels: 0,
        totalActiveMinutes: 0,
        lastResetDate: today,
      };
    }

    prefs.todayEstimate[platform] += 1;
    await this.setPreferences({ todayEstimate: prefs.todayEstimate });
    return prefs.todayEstimate[platform];
  }
}
