import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/emotion.css';

function BasicStrategies({ emotion, intensity, onBack }) {
  const navigate = useNavigate();
  
  // Strategie in base all'emozione e all'intensità
  const getStrategies = () => {
    // Determina quali strategie mostrare in base all'emozione e all'intensità
    const strategies = {
      felice: [
        { title: 'Condividi', description: 'Condividi la tua felicità con qualcuno', icon: '🗣️' },
        { title: 'Attività divertente', description: 'Fai qualcosa che ti piace', icon: '🎮' },
        { title: 'Gratitudine', description: 'Pensa a cosa ti rende felice', icon: '🙏' }
      ],
      triste: [
        { title: 'Respira', description: 'Fai qualche respiro profondo', icon: '🫁' },
        { title: 'Parla', description: 'Parla con qualcuno dei tuoi sentimenti', icon: '🗣️' },
        { title: 'Relax', description: 'Vai nel tuo spazio tranquillo', icon: '🧘' }
      ],
      arrabbiato: [
        { title: 'Calma', description: 'Fai 10 respiri profondi', icon: '🫁' },
        { title: 'Allontanati', description: 'Allontanati dalla situazione per un momento', icon: '🚶' },
        { title: 'Spazio sicuro', description: 'Vai nel tuo spazio tranquillo', icon: '🧘' }
      ],
      preoccupato: [
        { title: 'Respirazione', description: 'Usa la guida di respirazione', icon: '🫁' },
        { title: 'Pensieri', description: 'Scrivi ciò che ti preoccupa', icon: '✏️' },
        { title: 'Aiuto', description: 'Chiedi aiuto a un adulto', icon: '🙋' }
      ],
      calmo: [
        { title: 'Mantieni', description: 'Continua a fare ciò che ti fa stare bene', icon: '👍' },
        { title: 'Respirazione', description: 'Mantieni una respirazione regolare', icon: '🫁' },
        { title: 'Relax', description: 'Goditi questo momento di calma', icon: '😌' }
      ],
      confuso: [
        { title: 'Pausa', description: 'Prenditi un momento di pausa', icon: '⏸️' },
        { title: 'Semplifica', description: 'Concentrati su una cosa alla volta', icon: '📝' },
        { title: 'Aiuto', description: 'Chiedi aiuto a qualcuno', icon: '🙋' }
      ]
    };
    
    // Filtra in base all'intensità
    let filteredStrategies = strategies[emotion.name] || [];
    
    // Se l'intensità è alta (3), visualizza tutte le strategie
    // Se è media (2), visualizza le prime due
    // Se è bassa (1), visualizza solo la prima
    if (intensity < 3) {
      filteredStrategies = filteredStrategies.slice(0, intensity + 1);
    }
    
    return filteredStrategies;
  };
  
  // Naviga allo spazio calmo
  const goToCalmSpace = () => {
    navigate('/calmspace');
  };
  
  return (
    <div className="strategies-container" style={{ backgroundColor: `${emotion.color}30` }}>
      <button className="back-button" onClick={onBack} aria-label="Torna indietro">
        ← Indietro
      </button>
      
      <h1 className="strategies-title">
        Cosa posso fare quando mi sento <span style={{ color: emotion.color }}>{emotion.name}</span>
      </h1>
      
      <div className="emotion-display">
        <span className="emotion-emoji large">{emotion.emoji}</span>
      </div>
      
      <div className="strategies-list">
        {getStrategies().map((strategy, index) => (
          <div key={index} className="strategy-card">
            <div className="strategy-icon">{strategy.icon}</div>
            <div className="strategy-content">
              <h2 className="strategy-title">{strategy.title}</h2>
              <p className="strategy-description">{strategy.description}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="action-buttons">
        <button 
          className="calmspace-button"
          onClick={goToCalmSpace}
          aria-label="Vai al tuo spazio"
          style={{ backgroundColor: emotion.color }}
        >
          Vai al tuo spazio
        </button>
        
        <button 
          className="home-button-alt"
          onClick={() => navigate('/')}
          aria-label="Torna alla home"
        >
          Torna alla home
        </button>
      </div>
    </div>
  );
}
export default BasicStrategies;