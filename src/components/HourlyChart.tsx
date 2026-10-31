import React, { useState } from 'react';

interface HourlyChartProps {
  hourly: number[];
  currentHour?: number;
  is24h?: boolean;
}

export const HourlyChart: React.FC<HourlyChartProps> = ({
  hourly,
  currentHour = new Date().getHours(),
  is24h = false,
}) => {
  const [selectedHour, setSelectedHour] = useState<number | null>(null);

  const maxReels = Math.max(...hourly, 1);
  const peakHour = hourly.indexOf(Math.max(...hourly));
  const activeFocus = selectedHour !== null ? selectedHour : (Math.max(...hourly) > 0 ? peakHour : null);

  const formatHourLabel = (h: number): string => {
    if (is24h) {
      return `${String(h).padStart(2, '0')}:00`;
    }
    if (h === 0) return '12 AM';
    if (h === 12) return '12 PM';
    return h < 12 ? `${h} AM` : `${h - 12} PM`;
  };

  const formatHourRange = (h: number): string => {
    const nextH = (h + 1) % 24;
    return `${formatHourLabel(h)} – ${formatHourLabel(nextH)}`;
  };

  const getAxisMark = (h: number): string => {
    if (is24h) return String(h).padStart(2, '0');
    if (h === 0) return '12a';
    if (h === 6) return '6a';
    if (h === 12) return '12p';
    if (h === 18) return '6p';
    return '';
  };

  return (
    <div className="w-full">
      {/* Chart Header Info */}
      <div className="flex items-center justify-between text-sm mb-3">
        <div className="text-zinc-400 font-medium">
          {activeFocus === null ? (
            'No reels yet today'
          ) : selectedHour === null ? (
            <span>
              Busiest <strong className="text-zinc-200">{formatHourRange(activeFocus)}</strong>
            </span>
          ) : (
            <span className="text-zinc-200 font-semibold">{formatHourRange(activeFocus)}</span>
          )}
        </div>
        {activeFocus !== null && (
          <div className="font-mono-numbers text-sm font-semibold text-zinc-100 bg-[#242423] px-2.5 py-0.5 rounded-full border border-white/5">
            {hourly[activeFocus]} {hourly[activeFocus] === 1 ? 'reel' : 'reels'}
          </div>
        )}
      </div>

      {/* SVG Canvas for precision rendering */}
      <div className="relative w-full h-[155px] bg-[#121118]/60 rounded-xl p-3 border border-white/5">
        {/* Hairline at the max with label */}
        {Math.max(...hourly) > 0 && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
            <div className="w-full h-px bg-white/10" />
            <span className="font-mono-numbers text-[10px] text-zinc-500 ml-2 pl-1 select-none">
              {Math.max(...hourly)}
            </span>
          </div>
        )}

        {/* Baseline */}
        <div className="absolute bottom-[28px] left-3 right-3 h-px bg-white/10" />

        {/* 24 Columns */}
        <div className="absolute top-5 bottom-[28px] left-3 right-3 flex items-end justify-between gap-[2px]">
          {hourly.map((count, hour) => {
            const heightPercent = maxReels > 0 ? (count / maxReels) * 100 : 0;
            const isSelected = selectedHour === hour;
            const isPeak = hour === peakHour && count > 0;
            const isCurrent = hour === currentHour;
            const isDimmed = selectedHour !== null && !isSelected;

            return (
              <div
                key={hour}
                onClick={() => setSelectedHour(selectedHour === hour ? null : hour)}
                className="relative flex-1 h-full flex flex-col justify-end items-center cursor-pointer group"
                title={`${formatHourLabel(hour)}: ${count} reels`}
              >
                {/* Bar */}
                {count > 0 ? (
                  <div
                    style={{ height: `${Math.max(heightPercent, 4)}%` }}
                    className={`w-full max-w-[20px] rounded-t-sm transition-all duration-200 ${
                      isSelected
                        ? 'bg-[#f4533f] ring-2 ring-[#f4533f]/40 shadow-lg shadow-[#f4533f]/30'
                        : isDimmed
                        ? 'bg-[#6b2e28] opacity-50'
                        : isPeak
                        ? 'bg-[#f4533f] group-hover:bg-[#ff6957]'
                        : 'bg-[#a3382c] group-hover:bg-[#f4533f]'
                    }`}
                  />
                ) : (
                  <div className="w-full max-w-[20px] h-[2px] bg-white/5 group-hover:bg-white/20 transition-colors" />
                )}

                {/* Hover indicator tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-7 pointer-events-none transition-opacity bg-zinc-900 border border-zinc-700 text-[10px] px-1.5 py-0.5 rounded shadow-xl whitespace-nowrap z-20">
                  {count}
                </div>
              </div>
            );
          })}
        </div>

        {/* Axis Labels & Current Hour Marker */}
        <div className="absolute bottom-1 left-3 right-3 flex justify-between text-[11px] font-mono-numbers text-zinc-500 select-none">
          {[0, 6, 12, 18, 23].map(h => (
            <div
              key={h}
              className={`flex flex-col items-center ${
                h === currentHour ? 'text-zinc-100 font-bold' : ''
              }`}
            >
              <span>{getAxisMark(h)}</span>
            </div>
          ))}
        </div>

        {/* Current Hour Dot indicator under baseline */}
        <div
          className="absolute bottom-[23px] w-1.5 h-1.5 rounded-full bg-[#f4533f] -translate-x-1/2 shadow-sm pointer-events-none"
          style={{
            left: `calc(12px + ${(currentHour / 23) * 100}% - 4px)`,
          }}
          title={`Now: ${formatHourLabel(currentHour)}`}
        />
      </div>
    </div>
  );
};
