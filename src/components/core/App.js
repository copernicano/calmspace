// src/components/core/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';

// Enhanced Components (NEW)
import EnhancedHomePage from './home/EnhancedHomePage';
import EnhancedCalmSpace from '../calm-space/EnhancedCalmSpace';
import EnhancedEmotionSelector from '../emotion-support/EnhancedEmotionSelector';
import EnhancedIntensitySlider from '../emotion-support/EnhancedIntensitySlider';
import EnhancedStrategies from '../emotion-support/EnhancedStrategies';
import EnhancedVisualTimer from '../timers/EnhancedVisualTimer';
import RoutineBuilder from '../timers/RoutineBuilder';
import EnhancedSettings from './EnhancedSettings';
import BottomNavigation from './BottomNavigation';

// Keep ChatButton
import ChatButton from '../chat/ChatButton';

// Styles
import '../../styles/design-system.css';
import '../../styles/fonts.css';
import '../../styles/global.css';

function AppContent() {
  const { settings } = useEnhancedSettings();
  const location = useLocation();

  // State per l'emozione selezionata e la sua intensità
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionIntensity, setEmotionIntensity] = useState(null);

  return (
    <div
      className={`app-container
        theme-${settings.theme}
        animations-${settings.animationLevel}
        text-size-${settings.textSize}
        ${settings.dyslexiaFont ? 'dyslexia-font' : ''}
        ${settings.highContrast ? 'high-contrast' : ''}
        focus-mode-${settings.focusModeEnabled ? (settings.focusModeLevel || 'minimal') : 'off'}
      `}
      style={{
        '--visual-intensity': settings.visualIntensity,
        '--color-saturation': settings.colorSaturation,
      }}
    >
      <Routes>
        <Route path="/" element={<EnhancedHomePage />} />
        <Route path="/calmspace" element={<EnhancedCalmSpace />} />
        <Route path="/emotion" element={
          <EnhancedEmotionSelector
            onSelectEmotion={setSelectedEmotion}
          />
        } />
        <Route path="/intensity" element={
          <EnhancedIntensitySlider
            emotion={selectedEmotion}
            onSelectIntensity={setEmotionIntensity}
            onBack={() => setSelectedEmotion(null)}
          />
        } />
        <Route path="/strategies" element={
          <EnhancedStrategies
            emotion={selectedEmotion}
            intensity={emotionIntensity}
            onBack={() => setEmotionIntensity(null)}
          />
        } />
        <Route path="/timer" element={<EnhancedVisualTimer />} />
        <Route path="/routines" element={<RoutineBuilder />} />
        <Route path="/settings" element={<EnhancedSettings />} />
      </Routes>

      {/* Bottom Navigation - always visible */}
      <BottomNavigation />

      {/* ChatButton con contesto emotivo */}
      <ChatButton
        emotion={selectedEmotion?.name}
        intensity={emotionIntensity}
        currentPage={location.pathname}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;