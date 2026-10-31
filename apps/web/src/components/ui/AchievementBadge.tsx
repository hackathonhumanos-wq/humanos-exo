/**
 * @file apps/web/src/components/ui/AchievementBadge.tsx
 * @description Reusable light-theme Achievement Badge card with rarity indicator and progress bar
 */
import React from 'react';
import { Lock, CheckCircle2 } from 'lucide-react';
import type { AchievementItem } from '../../../../../packages/shared-types/src/index.ts';
import { TrophyBadgeIllustration } from './BrandIllustrations.tsx';
import { ProgressBar } from './ProgressBar.tsx';

interface AchievementBadgeProps {
  achievement: AchievementItem;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const rarityStyles: Record<AchievementItem['rarity'], string> = {
    COMMON: 'bg-slate-100 text-slate-700 border-slate-200',
    RARE: 'bg-[#EBF3FF] text-[#2563EB] border-[#C8DFFF]',
    EPIC: 'bg-violet-50 text-violet-700 border-violet-200',
    LEGENDARY: 'bg-amber-50 text-amber-700 border-amber-200',
  };

  const illustrationKind =
    achievement.category === 'FOCUS'
      ? 'focus_master'
      : achievement.category === 'CONSISTENCY'
        ? 'study_champion'
        : 'productivity_star';

  const progressPct =
    achievement.progressCurrent !== undefined && achievement.progressTotal
      ? Math.round((achievement.progressCurrent / achievement.progressTotal) * 100)
      : achievement.isUnlocked
        ? 100
        : 0;

  return (
    <div
      className={`ff-card p-5 flex flex-col justify-between gap-4 transition-all ${
        achievement.isUnlocked ? 'border-[#CBEFE0]' : 'opacity-80 bg-[#FAFCFB]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="relative">
          <TrophyBadgeIllustration kind={illustrationKind} className="w-14 h-14" />
          {!achievement.isUnlocked && (
            <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white border border-[#E1EEE9] text-[#6C819C] flex items-center justify-center shadow-xs">
              <Lock className="w-3 h-3" />
            </span>
          )}
        </div>
        <span
          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
            rarityStyles[achievement.rarity]
          }`}
        >
          {achievement.rarity}
        </span>
      </div>

      <div>
        <div className="flex items-center gap-1.5">
          <h4 className="font-display text-sm font-bold text-[#142647]">{achievement.title}</h4>
          {achievement.isUnlocked && <CheckCircle2 className="w-4 h-4 text-[#079669] shrink-0" />}
        </div>
        <p className="text-xs text-[#5A708D] mt-1 leading-relaxed">{achievement.description}</p>
      </div>

      <div className="space-y-2 pt-1 border-t border-[#E1EEE9]">
        {achievement.progressTotal ? (
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-[#5A708D] mb-1 tabular-nums">
              <span>Progress</span>
              <span>
                {achievement.progressCurrent ?? 0} / {achievement.progressTotal}
              </span>
            </div>
            <ProgressBar
              value={progressPct}
              label={achievement.title}
              tone={achievement.isUnlocked ? 'emerald' : 'blue'}
              size="sm"
            />
          </div>
        ) : null}

        <div className="flex items-center justify-between text-xs">
          <span className="font-bold text-[#079669] tabular-nums">+{achievement.xpReward} XP</span>
          <span className="text-[11px] text-[#6C819C]">
            {achievement.isUnlocked ? 'Unlocked' : 'In progress'}
          </span>
        </div>
      </div>
    </div>
  );
};
