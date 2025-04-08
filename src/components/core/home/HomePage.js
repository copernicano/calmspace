// src/components/home/HomePage.js
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../../../contexts/SettingsContext';
import '../../../styles/components.css'; // Ruta corregida - subimos dos niveles

function HomePage() {
  const { settings } = useContext(SettingsContext);
  
  // Clase contenedor basada en las impostaciones
  const containerClass = `home-container theme-${settings.theme} ui-size-${settings.uiSize}`;
  
  return (
    <div className={containerClass}>
      <h1 className="app-title">CalmSpace</h1>
      
      <div className="main-menu">
        <Link to="/emotion" className="menu-button" aria-label="Come mi sento">
          <span className="icon">😊</span>
          <span className="button-text">Come mi sento</span>
        </Link>
        
        <Link to="/calmspace" className="menu-button" aria-label="Il mio spazio">
          <span className="icon">🌈</span>
          <span className="button-text">Il mio spazio</span>
        </Link>
        
        <Link to="/timer" className="menu-button" aria-label="I miei timer">
          <span className="icon">⏱️</span>
          <span className="button-text">I miei timer</span>
        </Link>
      </div>
      
      <Link to="/settings" className="settings-button" aria-label="Impostazioni">
        <span className="small-icon">⚙️</span>
        <span className="button-text">Impostazioni</span>
      </Link>
    </div>
  );
}

export default HomePage;