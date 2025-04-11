import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/components.css';

// Componente di navigazione con pulsante home fluttuante
function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hover, setHover] = useState(false);
  
  // Se siamo già nella home, non mostrare il pulsante home
  const isHomePage = location.pathname === '/';
  
  if (isHomePage) return null; // Non renderizzare nulla se sei già nella home
  
  return (
    <div className="navigation-container">
      <button 
        className="home-button"
        onClick={() => navigate('/')}
        aria-label="Torna alla Home"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="icon home-icon">🏠</div>
        {hover && <span className="button-text">Home</span>}
      </button>
    </div>
  );
}

export default Navigation;