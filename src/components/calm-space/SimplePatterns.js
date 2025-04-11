import React, { useState, useEffect, useRef, useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import '../../styles/calmspace.css';
import '../../styles/calmspace-animations.css';
// Importiamo i suoni
import bubblesSound from '../../assets/sounds/bubbles.mp3';
import wavesSound from '../../assets/sounds/waves.mp3';
import nightSound from '../../assets/sounds/summer-night.mp3';

function SimplePatterns({ settings }) {
  const { settings: globalSettings } = useContext(SettingsContext);
  const [activePattern, setActivePattern] = useState('bubbles');
  const [speed, setSpeed] = useState('medium'); // 'slow' o 'medium'
  
  // Stato per l'audio
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [volume, setVolume] = useState(0.5);
  
  // Riferimenti agli elementi audio
  const audioRefs = useRef({
    bubbles: new Audio(bubblesSound),
    waves: new Audio(wavesSound),
    stars: new Audio(nightSound)
  });
  
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
  
  return (
    <div className="patterns-container">
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
      
      {/* Controlli audio */}
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
      
      <div className="pattern-display">
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
      </div>
    </div>
  );
}

export default SimplePatterns;