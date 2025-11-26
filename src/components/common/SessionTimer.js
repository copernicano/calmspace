/**
 * ═══════════════════════════════════════════════════════════════════
 * Session Timer Component
 * ═══════════════════════════════════════════════════════════════════
 *
 * Tracks session duration and provides:
 * - Real-time elapsed time display
 * - Break reminders at configured intervals
 * - Session limit warnings
 * - Gentle notifications (not intrusive)
 * - Respects user settings for time awareness
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/design-system.css';
import '../../styles/session-timer.css';

const SessionTimer = ({
  onBreakReminder, // Callback when break reminder should show
  onSessionLimitReached, // Callback when session limit is reached
  className = '',
}) => {
  const { settings } = useEnhancedSettings();

  const [sessionStartTime] = useState(Date.now());
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [showBreakNotification, setShowBreakNotification] = useState(false);
  const [showLimitWarning, setShowLimitWarning] = useState(false);

  const lastBreakReminder = useRef(0);
  const limitWarningShown = useRef(false);

  /* ═══════════════════════════════════════════════════════════════════
     Update Timer Every Second
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - sessionStartTime) / 1000);
      setElapsedSeconds(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [sessionStartTime]);

  /* ═══════════════════════════════════════════════════════════════════
     Check for Break Reminders
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (!settings.showBreakReminders || settings.breakInterval === 0) {
      return;
    }

    const elapsedMinutes = Math.floor(elapsedSeconds / 60);
    const breakIntervalMinutes = settings.breakInterval;

    // Check if it's time for a break reminder
    if (
      elapsedMinutes > 0 &&
      elapsedMinutes % breakIntervalMinutes === 0 &&
      lastBreakReminder.current !== elapsedMinutes
    ) {
      lastBreakReminder.current = elapsedMinutes;
      setShowBreakNotification(true);

      if (onBreakReminder) {
        onBreakReminder(elapsedMinutes);
      }

      // Auto-hide after 10 seconds
      setTimeout(() => {
        setShowBreakNotification(false);
      }, 10000);
    }
  }, [elapsedSeconds, settings.showBreakReminders, settings.breakInterval, onBreakReminder]);

  /* ═══════════════════════════════════════════════════════════════════
     Check for Session Limit
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (settings.sessionTimeLimit === 0 || limitWarningShown.current) {
      return;
    }

    const elapsedMinutes = Math.floor(elapsedSeconds / 60);

    if (elapsedMinutes >= settings.sessionTimeLimit) {
      limitWarningShown.current = true;
      setShowLimitWarning(true);

      if (onSessionLimitReached) {
        onSessionLimitReached(elapsedMinutes);
      }
    }
  }, [elapsedSeconds, settings.sessionTimeLimit, onSessionLimitReached]);

  /* ═══════════════════════════════════════════════════════════════════
     Format Time Display
     ═══════════════════════════════════════════════════════════════════ */

  const formatTime = useCallback((seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    } else {
      return `${secs}s`;
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════════════
     Dismiss Notifications
     ═══════════════════════════════════════════════════════════════════ */

  const dismissBreakNotification = () => {
    setShowBreakNotification(false);
  };

  const dismissLimitWarning = () => {
    setShowLimitWarning(false);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Don't Render if Timer is Disabled
     ═══════════════════════════════════════════════════════════════════ */

  if (!settings.showSessionTimer) {
    return null;
  }

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <>
      {/* Session Timer Display */}
      <div className={`session-timer ${className}`} role="timer" aria-live="off">
        <span className="timer-icon" aria-hidden="true">⏱️</span>
        <span className="timer-label">Sessione:</span>
        <span className="timer-value">{formatTime(elapsedSeconds)}</span>
      </div>

      {/* Break Reminder Notification */}
      {showBreakNotification && (
        <div className="break-notification" role="alert" aria-live="polite">
          <div className="notification-content">
            <div className="notification-icon">☕</div>
            <div className="notification-text">
              <strong>Momento per una pausa</strong>
              <p>Hai passato {Math.floor(elapsedSeconds / 60)} minuti qui. Vuoi fare una pausa?</p>
            </div>
            <button
              className="btn btn-sm btn-ghost"
              onClick={dismissBreakNotification}
              aria-label="Chiudi notifica pausa"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Session Limit Warning */}
      {showLimitWarning && (
        <div className="limit-warning" role="alert" aria-live="assertive">
          <div className="notification-content">
            <div className="notification-icon">⚠️</div>
            <div className="notification-text">
              <strong>Limite sessione raggiunto</strong>
              <p>
                Hai raggiunto il limite di {settings.sessionTimeLimit} minuti.
                È consigliato fare una pausa.
              </p>
            </div>
            <button
              className="btn btn-sm btn-ghost"
              onClick={dismissLimitWarning}
              aria-label="Chiudi avviso limite"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionTimer;
