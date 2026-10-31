/**
 * @file apps/web/src/components/ui/AICoachCard.tsx
 * @description Reusable AI Coach recommendation card with friendly mascot and primary CTA
 */
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { AICoachMascot } from './BrandIllustrations.tsx';

interface AICoachCardProps {
  title?: string;
  headline: string;
  description: string;
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export const AICoachCard: React.FC<AICoachCardProps> = ({
  title = 'AI Coach Recommendation',
  headline,
  description,
  ctaLabel = 'View Detailed Plan',
  onCtaClick,
}) => {
  return (
    <div className="ff-card p-5 sm:p-6 flex flex-col justify-between h-full">
      <div className="flex items-center gap-2 mb-3.5">
        <Sparkles className="w-4 h-4 text-[#7C5CFC]" />
        <h3 className="font-display text-[15px] font-bold text-[#142647]">{title}</h3>
      </div>

      <div className="flex items-start gap-4">
        <AICoachMascot variant="avatar" />
        <div className="space-y-1.5 flex-1 min-w-0">
          <p className="text-[13px] font-bold text-[#142647] leading-snug">{headline}</p>
          <p className="text-xs text-[#5A708D] leading-relaxed">{description}</p>
          {onCtaClick && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onCtaClick}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E9F9F2] hover:bg-[#DDF7EC] border border-[#BCEAD7] text-[#079669] text-xs font-bold cursor-pointer"
              >
                <span>{ctaLabel}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
