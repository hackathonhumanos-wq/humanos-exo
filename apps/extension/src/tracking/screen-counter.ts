/**
 * @file apps/extension/src/tracking/screen-counter.ts
 * @description Tracks active tab time without reading page contents or keystrokes
 */

export class ScreenCounter {
  private activeStartTime: number = Date.now();
  private isUserActive: boolean = true;

  public setIdleState(state: 'active' | 'idle' | 'locked'): void {
    this.isUserActive = state === 'active';
  }

  public getElapsedActiveSeconds(): number {
    if (!this.isUserActive) return 0;
    const now = Date.now();
    const elapsed = Math.floor((now - this.activeStartTime) / 1000);
    this.activeStartTime = now;
    return elapsed;
  }
}
