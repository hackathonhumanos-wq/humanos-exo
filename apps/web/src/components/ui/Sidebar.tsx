/**
 * @file apps/web/src/components/ui/Sidebar.tsx
 * @description Responsive FOCUSFLOW Left Sidebar (~270px desktop) matching the light-theme reference design with real XP & Level data
 */
import React, { useState } from 'react';
import {
  Home,
  Clock,
  PlaySquare,
  Timer,
  Calendar,
  Sparkles,
  Trophy,
  Users,
  Medal,
  Award,
  Settings,
  Star,
  ChevronDown,
  ChevronUp,
  Target,
  Flame,
  HeartHandshake,
  Bot,
  Zap,
  GraduationCap,
  CreditCard,
  User,
  X,
} from 'lucide-react';
import type { LevelProgress } from '../../../../../packages/shared-types/src/index.ts';
import { FocusFlowLogo } from './BrandIllustrations.tsx';
import { ProgressBar } from './ProgressBar.tsx';

export type NavPageId =
  | 'landing'
  | 'login'
  | 'register'
  | 'dashboard'
  | 'focus'
  | 'analytics'
  | 'reels'
  | 'ai-coach'
  | 'goals'
  | 'study-planner'
  | 'wellbeing-insights'
  | 'subscriptions'
  | 'ai-agents'
  | 'automations'
  | 'institutional'
  | 'gamification'
  | 'achievements'
  | 'streaks'
  | 'challenges'
  | 'groups'
  | 'friends'
  | 'leaderboards'
  | 'profile'
  | 'settings';

export interface NavItemConfig {
  id: NavPageId;
  label: string;
  icon: React.FC<{ className?: string }>;
  keywords?: string;
}

export const PRIMARY_NAV_ITEMS: NavItemConfig[] = [
  { id: 'dashboard', label: 'Overview', icon: Home, keywords: 'home dashboard summary' },
  { id: 'analytics', label: 'Screen Time', icon: Clock, keywords: 'screen time weekly hours usage' },
  { id: 'reels', label: 'Reels & Shorts', icon: PlaySquare, keywords: 'instagram youtube facebook short video limits' },
  { id: 'focus', label: 'Focus Sessions', icon: Timer, keywords: 'pomodoro timer deep work study' },
  { id: 'study-planner', label: 'Study Planner', icon: Calendar, keywords: 'schedule subjects tasks exam' },
  { id: 'ai-coach', label: 'AI Coach', icon: Sparkles, keywords: 'recommendations coach advice' },
  { id: 'challenges', label: 'Challenges', icon: Trophy, keywords: 'daily weekly quests xp' },
  { id: 'friends', label: 'Friends', icon: Users, keywords: 'peers accountability circle' },
  { id: 'leaderboards', label: 'Leaderboards', icon: Medal, keywords: 'ranking global friends' },
  { id: 'achievements', label: 'Achievements', icon: Award, keywords: 'badges trophies milestones' },
  { id: 'settings', label: 'Settings', icon: Settings, keywords: 'privacy consent pause tracking limits' },
];

export const SECONDARY_NAV_ITEMS: NavItemConfig[] = [
  { id: 'goals', label: 'Daily Goals', icon: Target, keywords: 'targets caps habits' },
  { id: 'streaks', label: 'Streak Calendar', icon: Flame, keywords: 'streak consistency calendar' },
  { id: 'groups', label: 'Study Groups', icon: Users, keywords: 'collaborative rooms' },
  { id: 'gamification', label: 'XP & Levels', icon: Star, keywords: 'level progression ledger' },
  { id: 'wellbeing-insights', label: 'Wellbeing Score', icon: HeartHandshake, keywords: 'sleep doomscroll risk' },
  { id: 'automations', label: 'Smart Automations', icon: Zap, keywords: 'triggers rules blocker' },
  { id: 'ai-agents', label: 'AI Agent Hub', icon: Bot, keywords: 'multi-agent synthesis' },
  { id: 'institutional', label: 'Counsellor View', icon: GraduationCap, keywords: 'cohort campus analytics' },
  { id: 'subscriptions', label: 'Student Plans', icon: CreditCard, keywords: 'pricing plus campus' },
  { id: 'profile', label: 'My Profile', icon: User, keywords: 'account student profile' },
];

