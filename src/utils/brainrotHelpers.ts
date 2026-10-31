import { BrainStage, BRAIN_STAGES, DayStats, Friend, Sitting } from '../types/brainrot';

export function getStageForCount(count: number): BrainStage {
  for (let i = BRAIN_STAGES.length - 1; i >= 0; i--) {
    if (count >= BRAIN_STAGES[i].threshold) {
      return BRAIN_STAGES[i];
    }
  }
  return BRAIN_STAGES[0];
}

export function getNextThreshold(count: number): { nextStage: BrainStage | null; reelsRemaining: number | null } {
  const currentStage = getStageForCount(count);
  const nextStageIndex = currentStage.stage + 1;
  if (nextStageIndex < BRAIN_STAGES.length) {
    const next = BRAIN_STAGES[nextStageIndex];
    return {
      nextStage: next,
      reelsRemaining: next.threshold - count,
    };
  }
  return { nextStage: null, reelsRemaining: null };
}

export function formatDuration(ms: number): string {
  const totalMinutes = Math.floor(ms / (1000 * 60));
  if (totalMinutes < 1) return '< 1 min';
  if (totalMinutes < 60) return `${totalMinutes} min`;
  const hours = Math.floor(totalMinutes / 60);
  const remainingMins = totalMinutes % 60;
  return remainingMins > 0 ? `${hours} hr ${remainingMins} min` : `${hours} hr`;
}

export function formatTimeRange(start: number, end: number, is24h: boolean = false): string {
  const formatTime = (ts: number) => {
    const d = new Date(ts);
    if (is24h) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
    }
    return d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
  };
  return `${formatTime(start)} – ${formatTime(end)}`;
}

export function formatTimeAgo(ts: number | null): string {
  if (!ts) return 'Nothing counted yet';
  const diffSec = Math.floor((Date.now() - ts) / 1000);
  if (diffSec < 15) return 'just now';
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.floor(diffMin / 60);
  return `${diffHours}h ago`;
}

export const INITIAL_HOURLY = [
  0, 0, 0, 0, 0, 0, // 00:00 - 05:00
  0, 2, 8, 4, 1, 3, // 06:00 - 11:00
  12, 7, 3, 2, 5, 14, // 12:00 - 17:00
  24, 38, 29, 16, 8, 2 // 18:00 - 23:00
];

export const INITIAL_SITTINGS: Sitting[] = [
  {
    id: 'sit-1',
    start: Date.now() - 38 * 60 * 1000,
    end: Date.now() - 4 * 60 * 1000,
    reels: 42,
    durationMs: 34 * 60 * 1000
  },
  {
    id: 'sit-2',
    start: Date.now() - 110 * 60 * 1000,
    end: Date.now() - 85 * 60 * 1000,
    reels: 31,
    durationMs: 25 * 60 * 1000
  },
  {
    id: 'sit-3',
    start: Date.now() - 250 * 60 * 1000,
    end: Date.now() - 232 * 60 * 1000,
    reels: 18,
    durationMs: 18 * 60 * 1000
  },
  {
    id: 'sit-4',
    start: Date.now() - 480 * 60 * 1000,
    end: Date.now() - 465 * 60 * 1000,
    reels: 14,
    durationMs: 15 * 60 * 1000
  }
];

export const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'f-1',
    username: 'marcus_dev',
    displayName: 'Marcus V.',
    count: 268,
    scrollingMs: 82 * 60 * 1000,
    lastActiveMs: Date.now() - 45 * 1000, // Live right now!
    stage: 6,
    streakDays: 14
  },
  {
    id: 'f-2',
    username: 'elena.reads',
    displayName: 'Elena Rostova',
    count: 142,
    scrollingMs: 51 * 60 * 1000,
    lastActiveMs: Date.now() - 8 * 60 * 1000,
    stage: 4,
    streakDays: 7
  },
  {
    id: 'f-3',
    username: 'kai_scrolls',
    displayName: 'Kai Tanaka',
    count: 88,
    scrollingMs: 28 * 60 * 1000,
    lastActiveMs: Date.now() - 75 * 1000, // Live right now!
    stage: 3,
    streakDays: 4
  },
  {
    id: 'f-4',
    username: 'sarah_nomad',
    displayName: 'Sarah Jenkins',
    count: 18,
    scrollingMs: 7 * 60 * 1000,
    lastActiveMs: Date.now() - 140 * 60 * 1000,
    stage: 1,
    streakDays: 2
  }
];

export const SAMPLE_REELS = [
  {
    id: 'r-1',
    creator: 'Subway Surfers Gameplay',
    creatorHandle: '@clips_daily_loop',
    caption: 'Satisfying coin run while listening to an unfiltered Reddit story part 4 🛹🏃‍♂️ #viral #satisfying #reddit',
    audioTrack: 'Original sound - trending_audio_99',
    likes: '482.1K',
    comments: '3,842',
    bgGradient: 'from-amber-950 via-slate-900 to-indigo-950',
    videoTopic: 'Gameplay Splitted Screen + Voiceover',
    tags: ['Satisfying', 'Reddit', 'Gaming']
  },
  {
    id: 'r-2',
    creator: 'Chef Mario',
    creatorHandle: '@mario_cooks',
    caption: 'Deep frying melted cheese inside another cheese burger with garlic aioli 🧀🍔 #foodporn #cheese #cooking',
    audioTrack: 'Gourmet Sizzle - Sound Lab',
    likes: '1.2M',
    comments: '12.4K',
    bgGradient: 'from-orange-950 via-zinc-900 to-red-950',
    videoTopic: 'Hyper-saturated Food Recipe Cut',
    tags: ['Food', 'Cheese', 'Fast']
  },
  {
    id: 'r-3',
    creator: 'Gym Bro Wisdom',
    creatorHandle: '@daily_hypertrophy',
    caption: 'Why 99% of people are lifting wrong and ruining their gains (fix this today) 💪🔥 #gym #fitness #motivation',
    audioTrack: 'Phonk Aggressive - Drift Beats',
    likes: '235.8K',
    comments: '1,920',
    bgGradient: 'from-emerald-950 via-neutral-900 to-slate-950',
    videoTopic: 'Gym Advice with Loud Hardstyle Music',
    tags: ['Gym', 'Fitness', 'Gains']
  },
  {
    id: 'r-4',
    creator: 'Capybara Vibes',
    creatorHandle: '@capy_chill_club',
    caption: 'Bro is pulling up with an orange on his head and zero worries in life 🍊🛁 #capybara #chill #cute',
    audioTrack: 'After Dark x Sweater Weather',
    likes: '890.3K',
    comments: '5,110',
    bgGradient: 'from-teal-950 via-stone-900 to-cyan-950',
    videoTopic: 'Cute Animals in Hot Springs',
    tags: ['Chill', 'Animals', 'Cute']
  },
  {
    id: 'r-5',
    creator: 'Tech Unboxings 360',
    creatorHandle: '@gadget_peek',
    caption: 'Unboxing the most ridiculous gadget of 2026. Does anyone actually need this? 📱🤯 #tech #gadgets #unboxing',
    audioTrack: 'Cyber Lofi - Neon Drift',
    likes: '640.2K',
    comments: '4,103',
    bgGradient: 'from-purple-950 via-gray-900 to-blue-950',
    videoTopic: 'High Octane Tech Unboxing with Jump Cuts',
    tags: ['Tech', 'Gadgets', 'Review']
  }
];
