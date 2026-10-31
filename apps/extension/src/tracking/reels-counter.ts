/**
 * @file apps/extension/src/tracking/reels-counter.ts
 * @description Privacy-first short-form video transition detector.
 *
 * NOTE: Counts are strictly ESTIMATES derived from URL navigation state changes
 * or visible feed observer transitions. No keystrokes, messages, captions or personal
 * content are ever collected or processed.
 */
import { ExtensionStorage } from '../storage/extension-storage.ts';

export class ReelsCounter {
  private lastUrl = '';
  private lastCountTime = 0;
  private readonly cooldownMs = 2500; // Debounce fast accidental flickers

  public registerFeedTransition(currentUrl: string, platform: 'instagramReels' | 'youtubeShorts' | 'facebookReels'): void {
    const now = Date.now();
    if (currentUrl === this.lastUrl) return;
    if (now - this.lastCountTime < this.cooldownMs) return;

    this.lastUrl = currentUrl;
    this.lastCountTime = now;

    ExtensionStorage.incrementReelEstimate(platform)
      .then(total => {
        // Send message to background worker for badge update or limit check
        if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
          chrome.runtime.sendMessage({
            type: 'REEL_ESTIMATE_INCREMENTED',
            platform,
            totalToday: total,
          });
        }
      })
      .catch(() => {});
  }
}
