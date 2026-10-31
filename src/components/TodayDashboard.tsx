import React from 'react';
import { DayStats, TrackingState } from '../types/brainrot';
import { getStageForCount, getNextThreshold, formatDuration, formatTimeAgo, formatTimeRange } from '../utils/brainrotHelpers';
import { HourlyChart } from './HourlyChart';
import { ShieldCheck, Plus, Share2, Download, AlertTriangle } from 'lucide-react';

interface TodayDashboardProps {
  stats: DayStats;
  tracking: TrackingState;
  onOpenSettings: () => void;
  onAddWidget: () => void;
  onExportDebug: () => void;
  onIncrementReel: () => void;
  onToggleSimulator: () => void;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({
  stats,
  tracking,
  onOpenSettings,
  onAddWidget,
  onExportDebug,
  onIncrementReel,
  onToggleSimulator,
}) => {
  const stage = getStageForCount(stats.count);
  const { reelsRemaining } = getNextThreshold(stats.count);

  const maxSittingReels = stats.sittings.length > 0 ? Math.max(...stats.sittings.map(s => s.reels)) : 1;

  return (
    <div className="w-full max-w-xl mx-auto space-y-5">
      {/* Top Bar: Brand + Tracking Status Pill */}
      <div className="flex items-center justify-between py-2">
        <div className="flex items-center gap-2.5">
          <img src="/assets/icon.png" alt="Brainrot" className="w-9 h-9 rounded-xl shadow-md" />
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white leading-none">Brainrot</h1>
            <span className="text-[11px] text-zinc-400 font-mono">Offline Instagram Counter</span>
          </div>
        </div>

        {/* Tracking Status Pill (matches Android Accessibility service indicator) */}
        <button
          onClick={onOpenSettings}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
            tracking === 'On'
              ? 'bg-emerald-950/70 text-emerald-300 border-emerald-600/40 hover:bg-emerald-900/80 shadow-sm shadow-emerald-500/10'
              : tracking === 'Stalled'
              ? 'bg-amber-950/70 text-amber-300 border-amber-600/40 hover:bg-amber-900/80'
              : 'bg-rose-950/70 text-rose-300 border-rose-600/40 hover:bg-rose-900/80'
          }`}
          title="Click to view Accessibility Service details"
        >
          <span
            className={`w-2 h-2 rounded-full ${
              tracking === 'On'
                ? 'bg-emerald-400 animate-pulse'
                : tracking === 'Stalled'
                ? 'bg-amber-400'
                : 'bg-rose-500'
            }`}
          />
          <span>{tracking === 'On' ? 'Tracking' : tracking === 'Stalled' ? 'Stalled' : 'Not running'}</span>
        </button>
      </div>

      {/* Warning banner if service is off */}
      {tracking !== 'On' && (
        <div className="p-3.5 bg-amber-950/50 border border-amber-500/30 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-200">
            <strong>Accessibility service required:</strong> Turn on Brainrot in Settings → Accessibility so it can count reels from the Instagram pager.
            <button
              onClick={onOpenSettings}
              className="ml-2 underline font-semibold text-amber-100 hover:text-white"
            >
              Enable Now
            </button>
          </div>
        </div>
      )}

      {/* Hero: Huge Reels Count (Recreates TodayScreen Hero) */}
      <div className="pt-3 pb-1">
        <div className="text-sm font-medium text-zinc-400 mb-1">Reels watched today</div>
        <div className="flex items-baseline gap-3">
          <span className="font-mono-numbers text-[90px] sm:text-[112px] font-semibold leading-none tracking-tight text-white select-none">
            {stats.count}
          </span>
          <button
            onClick={onIncrementReel}
            className="p-2.5 bg-[#f4533f] hover:bg-[#ff6957] active:scale-95 text-white rounded-2xl shadow-lg shadow-[#f4533f]/30 transition-all cursor-pointer flex items-center justify-center"
            title="Simulate 1 counted reel"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
        <div className="text-sm text-zinc-500 mt-2">
          {stats.lastEventAt ? `Last one counted ${formatTimeAgo(stats.lastEventAt)}` : 'Nothing counted yet'}
        </div>
      </div>

      {/* Brain Card: Sprite + Stage title + Widget Action */}
      <div className="bg-[#1a1a19] border border-white/5 rounded-[22px] p-4 sm:p-5 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-18 h-16 sm:w-20 sm:h-18 flex items-center justify-center shrink-0">
            <img
              src={stage.sprite}
              alt={stage.name}
              className="w-full h-full object-contain filter drop-shadow-md"
            />
          </div>
          <div>
            <div className="text-lg font-bold text-white leading-tight flex items-center gap-2">
              {stage.name}
              <span className="text-[11px] font-mono text-zinc-400 bg-black/40 px-2 py-0.5 rounded-full border border-white/5">
                Stage {stage.stage}
              </span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              {reelsRemaining !== null ? `${reelsRemaining} more until it gets worse` : "It can't get any worse"}
            </div>
            <button
              onClick={onAddWidget}
              className="mt-2 text-xs font-semibold text-[#f4533f] hover:text-[#ff6957] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Add to home screen widget
            </button>
          </div>
        </div>

        {/* Quick Launch Simulator Button */}
        <button
          onClick={onToggleSimulator}
          className="hidden sm:flex flex-col items-center justify-center p-2.5 bg-[#242423] hover:bg-[#2d2d2c] border border-white/5 rounded-xl text-[11px] text-zinc-300 transition-all cursor-pointer"
        >
          <span className="text-xs font-semibold text-white">Reels Sim</span>
          <span className="text-[10px] text-zinc-500">Test overlay</span>
        </button>
      </div>

      {/* Stat Row: 3 Tiles (In Reels, Sittings, Per reel) */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#1a1a19] border border-white/5 rounded-[18px] p-3.5">
          <div className="text-xs text-zinc-400 font-medium truncate">In Reels</div>
          <div className="text-xl sm:text-2xl font-semibold font-mono-numbers text-white mt-1 truncate">
            {stats.count === 0 ? '0 min' : formatDuration(stats.scrollingMs)}
          </div>
        </div>

        <div className="bg-[#1a1a19] border border-white/5 rounded-[18px] p-3.5">
          <div className="text-xs text-zinc-400 font-medium truncate">Sittings</div>
          <div className="text-xl sm:text-2xl font-semibold font-mono-numbers text-white mt-1">
            {stats.sittings.length}
          </div>
        </div>

        <div className="bg-[#1a1a19] border border-white/5 rounded-[18px] p-3.5">
          <div className="text-xs text-zinc-400 font-medium truncate">Per reel</div>
          <div className="text-xl sm:text-2xl font-semibold font-mono-numbers text-white mt-1">
            {stats.secondsPerReel ? `${stats.secondsPerReel}s` : '–'}
          </div>
        </div>
      </div>

      {/* Hourly Chart Panel */}
      <div className="bg-[#1a1a19] border border-white/5 rounded-[22px] p-5">
        <div className="text-base font-semibold text-white mb-1">Hourly Breakdown</div>
        <div className="text-xs text-zinc-400 mb-3">Reels swiped by time of day</div>
        <HourlyChart hourly={stats.hourly} />
      </div>

      {/* Sittings Panel ("When you scrolled") */}
      <div className="bg-[#1a1a19] border border-white/5 rounded-[22px] p-5">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-base font-semibold text-white">When you scrolled</h3>
          <span className="text-[11px] text-zinc-500 font-mono">Session Log</span>
        </div>
        <p className="text-xs text-zinc-400 mb-4">A break of 3 min or more starts a new sitting</p>

        {stats.sittings.length === 0 ? (
          <div className="text-xs text-zinc-500 py-4 text-center">No reels yet today.</div>
        ) : (
          <div className="space-y-4">
            {stats.sittings.map((s, idx) => {
              const isLive = idx === 0 && Date.now() - s.end < 3 * 60 * 1000;
              const meterWidth = `${(s.reels / maxSittingReels) * 100}%`;

              return (
                <div key={s.id} className="group">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono-numbers text-sm font-medium text-white">
                          {formatTimeRange(s.start, s.end)}
                        </span>
                        {isLive && (
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#242423] border border-white/5 text-[11px] text-white">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#f4533f] animate-pulse" />
                            Now
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5">{formatDuration(s.durationMs)}</div>
                    </div>

                    <div className="flex items-baseline gap-1">
                      <span className="font-mono-numbers text-lg font-semibold text-white">{s.reels}</span>
                      <span className="text-xs text-zinc-400">{s.reels === 1 ? 'reel' : 'reels'}</span>
                    </div>
                  </div>

                  {/* Meter bar */}
                  <div className="mt-2.5 h-1.5 w-full bg-[#6b2e28]/40 rounded-full overflow-hidden">
                    <div
                      style={{ width: meterWidth }}
                      className="h-full bg-[#f4533f] rounded-full transition-all duration-300"
                    />
                  </div>

                  {idx < stats.sittings.length - 1 && (
                    <div className="h-px w-full bg-white/5 mt-4" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Details */}
      <div className="text-center pt-2 pb-6 space-y-2">
        <button
          onClick={onExportDebug}
          className="text-xs text-zinc-400 hover:text-zinc-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          Export debug capture
        </button>
        <p className="text-[11px] text-zinc-500 max-w-sm mx-auto">
          Counted on this device. Only daily totals are shared, and only once you connect with friends.
        </p>
      </div>
    </div>
  );
};
