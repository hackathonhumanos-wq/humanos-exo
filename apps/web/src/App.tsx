/**
 * @file apps/web/src/App.tsx
 * @description FOCUSFLOW Light-Theme Responsive Application Shell
 */
import React, { useState, useEffect, useCallback } from 'react';
import { apiClient } from './services/apiClient.ts';
import type { LevelProgress } from '../../../packages/shared-types/src/index.ts';

import { Sidebar, type NavPageId } from './components/ui/Sidebar.tsx';
import { Header } from './components/ui/Header.tsx';
import { FeedbackModal } from './components/feedback/FeedbackModal.tsx';

import { LandingPage } from './pages/LandingPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { DashboardPage } from './pages/DashboardPage.tsx';
import { FocusPage } from './pages/FocusPage.tsx';
import { AnalyticsPage } from './pages/AnalyticsPage.tsx';
import { ReelsPage } from './pages/ReelsPage.tsx';
import { AICoachPage } from './pages/AICoachPage.tsx';
import { GoalsPage } from './pages/GoalsPage.tsx';
import { GroupsPage } from './pages/GroupsPage.tsx';
import { ProfilePage } from './pages/ProfilePage.tsx';
import { SettingsPage } from './pages/SettingsPage.tsx';
import { GamificationPage } from './pages/GamificationPage.tsx';
import { AchievementsPage } from './pages/AchievementsPage.tsx';
import { StreakCalendarPage } from './pages/StreakCalendarPage.tsx';
import { ChallengesPage } from './pages/ChallengesPage.tsx';
import { FriendsPage } from './pages/FriendsPage.tsx';
import { LeaderboardPage } from './pages/LeaderboardPage.tsx';
import { StudyPlannerPage } from './pages/StudyPlannerPage.tsx';
import { WellbeingInsightsPage } from './pages/WellbeingInsightsPage.tsx';
import { SubscriptionPage } from './pages/SubscriptionPage.tsx';
import { AIAgentCenterPage } from './pages/AIAgentCenterPage.tsx';
import { AutomationsPage } from './pages/AutomationsPage.tsx';
import { InstitutionalPortalPage } from './pages/InstitutionalPortalPage.tsx';

