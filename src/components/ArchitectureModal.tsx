import React from 'react';
import { X, ShieldCheck, Cpu, Database, EyeOff, Layers } from 'lucide-react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureModal: React.FC<ArchitectureModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#b8ff3c] uppercase tracking-wider mb-1">
            <Cpu className="w-4 h-4" />
            Android Architecture Pipeline
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How Brainrot Counts Offline</h2>
          <p className="text-zinc-400 text-xs sm:text-sm mt-1">
            Pure Kotlin state-machine tracking without OCR, network sniffers, or view inspection.
          </p>
        </div>

        {/* Architecture Pipeline Diagram */}
        <div className="bg-[#0c0a10] border border-white/10 rounded-2xl p-5 space-y-4">
          <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Detection Pipeline</div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-[#17131f] border border-white/5 p-3 rounded-xl">
              <span className="font-mono text-[#f4533f] font-bold block mb-1">1. Accessibility</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Subscribes ONLY to scroll, window, and tab events. Never reads view text or walks the view tree.
              </p>
            </div>

            <div className="bg-[#17131f] border border-white/5 p-3 rounded-xl">
              <span className="font-mono text-[#b8ff3c] font-bold block mb-1">2. Pure State Machine</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                <code className="text-zinc-200">Detector</code> tracks in-Reels vs out-of-Reels. Accuracy policy: when unsure, exit immediately.
              </p>
            </div>

            <div className="bg-[#17131f] border border-white/5 p-3 rounded-xl">
              <span className="font-mono text-[#49e6ff] font-bold block mb-1">3. Index Strategy</span>
              <p className="text-zinc-400 text-[11px] leading-relaxed">
                Confirms a reel only when the pager settles on a new index. Swiping back or abandoned half-swipes never re-count.
              </p>
            </div>
          </div>

          <div className="p-3 bg-[#17131f] rounded-xl border border-white/5 font-mono text-[11px] text-zinc-300 overflow-x-auto whitespace-pre">
{`Instagram ──AccessibilityEvent──▶ ReelAccessibilityService ──UiSignal──▶ Detector
                                                                             │
Flow<Int> ◀── Room Database ◀── ReelRepository ◀── IndexStrategy ────────────┘`}
          </div>
        </div>

        {/* Privacy Safeguards */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold text-white flex items-center gap-2">
            <EyeOff className="w-4 h-4 text-emerald-400" />
            Zero-Compromise Privacy
          </h4>
          <ul className="text-xs text-zinc-400 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>100% Offline by Default:</strong> All swipe logs and sitting sessions are stored solely in a local Room database (<code className="text-zinc-300">reels.db</code>) on your phone.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>No Text Scraping:</strong> Captions, user comments, Direct Messages, and other users' profile pages are completely ignored and never accessed.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400 font-bold">•</span>
              <span><strong>Optional Friends Sync:</strong> If you connect an invite code, only your daily aggregate totals (total count and seconds) are synced via Supabase.</span>
            </li>
          </ul>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-[#242423] hover:bg-[#2d2d2c] text-white rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
