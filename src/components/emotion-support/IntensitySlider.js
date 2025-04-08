import React, { useState, useEffect } from 'react';
import '../../styles/emotion.css';

function IntensitySlider({ emotion, onSelectIntensity, onBack }) {
  const [sliderValue, setSliderValue] = useState(1);
  const [animate, setAnimate] = useState(false);
  
  // Applica animazioni all'avvio del componente
  useEffect(() => {
    setAnimate(true);
    
    // Colora dinamicamente lo sfondo con l'opacità in base al valore dello slider
    const root = document.documentElement;
    root.style.setProperty('--emotion-color', emotion.color);
    root.style.setProperty('--emotion-opacity', 0.1 + (sliderValue - 1) * 0.1);
    
    return () => {
      root.style.removeProperty('--emotion-color');
      root.style.removeProperty('--emotion-opacity');
    };
  }, [emotion.color, sliderValue]);
  
  // Gestisce il cambio di valore dello slider
  const handleSliderChange = (e) => {
    setSliderValue(parseInt(e.target.value, 10));
  };
  
  // Completa la selezione dell'intensità
  const handleContinue = () => {
    onSelectIntensity(sliderValue);
  };
  
  // Label per i livelli di intensità
  const getIntensityLabel = () => {
    switch (sliderValue) {
      case 1: return 'Un po\'';
      case 2: return 'Abbastanza';
      case 3: return 'Molto';
      default: return '';
    }
  };
  
  // Stile dinamico basato sull'emozione
  const containerStyle = {
    backgroundColor: `${emotion.color}${sliderValue * 10}`,
    transition: 'background-color 0.5s ease'
  };
  
  return (
    <div 
      className={`intensity-container ${animate ? 'slide-in' : ''}`} 
      style={containerStyle}
    >
      <button 
        className="back-button" 
        onClick={onBack} 
        aria-label="Torna indietro"
      >
        <span className="back-icon">←</span> Indietro
      </button>
      
      <h1 className="intensity-title">
        Quanto mi sento <span style={{ color: emotion.color, fontWeight: 800 }}>{emotion.name}</span>?
      </h1>
      
      <div className={`emotion-display ${animate ? 'pulse' : ''}`}>
        <span className="emotion-emoji large" style={{ fontSize: `${60 + sliderValue * 6}px` }}>
          {emotion.emoji}
        </span>
      </div>
      
      <div className="slider-container">
        <div className="slider-labels">
          <span>Un po'</span>
          <span>Abbastanza</span>
          <span>Molto</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="3" 
          value={sliderValue} 
          onChange={handleSliderChange}
          className="intensity-slider"
          aria-label="Seleziona intensità dell'emozione"
          style={{ 
            background: `linear-gradient(to right, ${emotion.color}20, ${emotion.color}80)`,
          }}
        />
        <div 
          className="selected-intensity"
          style={{ color: emotion.color }}
        >
          {getIntensityLabel()}
        </div>
      </div>
      
      <button 
        className={`continue-button ${animate ? 'fade-in' : ''}`}
        onClick={handleContinue}
        aria-label="Continua"
        style={{ 
          background: `linear-gradient(to right, ${emotion.color}, ${adjustColor(emotion.color, -30)})`,
          boxShadow: `0 4px 15px ${emotion.color}50`
        }}
      >
        Continua
      </button>
    </div>
  );
}

// Funzione helper per scurire un colore
function adjustColor(color, amount) {
  // Se il colore è in formato esadecimale, lo convertiamo in RGB
  if (color.startsWith('#')) {
    color = hexToRgb(color);
  }
  
  // Se il colore è in formato rgba o rgb
  const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/);
  if (rgbMatch) {
    const r = Math.max(0, Math.min(255, parseInt(rgbMatch[1]) + amount));
    const g = Math.max(0, Math.min(255, parseInt(rgbMatch[2]) + amount));
    const b = Math.max(0, Math.min(255, parseInt(rgbMatch[3]) + amount));
    return `rgb(${r}, ${g}, ${b})`;
  }
  
  // Se non riusciamo a manipolare il colore, restituiamo l'originale
  return color;
}

// Funzione helper per convertire da hex a rgb
function hexToRgb(hex) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
    : null;
}

export default IntensitySlider;