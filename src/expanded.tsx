import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './polyfills';
import './index.css'; // Import CSS explicitly
import ExpandedApp from './ExpandedApp.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ExpandedApp />
  </StrictMode>
);