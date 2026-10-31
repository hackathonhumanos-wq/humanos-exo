/**
 * @file apps/extension/src/content/instagram.ts
 * @description Privacy-conscious content script estimating Instagram Reel transitions
 */
import { ReelsCounter } from '../tracking/reels-counter.ts';

const counter = new ReelsCounter();

function checkReelUrl() {
  const currentUrl = window.location.href;
  if (currentUrl.includes('/reels/') || currentUrl.includes('/reel/')) {
    counter.registerFeedTransition(currentUrl, 'instagramReels');
  }
}

// Observe URL changes in single-page application navigation
let lastPath = window.location.pathname;
const observer = new MutationObserver(() => {
  if (window.location.pathname !== lastPath) {
    lastPath = window.location.pathname;
    checkReelUrl();
  }
});

observer.observe(document, { subtree: true, childList: true });
checkReelUrl();
