import React, { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import '../../styles/calmspace.css';

function SimplePatterns({ settings }) {
  // Recupera il pattern selezionato dal localStorage o imposta default
  const [selectedPattern, setSelectedPattern] = useState(() => {
    const savedPattern = getFromStorage('selectedPattern');
    return savedPattern || 'bubbles';
  });

  // Intensità dell'animazione basata sulle impostazioni
  const animationIntensity = settings.animationLevel === 'low' ? 'slow' : 'medium';
  
  // Salva la selezione quando cambia
  useEffect(() => {
    saveToStorage('selectedPattern', selectedPattern);
  }, [selectedPattern]);
  
  // Selezione del pattern
  const handlePatternSelect = (pattern) => {
    setSelectedPattern(pattern);
  };
  
  return (
    <div className="patterns-container">
      <div className="pattern-options">
        <button 
          className={`pattern-button ${selectedPattern === 'bubbles' ? 'active' : ''}`}
          onClick={() => handlePatternSelect('bubbles')}
          aria-label="Bolle"
        >
          <span className="pattern-icon">○</span>
          <span>Bolle</span>
        </button>
        
        <button 
          className={`pattern-button ${selectedPattern === 'waves' ? 'active' : ''}`}
          onClick={() => handlePatternSelect('waves')}
          aria-label="Onde"
        >
          <span className="pattern-icon">〰️</span>
          <span>Onde</span>
        </button>
        
        <button 
          className={`pattern-button ${selectedPattern === 'stars' ? 'active' : ''}`}
          onClick={() => handlePatternSelect('stars')}
          aria-label="Stelle"
        >
          <span className="pattern-icon">✨</span>
          <span>Stelle</span>
        </button>
      </div>
      
      <div className={`pattern-display ${selectedPattern} ${animationIntensity}`}>
        {selectedPattern === 'bubbles' && (
          <div className="bubbles-container">
            {[...Array(15)].map((_, i) => (
              <div key={i} className="bubble" style={{
                '--delay': `${i * 0.5}s`,
                '--size': `${20 + Math.random() * 40}px`,
                '--left': `${Math.random() * 100}%`
              }}></div>
            ))}
          </div>
        )}
        
        {selectedPattern === 'waves' && (
          <div className="waves-container">
            <div className="wave wave1"></div>
            <div className="wave wave2"></div>
            <div className="wave wave3"></div>
          </div>
        )}
        
        {selectedPattern === 'stars' && (
          <div className="stars-container">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="star" style={{
                '--delay': `${i * 0.2}s`,
                '--size': `${2 + Math.random() * 4}px`,
                '--top': `${Math.random() * 100}%`,
                '--left': `${Math.random() * 100}%`
              }}></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SimplePatterns;