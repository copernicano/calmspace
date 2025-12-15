/**
 * Tactile Breathing Mode - Respirazione Tattile
 * Cuore di particelle controllato dal movimento della mano
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import { createHeartParticleSystem } from './utils/heartParticles';
import { createHandTracker } from './utils/handTracking';

// Fasi respirazione 4-4-4-4
const BREATHING_PHASES = [
  { name: 'inhale', label: 'Inspira', duration: 4, targetOpenness: 1, icon: '🌬️' },
  { name: 'hold-in', label: 'Trattieni', duration: 4, targetOpenness: 1, icon: '⏸️' },
  { name: 'exhale', label: 'Espira', duration: 4, targetOpenness: 0, icon: '💨' },
  { name: 'hold-out', label: 'Trattieni', duration: 4, targetOpenness: 0, icon: '⏸️' }
];

const TactileBreathingMode = ({ isFullscreen, visualIntensity = 1, audioEnabled = false }) => {
  const { settings } = useEnhancedSettings();
  const theme = settings.theme || 'blue';

  // Refs
  const containerRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const videoRef = useRef(null);
  const particleSystemRef = useRef(null);
  const handTrackerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);

  // State
  const [webcamEnabled, setWebcamEnabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [webcamPermission, setWebcamPermission] = useState('prompt'); // 'prompt', 'granted', 'denied'
  const [handDetected, setHandDetected] = useState(false);
  const [handOpenness, setHandOpenness] = useState(0.5);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationProgress, setCalibrationProgress] = useState(0);

  // Breathing state
  const [isBreathing, setIsBreathing] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const [cycleCount, setCycleCount] = useState(0);

  // Touch fallback state
  const [isTouching, setIsTouching] = useState(false);

  // Calcola l'openness effettivo (da mano o touch)
  const effectiveOpenness = webcamEnabled && handDetected
    ? handOpenness
    : (isTouching ? 0 : 1);

  // Current phase
  const currentPhase = BREATHING_PHASES[currentPhaseIndex];

  /**
   * Inizializza Three.js
   */
  useEffect(() => {
    if (!canvasContainerRef.current) return;

    // Crea sistema particelle
    particleSystemRef.current = createHeartParticleSystem(
      canvasContainerRef.current,
      theme
    );

    // Animation loop
    const animate = () => {
      if (particleSystemRef.current) {
        particleSystemRef.current.update();
      }
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (particleSystemRef.current) {
        particleSystemRef.current.dispose();
        particleSystemRef.current = null;
      }
    };
  }, [theme]);

  /**
   * Aggiorna tema particelle quando cambia
   */
  useEffect(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.setTheme(theme);
    }
  }, [theme]);

  /**
   * Aggiorna espansione particelle
   */
  useEffect(() => {
    if (particleSystemRef.current) {
      particleSystemRef.current.setExpansion(effectiveOpenness);
    }
  }, [effectiveOpenness]);

  /**
   * Handler per aggiornamenti mano
   */
  const handleHandUpdate = useCallback((data) => {
    setHandDetected(data.detected);
    if (data.detected && data.openness !== null) {
      setHandOpenness(data.openness);
    }
    setIsCalibrating(data.isCalibrating);
    setCalibrationProgress(data.calibrationProgress);
  }, []);

  /**
   * Avvia webcam e hand tracking
   */
  const startWebcam = async () => {
    try {
      // Richiedi permesso webcam
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 640, height: 480 }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();

        // Inizializza hand tracker
        handTrackerRef.current = createHandTracker(videoRef.current, handleHandUpdate);
        await handTrackerRef.current.start();

        setWebcamPermission('granted');
        setWebcamEnabled(true);
      }
    } catch (error) {
      console.error('Webcam access denied:', error);
      setWebcamPermission('denied');
      setWebcamEnabled(false);
    }
  };

  /**
   * Ferma webcam
   */
  const stopWebcam = () => {
    if (handTrackerRef.current) {
      handTrackerRef.current.stop();
      handTrackerRef.current = null;
    }
    setWebcamEnabled(false);
    setHandDetected(false);
  };

  /**
   * Toggle webcam
   */
  const toggleWebcam = () => {
    if (webcamEnabled) {
      stopWebcam();
    } else {
      startWebcam();
    }
  };

  /**
   * Timer respirazione
   */
  useEffect(() => {
    if (!isBreathing) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    timerRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Passa alla fase successiva
          setCurrentPhaseIndex(prevIndex => {
            const nextIndex = (prevIndex + 1) % BREATHING_PHASES.length;
            if (nextIndex === 0) {
              setCycleCount(c => c + 1);
            }
            return nextIndex;
          });
          return BREATHING_PHASES[(currentPhaseIndex + 1) % BREATHING_PHASES.length].duration;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isBreathing, currentPhaseIndex]);

  /**
   * Avvia/ferma respirazione
   */
  const toggleBreathing = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setCurrentPhaseIndex(0);
      setCountdown(4);
    } else {
      setIsBreathing(true);
      setCurrentPhaseIndex(0);
      setCountdown(BREATHING_PHASES[0].duration);
      setCycleCount(0);
    }
  };

  /**
   * Touch handlers per fallback
   */
  const handleTouchStart = (e) => {
    if (!webcamEnabled) {
      e.preventDefault();
      setIsTouching(true);
    }
  };

  const handleTouchEnd = (e) => {
    if (!webcamEnabled) {
      e.preventDefault();
      setIsTouching(false);
    }
  };

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      stopWebcam();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Calcola feedback visivo
  const isCorrectPosition = Math.abs(effectiveOpenness - currentPhase.targetOpenness) < 0.3;
  const feedbackColor = isCorrectPosition ? '#22c55e' : '#f59e0b';

  return (
    <div
      ref={containerRef}
      className="tactile-breathing-container"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #0a0a1a 0%, #1a1a2e 50%, #16213e 100%)',
        overflow: 'hidden',
        touchAction: 'none'
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleTouchStart}
      onMouseUp={handleTouchEnd}
      onMouseLeave={handleTouchEnd}
    >
      {/* Three.js Canvas Container */}
      <div
        ref={canvasContainerRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1
        }}
      />

      {/* Hidden Video for MediaPipe */}
      <video
        ref={videoRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: 'none'
        }}
        playsInline
        muted
      />

      {/* UI Overlay */}
      <div
        className="tactile-ui-overlay"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10,
          pointerEvents: 'none',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: 'var(--space-4)'
        }}
      >
        {/* Top Controls */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            width: '100%',
            maxWidth: '600px',
            pointerEvents: 'auto',
            marginBottom: 'var(--space-4)'
          }}
        >
          {/* Webcam Toggle */}
          <button
            onClick={toggleWebcam}
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              border: 'none',
              background: webcamEnabled ? 'rgba(34, 197, 94, 0.3)' : 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: 'var(--text-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-2)'
            }}
          >
            {webcamEnabled ? '📹 Webcam ON' : '📷 Abilita Webcam'}
          </button>

          {/* Cycle Counter */}
          <div
            style={{
              padding: 'var(--space-2) var(--space-4)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'white',
              fontSize: 'var(--text-sm)'
            }}
          >
            Cicli: {cycleCount}
          </div>
        </div>

        {/* Calibration Indicator */}
        {isCalibrating && webcamEnabled && (
          <div
            style={{
              padding: 'var(--space-3) var(--space-6)',
              borderRadius: 'var(--radius-lg)',
              background: 'rgba(59, 130, 246, 0.3)',
              color: 'white',
              marginBottom: 'var(--space-4)',
              textAlign: 'center'
            }}
          >
            <div style={{ marginBottom: 'var(--space-2)' }}>
              🎯 Calibrazione in corso...
            </div>
            <div style={{ fontSize: 'var(--text-sm)', opacity: 0.8 }}>
              Apri e chiudi la mano alcune volte
            </div>
            <div
              style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '2px',
                marginTop: 'var(--space-2)',
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  width: `${calibrationProgress * 100}%`,
                  height: '100%',
                  background: '#3b82f6',
                  transition: 'width 0.1s'
                }}
              />
            </div>
          </div>
        )}

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Phase Display */}
        <div
          style={{
            textAlign: 'center',
            marginBottom: 'var(--space-6)'
          }}
        >
          <div
            style={{
              fontSize: '64px',
              marginBottom: 'var(--space-2)'
            }}
          >
            {currentPhase.icon}
          </div>
          <div
            style={{
              fontSize: 'var(--text-3xl)',
              fontWeight: 'bold',
              color: 'white',
              marginBottom: 'var(--space-2)',
              textShadow: '0 2px 10px rgba(0,0,0,0.5)'
            }}
          >
            {currentPhase.label}
          </div>
          <div
            style={{
              fontSize: '80px',
              fontWeight: 'bold',
              color: feedbackColor,
              textShadow: `0 0 30px ${feedbackColor}`,
              transition: 'color 0.3s'
            }}
          >
            {countdown}
          </div>
        </div>

        {/* Hand/Touch Indicator */}
        <div
          style={{
            marginBottom: 'var(--space-6)',
            textAlign: 'center'
          }}
        >
          {webcamEnabled ? (
            <div style={{ color: 'white', fontSize: 'var(--text-sm)' }}>
              {handDetected ? (
                <span style={{ color: '#22c55e' }}>✋ Mano rilevata</span>
              ) : (
                <span style={{ color: '#f59e0b' }}>👋 Mostra la mano alla webcam</span>
              )}
            </div>
          ) : (
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: 'var(--text-sm)' }}>
              {isTouching ? '👊 Tieni premuto (mano chiusa)' : '✋ Rilascia (mano aperta)'}
            </div>
          )}

          {/* Openness Bar */}
          <div
            style={{
              width: '200px',
              height: '8px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '4px',
              margin: 'var(--space-3) auto 0',
              overflow: 'hidden',
              position: 'relative'
            }}
          >
            {/* Target indicator */}
            <div
              style={{
                position: 'absolute',
                left: `${currentPhase.targetOpenness * 100}%`,
                top: '-4px',
                bottom: '-4px',
                width: '4px',
                background: 'white',
                transform: 'translateX(-50%)',
                borderRadius: '2px',
                boxShadow: '0 0 10px white'
              }}
            />
            {/* Current value */}
            <div
              style={{
                width: `${effectiveOpenness * 100}%`,
                height: '100%',
                background: feedbackColor,
                transition: 'width 0.1s, background 0.3s',
                boxShadow: `0 0 10px ${feedbackColor}`
              }}
            />
          </div>
        </div>

        {/* Start/Stop Button */}
        <button
          onClick={toggleBreathing}
          style={{
            padding: 'var(--space-4) var(--space-8)',
            borderRadius: 'var(--radius-xl)',
            border: 'none',
            background: isBreathing
              ? 'rgba(239, 68, 68, 0.8)'
              : 'rgba(34, 197, 94, 0.8)',
            color: 'white',
            fontSize: 'var(--text-lg)',
            fontWeight: 'bold',
            cursor: 'pointer',
            pointerEvents: 'auto',
            boxShadow: isBreathing
              ? '0 0 20px rgba(239, 68, 68, 0.5)'
              : '0 0 20px rgba(34, 197, 94, 0.5)',
            marginBottom: 'var(--space-8)'
          }}
        >
          {isBreathing ? '⏹️ Ferma' : '▶️ Inizia Respirazione'}
        </button>

        {/* Instructions (when not breathing) */}
        {!isBreathing && !webcamEnabled && (
          <div
            style={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.6)',
              fontSize: 'var(--text-sm)',
              maxWidth: '300px',
              marginBottom: 'var(--space-4)'
            }}
          >
            Abilita la webcam per controllare il cuore con la mano,
            oppure usa il touch: tieni premuto per chiudere, rilascia per aprire.
          </div>
        )}
      </div>
    </div>
  );
};

export default TactileBreathingMode;
