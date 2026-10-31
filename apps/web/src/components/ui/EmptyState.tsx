/**
 * @file apps/web/src/components/ui/EmptyState.tsx
 * @description Resilient loading, empty, unavailable, and error state presenter
 */
import React from 'react';
import { AlertCircle, Inbox, PauseCircle, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  variant?: 'empty' | 'error' | 'unavailable' | 'loading';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  variant = 'empty',
  title,
  description,
  actionLabel,
  onAction,
}) => {
  if (variant === 'loading') {
    return (
      <div className="ff-card p-8 space-y-4" aria-busy="true" aria-live="polite">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#E9F6F0] animate-pulse" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-44 rounded-lg bg-[#E9F6F0] animate-pulse" />
            <div className="h-3 w-72 max-w-full rounded-lg bg-[#F1F9F5] animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="h-24 rounded-2xl bg-[#F2FAF6] animate-pulse" />
          <div className="h-24 rounded-2xl bg-[#F2FAF6] animate-pulse" />
          <div className="h-24 rounded-2xl bg-[#F2FAF6] animate-pulse" />
        </div>
      </div>
    );
  }

  const Icon =
    variant === 'error'
      ? AlertCircle
      : variant === 'unavailable'
        ? PauseCircle
        : Inbox;

  const iconStyle =
    variant === 'error'
      ? 'bg-rose-50 text-rose-600 border-rose-200'
      : variant === 'unavailable'
        ? 'bg-amber-50 text-amber-600 border-amber-200'
        : 'bg-[#E9F9F2] text-[#079669] border-[#CBEFE0]';

  return (
    <div
      role={variant === 'error' ? 'alert' : 'status'}
      className="ff-card p-8 text-center flex flex-col items-center justify-center max-w-xl mx-auto my-2"
    >
      <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center mb-3.5 ${iconStyle}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-lg font-bold text-[#142647]">{title}</h3>
      <p className="text-sm text-[#5A708D] mt-1.5 max-w-md leading-relaxed">{description}</p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold cursor-pointer shadow-xs"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
