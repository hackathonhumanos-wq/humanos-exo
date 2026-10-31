/**
 * @file apps/api/src/services/automationService.ts
 * @description Smart focus automations engine executing autonomous rules & triggers
 */
import type {
  AutomationRule,
  AutomationTriggerType,
  AutomationActionType,
} from '../../../../packages/shared-types/src/index.ts';

class AutomationService {
  private rules: AutomationRule[] = [
    {
      id: 'auto-1',
      userId: 'usr-student-demo',
      name: 'Doomscroll Friction Shield',
      description: 'Trigger a non-intrusive full-screen breath reminder when reel transitions exceed 20 in a day.',
      trigger: 'REEL_COUNT_EXCEEDED',
      triggerThreshold: 20,
      action: 'SEND_DISMISSABLE_NUDGE',
      isEnabled: true,
      executionCount: 14,
      lastExecutedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    },
    {
      id: 'auto-2',
      userId: 'usr-student-demo',
      name: 'Bedtime Deep Sleep Lockdown',
      description: 'Automatically engage strict site blocking for distracting feeds after 22:30.',
      trigger: 'BEDTIME_APPROACHING',
      triggerThreshold: 22,
      action: 'ACTIVATE_STRICT_BLOCKER',
      isEnabled: true,
      executionCount: 22,
      lastExecutedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 'auto-3',
      userId: 'usr-student-demo',
      name: 'Daily Focus Goal Celebration',
      description: 'Award +50 bonus XP and trigger confetti notification when 120 study minutes are achieved.',
      trigger: 'DAILY_GOAL_MET',
      triggerThreshold: 120,
      action: 'AWARD_BONUS_XP',
      isEnabled: true,
      executionCount: 9,
      lastExecutedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 'auto-4',
      userId: 'usr-student-demo',
      name: 'Active Recall Pacing Nudge',
      description: 'Notify AI Focus Coach to suggest an eye-strain and hydration break after 3 consecutive sessions.',
      trigger: 'FOCUS_SESSION_COMPLETED',
      triggerThreshold: 3,
      action: 'NOTIFY_COACH',
      isEnabled: false,
      executionCount: 3,
      lastExecutedAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
  ];

  public getRules(): AutomationRule[] {
    return this.rules;
  }

  public createRule(data: {
    name: string;
    description: string;
    trigger: AutomationTriggerType;
    triggerThreshold: number;
    action: AutomationActionType;
    isEnabled?: boolean;
  }): AutomationRule {
    const newRule: AutomationRule = {
      id: `auto-${Date.now()}`,
      userId: 'usr-student-demo',
      name: data.name,
      description: data.description,
      trigger: data.trigger,
      triggerThreshold: data.triggerThreshold,
      action: data.action,
      isEnabled: data.isEnabled !== false,
      executionCount: 0,
    };
    this.rules.push(newRule);
    return newRule;
  }

  public toggleRule(id: string): AutomationRule | null {
    const rule = this.rules.find(r => r.id === id);
    if (!rule) return null;
    rule.isEnabled = !rule.isEnabled;
    return rule;
  }

  public deleteRule(id: string): boolean {
    const index = this.rules.findIndex(r => r.id === id);
    if (index === -1) return false;
    this.rules.splice(index, 1);
    return true;
  }
}

export const automationService = new AutomationService();
