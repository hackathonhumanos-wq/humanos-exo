import React, { useState, useEffect } from 'react';
import { ExtensionStorage, ExtensionPreferences } from '../storage/extension-storage.ts';

export const Popup: React.FC = () => {
  const [prefs, setPrefs] = useState<ExtensionPreferences | null>(null);
  const [blockingEnabled, setBlockingEnabled] = useState(false);

  useEffect(() => {
    ExtensionStorage.getPreferences().then(p => {
      setPrefs(p);
      setBlockingEnabled(p.blockDistractingSites);
    });
  }, []);

  const handleToggleBlocker = async () => {
    const next = !blockingEnabled;
    setBlockingEnabled(next);
    await ExtensionStorage.setPreferences({ blockDistractingSites: next });
    if (typeof chrome !== 'undefined' && chrome.runtime?.sendMessage) {
      chrome.runtime.sendMessage({ type: 'TOGGLE_BLOCKER', enabled: next });
    }
  };

  const totalReels = prefs
    ? prefs.todayEstimate.instagramReels +
      prefs.todayEstimate.youtubeShorts +
      prefs.todayEstimate.facebookReels
    : 0;

  return (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #2c2537', paddingBottom: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#f5f1e8' }}>FOCUSFLOW</h2>
          <span style={{ fontSize: '10px', color: '#b8ff3c', fontFamily: 'monospace' }}>COMPANION v1.0</span>
        </div>
        <span style={{ fontSize: '10px', padding: '3px 8px', borderRadius: '12px', backgroundColor: '#17131f', border: '1px solid #2c2537', color: '#b8ff3c' }}>
          Active
        </span>
      </div>

      {/* Today's Estimate Hero */}
      <div style={{ marginTop: '16px', backgroundColor: '#17131f', borderRadius: '16px', padding: '14px', border: '1px solid #2c2537' }}>
        <span style={{ fontSize: '11px', color: '#8f89a0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Estimated Short-Form Swipes
        </span>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '36px', fontWeight: 700, color: '#f5f1e8', fontFamily: 'monospace' }}>
            {totalReels}
          </span>
          <span style={{ fontSize: '12px', color: '#8f89a0' }}>today</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px', marginTop: '10px', fontSize: '10px' }}>
          <div style={{ backgroundColor: '#0c0a10', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ color: '#ff4fd8', display: 'block' }}>Instagram</span>
            <strong>{prefs?.todayEstimate.instagramReels ?? 0}</strong>
          </div>
          <div style={{ backgroundColor: '#0c0a10', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ color: '#f4533f', display: 'block' }}>Shorts</span>
            <strong>{prefs?.todayEstimate.youtubeShorts ?? 0}</strong>
          </div>
          <div style={{ backgroundColor: '#0c0a10', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
            <span style={{ color: '#49e6ff', display: 'block' }}>FB Reels</span>
            <strong>{prefs?.todayEstimate.facebookReels ?? 0}</strong>
          </div>
        </div>
      </div>

      {/* Website Blocker Toggle */}
      <div style={{ marginTop: '14px', backgroundColor: '#17131f', borderRadius: '16px', padding: '12px', border: '1px solid #2c2537', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <strong style={{ fontSize: '12px', color: '#f5f1e8', display: 'block' }}>Website Blocker</strong>
          <span style={{ fontSize: '10px', color: '#8f89a0' }}>Block social distractions</span>
        </div>
        <button
          onClick={handleToggleBlocker}
          style={{
            padding: '6px 12px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            backgroundColor: blockingEnabled ? '#b8ff3c' : '#2c2537',
            color: blockingEnabled ? '#07060a' : '#f5f1e8',
          }}
        >
          {blockingEnabled ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Bottom Link */}
      <div style={{ marginTop: 'auto', textAlign: 'center', paddingTop: '12px' }}>
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noreferrer"
          style={{ color: '#b8ff3c', fontSize: '11px', textDecoration: 'none' }}
        >
          Open FOCUSFLOW Dashboard →
        </a>
      </div>
    </div>
  );
};
