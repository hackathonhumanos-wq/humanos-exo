export interface BrainStage {
  stage: number;
  name: string;
  threshold: number;
  glow: string;
  sprite: string;
  isSlimy: boolean;
  isSmoking: boolean;
  tagline: string;
  description: string;
  symptoms: string[];
}

export const BRAIN_STAGES: BrainStage[] = [
  {
    stage: 0,
    name: "Fresh",
    threshold: 0,
    glow: "rgba(255, 79, 216, 0.28)",
    sprite: "/assets/brain-0.png",
    isSlimy: false,
    isSmoking: false,
    tagline: "Pristine neuroplasticity",
    description: "Your attention span is intact. Thoughts form crisp, cohesive sentences. You remember what you did 10 minutes ago.",
    symptoms: ["Clear focus", "High dopamine sensitivity", "Normal reading speed"]
  },
  {
    stage: 1,
    name: "Bruised",
    threshold: 10,
    glow: "rgba(255, 120, 200, 0.32)",
    sprite: "/assets/brain-1.png",
    isSlimy: false,
    isSmoking: false,
    tagline: "Minor dopamine depletion",
    description: "Slight discoloration. You intended to check one video, but thumb momentum took over for just a moment.",
    symptoms: ["Mild wanderlust", "Minor urge to keep scrolling", "Slight distraction"]
  },
  {
    stage: 2,
    name: "Foggy",
    threshold: 25,
    glow: "rgba(180, 160, 240, 0.35)",
    sprite: "/assets/brain-2.png",
    isSlimy: false,
    isSmoking: false,
    tagline: "Short-term buffer hazing",
    description: "Dull haze settling in. You forget which reel made you chuckle 45 seconds ago. Eyes slightly widened.",
    symptoms: ["Decreased working memory", "Diminishing returns on amusement", "Glazed gaze"]
  },
  {
    stage: 3,
    name: "Fried",
    threshold: 50,
    glow: "rgba(244, 83, 63, 0.45)",
    sprite: "/assets/brain-3.png",
    isSlimy: false,
    isSmoking: false,
    tagline: "Prefrontal cortex overheating",
    description: "Crispy edges. Synaptic firing is erratic. You tap through videos after 2 seconds because patience has evaporated.",
    symptoms: ["Sub-3-second attention threshold", "Phantom vibrations", "Sluggish decision making"]
  },
  {
    stage: 4,
    name: "Mushy",
    threshold: 100,
    glow: "rgba(184, 255, 60, 0.5)",
    sprite: "/assets/brain-4.png",
    isSlimy: true,
    isSmoking: false,
    tagline: "Cellular greening & slime excretion",
    description: "The brain turns green. Sweat droplets turn into viscous radioactive slime. You've been scrolling for over an hour.",
    symptoms: ["Green slime secretion", "Loss of temporal awareness", "Regret while continuing to swipe"]
  },
  {
    stage: 5,
    name: "Rotting",
    threshold: 175,
    glow: "rgba(127, 207, 0, 0.6)",
    sprite: "/assets/brain-5.png",
    isSlimy: true,
    isSmoking: true,
    tagline: "Necrotic decomposition & sulfur smoke",
    description: "Smoke curls continuously off the cerebral folds. Deep decay and hollow stare. Reality feels distant.",
    symptoms: ["Continuous smoke release", "Autopilot thumb mechanics", "Zero recollection of content"]
  },
  {
    stage: 6,
    name: "Brain rot",
    threshold: 250,
    glow: "rgba(255, 0, 85, 0.65)",
    sprite: "/assets/brain-6.png",
    isSlimy: true,
    isSmoking: true,
    tagline: "Total digital liquefaction",
    description: "Complete terminal rot. Electric spasms, bubbling toxic ooze, and permanent loop syndrome. It cannot get any worse.",
    symptoms: ["Terminal mush", "Electrical arcing", "Immunity to real world conversation", "Perpetual feed loop"]
  }
];

export interface Sitting {
  id: string;
  start: number;
  end: number;
  reels: number;
  durationMs: number;
}

export interface DayStats {
  count: number;
  scrollingMs: number;
  lastEventAt: number | null;
  sittings: Sitting[];
  hourly: number[];
  secondsPerReel: number | null;
}

export interface Friend {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
  count: number;
  scrollingMs: number;
  lastActiveMs: number;
  stage: number;
  streakDays: number;
}

export type TrackingState = 'On' | 'Off' | 'Stalled';

export interface ReelItem {
  id: string;
  creator: string;
  creatorHandle: string;
  avatar: string;
  caption: string;
  audioTrack: string;
  likes: string;
  comments: string;
  bgGradient: string;
  videoTopic: string;
  tags: string[];
}
