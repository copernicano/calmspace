import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsContext } from '../contexts/SettingsContext';
import '../styles/components.css';

function HomePage() {
  const navigate = useNavigate();
  const { settings } = useContext(SettingsContext);
  
  // Applica la classe CSS in base alle impostazioni dell'utente
  const containerClass = `home-container theme-${settings.theme} ui-size-${settings.uiSize}`;
  
  return (
    <div className={containerClass}>
      <h1 className="app-title">CalmSpace</h1>
      
      <div className="main-menu">
        <button 
          className="menu-button emotion-button"
          onClick={() => navigate('/emotion')}
          aria-label="Come mi sento"
        >
          <div className="icon">😊</div>
          <span className="button-text">Come mi sento</span>
        </button>
        
        <button 
          className="menu-button calm-button"
          onClick={() => navigate('/calm-space')}
          aria-label="Il mio spazio"
        >
          <div className="icon">🌈</div>
          <span className="button-text">Il mio spazio</span>
        </button>
        
        <button 
          className="menu-button timer-button"
          onClick={() => navigate('/timer')}
          aria-label="I miei timer"
        >
          <div className="icon">⏱️</div>
          <span className="button-text">I miei timer</span>
        </button>
      </div>
      
      <button 
        className="settings-button"
        onClick={() => navigate('/settings')}
        aria-label="Impostazioni"
      >
        <div className="icon small-icon">⚙️</div>
        <span className="button-text">Impostazioni</span>
      </button>
    </div>
  );
}

export default HomePage;