/**
 * @file apps/web/src/pages/AutomationsPage.tsx
 * @description Phase 10: Smart Focus Automations & Trigger-Action Workflow Engine
 */
import React, { useState, useEffect } from 'react';
import {
  Zap,
  Sliders,
  Check,
  Plus,
  Play,
  Trash2,
  Clock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Target,
  Bell,
} from 'lucide-react';
import {
  AutomationRule,
  AutomationTriggerType,
  AutomationActionType,
} from '../../../../packages/shared-types/src/index.ts';

export const AutomationsPage: React.FC = () => {
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [trigger, setTrigger] = useState<AutomationTriggerType>('REEL_COUNT_EXCEEDED');
  const [triggerThreshold, setTriggerThreshold] = useState<number>(20);
  const [action, setAction] = useState<AutomationActionType>('SEND_DISMISSABLE_NUDGE');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const res = await fetch('/api/v1/automations').then(r => r.json());
      if (res.success) setRules(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleToggle = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/v1/automations/${ruleId}/toggle`, { method: 'PATCH' }).then(r => r.json());
      if (res.success) {
        setRules(rules.map(r => (r.id === ruleId ? res.data : r)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (ruleId: string) => {
    try {
      const res = await fetch(`/api/v1/automations/${ruleId}`, { method: 'DELETE' }).then(r => r.json());
      if (res.success) {
        setRules(rules.filter(r => r.id !== ruleId));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) return;

    try {
      setIsSubmitting(true);
      const res = await fetch('/api/v1/automations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, description, trigger, triggerThreshold: Number(triggerThreshold), action }),
      }).then(r => r.json());

      if (res.success) {
        setRules([...rules, res.data]);
        setShowCreateModal(false);
        setName('');
        setDescription('');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#171329] via-[#1c1731] to-[#131022] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#d480ff]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#d480ff]/10 text-[#d480ff] border border-[#d480ff]/20 text-xs font-mono font-semibold rounded-full flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" /> Phase 10: Autonomous Workflows
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Smart Focus Automations
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Set trigger rules that automatically protect your time. Zero friction, intelligent interventions when you need them most.
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 bg-[#b8ff3c] hover:bg-[#a8eb34] text-[#07060a] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(184,255,60,0.2)] flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Automation Rule</span>
          </button>
        </div>
      </div>

      {/* Automations Rules List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {rules.map(rule => (
          <div
            key={rule.id}
            className={`rounded-3xl border p-6 flex flex-col justify-between transition-all ${
              rule.isEnabled
                ? 'bg-[#12101a] border-[#2c2537] hover:border-[#3d344d]'
                : 'bg-[#0f0e16]/60 border-[#201c29] opacity-75'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-[#1e192c] text-[#b8ff3c] border border-[#342b4a]">
                  TRIGGER: {rule.trigger.replace('_', ' ')}
                </span>
                <button
                  onClick={() => handleToggle(rule.id)}
                  className={`text-sm font-bold flex items-center gap-1.5 transition-colors ${
                    rule.isEnabled ? 'text-[#b8ff3c]' : 'text-zinc-600'
                  }`}
                >
                  {rule.isEnabled ? (
                    <>
                      <ToggleRight className="w-7 h-7" />
                      <span className="text-[11px] font-mono">ACTIVE</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft className="w-7 h-7" />
                      <span className="text-[11px] font-mono">PAUSED</span>
                    </>
                  )}
                </button>
              </div>

              <h3 className="font-bold text-white text-base">{rule.name}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{rule.description}</p>

              <div className="mt-4 p-3 bg-[#0c0a10] rounded-2xl border border-[#231e30] space-y-1.5 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Threshold</span>
                  <span className="font-mono text-zinc-200">{rule.triggerThreshold} units</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span>Action</span>
                  <span className="font-mono text-emerald-400 font-bold">{rule.action}</span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#231e30] flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono">Fired {rule.executionCount} times</span>
              <button
                onClick={() => handleDelete(rule.id)}
                className="text-zinc-600 hover:text-rose-400 transition-colors p-1"
                title="Delete rule"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Create Rule Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#141220] border border-[#2c2537] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 relative">
            <h3 className="text-xl font-bold text-white">Create Smart Automation</h3>

            <form onSubmit={handleCreateRule} className="space-y-4">
              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">RULE NAME</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Exam Mode Strict Shield"
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#b8ff3c]"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">DESCRIPTION</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Explain when and what this automation does"
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#b8ff3c]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">TRIGGER EVENT</label>
                  <select
                    value={trigger}
                    onChange={e => setTrigger(e.target.value as any)}
                    className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#b8ff3c]"
                  >
                    <option value="REEL_COUNT_EXCEEDED">Reel Scroll Exceeded</option>
                    <option value="DAILY_GOAL_MET">Daily Goal Met</option>
                    <option value="STREAK_AT_RISK">Streak At Risk</option>
                    <option value="BEDTIME_APPROACHING">Bedtime Approaching</option>
                    <option value="FOCUS_SESSION_COMPLETED">Focus Session Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-mono text-zinc-400 block mb-1">THRESHOLD VALUE</label>
                  <input
                    type="number"
                    value={triggerThreshold}
                    onChange={e => setTriggerThreshold(Number(e.target.value))}
                    className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#b8ff3c]"
                    min={1}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono text-zinc-400 block mb-1">AUTONOMOUS ACTION</label>
                <select
                  value={action}
                  onChange={e => setAction(e.target.value as any)}
                  className="w-full bg-[#0c0a10] border border-[#2c2537] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#b8ff3c]"
                >
                  <option value="SEND_DISMISSABLE_NUDGE">Send Dismissable Gentle Nudge</option>
                  <option value="ACTIVATE_STRICT_BLOCKER">Activate Strict Blocker Lockdown</option>
                  <option value="AWARD_BONUS_XP">Award Bonus XP & Streak Shield</option>
                  <option value="SCHEDULE_CALENDAR_BREAK">Schedule 10m Calendar Break</option>
                  <option value="NOTIFY_COACH">Notify AI Focus Coach</option>
                </select>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 bg-[#1b172a] text-zinc-400 hover:text-white rounded-xl text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 bg-[#b8ff3c] hover:bg-[#a8eb34] text-[#07060a] font-bold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Deploy Rule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
