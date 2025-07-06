import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './polyfills';
import ExpandedApp from './ExpandedApp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExpandedApp />
  </StrictMode>
);