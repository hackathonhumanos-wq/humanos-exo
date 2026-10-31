/**
 * @file apps/web/src/pages/AutomationsPage.tsx
 * @description Light-theme Smart Study Automations page connected to /api/v1/automations
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Zap, Plus, Trash2 } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  AutomationRule,
  AutomationTriggerType,
  AutomationActionType,
} from '../../../../packages/shared-types/src/index.ts';
import { EmptyState } from '../components/ui/EmptyState.tsx';
import { ConfirmDialog } from '../components/ui/ConfirmDialog.tsx';

export const AutomationsPage: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState<AutomationTriggerType>('REEL_COUNT_EXCEEDED');
  const [threshold, setThreshold] = useState(30);
  const [action, setAction] = useState<AutomationActionType>('SEND_DISMISSABLE_NUDGE');
  const [ruleToDelete, setRuleToDelete] = useState<AutomationRule | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadRules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await apiClient.getAutomations();
      setRules(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load automations.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRules();
  }, [loadRules]);

  const handleToggle = async (id: string) => {
    const updated = await apiClient.toggleAutomation(id);
    setRules((prev) => prev.map((r) => (r.id === id ? updated : r)));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const created = await apiClient.createAutomation({
      name: name.trim(),
      description: `Automated student rule when ${trigger} reaches ${threshold}.`,
      trigger,
      triggerThreshold: threshold,
      action,
    });
    setRules((prev) => [created, ...prev]);
    setName('');
  };

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;
    await apiClient.deleteAutomation(ruleToDelete.id);
    setRules((prev) => prev.filter((r) => r.id !== ruleToDelete.id));
    setRuleToDelete(null);
  };

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          Smart Focus Automations
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          Set automatic gentle nudges, study break reminders, or short-form shields when thresholds are met.
        </p>
      </div>

      <form onSubmit={handleCreate} className="ff-card p-6 grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
        <div className="md:col-span-4">
          <label htmlFor="auto-name" className="block text-xs font-bold text-[#334B68] mb-1">
            Rule Name
          </label>
          <input
            id="auto-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Evening Reels Wind-Down"
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs text-[#142647]"
            required
          />
        </div>
        <div className="md:col-span-3">
          <label htmlFor="auto-trigger" className="block text-xs font-bold text-[#334B68] mb-1">
            When Triggered
          </label>
          <select
            id="auto-trigger"
            value={trigger}
            onChange={(e) => setTrigger(e.target.value as AutomationTriggerType)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-semibold text-[#142647]"
          >
            <option value="REEL_COUNT_EXCEEDED">Estimated Reels Exceeded</option>
            <option value="FOCUS_SESSION_COMPLETED">Focus Session Completed</option>
            <option value="BEDTIME_APPROACHING">Bedtime Approaching</option>
            <option value="DAILY_GOAL_MET">Daily Goal Met</option>
          </select>
        </div>
        <div className="md:col-span-3">
          <label htmlFor="auto-action" className="block text-xs font-bold text-[#334B68] mb-1">
            Then Perform
          </label>
          <select
            id="auto-action"
            value={action}
            onChange={(e) => setAction(e.target.value as AutomationActionType)}
            className="w-full px-3 py-2.5 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-semibold text-[#142647]"
          >
            <option value="SEND_DISMISSABLE_NUDGE">Show Gentle Study Nudge</option>
            <option value="ACTIVATE_STRICT_BLOCKER">Activate Focus Shield</option>
            <option value="SCHEDULE_CALENDAR_BREAK">Schedule 5m Break</option>
            <option value="AWARD_BONUS_XP">Award Bonus XP</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full py-2.5 px-4 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Rule</span>
          </button>
        </div>
      </form>

      {loading ? (
        <EmptyState
          variant="loading"
          title="Loading Automations"
          description="Syncing your active habit guardrails..."
        />
      ) : error ? (
        <EmptyState
          variant="error"
          title="Automations unavailable"
          description={error}
          actionLabel="Retry"
          onAction={loadRules}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rules.map((rule) => (
            <div key={rule.id} className="ff-card p-5 flex flex-col justify-between gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-display text-base font-bold text-[#142647]">{rule.name}</h2>
                    <p className="text-xs text-[#5A708D] mt-0.5">{rule.description}</p>
                  </div>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-checked={rule.isEnabled}
                  aria-label={`Toggle ${rule.name}`}
                  onClick={() => handleToggle(rule.id)}
                  className={`relative inline-flex h-6 w-11 shrink-0 rounded-full border-2 border-transparent cursor-pointer ${
                    rule.isEnabled ? 'bg-[#079669]' : 'bg-[#CBDAD4]'
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-xs transition-transform ${
                      rule.isEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E1EEE9] text-xs">
                <span className="text-[#5A708D] tabular-nums">
                  Triggered {rule.executionCount} times
                </span>
                <button
                  type="button"
                  onClick={() => setRuleToDelete(rule)}
                  aria-label={`Delete ${rule.name}`}
                  className="text-[#6C819C] hover:text-rose-600 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={Boolean(ruleToDelete)}
        title="Delete Automation Rule?"
        description={ruleToDelete ? `Remove "${ruleToDelete.name}"?` : ''}
        confirmLabel="Delete Rule"
        tone="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => setRuleToDelete(null)}
      />
    </div>
  );
};
