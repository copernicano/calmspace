import React, { useState, useContext, useEffect } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import SimplePatterns from './SimplePatterns';
import BreathingGuide from './BreathingGuide';
import '../../styles/calmspace.css';

function CalmSpace() {
  const { settings } = useContext(SettingsContext);
  const [activeSection, setActiveSection] = useState('patterns'); // 'patterns' o 'breathing'
  
  // Monitora se uno dei componenti figli è in modalità schermo intero
  const [isChildFullscreen, setIsChildFullscreen] = useState(false);
  
  // Classe contenitore basata sulle impostazioni
  const containerClass = `calmspace-container theme-${settings.theme} ui-size-${settings.uiSize} ${isChildFullscreen ? 'child-fullscreen' : ''}`;
  
  // Aggiunge gestione del tasto Escape per uscire dalla modalità schermo intero
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isChildFullscreen) {
        // Notifica che il componente figlio ha lasciato la modalità fullscreen
        setIsChildFullscreen(false);
      }
    };
    
    if (isChildFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isChildFullscreen]);
  
  // Callback per quando un componente figlio entra/esce dalla modalità schermo intero
  const handleChildFullscreenChange = (isFullscreen) => {
    setIsChildFullscreen(isFullscreen);
  };
  
  return (
    <div className={containerClass}>
      {!isChildFullscreen && (
        <>
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
        </>
      )}
      
      <div className={`calmspace-content ${isChildFullscreen ? 'fullscreen-child' : ''}`}>
        {activeSection === 'patterns' ? (
          <SimplePatterns 
            settings={settings} 
            onFullscreenChange={handleChildFullscreenChange}
          />
        ) : (
          <BreathingGuide 
            settings={settings} 
            onFullscreenChange={handleChildFullscreenChange}
          />
        )}
      </div>
    </div>
  );
}

export default CalmSpace;