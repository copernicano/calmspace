// src/components/core/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SettingsContext } from '../../contexts/SettingsContext';
import HomePage from './home/HomePage';
import CalmSpace from '../calm-space/CalmSpace';
import EmotionSelector from '../emotion-support/EmotionSelector';
import IntensitySlider from '../emotion-support/IntensitySlider';
import BasicStrategies from '../emotion-support/BasicStrategies';
import VisualTimer from '../timers/VisualTimer';
import SimpleRoutine from '../timers/SimpleRoutine';
import Settings from './Settings';
import Navigation from './Navigation';
import ChatButton from '../chat/ChatButton'; // Importiamo il componente del chatbot
import '../../styles/global.css';
import { getFromStorage } from '../../utils/storage';

function App() {
  // State per le impostazioni utente
  const [settings, setSettings] = useState({
    theme: 'blue',
    animationLevel: 'medium',
    uiSize: 'standard',
  });
  
  // State per l'emozione selezionata e la sua intensità
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [emotionIntensity, setEmotionIntensity] = useState(null);
  
  // Carica le impostazioni dal localStorage all'avvio
  useEffect(() => {
    const savedSettings = getFromStorage('calmspace-settings');
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error('Errore nel parsing delle impostazioni salvate:', error);
      }
    }
  }, []);
  
  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      <Router>
        <div className={`app-container theme-${settings.theme} ui-size-${settings.uiSize}`}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/calmspace" element={<CalmSpace />} />
            <Route path="/emotion" element={
              <EmotionSelector 
                onSelectEmotion={setSelectedEmotion} 
              />
            } />
            <Route path="/intensity" element={
              <IntensitySlider 
                emotion={selectedEmotion} 
                onSelectIntensity={setEmotionIntensity}
                onBack={() => setSelectedEmotion(null)}
              />
            } />
            <Route path="/strategies" element={
              <BasicStrategies 
                emotion={selectedEmotion} 
                intensity={emotionIntensity}
                onBack={() => setEmotionIntensity(null)}
              />
            } />
            <Route path="/timer" element={<VisualTimer />} />
            <Route path="/routine" element={<SimpleRoutine />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          
          <Navigation />
          
          {/* Aggiungiamo il pulsante del chatbot */}
          <ChatButton />
        </div>
      </Router>
    </SettingsContext.Provider>
  );
}

export default App;