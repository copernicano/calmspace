import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import '../../styles/components.css';

// Componente di navigazione con pulsante home trascinabile
function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const navRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState(() => {
    // Carica la posizione salvata o usa la posizione predefinita
    const savedPosition = getFromStorage('homeButtonPosition');
    return savedPosition ? JSON.parse(savedPosition) : { x: null, y: null };
  });
  const [showHelper, setShowHelper] = useState(false);
  
  // Riferimenti per il trascinamento
  const dragOffset = useRef({ x: 0, y: 0 });
  
  // Se siamo già nella home, non mostrare il pulsante home
  const isHomePage = location.pathname === '/';
  
  // Effetto per mostrare il messaggio helper solo al primo caricamento
  useEffect(() => {
    const hasSeenHelper = getFromStorage('homeButtonHelperSeen');
    if (!hasSeenHelper && !isHomePage) {
      setShowHelper(true);
      saveToStorage('homeButtonHelperSeen', 'true');
      
      // Nasconde il messaggio dopo 3 secondi
      const timer = setTimeout(() => {
        setShowHelper(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isHomePage]);
  
  // Applica la posizione salvata
  useEffect(() => {
    if (navRef.current && position.x !== null && position.y !== null) {
      navRef.current.style.left = `${position.x}px`;
      navRef.current.style.top = `${position.y}px`;
      // Rimuoviamo bottom e right quando impostiamo manualmente top e left
      navRef.current.style.bottom = 'auto';
      navRef.current.style.right = 'auto';
    }
  }, [position]);
  
  // Funzioni per il trascinamento
  const handleMouseDown = (e) => {
    // Evita il trascinamento quando si clicca sul pulsante stesso (per navigare)
    if (e.target.className === 'home-button' || e.target.closest('.home-button')) {
      // Permettiamo il click del pulsante
      return;
    }
    
    e.preventDefault();
    
    const rect = navRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    setIsDragging(true);
    
    // Aggiungi event listener per il movimento e il rilascio
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newLeft = e.clientX - dragOffset.current.x;
    const newTop = e.clientY - dragOffset.current.y;
    
    // Assicurati che il pulsante rimanga all'interno della finestra
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const buttonWidth = navRef.current.offsetWidth;
    const buttonHeight = navRef.current.offsetHeight;
    
    const boundedLeft = Math.max(0, Math.min(newLeft, windowWidth - buttonWidth));
    const boundedTop = Math.max(0, Math.min(newTop, windowHeight - buttonHeight));
    
    navRef.current.style.left = `${boundedLeft}px`;
    navRef.current.style.top = `${boundedTop}px`;
    navRef.current.style.bottom = 'auto';
    navRef.current.style.right = 'auto';
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Salva la nuova posizione
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      const newPosition = { x: rect.left, y: rect.top };
      setPosition(newPosition);
      saveToStorage('homeButtonPosition', JSON.stringify(newPosition));
    }
    
    // Rimuovi event listener
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  // Event listeners per dispositivi touch
  const handleTouchStart = (e) => {
    // Ignora se si tocca il pulsante stesso (per navigare)
    if (e.target.className === 'home-button' || e.target.closest('.home-button')) {
      return;
    }
    
    const touch = e.touches[0];
    const rect = navRef.current.getBoundingClientRect();
    
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    setIsDragging(true);
  };
  
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    
    e.preventDefault(); // Previeni lo scroll mentre si trascina
    
    const touch = e.touches[0];
    const newLeft = touch.clientX - dragOffset.current.x;
    const newTop = touch.clientY - dragOffset.current.y;
    
    // Assicurati che il pulsante rimanga all'interno della finestra
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const buttonWidth = navRef.current.offsetWidth;
    const buttonHeight = navRef.current.offsetHeight;
    
    const boundedLeft = Math.max(0, Math.min(newLeft, windowWidth - buttonWidth));
    const boundedTop = Math.max(0, Math.min(newTop, windowHeight - buttonHeight));
    
    navRef.current.style.left = `${boundedLeft}px`;
    navRef.current.style.top = `${boundedTop}px`;
    navRef.current.style.bottom = 'auto';
    navRef.current.style.right = 'auto';
  };
  
  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Salva la nuova posizione
    if (navRef.current) {
      const rect = navRef.current.getBoundingClientRect();
      const newPosition = { x: rect.left, y: rect.top };
      setPosition(newPosition);
      saveToStorage('homeButtonPosition', JSON.stringify(newPosition));
    }
  };
  
  if (isHomePage) return null; // Non renderizzare nulla se sei già nella home
  
  return (
    <div 
      ref={navRef}
      className={`navigation-container ${isDragging ? 'dragging' : ''}`}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {showHelper && (
        <div className="drag-helper">
          Trascina questo pulsante dove preferisci
        </div>
      )}
      <button 
        className="home-button"
        onClick={() => navigate('/')}
        aria-label="Torna alla Home"
      >
        <div className="icon home-icon">🏠</div>
        <span className="home-tooltip">Home</span>
      </button>
    </div>
  );
}

export default Navigation;