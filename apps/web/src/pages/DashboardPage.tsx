/**
 * @file apps/web/src/pages/DashboardPage.tsx
 * @description Main FOCUSFLOW Overview Dashboard matched to the light-theme reference specification with real API-driven state
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  ArrowRight,
  Clock,
  Monitor,
  PlaySquare,
  Target,
  TrendingUp,
  BarChart2,
  Lightbulb,
  Info,
  Flame,
  ArrowUpRight,
  PartyPopper,
  AlertCircle,
  PauseCircle,
} from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  DashboardOverviewData,
  ReelsAnalyticsSummary,
  AdaptiveDailySchedule,
  StreakInfo,
  AchievementItem,
} from '../../../../packages/shared-types/src/index.ts';
import {
  AICoachMascot,
  CurvedCountUnderline,
  TrophyBadgeIllustration,
} from '../components/ui/BrandIllustrations.tsx';
import { MetricCard } from '../components/ui/MetricCard.tsx';
import { WeeklyFocusAreaChart, PlatformDonutChart } from '../components/ui/AnalyticsCharts.tsx';
import { AICoachCard } from '../components/ui/AICoachCard.tsx';
import { StudyTaskList } from '../components/ui/StudyTaskList.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onStartFocusSession?: () => void;
  onDataMutated?: () => void;
}

function formatMinutesToHoursMins(totalMinutes: number): string {
  const hrs = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  if (hrs <= 0) return `${mins}m`;
  return `${hrs}h ${mins}m`;
}

function getTimeOfDayGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getBadgeIllustrationKind(
  badge: AchievementItem,
  idx: number
): 'focus_master' | 'study_champion' | 'productivity_star' {
  if (badge.category === 'FOCUS') return 'focus_master';
  if (badge.category === 'CONSISTENCY') return 'study_champion';
  if (badge.category === 'WELLBEING') return 'productivity_star';
  const order: Array<'focus_master' | 'study_champion' | 'productivity_star'> = [
    'focus_master',
    'study_champion',
    'productivity_star',
  ];
  return order[idx % order.length];
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onStartFocusSession,
  onDataMutated,
}) => {
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null);
  const [reels, setReels] = useState<ReelsAnalyticsSummary | null>(null);
  const [schedule, setSchedule] = useState<AdaptiveDailySchedule | null>(null);
  const [streak, setStreak] = useState<StreakInfo | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<AchievementItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDashboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [overviewRes, reelsRes, scheduleRes, gamificationRes, achievementsRes] =
        await Promise.all([
          apiClient.getOverview(),
          apiClient.getReelsAnalytics(),
          apiClient.getCurrentSchedule(),
          apiClient.getGamificationProfile(),
          apiClient.getAchievements(),
        ]);
      setOverview(overviewRes);
      setReels(reelsRes);
      setSchedule(scheduleRes);
      setStreak(gamificationRes.streakInfo);
      setUnlockedBadges(achievementsRes.achievements.filter((a) => a.isUnlocked).slice(0, 3));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load dashboard analytics.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleToggleSlot = async (slotId: string) => {
    try {
      const updated = await apiClient.toggleStudySlot(slotId);
      setSchedule(updated);
      onDataMutated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update study task.');
    }
  };

  const handleAddSlot = async (input: { subject: string; durationMinutes: number }) => {
    const updated = await apiClient.addStudySlot({
      subject: input.subject,
      topic: `${input.durationMinutes} min`,
      durationMinutes: input.durationMinutes,
      recommendedMode: 'POMODORO',
    });
    setSchedule(updated);
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading your focus dashboard"
        description="Syncing today's study plan, focus sessions, and privacy-safe digital wellbeing insights..."
      />
    );
  }

  if (error || !overview || !reels) {
    return (
      <EmptyState
        variant="error"
        title="Could not load dashboard overview"
        description={error || 'The FOCUSFLOW analytics service is temporarily unreachable.'}
        actionLabel="Retry Dashboard Sync"
        onAction={loadDashboard}
      />
    );
  }

  const focusChangeSign = overview.focusVsLastWeekPercent >= 0 ? '↑' : '↓';
  const screenChangeSign = overview.screenVsLastWeekPercent <= 0 ? '↓' : '↑';
  const reelsChangeSign = reels.vsLastWeekPercent <= 0 ? '↓' : '↑';
  const streakDays = streak?.currentStreak ?? 0;

  const dailyGoalStatusLabel =
    overview.dailyGoalPercent >= 100
      ? 'Goal achieved!'
      : overview.dailyGoalPercent >= 60
        ? 'On track!'
        : overview.dailyGoalPercent > 0
          ? 'In progress'
          : 'Start first session';

  const isTrackingPaused = reels.coverage.permissionStatus === 'PAUSED_BY_USER';

  return (
    <div className="space-y-6 pb-4">
      {/* Top Hero Row: Greeting + CTA on Left, AI Coach Quote Card on Right */}
      <section className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-center">
        <div className="xl:col-span-7 space-y-3">
          <p className="text-lg sm:text-xl font-semibold text-[#142447] flex items-center gap-2">
            <span>
              {getTimeOfDayGreeting()}, {overview.studentName}
            </span>
            <span aria-hidden="true">👋</span>
          </p>

          <h1 className="font-display text-3xl sm:text-[46px] font-extrabold text-[#142447] tracking-tight leading-[1.12]">
            Make today{' '}
            <span className="relative inline-block text-[#079669]">
              count
              <span className="block -mt-1">
                <CurvedCountUnderline />
              </span>
            </span>
          </h1>

          <p className="text-sm sm:text-[15.5px] text-[#52627D] max-w-xl">
            Focus better, learn more, and build healthy digital habits.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (onStartFocusSession) {
                  onStartFocusSession();
                } else {
                  onNavigate('focus');
                }
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#079669] hover:bg-[#087A54] text-white font-bold text-sm shadow-sm cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Start Focus Session</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {isTrackingPaused && (
              <button
                type="button"
                onClick={() => onNavigate('settings')}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold cursor-pointer"
              >
                <PauseCircle className="w-3.5 h-3.5" />
                <span>Activity Tracking Paused • Manage</span>
              </button>
            )}
          </div>
        </div>

        {/* Hero Right: AI Coach Quote Card */}
        <div className="xl:col-span-5">
          <div className="ff-card-mint p-5 sm:p-6 flex items-center justify-between gap-4 overflow-hidden relative">
            <div className="space-y-2.5 z-10 max-w-[260px]">
              <div className="w-9 h-9 rounded-xl bg-white/85 border border-[#CBEFE0] text-[#079669] flex items-center justify-center shadow-2xs">
                <Lightbulb className="w-4 h-4" />
              </div>
              <blockquote className="text-sm sm:text-[15px] italic font-medium text-[#142447] leading-relaxed">
                “{overview.coachHeroQuote || 'Small steps every day lead to big changes!'}”
              </blockquote>
              <div className="text-xs text-[#52627D] font-medium">
                – <strong className="font-bold text-[#142447]">FOCUSFLOW</strong> AI Coach
              </div>
            </div>

            <AICoachMascot variant="hero" className="z-10 -mr-2 -mb-3" />
          </div>
        </div>
      </section>

      {/* 4 Summary KPI Cards */}
      <section
        aria-label="Daily focus and digital wellbeing summary"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        <MetricCard
          title="Focus Time"
          value={formatMinutesToHoursMins(overview.focusMinutesToday)}
          subtitle="vs last week"
          icon={<Clock className="w-5 h-5" />}
          iconBgClass="bg-[#E9F9F2] text-[#079669]"
          trendText={`${focusChangeSign} ${Math.abs(overview.focusVsLastWeekPercent)}%`}
          trendTone={overview.focusVsLastWeekPercent >= 0 ? 'positive' : 'warning'}
          sparklineValues={overview.focusSparkline7d}
          sparklineType="bars"
          sparklineColor="#079669"
          onClick={() => onNavigate('focus')}
        />

        <MetricCard
          title="Screen Time"
          value={formatMinutesToHoursMins(overview.screenMinutesToday)}
          subtitle="vs last week"
          icon={<Monitor className="w-5 h-5" />}
          iconBgClass="bg-[#EBF3FF] text-[#2878F0]"
          trendText={`${screenChangeSign} ${Math.abs(overview.screenVsLastWeekPercent)}%`}
          trendTone="info"
          sparklineValues={overview.screenSparkline7d}
          sparklineType="bars"
          sparklineColor="#2878F0"
          onClick={() => onNavigate('analytics')}
        />

        <MetricCard
          title="Reels & Shorts"
          value={String(reels.todayTotalEstimatedInteractions)}
          subtitle="Estimated interactions"
          infoTooltip="Estimated short-form scroll and URL transitions detected locally. Never labeled or collected as exact private video views."
          icon={<PlaySquare className="w-5 h-5" />}
          iconBgClass="bg-[#F3EEFF] text-[#8152E8]"
          trendText={`${reelsChangeSign} ${Math.abs(reels.vsLastWeekPercent)}%`}
          trendTone={reels.vsLastWeekPercent <= 0 ? 'warning' : 'info'}
          sparklineValues={reels.sparkline7d}
          sparklineType="line"
          sparklineColor="#8152E8"
          onClick={() => onNavigate('reels')}
        />

        <MetricCard
          title="Daily Goal"
          value={`${overview.dailyGoalPercent}%`}
          subtitle={dailyGoalStatusLabel}
          icon={<Target className="w-5 h-5" />}
          iconBgClass="bg-[#E9F9F2] text-[#079669]"
          progressPercent={overview.dailyGoalPercent}
          onClick={() => onNavigate('goals')}
        />
      </section>

      {/* Middle Analytics Row: Weekly Focus Overview (7 cols) + Reels & Shorts Insights (5 cols) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Weekly Focus Overview */}
        <div className="lg:col-span-7 ff-card p-5 sm:p-6 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-[#142447]">
                Your Weekly Focus Overview
              </h2>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-[#52627D]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#079669]" />
                Focus Time
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2878F0]" />
                Screen Time
              </span>
            </div>
          </div>

          <WeeklyFocusAreaChart data={overview.weeklyOverview} />
        </div>

        {/* Reels & Shorts Insights */}
        <div className="lg:col-span-5 ff-card p-5 sm:p-6 flex flex-col justify-between gap-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
                <BarChart2 className="w-4 h-4" />
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-[#142447]">
                Reels &amp; Shorts Insights
              </h2>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('reels')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#079669] hover:text-[#087A54] cursor-pointer"
            >
              <span>View Details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
            <div>
              <div className="text-xs font-semibold text-[#52627D]">Estimated interactions</div>
              <div className="mt-1 flex items-center gap-2.5">
                <span className="font-display text-4xl font-extrabold text-[#142447] tabular-nums">
                  {reels.todayTotalEstimatedInteractions}
                </span>
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold tabular-nums ${
                    reels.vsLastWeekPercent <= 0
                      ? 'bg-[#DDF7EC] text-[#079669]'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {reelsChangeSign} {Math.abs(reels.vsLastWeekPercent)}%
                </span>
              </div>
              <div className="text-xs font-medium text-[#8290A5] mt-1">vs last week</div>
            </div>

            <div className="flex items-center gap-4">
              <PlatformDonutChart platforms={reels.platformBreakdown} size={108} />
              <ul className="space-y-2 text-xs">
                {reels.platformBreakdown.map((p) => (
                  <li
                    key={p.platform}
                    className="flex items-center justify-between gap-3 min-w-[118px]"
                  >
                    <span className="inline-flex items-center gap-2 font-medium text-[#52627D]">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      {p.shortLabel}
                    </span>
                    <span className="font-bold text-[#142447] tabular-nums">{p.sharePercent}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Dynamic Insight Banner Derived Strictly from Real State */}
          {isTrackingPaused ? (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center shrink-0">
                  <PauseCircle className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-[#142447] leading-snug">
                  Short-form activity estimation is currently{' '}
                  <strong className="font-bold">paused</strong> in your privacy settings.
                </p>
              </div>
            </div>
          ) : reels.vsLastWeekPercent < 0 ? (
            <div className="p-3.5 rounded-2xl bg-[#EAF9F2] border border-[#CBEFE0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#079669] text-white flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-[#142447] leading-snug">
                  You&apos;re watching{' '}
                  <strong className="font-bold">
                    {Math.abs(reels.vsLastWeekPercent)}% less short videos
                  </strong>{' '}
                  this week! Great job on staying focused!
                </p>
              </div>
              <PartyPopper className="w-5 h-5 text-amber-500 shrink-0" aria-hidden="true" />
            </div>
          ) : reels.vsLastWeekPercent === 0 ? (
            <div className="p-3.5 rounded-2xl bg-[#F1FAF6] border border-[#DFEBF0] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#079669] text-white flex items-center justify-center shrink-0">
                  <Info className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-[#142447] leading-snug">
                  Your estimated short-form activity is{' '}
                  <strong className="font-bold">steady vs last week</strong>. Keep balancing breaks!
                </p>
              </div>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-[#F28A35] text-white flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-[#142447] leading-snug">
                  Estimated short-form swipes are{' '}
                  <strong className="font-bold">up {reels.vsLastWeekPercent}%</strong> vs last week.
                  Try turning on Short-Form Shield during study blocks.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Bottom Row: AI Coach Recommendation + Daily Study Plan + Streak & Achievements */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-4">
          <AICoachCard
            headline={
              overview.coachRecommendation?.headline ||
              'Ready for a focused 25-minute study sprint?'
            }
            description={
              overview.coachRecommendation?.detail ||
              'Pick one priority subject from your daily plan and take a 5-minute break afterward.'
            }
            ctaLabel="View Detailed Plan"
            onCtaClick={() => onNavigate('ai-coach')}
          />
        </div>

        <div className="lg:col-span-4">
          <StudyTaskList
            slots={schedule?.scheduledSlots ?? []}
            onToggleSlot={handleToggleSlot}
            onAddSlot={handleAddSlot}
            onUpdatePlanClick={() => onNavigate('study-planner')}
            compact
          />
        </div>

        <div className="lg:col-span-4 ff-card p-5 sm:p-6 flex flex-col justify-between h-full">
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#F28A35] fill-[#F28A35]" />
              <h3 className="font-display text-[15px] font-bold text-[#142447]">
                Your Streak &amp; Achievements
              </h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('achievements')}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#079669] hover:text-[#087A54] cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-3 py-2">
            {/* Streak Block */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrophyBadgeIllustration kind="streak_flame" className="w-12 h-12" />
                <div>
                  <div className="font-display text-3xl font-extrabold text-[#142447] tabular-nums leading-none">
                    {streakDays}
                  </div>
                  <div className="text-xs font-semibold text-[#52627D] mt-0.5">Day Streak</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('streaks')}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-[11px] font-bold cursor-pointer"
              >
                <span>{streakDays > 0 ? 'Keep it up!' : 'Start streak'}</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>

            {/* Real Unlocked Achievement Emblems from API */}
            {unlockedBadges.length > 0 ? (
              <div className="grid grid-cols-3 gap-2 text-center">
                {unlockedBadges.map((badge, idx) => (
                  <button
                    key={badge.id}
                    type="button"
                    title={`${badge.title} — ${badge.description}`}
                    aria-label={`${badge.title}: ${badge.description}`}
                    onClick={() => onNavigate('achievements')}
                    className="flex flex-col items-center gap-1 p-1.5 rounded-2xl hover:bg-[#F1FAF6] cursor-pointer"
                  >
                    <TrophyBadgeIllustration
                      kind={getBadgeIllustrationKind(badge, idx)}
                      className="w-12 h-12"
                    />
                    <span className="text-[10.5px] font-bold text-[#142447] leading-tight line-clamp-2">
                      {badge.title}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex-1 text-center p-3 rounded-2xl bg-[#F8FCFA] border border-[#DFEBF0]">
                <p className="text-xs text-[#52627D]">
                  Complete your first focus session to unlock achievement badges!
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
