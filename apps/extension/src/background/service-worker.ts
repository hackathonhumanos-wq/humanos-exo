/**
 * @file apps/extension/src/background/service-worker.ts
 * @description Manifest V3 Background Service Worker for FOCUSFLOW
 */
import { UsageManager } from '../tracking/usage-manager.ts';
import { ScreenCounter } from '../tracking/screen-counter.ts';
import { WebsiteBlocker } from '../blocking/blocker.ts';
import { ExtensionStorage } from '../storage/extension-storage.ts';

const usageManager = new UsageManager();
const screenCounter = new ScreenCounter();

// Set periodic alarm for usage flushing and telemetry sync
chrome.alarms.create('FOCUSFLOW_SYNC_TICK', { periodInMinutes: 1 });

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === 'FOCUSFLOW_SYNC_TICK') {
    const elapsed = screenCounter.getElapsedActiveSeconds();
    usageManager.recordTick(elapsed);
    usageManager.flush().catch(() => {});
  }
});

// Tab switch listener to track active domain without inspecting page content
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    usageManager.switchActiveDomain(tab?.url);
  });
});

// URL update within same tab
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.active) {
    usageManager.switchActiveDomain(tab.url);
  }
});

// Idle listener for screen time accuracy
chrome.idle.onStateChanged.addListener(newState => {
  screenCounter.setIdleState(newState);
});

// Message listener from content scripts & popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'REEL_ESTIMATE_INCREMENTED') {
    // Update badge with today's reel estimate
    chrome.action.setBadgeText({ text: String(message.totalToday) });
    chrome.action.setBadgeBackgroundColor({ color: '#f4533f' });
    sendResponse({ acknowledged: true });
  }

  if (message.type === 'TOGGLE_BLOCKER') {
    ExtensionStorage.getPreferences().then(prefs => {
      WebsiteBlocker.updateBlocklist(prefs.blockedDomains, message.enabled);
      sendResponse({ enabled: message.enabled });
    });
    return true; // Keep channel open for async response
  }
});

console.log('[FOCUSFLOW] Background Service Worker initialized.');