interface SidebarProps {
  currentPage: NavPageId;
  onNavigate: (page: NavPageId) => void;
  levelProgress: LevelProgress | null;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  levelProgress,
  mobileOpen,
  onCloseMobile,
}) => {
  const isSecondaryActive = SECONDARY_NAV_ITEMS.some((item) => item.id === currentPage);
  const [moreExpanded, setMoreExpanded] = useState(isSecondaryActive);

  const actualLevelNumber = levelProgress?.currentLevel.levelNumber ?? null;
  const totalXp = levelProgress?.totalXp ?? 0;
  const nextMilestoneXp = levelProgress
    ? levelProgress.nextLevel?.minXp ?? levelProgress.currentLevel.maxXp
    : 0;
  const xpPercent = levelProgress
    ? levelProgress.progressPercent
    : 0;

  const renderSidebarBody = () => (
    <div className="flex flex-col justify-between h-full py-5 px-4 bg-white/95 border-r border-[#DFEBF0] select-none">
      <div className="space-y-5 overflow-y-auto pr-0.5">
        {/* Brand Header */}
        <div className="flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => {
              onNavigate('dashboard');
              onCloseMobile();
            }}
            className="text-left cursor-pointer focus:outline-none rounded-xl"
            aria-label="Go to FOCUSFLOW Overview"
          >
            <FocusFlowLogo showTagline />
          </button>
          {mobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              aria-label="Close navigation menu"
              className="lg:hidden p-2 rounded-xl text-[#52627D] hover:text-[#142447] hover:bg-[#F1FAF6]"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Primary Navigation */}
        <nav aria-label="Main navigation" className="space-y-1">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  onCloseMobile();
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`relative w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-[14px] transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#DDF7EC] text-[#079669] font-bold shadow-2xs'
                    : 'text-[#142447] font-medium hover:bg-[#F1FAF6] hover:text-[#079669]'
                }`}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-2.5 bottom-2.5 w-1 rounded-r-full bg-[#079669]"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className={`w-[19px] h-[19px] shrink-0 ${
                    isActive ? 'text-[#079669]' : 'text-[#142447]'
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}

          {/* Expandable Secondary Tools */}
          <div className="pt-2 mt-2 border-t border-[#EBF4F0]">
            <button
              type="button"
              onClick={() => setMoreExpanded((prev) => !prev)}
              aria-expanded={moreExpanded || isSecondaryActive}
              className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-[#52627D] hover:text-[#142447] hover:bg-[#F8FCFA] cursor-pointer"
            >
              <span>More Tools &amp; Portals</span>
              {moreExpanded || isSecondaryActive ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>

            {(moreExpanded || isSecondaryActive) && (
              <div className="mt-1 space-y-0.5">
                {SECONDARY_NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentPage === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      aria-current={isActive ? 'page' : undefined}
                      className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all cursor-pointer text-left ${
                        isActive
                          ? 'bg-[#DDF7EC] text-[#079669] font-bold'
                          : 'text-[#52627D] font-medium hover:bg-[#F1FAF6] hover:text-[#079669]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </nav>
      </div>

      {/* Bottom XP & Level Progress Card (Live Gamification State — Never Hardcoded) */}
      <button
        type="button"
        onClick={() => {
          onNavigate('gamification');
          onCloseMobile();
        }}
        className="mt-4 w-full text-left p-4 rounded-2xl bg-gradient-to-br from-[#ECFBF4] to-[#DCF6EB] border border-[#CBEFE0] hover:border-[#9CE0C6] transition-all cursor-pointer shadow-2xs"
      >
        <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center mb-2.5">
          <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
        </div>
        {actualLevelNumber !== null ? (
          <>
            <div className="font-display text-lg font-extrabold text-[#079669] leading-tight">
              Level {actualLevelNumber}
            </div>
            <div className="text-xs font-semibold text-[#52627D] tabular-nums mt-0.5 mb-2.5">
              {totalXp.toLocaleString()} / {nextMilestoneXp.toLocaleString()} XP
            </div>
            <ProgressBar
              value={xpPercent}
              label={`Level ${actualLevelNumber} XP progress`}
              tone="emerald"
              size="md"
            />
          </>
        ) : (
          <>
            <div className="font-display text-base font-extrabold text-[#079669] leading-tight">
              Syncing XP...
            </div>
            <div className="text-xs font-medium text-[#52627D] mt-0.5 mb-2.5">
              Loading scholar rank
            </div>
            <ProgressBar value={0} label="Loading XP progress" tone="emerald" size="md" />
          </>
        )}
      </button>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar (~270px width matching --sidebar-width) */}
      <aside className="hidden lg:block w-[270px] shrink-0 sticky top-0 h-screen z-30">
        {renderSidebarBody()}
      </aside>

      {/* Mobile & Tablet Accessible Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-[#142447]/35 backdrop-blur-xs"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-[270px] max-w-[85vw] h-full z-10 shadow-2xl">
            {renderSidebarBody()}
          </div>
        </div>
      )}
    </>
  );
};
