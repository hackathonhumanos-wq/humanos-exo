/**
 * @file apps/api/src/services/ai/agentOrchestrator.ts
 * @description Multi-Agent AI Architecture coordinating 6 specialized autonomous productivity agents
 */
import type {
  AgentId,
  AgentMetadata,
  AgentActionStep,
  MultiAgentSynthesisReport,
  AgentAutonomyLevel,
} from '../../../../../packages/shared-types/src/index.ts';

class AgentOrchestrator {
  private agents: AgentMetadata[] = [
    {
      id: 'study_planner',
      name: 'Study Planner Agent',
      role: 'Curriculum & Workload Strategist',
      description: 'Aligns exam deadlines, syllabus topics, and daily focus blocks into realistic agendas.',
      avatarIcon: 'Calendar',
      autonomyLevel: 'SEMI_AUTONOMOUS',
      status: 'ONLINE',
      lastRunTimestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'focus_coach',
      name: 'Focus Coach Agent',
      role: 'Real-time Session Companion',
      description: 'Provides cognitive reframing, Pomodoro pacing, and mid-session encouragement.',
      avatarIcon: 'Compass',
      autonomyLevel: 'FULL_ADVISORY',
      status: 'ONLINE',
      lastRunTimestamp: new Date(Date.now() - 1800000).toISOString(),
    },
    {
      id: 'wellbeing_agent',
      name: 'Digital Wellbeing Agent',
      role: 'Doomscrolling & Fatigue Defender',
      description: 'Monitors short-form video transition velocity and activates evening friction shields.',
      avatarIcon: 'ShieldAlert',
      autonomyLevel: 'SEMI_AUTONOMOUS',
      status: 'ONLINE',
      lastRunTimestamp: new Date(Date.now() - 900000).toISOString(),
    },
    {
      id: 'productivity_analyst',
      name: 'Productivity Analyst',
      role: 'Quantitative Velocity Evaluator',
      description: 'Synthesizes weekly focus completion rates, subject ratios, and distraction trends.',
      avatarIcon: 'TrendingUp',
      autonomyLevel: 'FULL_ADVISORY',
      status: 'ONLINE',
      lastRunTimestamp: new Date(Date.now() - 7200000).toISOString(),
    },
    {
      id: 'goal_optimizer',
      name: 'Goal Optimizer',
      role: 'Dynamic Target Calibrator',
      description: 'Adjusts daily minute goals up or down based on fatigue indices and momentum.',
      avatarIcon: 'Target',
      autonomyLevel: 'SUPERVISED',
      status: 'ONLINE',
      lastRunTimestamp: new Date(Date.now() - 14400000).toISOString(),
    },
    {
      id: 'report_generator',
      name: 'Report Generator Agent',
      role: 'Executive Progress Chronicler',
      description: 'Compiles formal weekly student synthesis reports and aggregate counsellor briefs.',
      avatarIcon: 'FileSpreadsheet',
      autonomyLevel: 'FULL_ADVISORY',
      status: 'ONLINE',
      lastRunTimestamp: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  private actionLogs: AgentActionStep[] = [
    {
      id: 'act-1',
      agentId: 'study_planner',
      action: 'Rebalanced Thursday Schedule',
      inputSummary: 'Upcoming Algorithms Midterm in 9 days; completed DSA hours at 62%',
      outputSummary: 'Added 90m high-energy morning block for Dynamic Programming on Trees',
      confidenceScore: 0.94,
      requiresUserApproval: false,
      isApproved: true,
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
    },
    {
      id: 'act-2',
      agentId: 'wellbeing_agent',
      action: 'Prepared Bedtime Scroll Shield',
      inputSummary: 'Detected 45 transitions across Instagram Reels after 22:30 yesterday',
      outputSummary: 'Proposed activating gentle 5-minute wind-down notice starting 22:15 tonight',
      confidenceScore: 0.91,
      requiresUserApproval: true,
      isApproved: true,
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    },
    {
      id: 'act-3',
      agentId: 'goal_optimizer',
      action: 'Recommended Goal Recalibration',
      inputSummary: 'Consecutive 7-day streak maintained with average 125m daily focus',
      outputSummary: 'Suggest increasing daily target from 100m to 115m to earn Bonus XP badge',
      confidenceScore: 0.88,
      requiresUserApproval: true,
      isApproved: false,
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: 'act-4',
      agentId: 'productivity_analyst',
      action: 'Weekly Velocity Benchmark Computed',
      inputSummary: '14.5 hours of focus logged across 18 sessions this week',
      outputSummary: 'Focus velocity increased +19% compared to previous 7-day period',
      confidenceScore: 0.98,
      requiresUserApproval: false,
      isApproved: true,
      timestamp: new Date(Date.now() - 1800000).toISOString(),
    },
  ];

  public getAgents(): AgentMetadata[] {
    return this.agents;
  }

  public updateAgentAutonomy(agentId: AgentId, level: AgentAutonomyLevel): AgentMetadata | null {
    const agent = this.agents.find(a => a.id === agentId);
    if (!agent) return null;
    agent.autonomyLevel = level;
    return agent;
  }

  public getActionLogs(): AgentActionStep[] {
    return this.actionLogs;
  }

  public approveAction(actionId: string): AgentActionStep | null {
    const action = this.actionLogs.find(a => a.id === actionId);
    if (!action) return null;
    action.isApproved = true;
    return action;
  }

  public runMultiAgentSynthesis(): MultiAgentSynthesisReport {
    return {
      id: `syn-${Date.now()}`,
      generatedAt: new Date().toISOString(),
      overallProductivityGrade: 'A',
      executiveSummary:
        'Multi-Agent analysis confirms strong cognitive focus consistency. Study sessions showed high completion (91%), while short-form video transitions dropped 24.5% week-over-week. The prime area for optimization remains the 22:15–00:30 late evening dopamine trap.',
      agentPerspectives: [
        {
          agentId: 'study_planner',
          agentName: 'Study Planner Agent',
          keyObservation: 'Algorithms exam is 9 days away; student is tracking at 7.5 of 12 planned hours.',
          actionableDirective: 'Front-load tomorrow morning with two 45-minute Deep Work blocks for Tree DP.',
        },
        {
          agentId: 'focus_coach',
          agentName: 'Focus Coach Agent',
          keyObservation: 'Student maintained uninterrupted 50-minute Pomodoros during afternoon blocks.',
          actionableDirective: 'Maintain current 50/10 cadence; avoid extending past 60m to prevent afternoon cognitive fatigue.',
        },
        {
          agentId: 'wellbeing_agent',
          agentName: 'Digital Wellbeing Agent',
          keyObservation: 'Late-night reel scrolling declined by 38 minutes on nights where bedtime lock was enabled.',
          actionableDirective: 'Keep Bedtime Friction Shield active at 22:15 with audio wind-down trigger.',
        },
        {
          agentId: 'productivity_analyst',
          agentName: 'Productivity Analyst',
          keyObservation: 'Productivity velocity index reached 84/100, ranking in top 8% of student cohort.',
          actionableDirective: 'Lock in 7-day streak to unlock Master Strategist milestone badge.',
        },
      ],
      autonomousActionsProposed: this.actionLogs.filter(a => a.requiresUserApproval && !a.isApproved),
    };
  }
}

export const agentOrchestrator = new AgentOrchestrator();
