import React, { useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import '../../styles/components.css';

function Settings() {
  const { settings, updateSettings } = useContext(SettingsContext);
  
  // Gestori degli eventi per i cambiamenti delle impostazioni
  const handleThemeChange = (e) => {
    updateSettings({ theme: e.target.value });
  };
  
  const handleAnimationLevelChange = (e) => {
    updateSettings({ animationLevel: e.target.value });
  };
  
  const handleUiSizeChange = (e) => {
    updateSettings({ uiSize: e.target.value });
  };
  
  const handleStimulationLevelChange = (e) => {
    updateSettings({ stimulationLevel: e.target.value });
  };
  
  // Classe contenitore basata sulle impostazioni correnti
  const containerClass = `settings-container theme-${settings.theme} ui-size-${settings.uiSize}`;
  
  return (
    <div className={containerClass}>
      <h1 className="settings-title">Impostazioni</h1>
      
      <div className="settings-section">
        <h2 className="section-title">Tema colori</h2>
        <div className="option-buttons">
          <button 
            className={`option-button ${settings.theme === 'blue' ? 'active' : ''}`}
            onClick={() => updateSettings({ theme: 'blue' })}
            aria-label="Tema blu"
          >
            <div className="color-preview blue"></div>
            <span>Blu</span>
          </button>
          <button 
            className={`option-button ${settings.theme === 'green' ? 'active' : ''}`}
            onClick={() => updateSettings({ theme: 'green' })}
            aria-label="Tema verde"
          >
            <div className="color-preview green"></div>
            <span>Verde</span>
          </button>
          <button 
            className={`option-button ${settings.theme === 'purple' ? 'active' : ''}`}
            onClick={() => updateSettings({ theme: 'purple' })}
            aria-label="Tema viola"
          >
            <div className="color-preview purple"></div>
            <span>Viola</span>
          </button>
          <button 
            className={`option-button ${settings.theme === 'orange' ? 'active' : ''}`}
            onClick={() => updateSettings({ theme: 'orange' })}
            aria-label="Tema arancione"
          >
            <div className="color-preview orange"></div>
            <span>Arancione</span>
          </button>
        </div>
      </div>
      
      <div className="settings-section">
        <h2 className="section-title">Livello animazioni</h2>
        <div className="option-buttons">
          <button 
            className={`option-button ${settings.animationLevel === 'low' ? 'active' : ''}`}
            onClick={() => updateSettings({ animationLevel: 'low' })}
            aria-label="Animazioni basso livello"
          >
            <span>Basso</span>
          </button>
          <button 
            className={`option-button ${settings.animationLevel === 'medium' ? 'active' : ''}`}
            onClick={() => updateSettings({ animationLevel: 'medium' })}
            aria-label="Animazioni medio livello"
          >
            <span>Medio</span>
          </button>
        </div>
      </div>
      
      <div className="settings-section">
        <h2 className="section-title">Dimensione elementi</h2>
        <div className="option-buttons">
          <button 
            className={`option-button ${settings.uiSize === 'standard' ? 'active' : ''}`}
            onClick={() => updateSettings({ uiSize: 'standard' })}
            aria-label="Dimensione standard"
          >
            <span>Standard</span>
          </button>
          <button 
            className={`option-button ${settings.uiSize === 'large' ? 'active' : ''}`}
            onClick={() => updateSettings({ uiSize: 'large' })}
            aria-label="Dimensione grande"
          >
            <span>Grande</span>
          </button>
        </div>
      </div>
      
      <div className="settings-section">
        <h2 className="section-title">Livello stimolazione</h2>
        <div className="option-buttons">
          <button 
            className={`option-button ${settings.stimulationLevel === 'low' ? 'active' : ''}`}
            onClick={() => updateSettings({ stimulationLevel: 'low' })}
            aria-label="Stimolazione bassa"
          >
            <span>Basso</span>
          </button>
          <button 
            className={`option-button ${settings.stimulationLevel === 'medium' ? 'active' : ''}`}
            onClick={() => updateSettings({ stimulationLevel: 'medium' })}
            aria-label="Stimolazione media"
          >
            <span>Medio</span>
          </button>
          <button 
            className={`option-button ${settings.stimulationLevel === 'high' ? 'active' : ''}`}
            onClick={() => updateSettings({ stimulationLevel: 'high' })}
            aria-label="Stimolazione alta"
          >
            <span>Alto</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;