export default function WebApp() {
  const [currentPage, setCurrentPage] = useState<NavPageId>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [autoStartFocus, setAutoStartFocus] = useState(false);

  const [studentName, setStudentName] = useState('Adarsh');
  const [levelProgress, setLevelProgress] = useState<LevelProgress | null>(null);
  const [trackingPaused, setTrackingPaused] = useState(false);

  const refreshShellState = useCallback(async () => {
    const [overviewRes, gamificationRes, privacyRes] = await Promise.allSettled([
      apiClient.getOverview(),
      apiClient.getGamificationProfile(),
      apiClient.getPrivacyConsent(),
    ]);
    if (overviewRes.status === 'fulfilled') {
      setStudentName(overviewRes.value.studentName || 'Adarsh');
    }
    if (gamificationRes.status === 'fulfilled') {
      setLevelProgress(gamificationRes.value.levelProgress);
    }
    if (privacyRes.status === 'fulfilled') {
      setTrackingPaused(privacyRes.value.trackingPaused);
    }
  }, []);

  useEffect(() => {
    refreshShellState();
  }, [refreshShellState]);

  const handleToggleTrackingPause = async () => {
    const nextPaused = !trackingPaused;
    setTrackingPaused(nextPaused);
    try {
      const currentConsent = await apiClient.getPrivacyConsent();
      await Promise.all([
        apiClient.updatePrivacyConsent({
          ...currentConsent,
          trackingPaused: nextPaused,
        }),
        apiClient.updateReelsSettings({
          trackingPaused: nextPaused,
        }),
      ]);
      await refreshShellState();
    } catch {
      setTrackingPaused(!nextPaused);
    }
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as NavPageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFocusSession = () => {
    setAutoStartFocus(true);
    setCurrentPage('focus');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    try {
      window.localStorage.removeItem('focusflow_session');
    } catch {
      // Ignore storage access restrictions in sandboxed frames
    }
    setCurrentPage('login');
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAuthStandalone = currentPage === 'login' || currentPage === 'register';

  return (
    <div className="min-h-screen bg-[#F8FCFA] text-[#142447] relative flex overflow-x-clip">
      {/* Lightweight SVG organic pale-mint decorative waves matching reference image */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden z-0"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1536 1024"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <path
            d="M845 -40C915 110 1125 140 1320 95C1435 68 1510 15 1580 -20V380C1440 420 1245 360 1110 250C985 148 805 60 845 -40Z"
            fill="#E4F7EE"
            fillOpacity="0.65"
          />
          <path
            d="M780 390C930 245 1210 260 1420 340C1510 375 1560 430 1590 480V920C1410 960 1120 905 940 760C760 615 655 510 780 390Z"
            fill="#E7F8F0"
            fillOpacity="0.55"
          />
          <path
            d="M-60 880C85 835 235 885 360 955C460 1010 580 1035 690 1045H-60V880Z"
            fill="#E2F6EC"
            fillOpacity="0.7"
          />
        </svg>
      </div>

      {/* Left Sidebar (hidden on standalone login/register screens) */}
      {!isAuthStandalone && (
        <Sidebar
          currentPage={currentPage}
          onNavigate={(page) => handleNavigate(page)}
          levelProgress={levelProgress}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Column */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        {!isAuthStandalone && (
          <Header
            studentName={studentName}
            trackingPaused={trackingPaused}
            onToggleTrackingPause={handleToggleTrackingPause}
            onNavigate={(page) => handleNavigate(page)}
            onStartFocusSession={handleStartFocusSession}
            onLogout={handleLogout}
            onOpenMobileMenu={() => setMobileMenuOpen(true)}
            onOpenFeedback={() => setFeedbackModalOpen(true)}
          />
        )}

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
          {currentPage === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onStartFocusSession={handleStartFocusSession}
              onDataMutated={refreshShellState}
            />
          )}
          {currentPage === 'focus' && (
            <FocusPage
              onSessionLogged={refreshShellState}
              autoStart={autoStartFocus}
              onAutoStartConsumed={() => setAutoStartFocus(false)}
            />
          )}
          {currentPage === 'analytics' && <AnalyticsPage onNavigate={handleNavigate} />}
          {currentPage === 'reels' && <ReelsPage onSettingsChanged={refreshShellState} />}
          {currentPage === 'ai-coach' && <AICoachPage onNavigate={handleNavigate} />}
          {currentPage === 'goals' && <GoalsPage onGoalsChanged={refreshShellState} />}
          {currentPage === 'study-planner' && <StudyPlannerPage />}
          {currentPage === 'wellbeing-insights' && <WellbeingInsightsPage onNavigate={handleNavigate} />}
          {currentPage === 'subscriptions' && <SubscriptionPage />}
          {currentPage === 'ai-agents' && <AIAgentCenterPage />}
          {currentPage === 'automations' && <AutomationsPage />}
          {currentPage === 'institutional' && <InstitutionalPortalPage />}
          {currentPage === 'gamification' && <GamificationPage onXpUpdated={refreshShellState} />}
          {currentPage === 'achievements' && <AchievementsPage />}
          {currentPage === 'streaks' && <StreakCalendarPage />}
          {currentPage === 'challenges' && <ChallengesPage onChallengeClaimed={refreshShellState} />}
          {currentPage === 'groups' && <GroupsPage />}
          {currentPage === 'friends' && <FriendsPage />}
          {currentPage === 'leaderboards' && <LeaderboardPage />}
          {currentPage === 'profile' && <ProfilePage onNavigate={handleNavigate} />}
          {currentPage === 'settings' && <SettingsPage onSettingsUpdated={refreshShellState} />}
        </main>

        {!isAuthStandalone && (
          <footer className="border-t border-[#DFEBF0] bg-white/70 py-4 px-6 text-xs text-[#52627D]">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
              <span className="font-semibold text-[#142447]">
                FOCUSFLOW — Student Digital Wellbeing &amp; Study Focus Platform
              </span>
              <span>
                Privacy-First • Ethical Short-Form Estimation • Student Opt-In Controls
              </span>
            </div>
          </footer>
        )}
      </div>

      <FeedbackModal
        isOpen={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
      />
    </div>
  );
}
