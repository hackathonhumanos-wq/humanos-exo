/**
 * @file apps/web/src/pages/FocusPage.tsx
 * @description Light-theme Focus Sessions page with interactive timer and completed session log
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Clock, Award, CheckCircle2 } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type { DashboardOverviewData } from '../../../../packages/shared-types/src/index.ts';
import { FocusTimerWidget } from '../components/ui/FocusTimerWidget.tsx';
import { EmptyState } from '../components/ui/EmptyState.tsx';

interface FocusPageProps {
  onSessionLogged?: () => void;
  autoStart?: boolean;
  onAutoStartConsumed?: () => void;
}

export const FocusPage: React.FC<FocusPageProps> = ({
  onSessionLogged,
  autoStart = false,
  onAutoStartConsumed,
}) => {
  const [overview, setOverview] = useState<DashboardOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSessions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiClient.getOverview();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load focus session history.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  const handleLogged = () => {
    loadSessions();
    onSessionLogged?.();
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          Focus Sessions
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          Run structured Pomodoro, Deep Study, or Exam Mock blocks while shielding distracting feeds.
        </p>
      </div>

      <FocusTimerWidget
        onSessionLogged={handleLogged}
        autoStart={autoStart}
        onAutoStartConsumed={onAutoStartConsumed}
      />

      <section className="ff-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#079669]" />
            <h2 className="font-display text-lg font-bold text-[#142647]">
              Recent Completed Focus Sessions
            </h2>
          </div>
          {overview && (
            <span className="text-xs font-bold text-[#079669] tabular-nums">
              {overview.focusMinutesToday} min logged today
            </span>
          )}
        </div>

        {loading && !overview ? (
          <EmptyState
            variant="loading"
            title="Loading session log"
            description="Fetching your recent study blocks..."
          />
        ) : error ? (
          <EmptyState
            variant="error"
            title="Could not load session history"
            description={error}
            actionLabel="Retry"
            onAction={loadSessions}
          />
        ) : !overview || overview.recentSessions.length === 0 ? (
          <EmptyState
            variant="empty"
            title="No focus sessions logged yet"
            description="Start a 25-minute Pomodoro above to earn XP and build your daily study streak."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overview.recentSessions.map((session) => (
              <div
                key={session.id}
                className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] flex items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#142647]">{session.subject}</span>
                      {session.isDemo && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#EBF3FF] text-[#2563EB]">
                          [DEMO]
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#5A708D] tabular-nums">
                      {session.mode.replace('_', ' ')} • {session.durationMinutes} min •{' '}
                      {new Date(session.completedAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
                <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#DDF7EC] text-[#079669] text-xs font-bold tabular-nums shrink-0">
                  <Award className="w-3.5 h-3.5" />
                  <span>+{session.xpEarned} XP</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
