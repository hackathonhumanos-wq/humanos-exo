/**
 * @file apps/web/src/pages/LandingPage.tsx
 * @description Light-theme Platform Overview / Tour page inside FOCUSFLOW
 */
import React from 'react';
import { ArrowRight, ShieldCheck, Timer, PlaySquare, Sparkles } from 'lucide-react';
import { AICoachMascot, CurvedCountUnderline } from '../components/ui/BrandIllustrations.tsx';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-8 pb-8">
      <section className="ff-card-mint p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/85 border border-[#CBEFE0] text-[#079669] text-xs font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Built for Students • Privacy-First Digital Wellbeing</span>
          </div>
          <h1 className="font-display text-3xl sm:text-5xl font-extrabold text-[#142647] leading-tight">
            Reclaim your study hours and make every day{' '}
            <span className="relative inline-block text-[#079669]">
              count
              <span className="block -mt-1">
                <CurvedCountUnderline />
              </span>
            </span>
          </h1>
          <p className="text-sm sm:text-base text-[#334B68] max-w-xl leading-relaxed">
            FOCUSFLOW combines structured focus timers, adaptive study planning, and ethical short-form scroll estimation so you stay energized without surveillance.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="px-6 py-3.5 rounded-full bg-[#079669] hover:bg-[#057A55] text-white text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <span>Open My Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('reels')}
              className="px-5 py-3.5 rounded-full bg-white hover:bg-[#F7FCFA] border border-[#CBEFE0] text-[#142647] text-sm font-bold cursor-pointer"
            >
              Explore Reels &amp; Shorts Analytics
            </button>
          </div>
        </div>

        <div className="lg:col-span-5 flex justify-center">
          <AICoachMascot variant="hero" className="w-48 sm:w-56" />
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="ff-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
            <PlaySquare className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#142647]">
            Ethical Reels &amp; Shorts Estimation
          </h2>
          <p className="text-xs text-[#5A708D] leading-relaxed">
            Estimates scroll transitions across Instagram Reels, YouTube Shorts, and Facebook Reels without recording private URLs, messages, or screenshots.
          </p>
        </div>

        <div className="ff-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-[#EBF3FF] text-[#438CF5] flex items-center justify-center">
            <Timer className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#142647]">
            Structured Focus Sessions
          </h2>
          <p className="text-xs text-[#5A708D] leading-relaxed">
            Switch seamlessly between 25m Pomodoro, 50m Deep Study, and 90m Exam Mock blocks while earning XP toward scholar milestones.
          </p>
        </div>

        <div className="ff-card p-6 space-y-2.5">
          <div className="w-10 h-10 rounded-xl bg-violet-50 text-[#7C5CFC] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="font-display text-lg font-bold text-[#142647]">
            Adaptive Study Planner
          </h2>
          <p className="text-xs text-[#5A708D] leading-relaxed">
            Align Mathematics, Physics, Chemistry, and revision blocks with your peak cognitive energy hours.
          </p>
        </div>
      </section>
    </div>
  );
};
