/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Calm Space - Autism-Friendly Meditation & Breathing
 * ═══════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Persistent control bar (always accessible in fullscreen)
 * - Session timer with gentle end warnings
 * - Sensory customization (visual intensity, audio volume)
 * - Pattern/Breathing mode toggle without leaving fullscreen
 * - Preset session durations
 * - Minimizable controls (but never completely hidden)
 */

import React, { useState, useEffect, useRef } from 'react';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import { useNavigate } from 'react-router-dom';
import SessionTimer from '../common/SessionTimer';
import EnhancedSimplePatterns from './EnhancedSimplePatterns';
import EnhancedBreathingGuide from './EnhancedBreathingGuide';
import '../../styles/design-system.css';
import '../../styles/enhanced-calmspace.css';

const EnhancedCalmSpace = () => {
  const { settings } = useEnhancedSettings();
  const navigate = useNavigate();

  const [mode, setMode] = useState('patterns'); // 'patterns' | 'breathing'
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [controlsMinimized, setControlsMinimized] = useState(false);

  // Session Management
  const [sessionActive, setSessionActive] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(null); // minutes
  const [sessionStartTime, setSessionStartTime] = useState(null);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(null);

  // Sensory Controls
  const [visualIntensity, setVisualIntensity] = useState(settings.visualIntensity || 1);
  const [audioVolume, setAudioVolume] = useState(settings.soundVolume || 0.5);
  const [audioEnabled, setAudioEnabled] = useState(settings.soundEnabled || false);

  // Pattern/Breathing specific
  const [activePattern, setActivePattern] = useState('countryside'); // Start with new animation!
  const [animationSpeed, setAnimationSpeed] = useState('medium');

  const fullscreenRef = useRef(null);

  /* ═══════════════════════════════════════════════════════════════════
     Session Timer Management
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (!sessionActive || !sessionDuration) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      const remaining = sessionDuration * 60 - elapsed;

      setSessionTimeRemaining(remaining);

      // Gentle warnings
      if (remaining === 120) {
        // 2 minutes warning
        showNotification('2 minuti rimasti', 'info');
      } else if (remaining === 30) {
        // 30 seconds warning
        showNotification('30 secondi rimasti', 'info');
      } else if (remaining <= 0) {
        // Session ended
        handleSessionEnd();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionActive, sessionDuration, sessionStartTime]);

  /* ═══════════════════════════════════════════════════════════════════
     Session Handlers
     ═══════════════════════════════════════════════════════════════════ */

  const startSession = (duration) => {
    setSessionActive(true);
    setSessionDuration(duration);
    setSessionStartTime(Date.now());
    setSessionTimeRemaining(duration * 60);
    setIsFullscreen(true);
  };

  const handleSessionEnd = () => {
    setSessionActive(false);
    setSessionDuration(null);
    setSessionTimeRemaining(null);
    showNotification('Sessione completata! 🎉', 'success');
  };

  const pauseSession = () => {
    // TODO: Implement pause logic
    setSessionActive(false);
  };

  const resumeSession = () => {
    // TODO: Implement resume logic
    setSessionActive(true);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Fullscreen Management
     ═══════════════════════════════════════════════════════════════════ */

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (fullscreenRef.current.requestFullscreen) {
        fullscreenRef.current.requestFullscreen().catch(err => {
          console.error('Fullscreen request failed:', err);
        });
      }
      setIsFullscreen(true);
    } else {
      // Check if actually in fullscreen before trying to exit
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(err => {
          console.error('Exit fullscreen failed:', err);
        });
      }
      setIsFullscreen(false);
    }
  };

  // Listen for ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  /* ═══════════════════════════════════════════════════════════════════
     Notifications
     ═══════════════════════════════════════════════════════════════════ */

  const showNotification = (message, type = 'info') => {
    // Simple notification - could be enhanced with toast library
    console.log(`[${type.toUpperCase()}] ${message}`);
    // TODO: Implement proper notification UI
  };

  /* ═══════════════════════════════════════════════════════════════════
     Format Time Display
     ═══════════════════════════════════════════════════════════════════ */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div
      ref={fullscreenRef}
      className={`enhanced-calmspace-container ${isFullscreen ? 'fullscreen' : ''} ${
        controlsMinimized ? 'controls-minimized' : ''
      }`}
    >
      {/* ═══════════════════════════════════════════════════════════════
          Header (shown only when not in fullscreen)
          ═══════════════════════════════════════════════════════════════ */}
      {!isFullscreen && (
        <header className="calmspace-header">
          <h1 className="calmspace-title">Il mio spazio</h1>
          {settings.showSessionTimer && <SessionTimer />}
        </header>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Mode Selector (shown only when not in fullscreen)
          ═══════════════════════════════════════════════════════════════ */}
      {!isFullscreen && (
        <div className="mode-selector">
          <button
            className={`mode-button ${mode === 'patterns' ? 'active' : ''}`}
            onClick={() => setMode('patterns')}
            aria-pressed={mode === 'patterns'}
          >
            <span className="mode-icon">🌊</span>
            <span className="mode-label">Pattern</span>
          </button>
          <button
            className={`mode-button ${mode === 'breathing' ? 'active' : ''}`}
            onClick={() => setMode('breathing')}
            aria-pressed={mode === 'breathing'}
          >
            <span className="mode-icon">🫁</span>
            <span className="mode-label">Respirazione</span>
          </button>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Quick Session Presets (shown only when not in fullscreen)
          ═══════════════════════════════════════════════════════════════ */}
      {!isFullscreen && (
        <div className="session-presets">
          <h3 className="presets-title">Durata sessione:</h3>
          <div className="preset-buttons">
            <button className="btn btn-secondary" onClick={() => startSession(5)}>
              5 min
            </button>
            <button className="btn btn-secondary" onClick={() => startSession(10)}>
              10 min
            </button>
            <button className="btn btn-secondary" onClick={() => startSession(15)}>
              15 min
            </button>
            <button className="btn btn-secondary" onClick={() => startSession(20)}>
              20 min
            </button>
            <button className="btn btn-ghost" onClick={() => toggleFullscreen()}>
              Libera
            </button>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Content Area (Pattern or Breathing)
          ═══════════════════════════════════════════════════════════════ */}
      <div className="calmspace-content">
        {mode === 'patterns' ? (
          <EnhancedSimplePatterns
            isFullscreen={isFullscreen}
            visualIntensity={visualIntensity}
            audioVolume={audioVolume}
            audioEnabled={audioEnabled}
            activePattern={activePattern}
            animationSpeed={animationSpeed}
            onPatternChange={setActivePattern}
            onSpeedChange={setAnimationSpeed}
          />
        ) : (
          <EnhancedBreathingGuide
            isFullscreen={isFullscreen}
            audioVolume={audioVolume}
            audioEnabled={audioEnabled}
          />
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Persistent Control Bar (ALWAYS visible, even in fullscreen)
          ═══════════════════════════════════════════════════════════════ */}
      <div className={`persistent-controls ${controlsMinimized ? 'minimized' : ''}`}>
        {/* Minimize/Expand Toggle */}
        <button
          className="minimize-toggle"
          onClick={() => setControlsMinimized(!controlsMinimized)}
          aria-label={controlsMinimized ? 'Espandi controlli' : 'Riduci controlli'}
        >
          {controlsMinimized ? '▲' : '▼'}
        </button>

        {!controlsMinimized && (
          <div className="controls-content">
            {/* Session Timer Display (if active) */}
            {sessionActive && sessionTimeRemaining !== null && (
              <div className="session-timer-display">
                <span className="timer-label">Tempo rimanente:</span>
                <span className="timer-value">{formatTime(sessionTimeRemaining)}</span>
              </div>
            )}

            {/* Mode Switcher (in fullscreen) */}
            {isFullscreen && (
              <div className="mode-switcher">
                <button
                  className={`mode-switch-btn ${mode === 'patterns' ? 'active' : ''}`}
                  onClick={() => setMode('patterns')}
                >
                  🌊
                </button>
                <button
                  className={`mode-switch-btn ${mode === 'breathing' ? 'active' : ''}`}
                  onClick={() => setMode('breathing')}
                >
                  🫁
                </button>
              </div>
            )}

            {/* Pattern Selector (when in patterns mode) */}
            {mode === 'patterns' && (
              <div className="pattern-selector-mini">
                <button
                  className={`pattern-mini-btn ${activePattern === 'countryside' ? 'active' : ''}`}
                  onClick={() => setActivePattern('countryside')}
                  title="Campagna"
                >
                  🌾
                </button>
                <button
                  className={`pattern-mini-btn ${activePattern === 'bubbles' ? 'active' : ''}`}
                  onClick={() => setActivePattern('bubbles')}
                  title="Bolle"
                >
                  🫧
                </button>
                <button
                  className={`pattern-mini-btn ${activePattern === 'waves' ? 'active' : ''}`}
                  onClick={() => setActivePattern('waves')}
                  title="Onde"
                >
                  🌊
                </button>
                <button
                  className={`pattern-mini-btn ${activePattern === 'stars' ? 'active' : ''}`}
                  onClick={() => setActivePattern('stars')}
                  title="Stelle"
                >
                  ✨
                </button>
                <button
                  className={`pattern-mini-btn ${activePattern === 'abstract' ? 'active' : ''}`}
                  onClick={() => setActivePattern('abstract')}
                  title="Geometrico"
                >
                  📐
                </button>
              </div>
            )}

            {/* Audio Controls */}
            <div className="audio-controls">
              <button
                className={`audio-toggle ${audioEnabled ? 'active' : ''}`}
                onClick={() => setAudioEnabled(!audioEnabled)}
                aria-label={audioEnabled ? 'Disattiva audio' : 'Attiva audio'}
              >
                {audioEnabled ? '🔊' : '🔇'}
              </button>
              {audioEnabled && (
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={audioVolume}
                  onChange={(e) => setAudioVolume(parseFloat(e.target.value))}
                  className="volume-slider"
                  aria-label="Volume"
                />
              )}
            </div>

            {/* Visual Intensity Control */}
            {mode === 'patterns' && (
              <div className="intensity-control">
                <span className="control-label">Intensità:</span>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.1"
                  value={visualIntensity}
                  onChange={(e) => setVisualIntensity(parseFloat(e.target.value))}
                  className="intensity-slider"
                  aria-label="Intensità visiva"
                />
              </div>
            )}

            {/* Animation Speed Control */}
            {mode === 'patterns' && (
              <div className="speed-control">
                <button
                  className={`speed-btn ${animationSpeed === 'slow' ? 'active' : ''}`}
                  onClick={() => setAnimationSpeed('slow')}
                >
                  🐢 Lento
                </button>
                <button
                  className={`speed-btn ${animationSpeed === 'medium' ? 'active' : ''}`}
                  onClick={() => setAnimationSpeed('medium')}
                >
                  🐇 Medio
                </button>
              </div>
            )}

            {/* Fullscreen Toggle */}
            <button
              className="fullscreen-toggle btn btn-ghost btn-sm"
              onClick={toggleFullscreen}
            >
              {isFullscreen ? '⛶ Esci' : '⛶ Schermo intero'}
            </button>

            {/* Exit Button */}
            <button
              className="exit-button btn btn-ghost btn-sm"
              onClick={() => navigate('/')}
            >
              ✕ Esci
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCalmSpace;
