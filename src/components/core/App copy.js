import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './Navigation';
import HomePage from '../HomePage';
import CalmSpace from '../calm-space/CalmSpace';
import EmotionSelector from '../emotion-support/EmotionSelector';
import VisualTimer from '../timers/VisualTimer';
import Settings from './Settings';
import { SettingsProvider } from '../../contexts/SettingsContext';
import '../../styles/global.css';

function App() {
  return (
    <SettingsProvider>
      <Router>
        <div className="app-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calm-space" element={<CalmSpace />} />
            <Route path="/emotion" element={<EmotionSelector />} />
            <Route path="/timer" element={<VisualTimer />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Navigation />
        </div>
      </Router>
    </SettingsProvider>
  );
}

export default App;