import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/components.css';

// Componente di navigazione con icone grandi e testo minimo
function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Se siamo già nella home, non mostrare il pulsante home
  const isHomePage = location.pathname === '/';
  
  return (
    <div className="navigation-container">
      {!isHomePage && (
        <button 
          className="home-button"
          onClick={() => navigate('/')}
          aria-label="Torna alla Home"
        >
          <div className="icon home-icon">🏠</div>
          <span className="button-text">Home</span>
        </button>
      )}
    </div>
  );
}

export default Navigation;