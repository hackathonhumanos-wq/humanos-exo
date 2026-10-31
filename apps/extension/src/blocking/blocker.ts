/**
 * @file apps/extension/src/blocking/blocker.ts
 * @description Manages website blocking rules using Chrome Declarative Net Request API
 */

export class WebsiteBlocker {
  private static readonly RULE_ID_OFFSET = 1000;

  public static async updateBlocklist(domains: string[], isEnabled: boolean): Promise<void> {
    if (typeof chrome === 'undefined' || !chrome.declarativeNetRequest) {
      console.log('[FOCUSFLOW Blocker] DeclarativeNetRequest not available outside extension environment');
      return;
    }

    // Clear existing dynamic rules first
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    const ruleIdsToRemove = existingRules.map(r => r.id);

    if (!isEnabled || domains.length === 0) {
      await chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: ruleIdsToRemove,
      });
      return;
    }

    const newRules: chrome.declarativeNetRequest.Rule[] = domains.map((domain, index) => ({
      id: this.RULE_ID_OFFSET + index,
      priority: 1,
      action: {
        type: 'block' as chrome.declarativeNetRequest.RuleActionType.BLOCK,
      },
      condition: {
        urlFilter: `||${domain}^`,
        resourceTypes: ['main_frame' as chrome.declarativeNetRequest.ResourceType.MAIN_FRAME],
      },
    }));

    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove,
      addRules: newRules,
    });
  }
}
