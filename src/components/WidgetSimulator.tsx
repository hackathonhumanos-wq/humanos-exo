import React from 'react';
import { DayStats } from '../types/brainrot';
import { getStageForCount } from '../utils/brainrotHelpers';
import { Smartphone, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';

interface WidgetSimulatorProps {
  stats: DayStats;
  onOpenApp: () => void;
}

export const WidgetSimulator: React.FC<WidgetSimulatorProps> = ({
  stats,
  onOpenApp,
}) => {
  const stage = getStageForCount(stats.count);

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-3 py-1 rounded-full border border-[#b8ff3c]/20">
          <Smartphone className="w-3.5 h-3.5" />
          Android 14+ Home Screen Widget
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Glanceable Daily Rot</h2>
        <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto">
          Add the Brainrot widget to your home screen to see today's rot stage without opening Instagram or the app.
        </p>
      </div>

      {/* Simulated Android Launcher Screen */}
      <div className="relative mx-auto w-[330px] sm:w-[360px] h-[480px] bg-gradient-to-b from-stone-900 via-zinc-900 to-black rounded-[40px] p-5 border-4 border-zinc-700 shadow-2xl overflow-hidden flex flex-col justify-between select-none">
        {/* Launcher Top Bar / Clock & Search */}
        <div className="flex items-center justify-between text-xs text-white/80 font-mono pt-2 px-1">
          <span>09:41</span>
          <div className="flex items-center gap-1.5 text-[10px]">
            <span>5G</span>
            <span>100%</span>
          </div>
        </div>

        {/* ----------------- 2x2 BRAINROT WIDGET ----------------- */}
        <div
          onClick={onOpenApp}
          className="bg-[#17131f]/95 hover:bg-[#1f1a29] border border-white/15 rounded-3xl p-4 shadow-xl backdrop-blur-md cursor-pointer transition-all hover:scale-[1.02] active:scale-95 group"
          title="Tap widget to open Brainrot"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">Brainrot</span>
            <span className="text-[10px] font-mono text-[#b8ff3c] flex items-center gap-1">
              <RefreshCw className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: '8s' }} />
              Today
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 h-14 flex items-center justify-center shrink-0">
              <img
                src={stage.sprite}
                alt=""
                className="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
              />
            </div>
            <div>
              <div className="text-2xl font-bold font-mono-numbers text-white leading-none">
                {stats.count}
                <span className="text-xs text-zinc-400 font-normal ml-1">reels</span>
              </div>
              <div className="text-sm font-semibold text-[#f4533f] mt-1">{stage.name}</div>
              <div className="text-[10px] text-zinc-400 mt-0.5">Tap to open app</div>
            </div>
          </div>
        </div>

        {/* Dummy App Grid (Android Launcher Apps) */}
        <div className="grid grid-cols-4 gap-4 px-2 py-4">
          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-500 flex items-center justify-center shadow-md">
              <span className="text-[10px] font-bold text-white">IG</span>
            </div>
            <span className="text-[10px] text-zinc-300">Instagram</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-[#0c0a10] border border-[#b8ff3c]/40 flex items-center justify-center shadow-md">
              <img src="/assets/icon.png" alt="" className="w-8 h-8 rounded-lg" />
            </div>
            <span className="text-[10px] text-zinc-300 font-medium text-[#b8ff3c]">Brainrot</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center shadow-md">
              <span className="text-[10px] font-bold text-white">Chrome</span>
            </div>
            <span className="text-[10px] text-zinc-300">Browser</span>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600 flex items-center justify-center shadow-md">
              <span className="text-[10px] font-bold text-white">Phone</span>
            </div>
            <span className="text-[10px] text-zinc-300">Phone</span>
          </div>
        </div>

        {/* Launcher Home Bar */}
        <div className="w-32 h-1 bg-white/40 rounded-full mx-auto mb-1" />
      </div>

      {/* Installation Steps */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-3">
        <h4 className="text-sm font-semibold text-white">How to add to your Android Home Screen</h4>
        <ol className="text-xs text-zinc-400 space-y-2 list-decimal list-inside">
          <li>Install the Brainrot APK on your Android phone.</li>
          <li>Long-press an empty space on your home screen.</li>
          <li>Tap <strong className="text-zinc-200">Widgets</strong> and scroll down to <strong className="text-zinc-200">Brainrot</strong>.</li>
          <li>Drag the 2×2 or 4×2 rot counter onto your screen.</li>
        </ol>
      </div>
    </div>
  );
};
