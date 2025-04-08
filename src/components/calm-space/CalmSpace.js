import React, { useState, useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import SimplePatterns from './SimplePatterns';
import BreathingGuide from './BreathingGuide';
import '../../styles/calmspace.css';

function CalmSpace() {
  const { settings } = useContext(SettingsContext);
  const [activeSection, setActiveSection] = useState('patterns'); // 'patterns' o 'breathing'
  
  // Classe contenitore basata sulle impostazioni
  const containerClass = `calmspace-container theme-${settings.theme} ui-size-${settings.uiSize}`;
  
  return (
    <div className={containerClass}>
      <h1 className="calmspace-title">Il mio spazio</h1>
      
      <div className="section-selector">
        <button 
          className={`section-button ${activeSection === 'patterns' ? 'active' : ''}`}
          onClick={() => setActiveSection('patterns')}
          aria-label="Pattern"
        >
          <span>Pattern</span>
        </button>
        <button 
          className={`section-button ${activeSection === 'breathing' ? 'active' : ''}`}
          onClick={() => setActiveSection('breathing')}
          aria-label="Respirazione"
        >
          <span>Respirazione</span>
        </button>
      </div>
      
      <div className="calmspace-content">
        {activeSection === 'patterns' ? (
          <SimplePatterns settings={settings} />
        ) : (
          <BreathingGuide settings={settings} />
        )}
      </div>
    </div>
  );
}

export default CalmSpace;