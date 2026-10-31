/**
 * @file apps/web/src/pages/AIAgentCenterPage.tsx
 * @description Phase 10: Multi-Agent AI Control Center, Autonomy Toggles & Autonomous Workflow Queue
 */
import React, { useState, useEffect } from 'react';
import {
  Bot,
  Sparkles,
  Shield,
  Cpu,
  CheckCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  Sliders,
  Calendar,
  Compass,
  ShieldAlert,
  Target,
  FileSpreadsheet,
  AlertCircle,
  Zap,
} from 'lucide-react';
import {
  AgentMetadata,
  AgentActionStep,
  MultiAgentSynthesisReport,
  AgentId,
  AgentAutonomyLevel,
} from '../../../../packages/shared-types/src/index.ts';

export const AIAgentCenterPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentMetadata[]>([]);
  const [actions, setActions] = useState<AgentActionStep[]>([]);
  const [synthesis, setSynthesis] = useState<MultiAgentSynthesisReport | null>(null);
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    try {
      setIsLoading(true);
      const [agentsRes, actionsRes, synRes] = await Promise.all([
        fetch('/api/v1/ai-agents/agents').then(r => r.json()),
        fetch('/api/v1/ai-agents/actions').then(r => r.json()),
        fetch('/api/v1/ai-agents/synthesis', { method: 'POST' }).then(r => r.json()),
      ]);

      if (agentsRes.success) setAgents(agentsRes.data);
      if (actionsRes.success) setActions(actionsRes.data);
      if (synRes.success) setSynthesis(synRes.data);
    } catch (e) {
      console.error('Error fetching agent data', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAutonomyChange = async (agentId: AgentId, level: AgentAutonomyLevel) => {
    try {
      const res = await fetch(`/api/v1/ai-agents/agents/${agentId}/autonomy`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ autonomyLevel: level }),
      }).then(r => r.json());

      if (res.success) {
        setAgents(agents.map(a => (a.id === agentId ? res.data : a)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleApproveAction = async (actionId: string) => {
    try {
      const res = await fetch(`/api/v1/ai-agents/actions/${actionId}/approve`, {
        method: 'POST',
      }).then(r => r.json());

      if (res.success) {
        setActions(actions.map(a => (a.id === actionId ? { ...a, isApproved: true } : a)));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRunSynthesis = async () => {
    try {
      setIsSynthesizing(true);
      const res = await fetch('/api/v1/ai-agents/synthesis', { method: 'POST' }).then(r => r.json());
      if (res.success) {
        setSynthesis(res.data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSynthesizing(false);
    }
  };

  const getAgentIcon = (id: AgentId) => {
    switch (id) {
      case 'study_planner':
        return Calendar;
      case 'focus_coach':
        return Compass;
      case 'wellbeing_agent':
        return ShieldAlert;
      case 'productivity_analyst':
        return TrendingUp;
      case 'goal_optimizer':
        return Target;
      case 'report_generator':
        return FileSpreadsheet;
      default:
        return Bot;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#171329] via-[#1c1731] to-[#131022] border border-[#2c2537] rounded-3xl p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#b8ff3c]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#b8ff3c]/10 text-[#b8ff3c] border border-[#b8ff3c]/20 text-xs font-mono font-semibold rounded-full flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5" /> Phase 10: Multi-Agent AI Architecture
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Autonomous AI Agent Control Center
            </h1>
            <p className="text-zinc-400 text-sm mt-1 max-w-2xl">
              Six dedicated AI sub-agents working together in an asynchronous swarm to safeguard focus, optimize study velocity, and eliminate late-night scrolling.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunSynthesis}
              disabled={isSynthesizing}
              className="px-4 py-2.5 bg-[#b8ff3c] hover:bg-[#a8eb34] text-[#07060a] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(184,255,60,0.2)] flex items-center gap-2 disabled:opacity-50"
            >
              <Zap className="w-4 h-4" />
              <span>{isSynthesizing ? 'Synthesizing...' : 'Run Swarm Synthesis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 6 Specialized Agents Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#b8ff3c]" /> Specialized AI Agent Swarm
          </h2>
          <span className="text-xs font-mono text-zinc-400">{agents.length} Agents Online</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agents.map(agent => {
            const Icon = getAgentIcon(agent.id);
            return (
              <div
                key={agent.id}
                className="bg-[#12101a] border border-[#2c2537] rounded-3xl p-5 flex flex-col justify-between hover:border-[#3d344d] transition-all space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#1e192c] border border-[#342b4a] text-[#b8ff3c] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {agent.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-white text-base">{agent.name}</h3>
                  <div className="text-xs text-[#b8ff3c] font-medium mt-0.5">{agent.role}</div>
                  <p className="text-xs text-zinc-400 mt-2 leading-relaxed">{agent.description}</p>
                </div>

                {/* Autonomy Selector */}
                <div className="pt-3 border-t border-[#231e30] space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                    <span>AUTONOMY LEVEL</span>
                    <span className="text-white font-bold">{agent.autonomyLevel}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 p-1 bg-[#0c0a10] rounded-xl border border-[#2c2537]">
                    {(['SUPERVISED', 'SEMI_AUTONOMOUS', 'FULL_ADVISORY'] as AgentAutonomyLevel[]).map(
                      level => (
                        <button
                          key={level}
                          onClick={() => handleAutonomyChange(agent.id, level)}
                          className={`py-1 text-[9px] font-mono font-bold rounded-lg transition-colors truncate px-1 ${
                            agent.autonomyLevel === level
                              ? 'bg-[#1e192c] text-[#b8ff3c] shadow-sm'
                              : 'text-zinc-500 hover:text-zinc-300'
                          }`}
                        >
                          {level.replace('_', ' ')}
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Synthesis Report & Action Approval Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Swarm Synthesis Report (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-[#49e6ff]" /> Weekly Multi-Agent Executive Brief
            </h2>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold rounded-full">
              GRADE {synthesis?.overallProductivityGrade || 'A'}
            </span>
          </div>

          <div className="bg-[#12101a] border border-[#2c2537] rounded-3xl p-6 space-y-5">
            <div className="text-xs text-zinc-300 leading-relaxed bg-[#191526] p-4 rounded-2xl border border-[#2c2537]">
              {synthesis?.executiveSummary}
            </div>

            <div className="space-y-3">
              <div className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider">
                Cross-Agent Perspectives:
              </div>
              {synthesis?.agentPerspectives.map(p => (
                <div key={p.agentId} className="bg-[#0c0a10] border border-[#241e30] rounded-2xl p-4 space-y-1.5">
                  <div className="text-xs font-bold text-[#b8ff3c]">{p.agentName}</div>
                  <div className="text-xs text-zinc-400">
                    <strong className="text-zinc-300">Observation:</strong> {p.keyObservation}
                  </div>
                  <div className="text-xs text-emerald-400 font-medium">
                    🎯 <strong>Directive:</strong> {p.actionableDirective}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Autonomous Action Queue & Human Approval (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-[#d480ff]" /> Autonomous Action Queue
          </h2>
          <p className="text-xs text-zinc-400">
            High-impact agent proposals requiring human-in-the-loop student consent.
          </p>

          <div className="space-y-3">
            {actions.map(action => (
              <div
                key={action.id}
                className="bg-[#12101a] border border-[#2c2537] rounded-2xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400 uppercase">
                    Agent: {action.agentId.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono text-[#b8ff3c] bg-[#b8ff3c]/10 px-2 py-0.5 rounded-md">
                    {Math.round(action.confidenceScore * 100)}% Confidence
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white">{action.action}</h4>
                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{action.outputSummary}</p>
                </div>

                <div className="pt-2 border-t border-[#231e30] flex items-center justify-between">
                  {action.isApproved ? (
                    <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Approved & Executed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleApproveAction(action.id)}
                      className="px-3.5 py-1.5 bg-[#b8ff3c] hover:bg-[#a8eb34] text-[#07060a] font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Approve Action
                    </button>
                  )}
                  <span className="text-[10px] font-mono text-zinc-500">
                    {action.requiresUserApproval ? 'Supervised' : 'Autonomous'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
