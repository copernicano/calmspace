/**
 * ═══════════════════════════════════════════════════════════════════
 * Routine Executor - Execute Routines with Auto-Transitions
 * ═══════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Step-by-step activity execution
 * - Auto-transition with optional confirmations
 * - Progress tracking
 * - Pause/Resume capability
 * - Skip ahead option
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/routine-builder.css';

const RoutineExecutor = ({ routine, onComplete, onCancel }) => {
  const { settings } = useEnhancedSettings();
  const navigate = useNavigate();

  // Execution State
  const [currentActivityIndex, setCurrentActivityIndex] = useState(0);
  const [activityState, setActivityState] = useState('idle'); // 'idle' | 'running' | 'paused' | 'completed'
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [totalElapsed, setTotalElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-transition
  const [autoTransition, setAutoTransition] = useState(true);
  const [showTransitionConfirm, setShowTransitionConfirm] = useState(false);

  // Timer refs
  const startTimeRef = useRef(null);
  const pausedTimeRef = useRef(null);

  const currentActivity = routine.activities[currentActivityIndex];
  const isLastActivity = currentActivityIndex === routine.activities.length - 1;
  const totalDuration = routine.activities.reduce((sum, a) => sum + a.duration, 0);

  /* ═══════════════════════════════════════════════════════════════════
     Activity Timer Logic
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (activityState === 'running') {
      const interval = setInterval(() => {
        const now = Date.now();
        const elapsed = Math.floor((now - startTimeRef.current) / 1000);
        const remaining = currentActivity.duration * 60 - elapsed;

        if (remaining <= 0) {
          handleActivityComplete();
        } else {
          setTimeRemaining(remaining);
          setTotalElapsed(
            routine.activities
              .slice(0, currentActivityIndex)
              .reduce((sum, a) => sum + a.duration * 60, 0) + elapsed
          );
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [activityState, currentActivityIndex, currentActivity]);

  /* ═══════════════════════════════════════════════════════════════════
     Activity Control
     ═══════════════════════════════════════════════════════════════════ */

  const startActivity = () => {
    setActivityState('running');
    setTimeRemaining(currentActivity.duration * 60);
    startTimeRef.current = Date.now();
  };

  const pauseActivity = () => {
    if (activityState === 'running') {
      setActivityState('paused');
      setIsPaused(true);
      pausedTimeRef.current = Date.now();
    }
  };

  const resumeActivity = () => {
    if (activityState === 'paused') {
      // Adjust start time to account for pause
      const pauseDuration = Date.now() - pausedTimeRef.current;
      startTimeRef.current += pauseDuration;
      setActivityState('running');
      setIsPaused(false);
    }
  };

  const handleActivityComplete = () => {
    setActivityState('completed');

    if (isLastActivity) {
      // Routine completed
      setTimeout(() => {
        onComplete();
      }, 2000);
    } else {
      // Move to next activity
      if (autoTransition) {
        setTimeout(() => {
          moveToNextActivity();
        }, 2000);
      } else {
        setShowTransitionConfirm(true);
      }
    }
  };

  const moveToNextActivity = () => {
    setShowTransitionConfirm(false);
    setCurrentActivityIndex(currentActivityIndex + 1);
    setActivityState('idle');
  };

  const skipToNextActivity = () => {
    if (!isLastActivity) {
      setCurrentActivityIndex(currentActivityIndex + 1);
      setActivityState('idle');
      setShowTransitionConfirm(false);
    }
  };

  const goToPreviousActivity = () => {
    if (currentActivityIndex > 0) {
      setCurrentActivityIndex(currentActivityIndex - 1);
      setActivityState('idle');
      setShowTransitionConfirm(false);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     Formatting
     ═══════════════════════════════════════════════════════════════════ */

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return (totalElapsed / (totalDuration * 60)) * 100;
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="routine-executor-container">
      {/* Header */}
      <header className="executor-header">
        <h1 className="executor-title">{routine.name}</h1>
        <button className="btn btn-ghost btn-sm" onClick={onCancel}>
          ✕ Interrompi routine
        </button>
      </header>

      {/* Overall Progress */}
      <div className="executor-progress-section">
        <div className="progress-info">
          <span className="progress-step">
            Attività {currentActivityIndex + 1} di {routine.activities.length}
          </span>
          <span className="progress-time">
            {formatTime(totalElapsed)} / {totalDuration} min
          </span>
        </div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Current Activity Display */}
      <div className={`current-activity-display state-${activityState}`}>
        <div className="activity-icon-large">{currentActivity.icon}</div>
        <h2 className="activity-name">{currentActivity.name}</h2>

        {activityState === 'idle' && (
          <>
            <p className="activity-instruction">
              Durata: {currentActivity.duration} minuti
            </p>
            <button className="btn btn-primary btn-lg" onClick={startActivity}>
              Inizia
            </button>
          </>
        )}

        {(activityState === 'running' || activityState === 'paused') && (
          <>
            <div className="activity-timer-display">
              <div className="timer-circle-mini">
                <div className="timer-value">{formatTime(timeRemaining)}</div>
              </div>
            </div>

            {activityState === 'paused' && (
              <div className="pause-badge">In pausa</div>
            )}

            <div className="activity-controls">
              {activityState === 'running' && (
                <button className="btn btn-secondary" onClick={pauseActivity}>
                  ⏸ Pausa
                </button>
              )}
              {activityState === 'paused' && (
                <button className="btn btn-primary" onClick={resumeActivity}>
                  ▶ Riprendi
                </button>
              )}
              {!isLastActivity && (
                <button className="btn btn-ghost" onClick={skipToNextActivity}>
                  Salta →
                </button>
              )}
            </div>
          </>
        )}

        {activityState === 'completed' && (
          <>
            <div className="completion-badge">✓ Completata!</div>
            {isLastActivity ? (
              <p className="completion-message">Routine completata!</p>
            ) : (
              <p className="completion-message">
                {autoTransition
                  ? 'Passaggio alla prossima attività...'
                  : 'Pronto per la prossima attività'}
              </p>
            )}
          </>
        )}
      </div>

      {/* Transition Confirmation */}
      {showTransitionConfirm && (
        <div className="transition-confirm-modal">
          <div className="modal-content">
            <h3 className="modal-title">Attività completata!</h3>
            <p className="modal-message">
              Prossima attività: {routine.activities[currentActivityIndex + 1].name}
            </p>
            <div className="modal-actions">
              <button className="btn btn-primary" onClick={moveToNextActivity}>
                Continua
              </button>
              <button className="btn btn-ghost" onClick={onCancel}>
                Interrompi routine
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity List (collapsed) */}
      <div className="executor-activity-list">
        <h3 className="activity-list-title">Timeline routine</h3>
        <div className="activity-list-items">
          {routine.activities.map((activity, index) => (
            <div
              key={index}
              className={`activity-list-item ${
                index === currentActivityIndex ? 'active' : ''
              } ${index < currentActivityIndex ? 'completed' : ''}`}
            >
              <span className="activity-list-icon">
                {index < currentActivityIndex ? '✓' : activity.icon}
              </span>
              <span className="activity-list-name">{activity.name}</span>
              <span className="activity-list-duration">{activity.duration} min</span>
            </div>
          ))}
        </div>
      </div>

      {/* Settings */}
      <div className="executor-settings">
        <label className="setting-toggle">
          <input
            type="checkbox"
            checked={autoTransition}
            onChange={(e) => setAutoTransition(e.target.checked)}
          />
          <span>Transizione automatica tra attività</span>
        </label>
      </div>

      {/* Navigation */}
      {activityState === 'idle' && (
        <div className="executor-navigation">
          {currentActivityIndex > 0 && (
            <button className="btn btn-ghost" onClick={goToPreviousActivity}>
              ← Attività precedente
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default RoutineExecutor;
