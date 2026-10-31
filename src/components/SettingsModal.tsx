import React from 'react';
import { X, CheckCircle, AlertTriangle, Battery, ShieldAlert, Cpu } from 'lucide-react';
import { TrackingState } from '../types/brainrot';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  tracking: TrackingState;
  onSetTracking: (state: TrackingState) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  tracking,
  onSetTracking,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-7 max-w-md w-full space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#b8ff3c] uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            Android System Service
          </div>
          <h3 className="text-xl font-bold text-white">Accessibility & Tracking</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Recreates the Android Accessibility Settings configuration for ReelAccessibilityService.
          </p>
        </div>

        {/* Toggle Service State */}
        <div className="bg-[#120f18] p-4 rounded-2xl border border-white/5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-white">Accessibility Service</div>
              <div className="text-xs text-zinc-400">Settings → Accessibility → Brainrot</div>
            </div>
            <button
              onClick={() => onSetTracking(tracking === 'On' ? 'Off' : 'On')}
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
                tracking === 'On' ? 'bg-[#b8ff3c]' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`bg-black w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  tracking === 'On' ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex gap-2 pt-2 border-t border-white/5">
            {(['On', 'Stalled', 'Off'] as TrackingState[]).map(s => (
              <button
                key={s}
                onClick={() => onSetTracking(s)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-medium border transition-colors cursor-pointer ${
                  tracking === s
                    ? 'bg-[#241a31] border-[#b8ff3c] text-[#b8ff3c]'
                    : 'bg-[#17131f] border-white/5 text-zinc-400 hover:text-white'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Battery Optimization Info */}
        <div className="bg-[#120f18] p-4 rounded-2xl border border-white/5 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Battery className="w-4 h-4 text-emerald-400" />
            Battery Optimization: Unrestricted
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Many phone manufacturers (OPPO, OnePlus, Xiaomi, Samsung) aggressively terminate background accessibility services. Setting battery to <strong>Unrestricted</strong> prevents unexpected stops.
          </p>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 bg-[#242423] hover:bg-[#2d2d2c] text-white text-xs font-semibold rounded-xl"
        >
          Close
        </button>
      </div>
    </div>
  );
};
