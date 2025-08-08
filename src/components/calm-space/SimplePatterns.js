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
   
  // Genera bolle con effetti moderni e artistici
  const generateBubbles = () => {
    const bubblesCount = 25;
    const bubbles = [];
    
    for (let i = 0; i < bubblesCount; i++) {
      const size = Math.floor(Math.random() * 80) + 15; // 15-95px
      const left = Math.floor(Math.random() * 100); // 0-100%
      const delay = Math.random() * 8; // 0-8s delay per più varietà
      const opacity = Math.random() * 0.4 + 0.4; // 0.4-0.8 opacity
      const drift = Math.random() * 150 - 75; // Movimento laterale più ampio
      const rotationSpeed = Math.random() * 20 + 10; // Rotazione variabile
      const floatDuration = Math.random() * 6 + 8; // 8-14s durata variabile
      const hue = Math.floor(Math.random() * 60) + 180; // Più varietà di colori
      const saturation = Math.floor(Math.random() * 40) + 60; // Saturazione variabile
      const scale = Math.random() * 0.5 + 0.75; // Scala finale variabile
      
      // Tipi di bolla diversi per varietà
      const bubbleType = Math.random();
      let bubbleClass = 'bubble';
      if (bubbleType > 0.8) bubbleClass = 'bubble-large';
      else if (bubbleType > 0.6) bubbleClass = 'bubble-micro';
      else if (bubbleType > 0.4) bubbleClass = 'bubble-sparkly';
    
      bubbles.push(
        <div 
          key={i}
          className={bubbleClass}
          style={{
            '--size': `${size}px`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
            opacity: opacity,
            background: `radial-gradient(
              circle at 25% 25%,
              hsla(${hue}, ${saturation}%, 95%, 0.9),
              hsla(${hue}, ${saturation}%, 80%, 0.6) 30%,
              hsla(${hue}, ${saturation}%, 60%, 0.3) 60%,
              hsla(${hue}, ${saturation}%, 40%, 0.1) 85%,
              transparent
            )`,
            animationDuration: `${floatDuration / (speed === 'slow' ? 0.7 : 1)}s`,
            '--drift-x': `${drift}px`,
            '--rotation-speed': `${rotationSpeed}s`,
            '--final-scale': scale,
            '--hue': hue
          }}
        />
      );
    }
    
    // Aggiungiamo particelle di schiuma
    for (let i = 0; i < 15; i++) {
      const size = Math.floor(Math.random() * 8) + 2; // Piccole particelle
      const left = Math.floor(Math.random() * 100);
      const delay = Math.random() * 10;
      
      bubbles.push(
        <div 
          key={`foam-${i}`}
          className="bubble-foam"
          style={{
            '--size': `${size}px`,
            left: `${left}%`,
            animationDelay: `${delay}s`,
            animationDuration: `${(Math.random() * 4 + 6) / (speed === 'slow' ? 0.7 : 1)}s`
          }}
        />
      );
    }
    
    return bubbles;
  };
  
  // Genera un universo stellato moderno e spettacolare
  const generateStars = () => {
    const stars = [];
    
    // Stelle principali luminose con forme a croce
    for (let i = 0; i < 60; i++) {
      const size = Math.random() * 3 + 2; // 2-5px
      const top = Math.random() * 100;
      const left = Math.random() * 100;
      const delay = Math.random() * 8;
      const duration = Math.random() * 4 + 3; // 3-7s
      const intensity = Math.random() * 0.8 + 0.4; // 0.4-1.2
      const color = Math.random();
      
      // Tipi di stelle moderne
      let starType = 'modern-star';
      let starColor = '#FFFFFF';
      
      if (color > 0.85) {
        starType = 'modern-star-red';
        starColor = '#FF4757';
      } else if (color > 0.7) {
        starType = 'modern-star-blue';
        starColor = '#3742FA';
      } else if (color > 0.55) {
        starType = 'modern-star-gold';
        starColor = '#FFD700';
      } else if (color > 0.4) {
        starType = 'modern-star-pink';
        starColor = '#FF6B9D';
      }
      
      stars.push(
        <div 
          key={`modern-star-${i}`}
          className={starType}
          style={{
            '--star-size': `${size}px`,
            '--star-top': `${top}%`,
            '--star-left': `${left}%`,
            '--star-delay': `${delay}s`,
            '--star-duration': `${duration}s`,
            '--star-intensity': intensity,
            '--star-color': starColor
          }}
        />
      );
    }
    
    // Costellazioni con linee di collegamento
    for (let constellation = 0; constellation < 4; constellation++) {
      const centerX = 20 + Math.random() * 60; // 20-80%
      const centerY = 20 + Math.random() * 60; // 20-80%
      const constellationStars = 5 + Math.floor(Math.random() * 3); // 5-7 stelle
      const constellationPositions = [];
      
      // Genera le posizioni delle stelle della costellazione
      for (let j = 0; j < constellationStars; j++) {
        const angle = (j / constellationStars) * Math.PI * 2 + Math.random() * 0.5;
        const distance = Math.random() * 12 + 8; // 8-20% distance
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        constellationPositions.push({x, y});
        
        stars.push(
          <div 
            key={`constellation-star-${constellation}-${j}`}
            className="constellation-star-modern"
            style={{
              '--star-top': `${y}%`,
              '--star-left': `${x}%`,
              '--star-delay': `${j * 0.3}s`
            }}
          />
        );
      }
      
      // Linee di collegamento tra stelle della costellazione
      for (let j = 0; j < constellationPositions.length - 1; j++) {
        const star1 = constellationPositions[j];
        const star2 = constellationPositions[j + 1];
        const distance = Math.sqrt((star2.x - star1.x) ** 2 + (star2.y - star1.y) ** 2);
        const angle = Math.atan2(star2.y - star1.y, star2.x - star1.x) * 180 / Math.PI;
        
        stars.push(
          <div 
            key={`constellation-line-${constellation}-${j}`}
            className="constellation-line"
            style={{
              '--line-top': `${star1.y}%`,
              '--line-left': `${star1.x}%`,
              '--line-width': `${distance}%`,
              '--line-angle': `${angle}deg`,
              '--line-delay': `${j * 0.5}s`
            }}
          />
        );
      }
    }
    
    // Meteore spettacolari con scie luminose
    for (let i = 0; i < 8; i++) {
      const startTop = Math.random() * 30; // Parte alta
      const startLeft = Math.random() * 70 + 15; // 15-85%
      const delay = Math.random() * 12 + i * 2; // Distribuiti nel tempo
      const duration = Math.random() * 1.5 + 2; // 2-3.5s velocità
      const length = Math.random() * 100 + 150; // 150-250px scia
      
      stars.push(
        <div 
          key={`spectacular-meteor-${i}`}
          className="spectacular-meteor"
          style={{
            '--meteor-start-top': `${startTop}%`,
            '--meteor-start-left': `${startLeft}%`,
            '--meteor-delay': `${delay}s`,
            '--meteor-duration': `${duration}s`,
            '--meteor-trail-length': `${length}px`
          }}
        />
      );
    }
    
    // Nebulose colorate vibranti
    for (let i = 0; i < 6; i++) {
      const size = Math.random() * 200 + 120; // 120-320px
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const hue = [270, 300, 180, 210, 330, 60][i]; // Colori specifici
      const saturation = Math.random() * 30 + 70; // 70-100%
      const lightness = Math.random() * 20 + 60; // 60-80%
      
      stars.push(
        <div 
          key={`vibrant-nebula-${i}`}
          className="vibrant-nebula"
          style={{
            '--nebula-size': `${size}px`,
            '--nebula-left': `${left}%`,
            '--nebula-top': `${top}%`,
            '--nebula-hue': hue,
            '--nebula-saturation': `${saturation}%`,
            '--nebula-lightness': `${lightness}%`,
            '--nebula-duration': `${Math.random() * 15 + 25}s`
          }}
        />
      );
    }
    
    // Pulviscolo stellare scintillante
    for (let i = 0; i < 50; i++) {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const delay = Math.random() * 15;
      const size = Math.random() * 1.5 + 0.5; // 0.5-2px
      
      stars.push(
        <div 
          key={`sparkling-dust-${i}`}
          className="sparkling-dust"
          style={{
            '--dust-left': `${left}%`,
            '--dust-top': `${top}%`,
            '--dust-delay': `${delay}s`,
            '--dust-size': `${size}px`
          }}
        />
      );
    }
    
    return stars;
  };

  // Genera onde poetiche e fluide con CSS puro
  const generateWaves = () => {
    const waves = [];
    
    // Onde principali fluide con CSS clip-path curvato
    for (let i = 0; i < 6; i++) {
      const height = 40 + i * 8; // Altezza crescente
      const speed = 12 + i * 3; // Velocità diversa per ogni onda
      const delay = i * 1.5; // Delay scaglionato
      const opacity = 0.6 - i * 0.08; // Trasparenza decrescente
      const hue = 200 + i * 15; // Sfumatura blu-turchese
      
      waves.push(
        <div 
          key={`fluid-wave-${i}`}
          className="fluid-wave-layer"
          style={{
            '--wave-height': `${height}px`,
            '--wave-speed': `${speed}s`,
            '--wave-delay': `${delay}s`,
            '--wave-opacity': opacity,
            '--wave-hue': hue,
            '--wave-bottom': `${i * 5}%`
          }}
        />
      );
    }
    
    // Onde di superficie con riflessi
    for (let i = 0; i < 4; i++) {
      const surfaceHeight = 15 + i * 3;
      const surfaceSpeed = 8 + i * 2;
      const surfaceDelay = i * 0.8;
      
      waves.push(
        <div 
          key={`surface-wave-${i}`}
          className="surface-wave"
          style={{
            '--surface-height': `${surfaceHeight}px`,
            '--surface-speed': `${surfaceSpeed}s`,
            '--surface-delay': `${surfaceDelay}s`,
            '--surface-bottom': `${20 + i * 3}%`
          }}
        />
      );
    }
    
    // Particelle galleggianti organiche
    for (let i = 0; i < 12; i++) {
      const particleX = Math.random() * 100;
      const particleY = 30 + Math.random() * 40; // Zona centrale dell'acqua
      const particleSize = 2 + Math.random() * 4;
      const floatDuration = 8 + Math.random() * 8;
      const floatDelay = Math.random() * 10;
      
      waves.push(
        <div 
          key={`floating-particle-${i}`}
          className="floating-particle"
          style={{
            left: `${particleX}%`,
            top: `${particleY}%`,
            '--particle-size': `${particleSize}px`,
            '--float-duration': `${floatDuration}s`,
            '--float-delay': `${floatDelay}s`
          }}
        />
      );
    }
    
    // Riflessi luminosi sull'acqua
    for (let i = 0; i < 8; i++) {
      const reflectionX = Math.random() * 100;
      const reflectionY = 25 + Math.random() * 50;
      const shimmerDelay = Math.random() * 6;
      const shimmerDuration = 3 + Math.random() * 3;
      
      waves.push(
        <div 
          key={`water-shimmer-${i}`}
          className="water-shimmer"
          style={{
            left: `${reflectionX}%`,
            top: `${reflectionY}%`,
            '--shimmer-delay': `${shimmerDelay}s`,
            '--shimmer-duration': `${shimmerDuration}s`
          }}
        />
      );
    }

    return waves;
  };
  
  // Genera pattern geometrico moderno e sofisticato
  const generateAbstractPattern = () => {
    const elements = [];
    
    // Pattern di base con griglia esagonale
    const hexGrid = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 12; col++) {
        const x = col * 8 + (row % 2) * 4; // Offset per righe alternate
        const y = row * 7;
        const delay = (row + col) * 0.1;
        const duration = Math.random() * 4 + 6;
        const opacity = Math.random() * 0.3 + 0.1;
        
        if (Math.random() > 0.6) { // Solo alcuni esagoni per spazio
          hexGrid.push(
            <div 
              key={`hex-${row}-${col}`}
              className="hex-cell"
              style={{
                '--x': `${x}%`,
                '--y': `${y}%`,
                '--delay': `${delay}s`,
                '--duration': `${duration}s`,
                '--opacity': opacity
              }}
            />
          );
        }
      }
    }
    elements.push(...hexGrid);
    
    // Forme geometriche fluttuanti moderne
    const modernShapes = [
      // Cerchi concentrici
      ...Array(6).fill().map((_, i) => (
        <div 
          key={`concentric-${i}`}
          className="concentric-circle"
          style={{
            '--size': `${30 + i * 15}px`,
            '--left': '20%',
            '--top': '30%',
            '--delay': `${i * 0.3}s`,
            '--opacity': 0.8 - i * 0.1
          }}
        />
      )),
      
      // Triangoli rotanti
      ...Array(4).fill().map((_, i) => (
        <div 
          key={`rotating-triangle-${i}`}
          className="rotating-triangle"
          style={{
            '--size': `${20 + i * 10}px`,
            '--left': `${70 + i * 5}%`,
            '--top': `${20 + i * 15}%`,
            '--delay': `${i * 0.8}s`,
            '--rotation-duration': `${8 + i * 2}s`
          }}
        />
      )),
      
      // Quadrati pulsanti
      ...Array(3).fill().map((_, i) => (
        <div 
          key={`pulsing-square-${i}`}
          className="pulsing-square"
          style={{
            '--size': `${15 + i * 8}px`,
            '--left': `${40 + i * 15}%`,
            '--top': `${60 + i * 10}%`,
            '--delay': `${i * 1.2}s`,
            '--pulse-scale': 1.5 + i * 0.3
          }}
        />
      )),
      
      // Linee dinamiche curvate
      ...Array(8).fill().map((_, i) => (
        <div 
          key={`curved-line-${i}`}
          className="curved-line"
          style={{
            '--start-x': `${Math.random() * 100}%`,
            '--start-y': `${Math.random() * 100}%`,
            '--end-x': `${Math.random() * 100}%`,
            '--end-y': `${Math.random() * 100}%`,
            '--delay': `${i * 0.5}s`,
            '--duration': `${6 + Math.random() * 4}s`,
            '--hue': Math.random() * 360
          }}
        />
      ))
    ];
    elements.push(...modernShapes);
    
    // Particelle di connessione
    const connectionDots = [];
    for (let i = 0; i < 20; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const delay = Math.random() * 5;
      const moveDistance = Math.random() * 50 + 20;
      
      connectionDots.push(
        <div 
          key={`connection-dot-${i}`}
          className="connection-dot"
          style={{
            '--x': `${x}%`,
            '--y': `${y}%`,
            '--delay': `${delay}s`,
            '--move-distance': `${moveDistance}px`,
            '--direction': `${Math.random() * 360}deg`
          }}
        />
      );
    }
    elements.push(...connectionDots);
    
    // Pattern frattale semplificato
    const fractalElements = [];
    for (let level = 0; level < 3; level++) {
      const size = 100 - level * 25;
      const count = Math.pow(2, level);
      
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * 360;
        const distance = level * 15;
        const x = 50 + Math.cos(angle * Math.PI / 180) * distance;
        const y = 50 + Math.sin(angle * Math.PI / 180) * distance;
        
        fractalElements.push(
          <div 
            key={`fractal-${level}-${i}`}
            className="fractal-element"
            style={{
              '--size': `${size}px`,
              '--x': `${x}%`,
              '--y': `${y}%`,
              '--level': level,
              '--delay': `${level * 0.5 + i * 0.1}s`,
              '--rotation-speed': `${10 + level * 2}s`
            }}
          />
        );
      }
    }
    elements.push(...fractalElements);
    
    // Onde di energia radiali
    const energyWaves = [];
    for (let i = 0; i < 5; i++) {
      energyWaves.push(
        <div 
          key={`energy-wave-${i}`}
          className="energy-wave"
          style={{
            '--delay': `${i * 0.8}s`,
            '--duration': '4s',
            '--max-radius': `${150 + i * 30}px`,
            '--center-x': '50%',
            '--center-y': '50%'
          }}
        />
      );
    }
    elements.push(...energyWaves);
    
    // Particelle orbitanti
    const orbitingParticles = [];
    for (let orbit = 0; orbit < 3; orbit++) {
      const particleCount = 4 + orbit * 2;
      const radius = 30 + orbit * 20;
      
      for (let i = 0; i < particleCount; i++) {
        orbitingParticles.push(
          <div 
            key={`orbit-${orbit}-${i}`}
            className="orbiting-particle"
            style={{
              '--orbit-radius': `${radius}px`,
              '--orbit-duration': `${8 + orbit * 2}s`,
              '--particle-delay': `${(i / particleCount) * (8 + orbit * 2)}s`,
              '--particle-size': `${3 + orbit}px`
            }}
          />
        );
      }
    }
    elements.push(...orbitingParticles);
    
    return (
      <>
        {elements}
        <div className="geometric-overlay"></div>
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
            {generateWaves()}
          </div>
        )}
        
        {activePattern === 'stars' && (
          <div className={`stars-container ${speed}`}>
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