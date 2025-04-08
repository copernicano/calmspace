import React, { useState, useContext } from 'react';
import { SettingsContext } from '../../contexts/SettingsContext';
import SimpleRoutine from './SimpleRoutine';
import '../../styles/timer.css';

function VisualTimer() {
  const { settings } = useContext(SettingsContext);
  const [activeSection, setActiveSection] = useState('timer'); // 'timer' o 'routine'
  
  // Stato per il timer
  const [timerDuration, setTimerDuration] = useState(5); // durata in minuti
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(timerDuration * 60); // tempo rimanente in secondi
  
  // Riferimento al timer
  const [timerInterval, setTimerInterval] = useState(null);
  
  // Gestisce il cambio della durata del timer
  const handleDurationChange = (minutes) => {
    setTimerDuration(minutes);
    setTimeLeft(minutes * 60);
    // Se il timer è attivo, lo ferma e lo riavvia con la nuova durata
    if (isTimerActive) {
      stopTimer();
      startTimer(minutes * 60);
    }
  };
  
  // Avvia il timer
  const startTimer = (seconds) => {
    if (timerInterval) clearInterval(timerInterval);
    
    const startTime = Date.now();
    const endTime = startTime + seconds * 1000;
    
    setIsTimerActive(true);
    
    const interval = setInterval(() => {
      const currentTime = Date.now();
      const remaining = Math.round((endTime - currentTime) / 1000);
      
      if (remaining <= 0) {
        clearInterval(interval);
        setTimeLeft(0);
        setIsTimerActive(false);
        playAlarmSound();
      } else {
        setTimeLeft(remaining);
      }
    }, 1000);
    
    setTimerInterval(interval);
  };
  
  // Ferma il timer
  const stopTimer = () => {
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    setIsTimerActive(false);
  };
  
  // Ripristina il timer
  const resetTimer = () => {
    stopTimer();
    setTimeLeft(timerDuration * 60);
  };
  
  // Riproduce un suono di allarme quando il timer scade
  const playAlarmSound = () => {
    // Per semplicità, usiamo un semplice beep
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 440; // A4 note
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Imposta il volume e la durata
    gainNode.gain.value = 0.5;
    oscillator.start();
    
    // Ferma il suono dopo 1 secondo
    setTimeout(() => {
      oscillator.stop();
    }, 1000);
  };
  
  // Formatta il tempo rimanente in minuti:secondi
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Calcola la percentuale di completamento del timer
  const calculateProgress = () => {
    const totalSeconds = timerDuration * 60;
    return ((totalSeconds - timeLeft) / totalSeconds) * 100;
  };
  
  // Classe contenitore basata sulle impostazioni
  const containerClass = `timer-container theme-${settings.theme} ui-size-${settings.uiSize}`;
  
  return (
    <div className={containerClass}>
      <h1 className="timer-title">I miei timer</h1>
      
      <div className="section-selector">
        <button 
          className={`section-button ${activeSection === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveSection('timer')}
          aria-label="Timer"
        >
          <span>Timer</span>
        </button>
        <button 
          className={`section-button ${activeSection === 'routine' ? 'active' : ''}`}
          onClick={() => setActiveSection('routine')}
          aria-label="Routine"
        >
          <span>Routine</span>
        </button>
      </div>
      
      {activeSection === 'timer' ? (
        <div className="timer-content">
          <div className="timer-display">
            <div className="timer-circle-container">
              <div className="timer-circle">
                <div className="timer-progress" style={{ 
                  background: `conic-gradient(
                    var(--primary-color) ${calculateProgress()}%, 
                    transparent ${calculateProgress()}%
                  )`
                }}></div>
                <div className="timer-inner-circle">
                  <span className="timer-text">{formatTime(timeLeft)}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="duration-buttons">
            <button 
              className={`duration-button ${timerDuration === 1 ? 'active' : ''}`}
              onClick={() => handleDurationChange(1)}
              disabled={isTimerActive}
            >
              1 min
            </button>
            <button 
              className={`duration-button ${timerDuration === 5 ? 'active' : ''}`}
              onClick={() => handleDurationChange(5)}
              disabled={isTimerActive}
            >
              5 min
            </button>
            <button 
              className={`duration-button ${timerDuration === 10 ? 'active' : ''}`}
              onClick={() => handleDurationChange(10)}
              disabled={isTimerActive}
            >
              10 min
            </button>
            <button 
              className={`duration-button ${timerDuration === 15 ? 'active' : ''}`}
              onClick={() => handleDurationChange(15)}
              disabled={isTimerActive}
            >
              15 min
            </button>
          </div>
          
          <div className="timer-controls">
            {!isTimerActive ? (
              <button 
                className="start-timer-button"
                onClick={() => startTimer(timeLeft)}
                aria-label="Avvia timer"
              >
                Avvia
              </button>
            ) : (
              <button 
                className="stop-timer-button"
                onClick={stopTimer}
                aria-label="Ferma timer"
              >
                Ferma
              </button>
            )}
            
            <button 
              className="reset-timer-button"
              onClick={resetTimer}
              aria-label="Ripristina timer"
              disabled={timeLeft === timerDuration * 60}
            >
              Ripristina
            </button>
          </div>
        </div>
      ) : (
        <SimpleRoutine settings={settings} />
      )}
    </div>
  );
}

export default VisualTimer;