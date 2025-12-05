import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/core/App';
import { EnhancedSettingsProvider } from './contexts/EnhancedSettingsContext';
import './styles/global.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <EnhancedSettingsProvider>
      <App />
    </EnhancedSettingsProvider>
  </React.StrictMode>
);

// Registra il service worker per la funzionalità offline
serviceWorkerRegistration.register();