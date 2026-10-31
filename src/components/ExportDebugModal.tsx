import React, { useState } from 'react';
import { X, Copy, Check, Download, FileJson } from 'lucide-react';
import { DayStats } from '../types/brainrot';

interface ExportDebugModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: DayStats;
}

export const ExportDebugModal: React.FC<ExportDebugModalProps> = ({
  isOpen,
  onClose,
  stats,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const debugPayload = {
    exportedAt: new Date().toISOString(),
    version: '1.0.4-release',
    engine: 'ReelAccessibilityService',
    summary: {
      reelsToday: stats.count,
      scrollingMs: stats.scrollingMs,
      sittingCount: stats.sittings.length,
      secondsPerReel: stats.secondsPerReel,
    },
    hourlyDistribution: stats.hourly,
    sittings: stats.sittings,
    system: {
      runtime: 'Android 14 (API 34)',
      accessibilityStatus: 'Active',
      batteryOptimization: 'Unrestricted',
      targetApp: 'com.instagram.android',
    },
  };

  const jsonString = JSON.stringify(debugPayload, null, 2);

  const handleCopy = () => {
    navigator.clipboard?.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brainrot-debug-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#17131f] border border-[#2c2537] rounded-3xl p-6 sm:p-7 max-w-xl w-full space-y-5 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-zinc-400 hover:text-white rounded-full bg-white/5 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#b8ff3c] uppercase tracking-wider mb-1">
            <FileJson className="w-4 h-4" />
            Diagnostic Telemetry
          </div>
          <h3 className="text-xl font-bold text-white">Debug Session Export</h3>
          <p className="text-xs text-zinc-400 mt-1">
            Local session events, timestamps, and sittings. Contains zero personal captions or messages.
          </p>
        </div>

        <div className="bg-[#0c0a10] border border-white/5 rounded-xl p-3 max-h-64 overflow-y-auto">
          <pre className="text-[11px] font-mono text-zinc-300 whitespace-pre-wrap">{jsonString}</pre>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 py-2.5 bg-[#242423] hover:bg-[#2d2d2c] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied to Clipboard' : 'Copy JSON'}
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 py-2.5 bg-[#f4533f] hover:bg-[#ff6957] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download Log File
          </button>
        </div>
      </div>
    </div>
  );
};
