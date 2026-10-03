import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { processCallbackInApp } from './utils/oauthHandler';

// Handle OAuth callback in case of SPA routing
if (typeof window !== 'undefined' && window.location.pathname.includes('/auth/callback')) {
  processCallbackInApp();
}

createRoot(document.getElementById('root')!).render(<App />);
