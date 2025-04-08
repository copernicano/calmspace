import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../../contexts/SettingsContext';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import IntensitySlider from './IntensitySlider';
import BasicStrategies from './BasicStrategies';
import '../../styles/emotion.css';

function EmotionSelector() {
  const { settings } = useContext(SettingsContext);
  const navigate = useNavigate();
  
  // Stato per tener traccia dell'emozione selezionata
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  // Stato per l'intensità dell'emozione
  const [intensity, setIntensity] = useState(0);
  // Stato per il passaggio tra selezione emozione, intensità e strategie
  const [step, setStep] = useState('select'); // 'select', 'intensity', 'strategies'
  
  // Carica l'ultima emozione selezionata dal localStorage
  useEffect(() => {
    const savedEmotion = getFromStorage('lastEmotion');
    if (savedEmotion) {
      try {
        const parsed = JSON.parse(savedEmotion);
        if (parsed.name) {
          setSelectedEmotion(parsed);
        }
      } catch (e) {
        console.error('Error parsing saved emotion:', e);
      }
    }
  }, []);
  
  // Opzioni di emozioni disponibili
  const emotions = [
    { name: 'felice', emoji: '😊', color: '#FFD700' },
    { name: 'triste', emoji: '😢', color: '#6495ED' },
    { name: 'arrabbiato', emoji: '😠', color: '#FF6347' },
    { name: 'preoccupato', emoji: '😟', color: '#9370DB' },
    { name: 'calmo', emoji: '😌', color: '#90EE90' },
    { name: 'confuso', emoji: '😕', color: '#FFB6C1' }
  ];
  
  // Gestisce la selezione di un'emozione
  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    // Salva l'emozione selezionata in localStorage
    saveToStorage('lastEmotion', JSON.stringify(emotion));
    // Passa al passo successivo (intensità)
    setStep('intensity');
  };
  
  // Gestisce la selezione dell'intensità
  const handleIntensitySelect = (level) => {
    setIntensity(level);
    // Passa al passo successivo (strategie)
    setStep('strategies');
  };
  
  // Torna al selettore di emozioni
  const handleBackToEmotions = () => {
    setStep('select');
  };
  
  // Torna al selettore di intensità
  const handleBackToIntensity = () => {
    setStep('intensity');
  };
  
  // Classe contenitore basata sulle impostazioni correnti
  const containerClass = `emotion-container theme-${settings.theme} ui-size-${settings.uiSize}`;
  
  return (
    <div className={containerClass}>
      {step === 'select' && (
        <>
          <h1 className="emotion-title">Come mi sento</h1>
          <div className="emotion-grid">
            {emotions.map((emotion) => (
              <button
                key={emotion.name}
                className="emotion-button"
                onClick={() => handleEmotionSelect(emotion)}
                aria-label={`Mi sento ${emotion.name}`}
                style={{ backgroundColor: emotion.color }}
              >
                <span className="emotion-emoji">{emotion.emoji}</span>
                <span className="emotion-name">{emotion.name}</span>
              </button>
            ))}
          </div>
        </>
      )}
      
      {step === 'intensity' && selectedEmotion && (
        <IntensitySlider 
          emotion={selectedEmotion}
          onSelectIntensity={handleIntensitySelect}
          onBack={handleBackToEmotions}
        />
      )}
      
      {step === 'strategies' && selectedEmotion && (
        <BasicStrategies 
          emotion={selectedEmotion}
          intensity={intensity}
          onBack={handleBackToIntensity}
        />
      )}
    </div>
  );
}

export default EmotionSelector;