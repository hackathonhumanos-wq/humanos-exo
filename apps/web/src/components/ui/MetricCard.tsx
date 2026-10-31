/**
 * @file apps/web/src/components/ui/MetricCard.tsx
 * @description Clean white KPI Metric Card with icon badge, trend indicator, accessible tooltip, and sparkline or progress bar
 */
import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { ProgressBar } from './ProgressBar.tsx';

interface MetricCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  iconBgClass?: string;
  trendText?: string;
  trendTone?: 'positive' | 'info' | 'warning';
  infoTooltip?: string;
  sparklineValues?: number[];
  sparklineType?: 'bars' | 'line';
  sparklineColor?: string;
  progressPercent?: number;
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  iconBgClass = 'bg-[#E9F9F2] text-[#079669]',
  trendText,
  trendTone = 'positive',
  infoTooltip,
  sparklineValues,
  sparklineType = 'bars',
  sparklineColor = '#079669',
  progressPercent,
  onClick,
}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const trendBadgeClass =
    trendTone === 'info'
      ? 'bg-[#EBF3FF] text-[#2563EB]'
      : trendTone === 'warning'
        ? 'bg-[#FFF1F2] text-[#E11D48]'
        : 'bg-[#E6F8F0] text-[#079669]';

  const renderSparkline = () => {
    if (!sparklineValues || sparklineValues.length === 0) return null;
    const maxVal = Math.max(...sparklineValues, 1);
    const minVal = Math.min(...sparklineValues, 0);

    if (sparklineType === 'line') {
      const width = 76;
      const height = 26;
      const range = Math.max(maxVal - minVal, 1);
      const pts = sparklineValues
        .map((v, idx) => {
          const x = (idx / Math.max(sparklineValues.length - 1, 1)) * (width - 6) + 3;
          const y = height - 4 - ((v - minVal) / range) * (height - 8);
          return `${x.toFixed(1)},${y.toFixed(1)}`;
        })
        .join(' ');
      const areaPts = `3,${height - 2} ${pts} ${width - 3},${height - 2}`;

      return (
        <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" className="shrink-0">
          <polygon points={areaPts} fill={sparklineColor} fillOpacity="0.14" />
          <polyline
            fill="none"
            stroke={sparklineColor}
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={pts}
          />
        </svg>
      );
    }

    return (
      <div className="flex items-end gap-1 h-7 shrink-0" aria-hidden="true">
        {sparklineValues.map((val, idx) => {
          const heightPct = Math.max(22, Math.round((val / maxVal) * 100));
          const isLast = idx === sparklineValues.length - 1;
          return (
            <span
              key={idx}
              className="w-1.5 rounded-t-sm transition-all"
              style={{
                height: `${heightPct}%`,
                backgroundColor: sparklineColor,
                opacity: isLast ? 0.95 : 0.42 + idx * 0.07,
              }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
      className={`ff-card p-5 flex flex-col justify-between gap-3 relative ${
        onClick ? 'cursor-pointer hover:border-[#B6E5D4] hover:-translate-y-0.5' : ''
      }`}
    >
      <div className="flex items-start gap-3.5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgClass}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-semibold text-[#334B68] truncate">{title}</div>
          <div className="mt-1 flex items-center gap-2 flex-wrap">
            <span className="font-display text-2xl sm:text-[26px] font-extrabold text-[#142647] tabular-nums tracking-tight leading-none">
              {value}
            </span>
            {infoTooltip && (
              <div className="relative inline-flex">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setTooltipOpen((prev) => !prev);
                  }}
                  onMouseEnter={() => setTooltipOpen(true)}
                  onMouseLeave={() => setTooltipOpen(false)}
                  aria-label={`About ${title}`}
                  className="w-4 h-4 rounded-full bg-[#EDF4F1] text-[#5B728E] hover:text-[#142647] flex items-center justify-center cursor-pointer"
                >
                  <Info className="w-3 h-3" />
                </button>
                {tooltipOpen && (
                  <div
                    role="tooltip"
                    className="absolute left-0 bottom-6 z-30 w-60 p-2.5 rounded-xl bg-[#142647] text-white text-[11px] leading-relaxed shadow-lg"
                  >
                    {infoTooltip}
                  </div>
                )}
              </div>
            )}
            {trendText && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums ${trendBadgeClass}`}
              >
                {trendText}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3 pt-0.5">
        <span className="text-xs font-medium text-[#5D738E]">{subtitle}</span>
        {progressPercent !== undefined ? (
          <div className="w-28 sm:w-32">
            <ProgressBar value={progressPercent} label={title} tone="emerald" size="md" />
          </div>
        ) : (
          renderSparkline()
        )}
      </div>
    </div>
  );
};
