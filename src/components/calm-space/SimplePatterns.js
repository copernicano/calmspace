import React, { useState, useEffect, useRef, useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import '../../styles/calmspace.css';
import '../../styles/calmspace-animations.css';
// Importiamo i suoni
import bubblesSound from '../../assets/sounds/bubbles.mp3';
import wavesSound from '../../assets/sounds/waves.mp3';
import nightSound from '../../assets/sounds/summer-night.mp3';
import whitenoiseBinauralSound from '../../assets/sounds/whitenoise-binaural.mp3';

function SimplePatterns({ settings, onFullscreenChange }) {
  const { settings: globalSettings } = useContext(SettingsContext);
  const [activePattern, setActivePattern] = useState('bubbles');
  const [speed, setSpeed] = useState('medium'); // 'slow' o 'medium'
  
  // Stato per l'audio
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  
  // Stato per la modalità a schermo intero
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState(null);
  
  // Riferimento al contenitore del pattern display
  const patternContainerRef = useRef(null);
  
  // Riferimenti agli elementi audio
  const audioRefs = useRef({
    bubbles: new Audio(bubblesSound),
    waves: new Audio(wavesSound),
    stars: new Audio(nightSound),
    abstract: new Audio(whitenoiseBinauralSound)
  });
  
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
  
  // Gestisce la riproduzione dell'audio quando cambia il pattern
  useEffect(() => {
    // Funzione per fermare tutti gli audio
    const stopAllAudio = () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };

    // Ferma tutti gli audio prima di iniziare
    stopAllAudio();
    
    // Avvia l'audio corrispondente al pattern se abilitato
    if (audioEnabled) {
      let currentAudio;
      switch(activePattern) {
        case 'bubbles':
          currentAudio = audioRefs.current.bubbles;
          break;
        case 'waves':
          currentAudio = audioRefs.current.waves;
          break;
        case 'stars':
          currentAudio = audioRefs.current.stars;
          break;
        case 'abstract':
          currentAudio = audioRefs.current.abstract;
          break;
        default:
          currentAudio = null;
      }
      
      if (currentAudio) {
        currentAudio.volume = volume;
        currentAudio.loop = true;
        
        // Utilizzare una Promise per gestire gli errori di riproduzione (ad es. autoplay bloccato)
        const playPromise = currentAudio.play();
        
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Riproduzione audio non riuscita:", error);
          });
        }
      }
    }
    
    // Cleanup quando il componente viene smontato o cambia il pattern
    return () => {
      stopAllAudio();
    };
  }, [activePattern, audioEnabled, volume]);
  
  // Configura il volume di tutti gli audio
  useEffect(() => {
    Object.values(audioRefs.current).forEach(audio => {
      audio.volume = volume;
    });
  }, [volume]);
  
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
   
  // Genera bolle con dimensioni e posizioni casuali
  const generateBubbles = () => {
    const bubblesCount = 15;
    const bubbles = [];
    
    for (let i = 0; i < bubblesCount; i++) {
      const size = Math.floor(Math.random() * 60) + 20; // 20-80px
      const left = Math.floor(Math.random() * 100); // 0-100%
      const delay = Math.random() * 5; // 0-5s delay
      const opacity = Math.random() * 0.5 + 0.3; // 0.3-0.8 opacity
      const drift = Math.random() * 100 - 50; // Valore per spostamento laterale
      const hue = Math.floor(Math.random() * 40) + 190; // Tonalità blu/azzurro variabile
    
      bubbles.push(
        <div 
          key={i}
          className="bubble"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
            opacity: opacity,
            background: `radial-gradient(
              circle at 30% 30%,
              hsla(${hue}, 90%, 80%, 0.8),
              hsla(${hue}, 90%, 70%, 0.3) 70%,
              hsla(${hue}, 90%, 60%, 0.1)
            )`,
            animationDuration: `${8 / (speed === 'slow' ? 0.7 : 1)}s`,
            transform: `translateX(${drift}px)`
          }}
        />
      );
    }
    
    return bubbles;
  };
  
  // Genera stelle con dimensioni e posizioni casuali
  const generateStars = () => {
    const starsCount = 50;
    const stars = [];
    
    for (let i = 0; i < starsCount; i++) {
      const size = Math.floor(Math.random() * 5) + 2; // 2-7px
      const top = Math.floor(Math.random() * 100); // 0-100%
      const left = Math.floor(Math.random() * 100); // 0-100%
      const delay = Math.random() * 3; // 0-3s delay
      const duration = Math.random() * 2 + 2; // 2-4s duration
      
      stars.push(
        <div 
          key={i}
          className="star"
          style={{
            '--size': `${size}px`,
            '--top': `${top}%`,
            '--left': `${left}%`,
            '--delay': `${delay}s`,
            '--duration': `${duration}s`,
            '--brightness': Math.random() * 30 + 70, // Luminosità variabile
          }}
        />
      );
    }
    
    // Aggiungiamo anche qualche stella cadente
    for (let i = 0; i < 3; i++) {
      const top = Math.floor(Math.random() * 50); // Nella metà superiore
      const left = Math.floor(Math.random() * 80) + 10; // 10-90%
      const delay = Math.random() * 7 + i * 4; // Delay variabili
      
      stars.push(
        <div 
          key={`shooting-${i}`}
          className="shooting-star"
          style={{
            '--top': `${top}%`,
            '--left': `${left}%`,
            '--delay': `${delay}s`,
          }}
        />
      );
    }
    
    return stars;
  };

  // Genera onde con proprietà dinamiche
  const generateWaves = () => {
    const waves = [];
    const waveCount = 4; // Numero di onde

    for (let i = 1; i <= waveCount; i++) {
      waves.push(
        <div 
          key={`wave-${i}`} 
          className={`wave wave${i}`} 
          style={{
            animationDuration: `${12 + i * 2}s`,
            animationDelay: `${i * 2}s`,
            top: `${60 + i * 5}%`,
            height: `${50 + i * 5}%`,
            background: `rgba(255, 255, 255, ${0.2 - i * 0.05})`
          }}
        ></div>
      );
    }

    return waves;
  };
  
  // Genera elementi per il pattern astratto
  const generateAbstractPattern = () => {
    const shapes = [];
    const lines = [];
    const intersections = [];
    
    // Genera linee orizzontali
    for (let i = 0; i < 5; i++) {
      const yPos = 20 + i * 15; // Distribuzione delle linee
      const animDelay = i * 0.5; // Delay per l'animazione
      
      lines.push(
        <div 
          key={`h-line-${i}`}
          className="line horizontal-line"
          style={{
            top: `${yPos}%`,
            animationName: 'move-horizontal',
            animationDuration: `${15 / (speed === 'slow' ? 0.7 : 1)}s`,
            animationDelay: `${animDelay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      );
    }
    
    // Genera linee verticali
    for (let i = 0; i < 5; i++) {
      const xPos = 20 + i * 15; // Distribuzione delle linee
      const animDelay = i * 0.7; // Delay per l'animazione
      
      lines.push(
        <div 
          key={`v-line-${i}`}
          className="line vertical-line"
          style={{
            left: `${xPos}%`,
            animationName: 'move-vertical',
            animationDuration: `${17 / (speed === 'slow' ? 0.7 : 1)}s`,
            animationDelay: `${animDelay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      );
    }
    
    // Genera alcune linee diagonali
    for (let i = 0; i < 3; i++) {
      const pos = 30 + i * 20; // Posizione
      const animDelay = i * 1.2; // Delay per l'animazione
      
      lines.push(
        <div 
          key={`d-line-${i}`}
          className="line diagonal-line"
          style={{
            top: `${pos}%`,
            left: '-25%',
            animationName: 'move-diagonal',
            animationDuration: `${19 / (speed === 'slow' ? 0.7 : 1)}s`,
            animationDelay: `${animDelay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      );
      
      lines.push(
        <div 
          key={`d-line-rev-${i}`}
          className="line diagonal-line-reverse"
          style={{
            top: `${pos}%`,
            left: '-25%',
            animationName: 'move-diagonal-reverse',
            animationDuration: `${21 / (speed === 'slow' ? 0.7 : 1)}s`,
            animationDelay: `${animDelay + 0.5}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      );
    }
    
    // Genera forme geometriche
    // Cerchi
    for (let i = 0; i < 3; i++) {
      const size = 40 + i * 30; // Dimensione in px
      const animDelay = i * 3.5; // Delay per l'animazione
      
      shapes.push(
        <div 
          key={`circle-${i}`}
          className="geometric-shape circle"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${30 + i * 20}%`,
            top: `${40 + (i % 2) * 15}%`,
            animationName: 'float-shape, pulse-opacity',
            animationDuration: `${(20 + i * 2) / (speed === 'slow' ? 0.7 : 1)}s, ${(15 + i * 3) / (speed === 'slow' ? 0.7 : 1)}s`,
            animationDelay: `${animDelay}s, ${animDelay + 1}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      );
    }
    
    // Quadrati
    for (let i = 0; i < 2; i++) {
      const size = 30 + i * 25; // Dimensione in px
      const animDelay = i * 4.2; // Delay per l'animazione
      
      shapes.push(
        <div 
          key={`square-${i}`}
          className="geometric-shape square"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${25 + i * 40}%`,
            top: `${25 + (i % 3) * 15}%`,
            animationName: 'float-shape, rotate-slow',
            animationDuration: `${(22 + i * 3) / (speed === 'slow' ? 0.7 : 1)}s, ${(90 + i * 10) / (speed === 'slow' ? 0.7 : 1)}s`,
            animationDelay: `${animDelay}s, ${animDelay + 2}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out, linear'
          }}
        />
      );
    }
    
    // Triangoli
    for (let i = 0; i < 2; i++) {
      const scale = 0.3 + i * 0.2; // Scala
      const animDelay = i * 2.8; // Delay per l'animazione
      
      shapes.push(
        <div 
          key={`triangle-${i}`}
          className="geometric-shape triangle"
          style={{
            left: `${45 + i * 25}%`,
            top: `${60 + (i % 2) * 10}%`,
            transform: `scale(${scale})`,
            animationName: 'float-shape, pulse-opacity',
            animationDuration: `${(24 + i * 2) / (speed === 'slow' ? 0.7 : 1)}s, ${(18 + i * 3) / (speed === 'slow' ? 0.7 : 1)}s`,
            animationDelay: `${animDelay}s, ${animDelay + 1.5}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'ease-in-out'
          }}
        />
      );
    }
    
    // Aggiungiamo alcuni punti di intersezione
    // Creiamo punti nelle intersezioni principali
    for (let h = 0; h < 5; h++) {
      const yPos = 20 + h * 15;
      
      for (let v = 0; v < 5; v++) {
        const xPos = 20 + v * 15;
        
        intersections.push(
          <div 
            key={`intersect-${h}-${v}`}
            className="intersection"
            style={{
              left: `${xPos}%`,
              top: `${yPos}%`
            }}
          />
        );
      }
    }
    
    return (
      <>
        {lines}
        {shapes}
        {intersections}
        <div className="depth-overlay"></div>
      </>
    );
  };
  
  // Cambia pattern attivo
  const handlePatternChange = (pattern) => {
    setActivePattern(pattern);
  };
  
  // Cambia velocità animazione
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  // Toggle per abilitare/disabilitare l'audio
  const toggleAudio = () => {
    setAudioEnabled(!audioEnabled);
  };
  
  // Gestisce il cambio del volume
  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
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
  
  // Renderizza i controlli per la modalità normale
  const renderNormalControls = () => (
    <>
      <div className="pattern-options">
        <button 
          className={`pattern-button ${activePattern === 'bubbles' ? 'active' : ''}`}
          onClick={() => handlePatternChange('bubbles')}
          aria-label="Bolle"
        >
          <span className="pattern-icon">🫧</span>
          <span>Bolle</span>
        </button>
        <button 
          className={`pattern-button ${activePattern === 'waves' ? 'active' : ''}`}
          onClick={() => handlePatternChange('waves')}
          aria-label="Onde"
        >
          <span className="pattern-icon">🌊</span>
          <span>Onde</span>
        </button>
        <button 
          className={`pattern-button ${activePattern === 'stars' ? 'active' : ''}`}
          onClick={() => handlePatternChange('stars')}
          aria-label="Stelle"
        >
          <span className="pattern-icon">✨</span>
          <span>Stelle</span>
        </button>
        <button 
          className={`pattern-button ${activePattern === 'abstract' ? 'active' : ''}`}
          onClick={() => handlePatternChange('abstract')}
          aria-label="Geometrico"
        >
          <span className="pattern-icon">📐</span>
          <span>Geometrico</span>
        </button>
      </div>
      
      <div className="animation-controls">
        <button 
          className={`speed-button ${speed === 'slow' ? 'active' : ''}`}
          onClick={() => handleSpeedChange('slow')}
          aria-label="Lento"
        >
          Lento
        </button>
        <button 
          className={`speed-button ${speed === 'medium' ? 'active' : ''}`}
          onClick={() => handleSpeedChange('medium')}
          aria-label="Medio"
        >
          Medio
        </button>
      </div>
      
      <div className="audio-controls">
        <button 
          className={`audio-button ${audioEnabled ? 'active' : ''}`} 
          onClick={toggleAudio}
          aria-label={audioEnabled ? "Disattiva audio" : "Attiva audio"}
        >
          <span className="audio-icon">
            {audioEnabled ? "🔊" : "🔇"}
          </span>
        </button>
        
        {audioEnabled && (
          <div className="volume-slider-container">
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
              aria-label="Volume"
            />
          </div>
        )}
      </div>
    </>
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
        className={`floating-control-button ${activePattern === 'bubbles' ? 'active' : ''}`}
        onClick={() => handlePatternChange('bubbles')}
        aria-label="Bolle"
      >
        🫧
      </button>
      
      <button 
        className={`floating-control-button ${activePattern === 'waves' ? 'active' : ''}`}
        onClick={() => handlePatternChange('waves')}
        aria-label="Onde"
      >
        🌊
      </button>
      
      <button 
        className={`floating-control-button ${activePattern === 'stars' ? 'active' : ''}`}
        onClick={() => handlePatternChange('stars')}
        aria-label="Stelle"
      >
        ✨
      </button>
      
      <button 
        className={`floating-control-button ${activePattern === 'abstract' ? 'active' : ''}`}
        onClick={() => handlePatternChange('abstract')}
        aria-label="Geometrico"
      >
        📐
      </button>
      
      <button 
        className={`floating-control-button ${speed === 'slow' ? 'active' : ''}`}
        onClick={() => handleSpeedChange('slow')}
        aria-label="Lento"
      >
        🐌
      </button>
      
      <button 
        className={`floating-control-button ${speed === 'medium' ? 'active' : ''}`}
        onClick={() => handleSpeedChange('medium')}
        aria-label="Medio"
      >
        🐇
      </button>
      
      <button 
        className={`floating-control-button ${audioEnabled ? 'active' : ''}`}
        onClick={toggleAudio}
        aria-label={audioEnabled ? "Disattiva audio" : "Attiva audio"}
      >
        {audioEnabled ? "🔊" : "🔇"}
      </button>
      
      {audioEnabled && (
        <div className="volume-slider-container">
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
            aria-label="Volume"
          />
        </div>
      )}
    </div>
  );
  
  // Renderizzazione condizionale in base alla modalità (normale o schermo intero)
  return (
    <div className={`patterns-container ${isFullscreen ? 'fullscreen-mode' : ''}`}>
      {!isFullscreen && renderNormalControls()}
      
      <div 
        className="pattern-display" 
        ref={patternContainerRef}
      >
        {/* Pulsante per attivare lo schermo intero */}
        <button 
          className="fullscreen-button"
          onClick={toggleFullscreen}
          aria-label={isFullscreen ? "Esci da schermo intero" : "Vai a schermo intero"}
        >
          <span className="fullscreen-icon">{isFullscreen ? "⤢" : "⤡"}</span>
        </button>
        
        {activePattern === 'bubbles' && (
          <div className={`bubbles-container ${speed}`}>
            {generateBubbles()}
          </div>
        )}
        
        {activePattern === 'waves' && (
          <div className={`waves-container ${speed}`}>
            <div className="sun"></div>
            <div className="sun-reflection"></div>
            
            {generateWaves()}
          </div>
        )}
        
        {activePattern === 'stars' && (
          <div className={`stars-container ${speed}`}>
            <div className="stars-gradient"></div>
            {generateStars()}
          </div>
        )}
        
        {activePattern === 'abstract' && (
          <div className={`abstract-container ${speed}`}>
            {generateAbstractPattern()}
          </div>
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

export default SimplePatterns;