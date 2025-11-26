/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Home Page - Autism-Friendly Entry Point
 * ═══════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Visual priority system (last used activity highlighted)
 * - Quick actions for favorite activities
 * - Time-based greeting
 * - Session info display
 * - Gentle onboarding for first-time users
 * - Clear, predictable layout
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEnhancedSettings } from '../../../contexts/EnhancedSettingsContext';
import { getFromStorage, saveToStorage } from '../../../utils/storage';
import '../../../styles/design-system.css';
import '../../../styles/enhanced-home.css';

const EnhancedHomePage = () => {
  const { settings } = useEnhancedSettings();
  const navigate = useNavigate();

  // Track usage history for visual priority
  const [lastUsed, setLastUsed] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [sessionStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(new Date());

  /* ═══════════════════════════════════════════════════════════════════
     Load User Data
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    // Load last used activity
    const lastActivity = getFromStorage('calmspace-last-activity');
    if (lastActivity) {
      setLastUsed(JSON.parse(lastActivity));
    }

    // Load favorites
    const savedFavorites = getFromStorage('calmspace-favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }

    // Check if first time user
    const hasSeenOnboarding = getFromStorage('calmspace-onboarding-seen');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }

    // Update time every minute (for greeting and session timer)
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timeInterval);
  }, []);

  /* ═══════════════════════════════════════════════════════════════════
     Activity Handlers
     ═══════════════════════════════════════════════════════════════════ */

  const activities = [
    {
      id: 'emotion',
      path: '/emotion',
      icon: '💭',
      title: 'Come mi sento',
      description: 'Identifica le tue emozioni',
      color: 'var(--color-blue-500)',
    },
    {
      id: 'calmspace',
      path: '/calmspace',
      icon: '🌊',
      title: 'Il mio spazio',
      description: 'Meditazione e respirazione',
      color: 'var(--color-green-500)',
    },
    {
      id: 'timer',
      path: '/timer',
      icon: '⏱️',
      title: 'I miei timer',
      description: 'Timer e routine',
      color: 'var(--color-amber-500)',
    },
  ];

  const handleActivityClick = (activity) => {
    // Save as last used
    saveToStorage('calmspace-last-activity', JSON.stringify({
      id: activity.id,
      timestamp: Date.now(),
    }));

    // Navigate
    navigate(activity.path);
  };

  const toggleFavorite = (activityId, e) => {
    e.preventDefault();
    e.stopPropagation();

    const newFavorites = favorites.includes(activityId)
      ? favorites.filter(id => id !== activityId)
      : [...favorites, activityId];

    setFavorites(newFavorites);
    saveToStorage('calmspace-favorites', JSON.stringify(newFavorites));
  };

  const dismissOnboarding = () => {
    setShowOnboarding(false);
    saveToStorage('calmspace-onboarding-seen', 'true');
  };

  /* ═══════════════════════════════════════════════════════════════════
     Time-Based Greeting
     ═══════════════════════════════════════════════════════════════════ */

  const getGreeting = () => {
    const hour = currentTime.getHours();

    if (hour < 6) return { text: 'Buona notte', icon: '🌙' };
    if (hour < 12) return { text: 'Buongiorno', icon: '☀️' };
    if (hour < 18) return { text: 'Buon pomeriggio', icon: '🌤️' };
    if (hour < 22) return { text: 'Buonasera', icon: '🌆' };
    return { text: 'Buona notte', icon: '🌙' };
  };

  const greeting = getGreeting();

  /* ═══════════════════════════════════════════════════════════════════
     Session Timer (if enabled in settings)
     ═══════════════════════════════════════════════════════════════════ */

  const getSessionDuration = () => {
    const minutes = Math.floor((Date.now() - sessionStartTime) / 60000);
    if (minutes === 0) return 'Appena iniziato';
    if (minutes === 1) return '1 minuto';
    return `${minutes} minuti`;
  };

  /* ═══════════════════════════════════════════════════════════════════
     Check if Activity is Last Used
     ═══════════════════════════════════════════════════════════════════ */

  const isLastUsed = (activityId) => {
    return lastUsed && lastUsed.id === activityId;
  };

  const isFavorite = (activityId) => {
    return favorites.includes(activityId);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="enhanced-home-container">
      {/* ─────────────────────────────────────────────────────────────
          Onboarding Modal (First Time Only)
          ───────────────────────────────────────────────────────────── */}
      {showOnboarding && (
        <div className="onboarding-overlay">
          <div className="onboarding-card card card-elevated">
            <div className="onboarding-icon">👋</div>
            <h2 className="onboarding-title">Benvenuto in CalmSpace</h2>
            <p className="onboarding-description">
              Uno spazio sicuro per gestire le tue emozioni, rilassarti e trovare calma.
              Scegli un'attività per iniziare.
            </p>
            <button className="btn btn-lg btn-block" onClick={dismissOnboarding}>
              Inizia
            </button>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Header with Greeting
          ───────────────────────────────────────────────────────────── */}
      <header className="home-header">
        <div className="greeting-section">
          <span className="greeting-icon" aria-hidden="true">{greeting.icon}</span>
          <h1 className="greeting-text">{greeting.text}</h1>
        </div>

        <div className="app-branding">
          <h2 className="app-name">CalmSpace</h2>
          <p className="app-tagline">Il tuo spazio di benessere</p>
        </div>

        {settings.showSessionTimer && (
          <div className="session-info">
            <span className="session-icon" aria-hidden="true">⏱️</span>
            <span className="session-text">Sessione: {getSessionDuration()}</span>
          </div>
        )}
      </header>

      {/* ─────────────────────────────────────────────────────────────
          Quick Actions (Favorites)
          ───────────────────────────────────────────────────────────── */}
      {favorites.length > 0 && !settings.reducedChoices && (
        <section className="quick-actions-section">
          <h3 className="section-title-small">⭐ Accesso Rapido</h3>
          <div className="quick-actions-grid">
            {activities
              .filter(activity => favorites.includes(activity.id))
              .map(activity => (
                <button
                  key={activity.id}
                  className="quick-action-button"
                  onClick={() => handleActivityClick(activity)}
                  style={{ '--activity-color': activity.color }}
                >
                  <span className="quick-action-icon">{activity.icon}</span>
                  <span className="quick-action-label">{activity.title}</span>
                </button>
              ))}
          </div>
        </section>
      )}

      {/* ─────────────────────────────────────────────────────────────
          Main Activities
          ───────────────────────────────────────────────────────────── */}
      <section className="main-activities-section">
        <h3 className="section-title-small">Scegli un'attività</h3>

        <div className="activities-grid">
          {activities.map(activity => {
            const isLast = isLastUsed(activity.id);
            const isFav = isFavorite(activity.id);

            return (
              <button
                key={activity.id}
                className={`activity-card ${isLast ? 'last-used' : ''}`}
                onClick={() => handleActivityClick(activity)}
                style={{ '--activity-color': activity.color }}
              >
                {/* Priority Badge */}
                {isLast && (
                  <div className="priority-badge badge badge-success">
                    ↻ Ultima attività
                  </div>
                )}

                {/* Favorite Star */}
                <button
                  className={`favorite-button ${isFav ? 'active' : ''}`}
                  onClick={(e) => toggleFavorite(activity.id, e)}
                  aria-label={isFav ? 'Rimuovi dai preferiti' : 'Aggiungi ai preferiti'}
                >
                  {isFav ? '⭐' : '☆'}
                </button>

                {/* Activity Icon */}
                <div className="activity-icon" aria-hidden="true">
                  {activity.icon}
                </div>

                {/* Activity Info */}
                <div className="activity-info">
                  <h4 className="activity-title">{activity.title}</h4>
                  <p className="activity-description">{activity.description}</p>
                </div>

                {/* Arrow Indicator */}
                <div className="activity-arrow" aria-hidden="true">→</div>
              </button>
            );
          })}
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Settings Link (prominent but not intrusive)
          ───────────────────────────────────────────────────────────── */}
      <section className="settings-link-section">
        <Link to="/settings" className="settings-link-card">
          <span className="settings-icon" aria-hidden="true">⚙️</span>
          <div className="settings-link-info">
            <span className="settings-link-title">Impostazioni</span>
            <span className="settings-link-description">
              Personalizza l'esperienza
            </span>
          </div>
          <span className="settings-arrow" aria-hidden="true">→</span>
        </Link>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          Help Text (if keyboard navigation help is enabled)
          ───────────────────────────────────────────────────────────── */}
      {settings.keyboardNavigationHelp && (
        <div className="keyboard-help">
          <p className="help-text">
            <kbd>Tab</kbd> per navigare • <kbd>Enter</kbd> per selezionare
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedHomePage;
