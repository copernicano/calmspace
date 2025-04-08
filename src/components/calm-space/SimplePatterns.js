import React, { useState, useEffect } from 'react';
import '../../styles/calmspace.css';
import '../../styles/calmspace-animations.css';

function SimplePatterns({ settings }) {
  const [activePattern, setActivePattern] = useState('bubbles');
  const [speed, setSpeed] = useState('medium'); // 'slow' o 'medium'
  
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
    
    // Aggiungiamo anche qualche stella cadente occasionale
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
    
    // Aggiunge delle nebulose per profondità
    for (let i = 0; i < 3; i++) {
      const size = Math.floor(Math.random() * 100) + 100; // 100-200px
      const top = Math.floor(Math.random() * 100); // 0-100%
      const left = Math.floor(Math.random() * 100); // 0-100%
      
      stars.push(
        <div 
          key={`nebula-${i}`}
          className="nebula"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${top}%`,
            left: `${left}%`,
            '--hue': `${Math.floor(Math.random() * 60) + 220}`, // Tonalità blu/viola
          }}
        />
      );
    }
    
    return stars;
  };
  
  // Cambia pattern attivo
  const handlePatternChange = (pattern) => {
    setActivePattern(pattern);
  };
  
  // Cambia velocità animazione
  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
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
      
      <div className="pattern-display">
        {activePattern === 'bubbles' && (
          <div className={`bubbles-container ${speed}`}>
            {generateBubbles()}
          </div>
        )}
        
        {activePattern === 'waves' && (
          <div className={`waves-container ${speed}`}>
            {/* Nuovo sole e riflesso per l'effetto tramonto */}
            <div className="sun"></div>
            <div className="sun-reflection"></div>
            
            {/* Nuvole nell'aria */}
            <div className="cloud cloud1"></div>
            <div className="cloud cloud2"></div>
            
            {/* Gabbiani che volano */}
            <div className="seagull1">v</div>
            <div className="seagull2">v</div>
            
            {/* Oggetti che galleggiano */}
            <div className="floating-object boat"></div>
            <div className="floating-object log"></div>
            
            {/* Onde in prospettiva */}
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
            <div className="wave wave4"></div>
            <div className="wave wave5"></div>
            
            {/* Effetto schiuma sulle onde */}
            <div className="foam foam1"></div>
            <div className="foam foam2"></div>
            <div className="foam foam3"></div>
            
            {/* Effetto di profondità dell'acqua */}
            <div className="deep-water"></div>
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