/**
 * @file apps/web/src/pages/AIAgentCenterPage.tsx
 * @description Light-theme AI Study Specialists Hub connected to /api/v1/ai-agents/*
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Bot, CheckCircle2, Sparkles } from 'lucide-react';
import { apiClient } from '../services/apiClient.ts';
import type {
  AgentMetadata,
  AgentActionStep,
  AgentAutonomyLevel,
} from '../../../../packages/shared-types/src/index.ts';
import { EmptyState } from '../components/ui/EmptyState.tsx';

export const AIAgentCenterPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [actions, setActions] = useState<AgentActionStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [ag, act] = await Promise.all([apiClient.getAgents(), apiClient.getAgentActions()]);
      setAgents(ag);
      setActions(act);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load study specialists.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgents();
  }, [loadAgents]);

  const handleAutonomyChange = async (agentId: AgentMetadata['id'], level: AgentAutonomyLevel) => {
    const updated = await apiClient.updateAgentAutonomy(agentId, level);
    setAgents((prev) => prev.map((a) => (a.id === agentId ? updated : a)));
  };

  const handleApproveAction = async (actionId: string) => {
    await apiClient.approveAgentAction(actionId);
    await loadAgents();
  };

  if (loading) {
    return (
      <EmptyState
        variant="loading"
        title="Loading Study Specialists"
        description="Syncing your advisory study planner, focus coach, and wellbeing modules..."
      />
    );
  }

  if (error) {
    return (
      <EmptyState
        variant="error"
        title="Study specialists unavailable"
        description={error}
        actionLabel="Retry"
        onAction={loadAgents}
      />
    );
  }

  return (
    <div className="space-y-6 pb-6">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-[#142647]">
          AI Study Specialists Hub
        </h1>
        <p className="text-sm text-[#4A607A] mt-1">
          Configure autonomy levels and review proposed study schedule adjustments before they apply.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <div key={agent.id} className="ff-card p-5 flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#E9F9F2] text-[#079669] flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#DDF7EC] text-[#079669]">
                  {agent.status}
                </span>
              </div>
              <h2 className="font-display text-base font-bold text-[#142647]">{agent.name}</h2>
              <p className="text-xs text-[#5A708D] leading-relaxed">{agent.description}</p>
            </div>

            <div>
              <label
                htmlFor={`autonomy-${agent.id}`}
                className="block text-[11px] font-bold text-[#334B68] mb-1"
              >
                Supervision Mode
              </label>
              <select
                id={`autonomy-${agent.id}`}
                value={agent.autonomyLevel}
                onChange={(e) =>
                  handleAutonomyChange(agent.id, e.target.value as AgentAutonomyLevel)
                }
                className="w-full px-3 py-2 rounded-xl bg-[#F7FCFA] border border-[#E1EEE9] text-xs font-semibold text-[#142647]"
              >
                <option value="SUPERVISED">Ask Before Every Change</option>
                <option value="SEMI_AUTONOMOUS">Semi-Autonomous Suggestions</option>
                <option value="FULL_ADVISORY">Advisory Insights Only</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      <div className="ff-card p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#079669]" />
          <h2 className="font-display text-lg font-bold text-[#142647]">
            Proposed Study Adjustments
          </h2>
        </div>

        <div className="space-y-3">
          {actions.map((step) => (
            <div
              key={step.id}
              className="p-4 rounded-2xl bg-[#F7FCFA] border border-[#E1EEE9] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="text-xs font-bold text-[#142647]">{step.action}</div>
                <p className="text-xs text-[#4A607A]">{step.outputSummary}</p>
              </div>
              {step.requiresUserApproval && !step.isApproved ? (
                <button
                  type="button"
                  onClick={() => handleApproveAction(step.id)}
                  className="px-4 py-2 rounded-xl bg-[#079669] hover:bg-[#057A55] text-white text-xs font-bold shrink-0 cursor-pointer"
                >
                  Approve Adjustment
                </button>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs font-bold text-[#079669] shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                  Approved
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
