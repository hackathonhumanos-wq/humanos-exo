/**
 * @file apps/extension/src/content/facebook.ts
 * @description Privacy-conscious content script estimating Facebook Reel transitions
 */
import { ReelsCounter } from '../tracking/reels-counter.ts';

const counter = new ReelsCounter();

function checkFacebookReelUrl() {
  const currentUrl = window.location.href;
  if (currentUrl.includes('/reel/') || currentUrl.includes('/watch/reels/')) {
    counter.registerFeedTransition(currentUrl, 'facebookReels');
  }
}

window.addEventListener('popstate', checkFacebookReelUrl);
let lastLocation = window.location.pathname;
setInterval(() => {
  if (window.location.pathname !== lastLocation) {
    lastLocation = window.location.pathname;
    checkFacebookReelUrl();
  }
}, 1000);

checkFacebookReelUrl();
