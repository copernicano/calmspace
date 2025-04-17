import React, { useState, useEffect, useRef } from 'react';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import '../../styles/calmspace.css';

function BreathingGuide({ settings, onFullscreenChange }) {
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
  
  // Stato per la modalità a schermo intero
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  
  // Riferimento al contenitore dell'animazione
  const breathingContainerRef = useRef(null);
  
  // Gestisce il movimento del mouse per mostrare/nascondere i controlli
  useEffect(() => {
    if (!isFullscreen) return;
    
    const handleMouseMove = () => {
      // Mostra i controlli
      setControlsVisible(true);
      
      // Resetta il timeout esistente
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
      
      // Imposta un nuovo timeout per nascondere i controlli dopo 3 secondi
      const timeout = setTimeout(() => {
        setControlsVisible(false);
      }, 3000);
      
      setControlsTimeout(timeout);
    };
    
    // Aggiungi l'event listener solo in modalità fullscreen
    if (isFullscreen) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchstart', handleMouseMove);
      
      // Invoca una volta all'inizio per avviare il timer
      handleMouseMove();
    }
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchstart', handleMouseMove);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [isFullscreen, controlsTimeout]);
  
  // Aggiunge gestione tasto Escape per uscire dalla modalità schermo intero
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        toggleFullscreen();
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen]);
  
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
  
  // Toggle per la modalità a schermo intero
  const toggleFullscreen = () => {
    const newFullscreenState = !isFullscreen;
    setIsFullscreen(newFullscreenState);
    
    // Notifica il componente genitore del cambio di stato
    if (onFullscreenChange) {
      onFullscreenChange(newFullscreenState);
    }
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
  
  // Renderizza i controlli per la modalità normale
  const renderNormalControls = () => (
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
  );
  
  // Renderizza i controlli fluttuanti per la modalità a schermo intero
  const renderFloatingControls = () => (
    <div className={`floating-controls ${controlsVisible ? '' : 'hidden'}`}>
      <button 
        className="floating-control-button"
        onClick={toggleFullscreen}
        aria-label="Esci da schermo intero"
      >
        <span className="fullscreen-icon">⤢</span>
      </button>
      
      <button 
        className={`floating-control-button ${breathingType === 'square' ? 'active' : ''}`}
        onClick={() => handleBreathingSelect('square')}
        aria-label="Respirazione quadrata"
      >
        □
      </button>
      
      <button 
        className={`floating-control-button ${breathingType === '478' ? 'active' : ''}`}
        onClick={() => handleBreathingSelect('478')}
        aria-label="Respirazione 4-7-8"
      >
        478
      </button>
      
      <button 
        className={`floating-control-button ${isActive ? 'active' : ''}`}
        onClick={toggleAnimation}
        aria-label={isActive ? "Ferma" : "Inizia"}
      >
        {isActive ? "⏹" : "▶"}
      </button>
    </div>
  );
  
  return (
    <div className={`breathing-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {!isFullscreen && renderNormalControls()}
      
      <div 
        className="breathing-animation-container" 
        ref={breathingContainerRef}
      >
        {/* Pulsante per attivare lo schermo intero */}
        <button 
          className="fullscreen-button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Esci da schermo intero" : "Vai a schermo intero"}
        >
          <span className="fullscreen-icon">{isFullscreen ? "⤢" : "⤡"}</span>
        </button>
        
        <div className={`breathing-circle ${isActive ? 'active' : ''} ${phase}`}>
          <div className="inner-circle">
            <span className="count">{count}</span>
            <span className="instruction">{isActive ? getInstructionText() : 'Premi per iniziare'}</span>
          </div>
        </div>
        
        {!isFullscreen && (
          <button 
            className={`start-button ${isActive ? 'active' : ''}`}
            onClick={toggleAnimation}
            aria-label={isActive ? 'Ferma' : 'Inizia'}
          >
            {isActive ? 'Ferma' : 'Inizia'}
          </button>
        )}
      </div>
      
      {isFullscreen && renderFloatingControls()}
      
      {/* Indicatore di autoscomparsa */}
      {isFullscreen && !controlsVisible && (
        <div className="timer-indicator visible">
          Muovi il mouse per mostrare i controlli
        </div>
      )}
    </div>
  );
}

export default BreathingGuide;