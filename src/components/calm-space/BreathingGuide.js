import React, { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import '../../styles/calmspace.css';

function BreathingGuide({ settings }) {
  // Tipo di respirazione selezionato (default o da localStorage)
  const [breathingType, setBreathingType] = useState(() => {
    const savedType = getFromStorage('breathingType');
    return savedType || 'square';
  });
  
  // Stato dell'animazione
  const [isActive, setIsActive] = useState(false);
  // Fase corrente di respirazione
  const [phase, setPhase] = useState('inhale'); // 'inhale', 'hold', 'exhale', 'rest'
  // Conteggio per la fase corrente
  const [count, setCount] = useState(4);
  
  // Durata delle fasi in base alle impostazioni
  const getDuration = () => {
    return settings.animationLevel === 'low' ? 1.5 : 1;
  };
  
  // Salva la selezione quando cambia
  useEffect(() => {
    saveToStorage('breathingType', breathingType);
  }, [breathingType]);
  
  // Gestione dell'animazione di respirazione
  useEffect(() => {
    if (!isActive) return;
    
    const duration = getDuration();
    
    const interval = setInterval(() => {
      setCount(prevCount => {
        if (prevCount <= 1) {
          // Passa alla fase successiva quando il conteggio arriva a 0
          switch (phase) {
            case 'inhale':
              setPhase('hold');
              return breathingType === 'square' ? 4 : 7;
            case 'hold':
              setPhase('exhale');
              return breathingType === 'square' ? 4 : 8;
            case 'exhale':
              setPhase(breathingType === 'square' ? 'inhale' : 'rest');
              return breathingType === 'square' ? 4 : 4;
            case 'rest':
              setPhase('inhale');
              return breathingType === 'square' ? 4 : 4;
            default:
              return 4;
          }
        }
        return prevCount - 1;
      });
    }, duration * 1000);
    
    return () => clearInterval(interval);
  }, [isActive, phase, breathingType, settings.animationLevel]);
  
  // Toggle dell'animazione
  const toggleAnimation = () => {
    if (!isActive) {
      setPhase('inhale');
      setCount(4);
    }
    setIsActive(!isActive);
  };
  
  // Selezione del tipo di respirazione
  const handleBreathingSelect = (type) => {
    setBreathingType(type);
    setIsActive(false);
    setPhase('inhale');
    setCount(4);
  };
  
  // Testo istruzioni in base alla fase corrente
  const getInstructionText = () => {
    switch (phase) {
      case 'inhale': return 'Inspira';
      case 'hold': return 'Trattieni';
      case 'exhale': return 'Espira';
      case 'rest': return 'Riposa';
      default: return '';
    }
  };
  
  return (
    <div className="breathing-container">
      <div className="breathing-options">
        <button 
          className={`breathing-button ${breathingType === 'square' ? 'active' : ''}`}
          onClick={() => handleBreathingSelect('square')}
          aria-label="Respirazione quadrata"
        >
          <span>Quadrata (4-4-4-4)</span>
        </button>
        <button 
          className={`breathing-button ${breathingType === '478' ? 'active' : ''}`}
          onClick={() => handleBreathingSelect('478')}
          aria-label="Respirazione 4-7-8"
        >
          <span>4-7-8</span>
        </button>
      </div>
      
      <div className="breathing-animation-container">
        <div className={`breathing-circle ${isActive ? 'active' : ''} ${phase}`}>
          <div className="inner-circle">
            <span className="count">{count}</span>
            <span className="instruction">{isActive ? getInstructionText() : 'Premi per iniziare'}</span>
          </div>
        </div>
        
        <button 
          className={`start-button ${isActive ? 'active' : ''}`}
          onClick={toggleAnimation}
          aria-label={isActive ? 'Ferma' : 'Inizia'}
        >
          {isActive ? 'Ferma' : 'Inizia'}
        </button>
      </div>
    </div>
  );
}

export default BreathingGuide;