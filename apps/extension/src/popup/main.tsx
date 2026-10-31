import React from 'react';
import { createRoot } from 'react-dom/client';
import { Popup } from './Popup.tsx';

const rootEl = document.getElementById('popup-root');
if (rootEl) {
  createRoot(rootEl).render(
    <React.StrictMode>
      <Popup />
    </React.StrictMode>
  );
}
