/**
 * ═══════════════════════════════════════════════════════════════════
 * Loading States - Common Loading Patterns
 * ═══════════════════════════════════════════════════════════════════
 *
 * Predefined loading states for common scenarios in CalmSpace
 */

import React from 'react';
import SkeletonLoader from './SkeletonLoader';
import '../../styles/loading-states.css';

/* ═══════════════════════════════════════════════════════════════════
   Emotion Selector Loading
   ═══════════════════════════════════════════════════════════════════ */

export const EmotionSelectorLoading = () => (
  <div className="loading-emotion-selector">
    <div className="skeleton skeleton-text" style={{ width: '200px', height: '2em', marginBottom: 'var(--space-6)' }} />
    <div className="emotion-cards-skeleton">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="emotion-card-skeleton">
          <div className="skeleton skeleton-circle" style={{ width: '80px', height: '80px' }} />
          <div className="skeleton skeleton-text" style={{ width: '80px', height: '1.2em' }} />
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Strategies Loading
   ═══════════════════════════════════════════════════════════════════ */

export const StrategiesLoading = () => (
  <div className="loading-strategies">
    <div className="skeleton skeleton-text" style={{ width: '250px', height: '2em', marginBottom: 'var(--space-6)' }} />
    <div className="strategies-skeleton">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="strategy-card-skeleton">
          <div className="strategy-header-skeleton">
            <div className="skeleton skeleton-circle" style={{ width: '60px', height: '60px' }} />
            <div style={{ flex: 1 }}>
              <div className="skeleton skeleton-text" style={{ width: '70%', height: '1.5em', marginBottom: 'var(--space-2)' }} />
              <div className="skeleton skeleton-text" style={{ width: '100%', height: '1em' }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Calm Space Patterns Loading
   ═══════════════════════════════════════════════════════════════════ */

export const CalmSpaceLoading = () => (
  <div className="loading-calm-space">
    <div className="calm-space-skeleton">
      <div className="skeleton skeleton-text" style={{ width: '150px', height: '1.5em', marginBottom: 'var(--space-4)' }} />
      <div className="pattern-display-skeleton">
        <div className="skeleton skeleton-rectangle" style={{ width: '100%', height: '400px', borderRadius: 'var(--radius-2xl)' }} />
      </div>
      <div className="controls-skeleton">
        <div className="skeleton skeleton-rectangle" style={{ width: '100%', height: '60px', borderRadius: 'var(--radius-lg)' }} />
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Timer Loading
   ═══════════════════════════════════════════════════════════════════ */

export const TimerLoading = () => (
  <div className="loading-timer">
    <div className="skeleton skeleton-text" style={{ width: '200px', height: '2em', marginBottom: 'var(--space-6)' }} />
    <div className="timer-display-skeleton">
      <div className="skeleton skeleton-circle" style={{ width: '280px', height: '280px', margin: '0 auto var(--space-6)' }} />
      <div className="skeleton skeleton-rectangle" style={{ width: '200px', height: '48px', margin: '0 auto', borderRadius: 'var(--radius-lg)' }} />
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Routine List Loading
   ═══════════════════════════════════════════════════════════════════ */

export const RoutineListLoading = () => (
  <div className="loading-routine-list">
    <div className="skeleton skeleton-text" style={{ width: '250px', height: '2em', marginBottom: 'var(--space-6)' }} />
    <div className="routine-cards-skeleton">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="routine-card-skeleton">
          <div className="skeleton skeleton-text" style={{ width: '60%', height: '1.5em', marginBottom: 'var(--space-3)' }} />
          <div className="skeleton skeleton-text" style={{ width: '100%', height: '1em', marginBottom: 'var(--space-2)' }} />
          <div className="skeleton skeleton-text" style={{ width: '80%', height: '1em', marginBottom: 'var(--space-4)' }} />
          <div className="skeleton skeleton-rectangle" style={{ width: '120px', height: '40px', borderRadius: 'var(--radius-md)' }} />
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Settings Loading
   ═══════════════════════════════════════════════════════════════════ */

export const SettingsLoading = () => (
  <div className="loading-settings">
    <div className="skeleton skeleton-text" style={{ width: '200px', height: '2em', marginBottom: 'var(--space-6)' }} />
    <div className="settings-sections-skeleton">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="settings-section-skeleton">
          <div className="skeleton skeleton-text" style={{ width: '150px', height: '1.2em', marginBottom: 'var(--space-3)' }} />
          <div className="skeleton skeleton-rectangle" style={{ width: '100%', height: '120px', borderRadius: 'var(--radius-lg)' }} />
        </div>
      ))}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Generic Page Loading (when unsure which type)
   ═══════════════════════════════════════════════════════════════════ */

export const PageLoading = ({ message = 'Caricamento...' }) => (
  <div className="loading-page">
    <div className="loading-page-content">
      <div className="skeleton skeleton-rectangle" style={{ width: '100px', height: '100px', margin: '0 auto var(--space-4)', borderRadius: 'var(--radius-lg)' }} />
      <div className="loading-message">{message}</div>
      <div className="loading-progress-dots">
        <span className="dot"></span>
        <span className="dot"></span>
        <span className="dot"></span>
      </div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Inline Loading (small loading indicator)
   ═══════════════════════════════════════════════════════════════════ */

export const InlineLoading = ({ size = 'medium', message }) => (
  <div className={`inline-loading inline-loading-${size}`}>
    <div className="inline-loading-spinner" />
    {message && <span className="inline-loading-message">{message}</span>}
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Error State (bonus - useful for failed loads)
   ═══════════════════════════════════════════════════════════════════ */

export const ErrorState = ({
  icon = '⚠️',
  title = 'Qualcosa è andato storto',
  message = 'Riprova più tardi',
  onRetry,
  retryLabel = 'Riprova',
}) => (
  <div className="error-state">
    <div className="error-state-content">
      <div className="error-icon">{icon}</div>
      <h2 className="error-title">{title}</h2>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button className="btn btn-primary" onClick={onRetry}>
          {retryLabel}
        </button>
      )}
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════════════════
   Empty State (bonus - useful for empty lists)
   ═══════════════════════════════════════════════════════════════════ */

export const EmptyState = ({
  icon = '📭',
  title = 'Nessun contenuto',
  message,
  action,
  actionLabel,
}) => (
  <div className="empty-state">
    <div className="empty-state-content">
      <div className="empty-state-icon">{icon}</div>
      <h2 className="empty-state-title">{title}</h2>
      {message && <p className="empty-state-message">{message}</p>}
      {action && actionLabel && (
        <button className="btn btn-primary" onClick={action}>
          {actionLabel}
        </button>
      )}
    </div>
  </div>
);

export default {
  EmotionSelectorLoading,
  StrategiesLoading,
  CalmSpaceLoading,
  TimerLoading,
  RoutineListLoading,
  SettingsLoading,
  PageLoading,
  InlineLoading,
  ErrorState,
  EmptyState,
};
