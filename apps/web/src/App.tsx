import React, { useState } from 'react';
import {
  LayoutDashboard,
  Clock,
  BarChart3,
  Flame,
  Sparkles,
  Target,
  Users,
  User,
  Settings,
  Home,
  Menu,
  X,
  Trophy,
  Award,
  Medal,
  UserCheck,
  Zap,
  BookOpen,
  HeartHandshake,
  CreditCard,
  Bot,
  GraduationCap,
  MessageSquarePlus,
} from 'lucide-react';

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
import { NotificationCenter } from './components/notifications/NotificationCenter.tsx';
import { StudyPlannerPage } from './pages/StudyPlannerPage.tsx';
import { WellbeingInsightsPage } from './pages/WellbeingInsightsPage.tsx';
import { SubscriptionPage } from './pages/SubscriptionPage.tsx';
import { AIAgentCenterPage } from './pages/AIAgentCenterPage.tsx';
import { AutomationsPage } from './pages/AutomationsPage.tsx';
import { InstitutionalPortalPage } from './pages/InstitutionalPortalPage.tsx';
import { FeedbackModal } from './components/feedback/FeedbackModal.tsx';

type NavPage =
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

export default function WebApp() {
  const [currentPage, setCurrentPage] = useState<NavPage>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  const navItems: { id: NavPage; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'focus', label: 'Focus Timer', icon: Clock },
    { id: 'reels', label: 'Reel Guard', icon: Flame },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai-coach', label: 'AI Coach', icon: Sparkles },
    { id: 'goals', label: 'Daily Goals', icon: Target },
    { id: 'study-planner', label: 'Adaptive Study Plan', icon: BookOpen, badge: 'Phase 9' },
    { id: 'wellbeing-insights', label: 'Wellbeing Intelligence', icon: HeartHandshake, badge: 'Phase 9' },
    { id: 'subscriptions', label: 'Student Pricing & SaaS', icon: CreditCard, badge: 'Phase 9' },
    { id: 'ai-agents', label: 'AI Agent Swarm', icon: Bot, badge: 'Phase 10' },
    { id: 'automations', label: 'Smart Automations', icon: Zap, badge: 'Phase 10' },
    { id: 'institutional', label: 'Counsellor Portal', icon: GraduationCap, badge: 'Phase 10' },
    { id: 'gamification', label: 'XP & Progression', icon: Trophy, badge: 'Phase 6' },
    { id: 'achievements', label: 'Badges Gallery', icon: Award },
    { id: 'streaks', label: 'Streak Calendar', icon: Flame },
    { id: 'challenges', label: 'Focus Challenges', icon: Target },
    { id: 'groups', label: 'Study Groups', icon: Users },
    { id: 'friends', label: 'Friends Circle', icon: UserCheck },
    { id: 'leaderboards', label: 'Leaderboard', icon: Medal },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];


  const handleNavigate = (page: string) => {
    setCurrentPage(page as NavPage);
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0c0a10] text-[#f5f1e8] flex flex-col font-sans selection:bg-[#b8ff3c] selection:text-[#07060a]">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0c0a10]/90 backdrop-blur-md border-b border-[#2c2537] px-4 sm:px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div
              onClick={() => setCurrentPage('landing')}
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#b8ff3c] to-[#49e6ff] p-[1.5px]">
                <div className="w-full h-full bg-[#0c0a10] rounded-[10px] flex items-center justify-center font-extrabold text-[#b8ff3c] text-xs font-mono">
                  FF
                </div>
              </div>
              <span className="font-extrabold text-lg tracking-tight text-white">FOCUSFLOW</span>
              <span className="text-[10px] font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2 py-0.5 rounded-full hidden sm:inline border border-[#b8ff3c]/20">
                AI Focus & Study Platform
              </span>

            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick XP & Level Pill */}
            <button
              onClick={() => setCurrentPage('gamification')}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#17131f] border border-[#2c2537] hover:border-[#b8ff3c]/40 transition-all cursor-pointer font-mono text-xs"
              title="View XP & Progression"
            >
              <Trophy className="w-3.5 h-3.5 text-[#b8ff3c]" />
              <span className="text-white font-bold">Lvl 4</span>
              <span className="text-zinc-500">•</span>
              <span className="text-[#b8ff3c] font-bold">840 XP</span>
            </button>

            {/* Quick Streak Pill */}
            <button
              onClick={() => setCurrentPage('streaks')}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#17131f] border border-[#2c2537] hover:border-amber-400/40 transition-all cursor-pointer font-mono text-xs"
              title="View Streak Calendar"
            >
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="text-amber-400 font-bold">5 Days</span>
            </button>

            {/* Notification Center */}
            <NotificationCenter />

            {/* Student Feedback Button */}
            <button
              onClick={() => setFeedbackModalOpen(true)}
              className="text-xs font-mono px-3 py-1.5 rounded-xl bg-[#17131f] hover:bg-[#241a31] border border-[#2c2537] text-zinc-300 hover:text-[#b8ff3c] transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Share Feedback or Report an Issue"
            >
              <MessageSquarePlus className="w-3.5 h-3.5 text-[#b8ff3c]" />
              <span className="hidden sm:inline">Feedback</span>
            </button>

            {currentPage !== 'login' && currentPage !== 'register' && (
              <button
                onClick={() => setCurrentPage('login')}
                className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-[#b8ff3c] hover:bg-[#a6eb2f] text-[#07060a] transition-all cursor-pointer"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </header>

      {/* App Body with Sidebar */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        {/* Desktop Sidebar */}
        <aside className="w-56 border-r border-[#2c2537] p-4 hidden lg:block shrink-0 space-y-1">
          <div className="text-[11px] font-mono text-zinc-500 uppercase px-3 py-2">Navigation</div>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all cursor-pointer text-left ${
                  isActive
                    ? 'bg-[#17131f] text-[#b8ff3c] font-semibold border border-white/5 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#b8ff3c]' : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-md bg-[#b8ff3c]/10 text-[#b8ff3c] border border-[#b8ff3c]/20">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/80 lg:hidden p-4 pt-16 flex flex-col">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-4 right-4 p-2 text-zinc-400"
            >
              <X className="w-6 h-6" />
            </button>
            <div className="space-y-1 bg-[#17131f] border border-[#2c2537] rounded-2xl p-4">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium ${
                      isActive ? 'bg-[#b8ff3c] text-black font-bold' : 'text-zinc-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Main View Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
          {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
          {currentPage === 'login' && <LoginPage onNavigate={handleNavigate} />}
          {currentPage === 'register' && <RegisterPage onNavigate={handleNavigate} />}
          {currentPage === 'dashboard' && <DashboardPage onNavigate={handleNavigate} />}
          {currentPage === 'focus' && <FocusPage />}
          {currentPage === 'analytics' && <AnalyticsPage />}
          {currentPage === 'reels' && <ReelsPage />}
          {currentPage === 'ai-coach' && <AICoachPage />}
          {currentPage === 'goals' && <GoalsPage />}
          {currentPage === 'study-planner' && <StudyPlannerPage />}
          {currentPage === 'wellbeing-insights' && <WellbeingInsightsPage />}
          {currentPage === 'subscriptions' && <SubscriptionPage />}
          {currentPage === 'ai-agents' && <AIAgentCenterPage />}
          {currentPage === 'automations' && <AutomationsPage />}
          {currentPage === 'institutional' && <InstitutionalPortalPage />}
          {currentPage === 'gamification' && <GamificationPage />}
          {currentPage === 'achievements' && <AchievementsPage />}
          {currentPage === 'streaks' && <StreakCalendarPage />}
          {currentPage === 'challenges' && <ChallengesPage />}
          {currentPage === 'groups' && <GroupsPage />}
          {currentPage === 'friends' && <FriendsPage />}
          {currentPage === 'leaderboards' && <LeaderboardPage />}
          {currentPage === 'profile' && <ProfilePage />}
          {currentPage === 'settings' && <SettingsPage />}
        </main>
      </div>

      {/* Global In-App Student Feedback Modal */}
      <FeedbackModal isOpen={feedbackModalOpen} onClose={() => setFeedbackModalOpen(false)} />


      {/* Footer */}
      <footer className="border-t border-[#2c2537] bg-[#0c0a10] py-4 px-6 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>FOCUSFLOW — AI Productivity & Focus Coach</span>
          <span className="font-mono text-[11px] text-zinc-400">
            Student Digital Wellbeing Platform • Privacy-First Architecture
          </span>
        </div>
      </footer>
    </div>
  );
}


