import React, { useState } from 'react';
import { Download, Copy, Check, ShieldCheck, Terminal, Smartphone, Github, ExternalLink, HelpCircle } from 'lucide-react';

export const DocumentationSection: React.FC = () => {
  const [copiedSha, setCopiedSha] = useState(false);
  const sha256Checksum = 'b94f8a3e712c98d641154ea22c4e88b699e3240e53a25cb4818dbca42ff8e752';

  const handleCopySha = () => {
    navigator.clipboard?.writeText(sha256Checksum);
    setCopiedSha(true);
    setTimeout(() => setCopiedSha(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Download APK Hero Card */}
      <div className="bg-gradient-to-br from-[#1a1524] via-[#17131f] to-[#120f18] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-3 py-1 rounded-full border border-[#b8ff3c]/20">
              <Download className="w-3.5 h-3.5" />
              Android Release v1.0.4
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Download Brainrot APK</h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md">
              Sideload the signed APK on any phone running Android 8.0 (Oreo) or later. Zero Google Play tracking.
            </p>
          </div>

          <span
            className="px-6 py-3.5 bg-[#1f1a29] border border-[#2c2537] text-zinc-300 font-extrabold rounded-2xl text-sm flex items-center justify-center gap-2 shrink-0"
          >
            <Smartphone className="w-5 h-5 text-[#b8ff3c]" />
            Web Companion Active
          </span>
        </div>

        {/* Checksum Bar */}
        <div className="mt-6 pt-5 border-t border-[#2c2537] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-zinc-400 truncate">
            <span className="font-mono text-zinc-500 uppercase">SHA-256:</span>
            <span className="font-mono text-zinc-300 truncate max-w-xs sm:max-w-md">{sha256Checksum}</span>
          </div>
          <button
            onClick={handleCopySha}
            className="self-start sm:self-auto px-2.5 py-1 bg-[#242423] hover:bg-[#2d2d2c] text-zinc-300 rounded-lg font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
          >
            {copiedSha ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedSha ? 'Copied' : 'Copy Hash'}</span>
          </button>
        </div>
      </div>

      {/* Quick Setup Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-[#17131f] border border-[#2c2537] rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Smartphone className="w-4 h-4 text-[#f4533f]" />
            1. Enable Accessibility
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Go to <strong>Settings → Accessibility → Installed apps → Brainrot → On</strong>.
            The accessibility event stream allows Brainrot to detect when the Instagram Reels pager snaps to a new index.
          </p>
        </div>

        <div className="bg-[#17131f] border border-white/5 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            2. Unrestricted Battery
          </div>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Go to <strong>Settings → Apps → Brainrot → Battery → Unrestricted</strong>.
            This ensures modern Android OEM power managers do not kill the floating counter service in the background.
          </p>
        </div>
      </div>

      {/* Technical FAQ */}
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 space-y-4">
        <h4 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-[#b8ff3c]" />
          Frequently Asked Questions
        </h4>

        <div className="space-y-4 text-xs">
          <div>
            <h5 className="font-semibold text-zinc-200 mb-1">Does it read my DMs, captions, or view history?</h5>
            <p className="text-zinc-400 leading-relaxed">
              Never. The accessibility service only registers <code className="text-zinc-300">TYPE_VIEW_SCROLLED</code> and <code className="text-zinc-300">TYPE_WINDOW_STATE_CHANGED</code>. It drops all events originating from non-Instagram apps before even checking their source.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5">
            <h5 className="font-semibold text-zinc-200 mb-1">What happens if I swipe back to a reel I already saw?</h5>
            <p className="text-zinc-400 leading-relaxed">
              The <code className="text-zinc-300">IndexStrategy</code> keeps track of seen page indexes within the active session epoch. Swiping backwards lands on an index already logged, so it is completely ignored and will never inflate your count.
            </p>
          </div>

          <div className="pt-3 border-t border-white/5">
            <h5 className="font-semibold text-zinc-200 mb-1">When does the counter reset?</h5>
            <p className="text-zinc-400 leading-relaxed">
              Counting resets automatically at local midnight. No continuous counter is ever stored; daily totals are computed dynamically from timestamped event rows in the local Room database (<code className="text-zinc-300">reels.db</code>).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
