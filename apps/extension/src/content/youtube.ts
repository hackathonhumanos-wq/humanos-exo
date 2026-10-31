/**
 * @file apps/extension/src/content/youtube.ts
 * @description Privacy-conscious content script estimating YouTube Shorts transitions
 */
import { ReelsCounter } from '../tracking/reels-counter.ts';

const counter = new ReelsCounter();

function checkShortsUrl() {
  const currentUrl = window.location.href;
  if (currentUrl.includes('/shorts/')) {
    counter.registerFeedTransition(currentUrl, 'youtubeShorts');
  }
}

// Observe URL changes on YouTube's SPA router
window.addEventListener('yt-navigate-finish', checkShortsUrl);
window.addEventListener('popstate', checkShortsUrl);
checkShortsUrl();
