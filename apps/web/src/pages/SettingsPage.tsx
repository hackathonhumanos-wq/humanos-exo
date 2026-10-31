import React, { useState } from 'react';
import { ShieldCheck, EyeOff, Bell, Key, Smartphone } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [shareWithParent, setShareWithParent] = useState(false);
  const [shareWithCounsellor, setShareWithCounsellor] = useState(false);
  const [telemetryEnabled, setTelemetryEnabled] = useState(true);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="pb-4 border-b border-[#2c2537]">
        <h2 className="text-2xl font-extrabold text-white">System & Privacy Settings</h2>
        <p className="text-xs text-zinc-400">Manage consent disclosures, device pairings, and ethical data controls</p>
      </div>

      {/* Ethical Consent Section */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#b8ff3c]" />
          Consent & Transparency Controls
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed">
          In alignment with FOCUSFLOW student data governance, all external sharing is strictly opt-in and revocable at any time.
        </p>

        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between p-3.5 bg-[#0c0a10] rounded-xl border border-white/5">
            <div>
              <span className="text-sm font-semibold text-white block">Share Aggregate Metrics with Parent</span>
              <span className="text-xs text-zinc-400">Shares only total daily study minutes and completed goal badges.</span>
            </div>
            <button
              onClick={() => setShareWithParent(!shareWithParent)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                shareWithParent ? 'bg-[#b8ff3c]' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  shareWithParent ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#0c0a10] rounded-xl border border-white/5">
            <div>
              <span className="text-sm font-semibold text-white block">Share Summary with Campus Wellbeing Counsellor</span>
              <span className="text-xs text-zinc-400">Allows counsellors to review weekly stress & doomscrolling patterns.</span>
            </div>
            <button
              onClick={() => setShareWithCounsellor(!shareWithCounsellor)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                shareWithCounsellor ? 'bg-[#b8ff3c]' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  shareWithCounsellor ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 bg-[#0c0a10] rounded-xl border border-white/5">
            <div>
              <span className="text-sm font-semibold text-white block">Chrome Extension Short-Form Detection</span>
              <span className="text-xs text-zinc-400">Estimates video swipe counts locally to calculate rot scores.</span>
            </div>
            <button
              onClick={() => setTelemetryEnabled(!telemetryEnabled)}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                telemetryEnabled ? 'bg-[#b8ff3c]' : 'bg-zinc-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-black transition-transform ${
                  telemetryEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
