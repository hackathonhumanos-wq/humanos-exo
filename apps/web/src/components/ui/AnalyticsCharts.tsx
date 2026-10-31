/**
 * @file apps/web/src/components/ui/AnalyticsCharts.tsx
 * @description Accessible responsive SVG charts for Weekly Focus vs Screen Time, Platform Breakdown Donut, and 7-Day Reels/Shorts Trends
 */
import React, { useState } from 'react';
import type {
  WeeklyFocusDayPoint,
  ReelsPlatformBreakdown,
  ReelsDailyTrendPoint,
} from '../../../../../packages/shared-types/src/index.ts';

interface WeeklyFocusAreaChartProps {
  data: WeeklyFocusDayPoint[];
}

export const WeeklyFocusAreaChart: React.FC<WeeklyFocusAreaChartProps> = ({ data }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-sm text-[#6C819C]">
        No weekly focus telemetry recorded yet.
      </div>
    );
  }

  const width = 580;
  const height = 210;
  const padLeft = 36;
  const padRight = 18;
  const padTop = 18;
  const padBottom = 32;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  const peakDataHours = Math.max(
    ...data.map((d) => Math.max(d.focusHours, d.screenHours)),
    4
  );
  const maxHours = Math.max(4, Math.ceil(peakDataHours));
  const yTicks = [0, 1, 2, 3, 4].map((step) => Math.round((step / 4) * maxHours * 10) / 10);

  const getX = (index: number) =>
    padLeft + (index / Math.max(data.length - 1, 1)) * plotW;
  const getY = (hours: number) =>
    padTop + plotH - (Math.min(hours, maxHours) / maxHours) * plotH;

  const focusPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.focusHours) }));
  const screenPoints = data.map((d, i) => ({ x: getX(i), y: getY(d.screenHours) }));

  const buildPolyline = (pts: { x: number; y: number }[]) =>
    pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

  const focusAreaPath = `M ${focusPoints[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${focusPoints
    .map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' L ')} L ${focusPoints[focusPoints.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  const screenAreaPath = `M ${screenPoints[0].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} L ${screenPoints
    .map((p) => `${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(' L ')} L ${screenPoints[screenPoints.length - 1].x.toFixed(1)} ${(padTop + plotH).toFixed(1)} Z`;

  const hoveredPoint = activeIndex !== null ? data[activeIndex] : null;

  return (
    <div className="w-full">
      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 overflow-visible"
          role="img"
          aria-label="Weekly Focus Time versus Screen Time line chart from Monday to Sunday"
        >
          <defs>
            <linearGradient id="focusAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#079669" stopOpacity="0.24" />
              <stop offset="100%" stopColor="#079669" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="screenAreaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2878F0" stopOpacity="0.14" />
              <stop offset="100%" stopColor="#2878F0" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal Y gridlines */}
          {yTicks.map((hour) => {
            const y = getY(hour);
            return (
              <g key={hour}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="#E8F2EE"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-[#8290A5] text-[11px] font-medium tabular-nums"
                >
                  {Number.isInteger(hour) ? `${hour}h` : `${hour.toFixed(1)}h`}
                </text>
              </g>
            );
          })}

          {/* Vertical subtle day guides */}
          {data.map((d, i) => {
            const x = getX(i);
            return (
              <g key={d.dayLabel}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + plotH}
                  stroke={activeIndex === i ? '#B8E4D3' : '#F2F8F5'}
                  strokeWidth={activeIndex === i ? '1.5' : '1'}
                />
                <text
                  x={x}
                  y={height - 8}
                  textAnchor="middle"
                  className="fill-[#4A607A] text-[11px] font-medium"
                >
                  {d.dayLabel}
                </text>
              </g>
            );
          })}

          {/* Soft gradient fills */}
          <path d={screenAreaPath} fill="url(#screenAreaFill)" />
          <path d={focusAreaPath} fill="url(#focusAreaFill)" />

          {/* Screen Time Line (#2878F0) */}
          <polyline
            fill="none"
            stroke="#2878F0"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline(screenPoints)}
          />

          {/* Focus Time Line (#079669) */}
          <polyline
            fill="none"
            stroke="#079669"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            points={buildPolyline(focusPoints)}
          />

          {/* Data nodes + interactive hit areas */}
          {data.map((d, i) => (
            <g
              key={d.dayLabel}
              tabIndex={0}
              role="button"
              aria-label={`${d.dayLabel}: Focus Time ${d.focusHours} hours, Screen Time ${d.screenHours} hours`}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
              onFocus={() => setActiveIndex(i)}
              onBlur={() => setActiveIndex(null)}
              className="cursor-pointer focus:outline-none"
            >
              <rect
                x={getX(i) - 22}
                y={padTop}
                width="44"
                height={plotH}
                fill="transparent"
              />
              <circle
                cx={screenPoints[i].x}
                cy={screenPoints[i].y}
                r={activeIndex === i ? 5 : 3.8}
                fill="#FFFFFF"
                stroke="#2878F0"
                strokeWidth="2.4"
              />
              <circle
                cx={focusPoints[i].x}
                cy={focusPoints[i].y}
                r={activeIndex === i ? 5 : 3.8}
                fill="#FFFFFF"
                stroke="#079669"
                strokeWidth="2.4"
              />
            </g>
          ))}
        </svg>

        {hoveredPoint && (
          <div className="mt-2 px-3 py-1.5 rounded-xl bg-[#F2FBF7] border border-[#CBEFE0] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-bold text-[#142647]">{hoveredPoint.dayLabel}</span>
            <div className="flex items-center gap-4 tabular-nums">
              <span className="text-[#079669] font-semibold">
                Focus: {hoveredPoint.focusHours.toFixed(1)}h ({hoveredPoint.focusMinutes}m)
              </span>
              <span className="text-[#2878F0] font-semibold">
                Screen: {hoveredPoint.screenHours.toFixed(1)}h ({hoveredPoint.screenMinutes}m)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface PlatformDonutChartProps {
  platforms: ReelsPlatformBreakdown[];
  size?: number;
}

export const PlatformDonutChart: React.FC<PlatformDonutChartProps> = ({
  platforms,
  size = 112,
}) => {
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = platforms.reduce((acc, p) => acc + p.estimatedInteractions, 0);

  let cumulativeOffset = 0;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className="shrink-0 -rotate-90"
      role="img"
      aria-label="Estimated short-form video interactions share by platform"
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#EBF5F0"
        strokeWidth={strokeWidth}
      />
      {total > 0 &&
        platforms.map((platform) => {
          const fraction = platform.estimatedInteractions / total;
          const dashLength = Math.max(0, fraction * circumference - 2);
          const dashOffset = -cumulativeOffset;
          cumulativeOffset += fraction * circumference;
          return (
            <circle
              key={platform.platform}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={platform.color}
              strokeWidth={strokeWidth}
              strokeDasharray={`${dashLength} ${circumference}`}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
            />
          );
        })}
    </svg>
  );
};

interface ReelsWeeklyBarChartProps {
  trends: ReelsDailyTrendPoint[];
  dailyLimit: number;
}

export const ReelsWeeklyBarChart: React.FC<ReelsWeeklyBarChartProps> = ({
  trends,
  dailyLimit,
}) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(trends.length - 1);

  if (!trends || trends.length === 0) {
    return (
      <div className="h-52 flex items-center justify-center text-sm text-[#6C819C]">
        No short-form trend data available.
      </div>
    );
  }

  const maxTotal = Math.max(
    ...trends.map((t) => t.totalEstimated),
    dailyLimit,
    20
  );
  const limitPct = Math.min(100, Math.round((dailyLimit / maxTotal) * 100));
  const selected = trends[selectedIdx] ?? trends[trends.length - 1];

  return (
    <div className="space-y-4">
      <div className="relative h-52 pt-6 pb-2 px-2 border-b border-[#E1EEE9] flex items-end justify-between gap-2 sm:gap-4">
        {/* Daily limit reference line */}
        <div
          className="absolute left-0 right-0 border-t-2 border-dashed border-[#079669]/55 pointer-events-none flex justify-end pr-2"
          style={{ bottom: `${limitPct}%` }}
        >
          <span className="-mt-5 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669] tabular-nums">
            Daily limit: {dailyLimit} est.
          </span>
        </div>

        {trends.map((day, idx) => {
          const totalHeightPct = Math.max(8, Math.round((day.totalEstimated / maxTotal) * 100));
          const igPct = day.totalEstimated > 0 ? (day.reelsEstimated / day.totalEstimated) * 100 : 0;
          const ytPct = day.totalEstimated > 0 ? (day.shortsEstimated / day.totalEstimated) * 100 : 0;
          const fbPct = Math.max(0, 100 - igPct - ytPct);
          const isSelected = selectedIdx === idx;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelectedIdx(idx)}
              className="flex-1 h-full flex flex-col items-center justify-end group cursor-pointer focus:outline-none"
              aria-label={`${day.dayLabel}: ${day.totalEstimated} estimated interactions (${day.estimatedMinutes} min)`}
            >
              <span className="text-[11px] font-bold text-[#142647] tabular-nums mb-1.5 opacity-80 group-hover:opacity-100">
                {day.totalEstimated}
              </span>
              <div
                className={`w-full max-w-[38px] rounded-t-xl overflow-hidden flex flex-col transition-all ${
                  isSelected ? 'ring-2 ring-[#079669] ring-offset-2' : 'opacity-85 group-hover:opacity-100'
                }`}
                style={{ height: `${totalHeightPct}%` }}
              >
                <div style={{ height: `${fbPct}%`, backgroundColor: '#438CF5' }} />
                <div style={{ height: `${ytPct}%`, backgroundColor: '#EF4444' }} />
                <div style={{ height: `${igPct}%`, backgroundColor: '#7C5CFC' }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* X-Axis Labels */}
      <div className="flex items-center justify-between gap-2 px-2">
        {trends.map((day, idx) => (
          <div
            key={day.date}
            className={`flex-1 text-center text-xs font-semibold ${
              selectedIdx === idx ? 'text-[#079669]' : 'text-[#5A708D]'
            }`}
          >
            {day.dayLabel}
          </div>
        ))}
      </div>

      {/* Selected Day Breakdown Pill */}
      {selected && (
        <div className="p-3.5 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <span className="font-bold text-[#142647]">{selected.dayLabel} ({selected.date})</span>
            <span className="text-[#5A708D] ml-2 tabular-nums">
              • ~{selected.estimatedMinutes} min estimated time spent
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 tabular-nums font-semibold">
            <span className="text-[#7C5CFC]">IG Reels: {selected.reelsEstimated}</span>
            <span className="text-[#EF4444]">YT Shorts: {selected.shortsEstimated}</span>
            <span className="text-[#438CF5]">FB Reels: {selected.facebookEstimated}</span>
          </div>
        </div>
      )}
    </div>
  );
};
