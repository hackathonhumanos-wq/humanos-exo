/**
 * @file packages/shared-utils/src/index.ts
 * @description Shared pure utility helpers for FOCUSFLOW across web, API, and extension
 */

/**
 * Format total minutes into human-readable duration (e.g., "1h 45m" or "25m")
 */
export function formatMinutes(totalMinutes: number): string {
  if (totalMinutes < 60) {
    return `${Math.round(totalMinutes)}m`;
  }
  const hours = Math.floor(totalMinutes / 60);
  const mins = Math.round(totalMinutes % 60);
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
}

/**
 * Format seconds into mm:ss for timers
 */
export function formatTimerSeconds(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

/**
 * Sanitize a domain to avoid recording detailed paths or tracking tokens
 * e.g., "https://www.instagram.com/reels/xyz?igsh=123" -> "instagram.com"
 */
export function sanitizeDomain(urlOrHostname: string): string {
  try {
    let hostname = urlOrHostname;
    if (urlOrHostname.startsWith('http://') || urlOrHostname.startsWith('https://')) {
      hostname = new URL(urlOrHostname).hostname;
    }
    return hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return urlOrHostname.toLowerCase();
  }
}

/**
 * Calculates XP reward for a completed focus session
 */
export function calculateFocusXp(durationMinutes: number, streakDays: number = 0): number {
  const baseXp = Math.floor(durationMinutes * 2);
  const streakMultiplier = 1 + Math.min(streakDays * 0.05, 0.5); // Max 50% streak bonus
  return Math.round(baseXp * streakMultiplier);
}
