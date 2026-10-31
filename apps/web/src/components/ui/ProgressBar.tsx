/**
 * @file apps/web/src/components/ui/ProgressBar.tsx
 * @description Accessible reusable progress bar for XP, daily goals, and study targets
 */
import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  tone?: 'emerald' | 'blue' | 'amber' | 'rose' | 'purple';
  size?: 'sm' | 'md' | 'lg';
  showValueLabel?: boolean;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label = 'Progress',
  tone = 'emerald',
  size = 'md',
  showValueLabel = false,
  className = '',
}) => {
  const safeMax = max > 0 ? max : 100;
  const pct = Math.max(0, Math.min(100, Math.round((value / safeMax) * 100)));

  const fillClass =
    tone === 'blue'
      ? 'bg-[#438CF5]'
      : tone === 'amber'
        ? 'bg-amber-500'
        : tone === 'rose'
          ? 'bg-rose-500'
          : tone === 'purple'
            ? 'bg-[#7C5CFC]'
            : 'bg-[#079669]';

  const trackClass =
    tone === 'blue'
      ? 'bg-[#E8F1FE]'
      : tone === 'amber'
        ? 'bg-amber-100'
        : tone === 'rose'
          ? 'bg-rose-100'
          : tone === 'purple'
            ? 'bg-violet-100'
            : 'bg-[#DDF7EC]';

  const heightClass = size === 'sm' ? 'h-2' : size === 'lg' ? 'h-3.5' : 'h-2.5';

  return (
    <div className={`w-full ${className}`}>
      {showValueLabel && (
        <div className="flex items-center justify-between text-xs font-medium text-[#4A607A] mb-1.5">
          <span>{label}</span>
          <span className="tabular-nums font-semibold text-[#142647]">{pct}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={`w-full ${heightClass} ${trackClass} rounded-full overflow-hidden`}
      >
        <div
          className={`h-full ${fillClass} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
