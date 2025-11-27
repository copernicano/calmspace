/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Visual Timer - Autism-Friendly Timer with Advanced Features
 * ═══════════════════════════════════════════════════════════════════
 *
 * Features:
 * - PAUSE function (not just stop/reset)
 * - Multiple alert types (audio, visual, vibration)
 * - Custom duration input + presets
 * - Time remaining warnings at configurable intervals
 * - Session history log
 * - Clear visual progress indication
 * - Large touch targets and predictable controls
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/design-system.css';
import '../../styles/enhanced-timer.css';

const EnhancedVisualTimer = () => {
  const { settings } = useEnhancedSettings();

  // Timer State
  const [timerState, setTimerState] = useState('idle'); // 'idle' | 'running' | 'paused' | 'completed'
  const [duration, setDuration] = useState(5 * 60); // Duration in seconds (default 5 min)
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [startTime, setStartTime] = useState(null);
  const [pausedTime, setPausedTime] = useState(null);

  // Alert Settings
  const [alertSettings, setAlertSettings] = useState({
    audio: true,
    visual: true,
    vibration: false,
    warningIntervals: [120, 60, 30, 10], // Warnings at 2min, 1min, 30sec, 10sec
  });

  // Custom Duration Input
  const [customMinutes, setCustomMinutes] = useState(5);
  const [showCustomInput, setShowCustomInput] = useState(false);

  // Session History
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  // Alert tracking
  const alertsTriggered = useRef(new Set());
  const audioRef = useRef(null);

  // Preset durations (in minutes)
  const presets = [1, 5, 10, 15, 20, 25, 30];

  /* ═══════════════════════════════════════════════════════════════════
     Timer Logic
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    let interval;

    if (timerState === 'running') {
      interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000);
        const remaining = duration - elapsed;

        if (remaining <= 0) {
          // Timer completed
          handleTimerComplete();
        } else {
          setTimeRemaining(remaining);

          // Check for warnings
          checkWarnings(remaining);
        }
      }, 100); // Update every 100ms for smooth animation
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerState, startTime, duration]);

  /* ═══════════════════════════════════════════════════════════════════
     Timer Controls
     ═══════════════════════════════════════════════════════════════════ */

  const startTimer = () => {
    setTimerState('running');
    setStartTime(Date.now());
    setTimeRemaining(duration);
    alertsTriggered.current.clear();
  };

  const pauseTimer = () => {
    if (timerState === 'running') {
      setTimerState('paused');
      setPausedTime(Date.now());
    }
  };

  const resumeTimer = () => {
    if (timerState === 'paused') {
      // Adjust start time to account for pause duration
      const pauseDuration = Date.now() - pausedTime;
      setStartTime(startTime + pauseDuration);
      setTimerState('running');
    }
  };

  const stopTimer = () => {
    setTimerState('idle');
    setTimeRemaining(duration);
    setStartTime(null);
    setPausedTime(null);
    alertsTriggered.current.clear();
  };

  const handleTimerComplete = () => {
    setTimerState('completed');
    setTimeRemaining(0);

    // Trigger completion alerts
    triggerAlert('completion');

    // Add to history
    addToHistory(duration, 'completed');
  };

  const resetAndRestart = () => {
    stopTimer();
    setTimeout(() => startTimer(), 100);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Duration Management
     ═══════════════════════════════════════════════════════════════════ */

  const setPresetDuration = (minutes) => {
    const seconds = minutes * 60;
    setDuration(seconds);
    setTimeRemaining(seconds);
    setShowCustomInput(false);
  };

  const applyCustomDuration = () => {
    const seconds = Math.max(1, Math.min(customMinutes, 120)) * 60; // 1-120 min range
    setDuration(seconds);
    setTimeRemaining(seconds);
    setShowCustomInput(false);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Alert System
     ═══════════════════════════════════════════════════════════════════ */

  const checkWarnings = (remaining) => {
    alertSettings.warningIntervals.forEach((interval) => {
      if (remaining <= interval && !alertsTriggered.current.has(interval)) {
        triggerAlert('warning', remaining);
        alertsTriggered.current.add(interval);
      }
    });
  };

  const triggerAlert = (type, remaining = 0) => {
    // Audio alert
    if (alertSettings.audio && audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.log('Audio alert prevented:', err);
      });
    }

    // Visual alert (handled by CSS class)
    if (alertSettings.visual) {
      const timerElement = document.querySelector('.timer-circle');
      if (timerElement) {
        timerElement.classList.add('alert-flash');
        setTimeout(() => {
          timerElement.classList.remove('alert-flash');
        }, 1000);
      }
    }

    // Vibration alert (if supported)
    if (alertSettings.vibration && navigator.vibrate) {
      if (type === 'completion') {
        navigator.vibrate([200, 100, 200, 100, 200]);
      } else {
        navigator.vibrate(200);
      }
    }

    // Show notification text
    showAlertNotification(type, remaining);
  };

  const showAlertNotification = (type, remaining) => {
    let message = '';

    if (type === 'completion') {
      message = 'Timer completato!';
    } else if (type === 'warning') {
      const minutes = Math.floor(remaining / 60);
      const seconds = remaining % 60;

      if (minutes > 0) {
        message = `${minutes} minut${minutes > 1 ? 'i' : 'o'} rimast${minutes > 1 ? 'i' : 'o'}`;
      } else {
        message = `${seconds} second${seconds !== 1 ? 'i' : 'o'} rimast${seconds !== 1 ? 'i' : 'o'}`;
      }
    }

    // Could integrate with a toast notification system
    console.log(`[ALERT] ${message}`);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Session History
     ═══════════════════════════════════════════════════════════════════ */

  const addToHistory = (durationSeconds, status) => {
    const session = {
      id: Date.now(),
      date: new Date(),
      duration: durationSeconds,
      status: status, // 'completed' | 'cancelled'
    };

    setSessionHistory((prev) => [session, ...prev].slice(0, 10)); // Keep last 10
  };

  /* ═══════════════════════════════════════════════════════════════════
     Formatting Helpers
     ═══════════════════════════════════════════════════════════════════ */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('it-IT', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getProgressPercentage = () => {
    return ((duration - timeRemaining) / duration) * 100;
  };

  const getTimeRemainingDescription = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;

    if (minutes === 0) {
      return `${seconds} second${seconds !== 1 ? 'i' : 'o'}`;
    } else if (seconds === 0) {
      return `${minutes} minut${minutes > 1 ? 'i' : 'o'}`;
    } else {
      return `${minutes} min ${seconds} sec`;
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="enhanced-timer-container">
      {/* Hidden audio element for alerts */}
      <audio ref={audioRef} src="/assets/sounds/timer-beep.mp3" />

      {/* Header */}
      <header className="timer-header">
        <h1 className="timer-title">Timer Visuale</h1>
        <p className="timer-subtitle">Gestisci il tuo tempo con consapevolezza</p>
      </header>

      {/* Main Timer Display */}
      <div className={`timer-display-section state-${timerState}`}>
        {/* Circular Progress Indicator */}
        <div className="timer-circle-container">
          <svg className="timer-circle-svg" viewBox="0 0 200 200">
            {/* Background circle */}
            <circle
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--color-neutral-200)"
              strokeWidth="8"
            />

            {/* Progress circle */}
            <circle
              className="timer-progress-circle"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              stroke="var(--color-blue-500)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 90}`}
              strokeDashoffset={`${2 * Math.PI * 90 * (1 - getProgressPercentage() / 100)}`}
              transform="rotate(-90 100 100)"
            />
          </svg>

          {/* Time Display */}
          <div className="timer-circle timer-circle">
            <div className="timer-time-display">
              {formatTime(timeRemaining)}
            </div>
            <div className="timer-description">
              {timeRemaining > 0 ? getTimeRemainingDescription() : 'Completato!'}
            </div>
            {timerState === 'paused' && (
              <div className="timer-status-badge">In pausa</div>
            )}
          </div>
        </div>

        {/* State Message */}
        {timerState === 'completed' && (
          <div className="timer-completion-message">
            <span className="completion-icon">✓</span>
            <span className="completion-text">Sessione completata!</span>
          </div>
        )}
      </div>

      {/* Control Buttons */}
      <div className="timer-controls">
        {timerState === 'idle' && (
          <button className="btn btn-primary btn-lg" onClick={startTimer}>
            Inizia Timer
          </button>
        )}

        {timerState === 'running' && (
          <>
            <button className="btn btn-secondary btn-lg" onClick={pauseTimer}>
              ⏸ Pausa
            </button>
            <button className="btn btn-ghost" onClick={stopTimer}>
              ⏹ Stop
            </button>
          </>
        )}

        {timerState === 'paused' && (
          <>
            <button className="btn btn-primary btn-lg" onClick={resumeTimer}>
              ▶ Riprendi
            </button>
            <button className="btn btn-ghost" onClick={stopTimer}>
              ⏹ Stop
            </button>
          </>
        )}

        {timerState === 'completed' && (
          <>
            <button className="btn btn-primary btn-lg" onClick={resetAndRestart}>
              ↻ Riavvia Timer
            </button>
            <button className="btn btn-ghost" onClick={stopTimer}>
              Nuovo Timer
            </button>
          </>
        )}
      </div>

      {/* Duration Selection (only when idle) */}
      {timerState === 'idle' && (
        <div className="duration-selection-section">
          <h2 className="section-title">Durata timer</h2>

          {/* Preset Buttons */}
          <div className="preset-duration-grid">
            {presets.map((minutes) => (
              <button
                key={minutes}
                className={`preset-duration-btn ${duration === minutes * 60 ? 'active' : ''}`}
                onClick={() => setPresetDuration(minutes)}
              >
                {minutes} min
              </button>
            ))}
          </div>

          {/* Custom Duration Toggle */}
          <button
            className="custom-duration-toggle btn btn-ghost btn-sm"
            onClick={() => setShowCustomInput(!showCustomInput)}
          >
            {showCustomInput ? '− Nascondi' : '+ Durata personalizzata'}
          </button>

          {/* Custom Duration Input */}
          {showCustomInput && (
            <div className="custom-duration-input-section">
              <label htmlFor="custom-minutes" className="input-label">
                Minuti (1-120):
              </label>
              <div className="custom-duration-controls">
                <input
                  id="custom-minutes"
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(parseInt(e.target.value) || 1)}
                  className="custom-duration-input"
                />
                <button className="btn btn-secondary" onClick={applyCustomDuration}>
                  Applica
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Alert Settings */}
      <div className="alert-settings-section">
        <h2 className="section-title">Notifiche</h2>
        <div className="alert-toggles">
          <label className="alert-toggle-item">
            <input
              type="checkbox"
              checked={alertSettings.audio}
              onChange={(e) =>
                setAlertSettings({ ...alertSettings, audio: e.target.checked })
              }
            />
            <span className="toggle-label">🔊 Audio</span>
          </label>

          <label className="alert-toggle-item">
            <input
              type="checkbox"
              checked={alertSettings.visual}
              onChange={(e) =>
                setAlertSettings({ ...alertSettings, visual: e.target.checked })
              }
            />
            <span className="toggle-label">💡 Visuale</span>
          </label>

          {navigator.vibrate && (
            <label className="alert-toggle-item">
              <input
                type="checkbox"
                checked={alertSettings.vibration}
                onChange={(e) =>
                  setAlertSettings({ ...alertSettings, vibration: e.target.checked })
                }
              />
              <span className="toggle-label">📳 Vibrazione</span>
            </label>
          )}
        </div>
      </div>

      {/* Session History */}
      <div className="session-history-section">
        <button
          className="history-toggle btn btn-ghost btn-sm"
          onClick={() => setShowHistory(!showHistory)}
        >
          {showHistory ? '− Nascondi cronologia' : '+ Mostra cronologia'}
        </button>

        {showHistory && sessionHistory.length > 0 && (
          <div className="history-list">
            {sessionHistory.map((session) => (
              <div key={session.id} className="history-item">
                <span className="history-date">{formatDate(session.date)}</span>
                <span className="history-duration">
                  {Math.floor(session.duration / 60)} min
                </span>
                <span className={`history-status status-${session.status}`}>
                  {session.status === 'completed' ? '✓' : '✕'}
                </span>
              </div>
            ))}
          </div>
        )}

        {showHistory && sessionHistory.length === 0 && (
          <p className="history-empty">Nessuna sessione completata</p>
        )}
      </div>
    </div>
  );
};

export default EnhancedVisualTimer;
