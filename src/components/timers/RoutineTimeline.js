/**
 * ═══════════════════════════════════════════════════════════════════
 * Routine Timeline - Visual Timeline for Routine Activities
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import '../../styles/routine-builder.css';

const RoutineTimeline = ({ activities, onUpdateDuration, onRemove, onMove }) => {
  const availableDurations = {
    breathing: [2, 3, 5, 10],
    meditation: [5, 10, 15, 20],
    timer: [5, 10, 15, 20, 25, 30],
    'emotion-check': [3, 5],
  };

  return (
    <div className="routine-timeline">
      {activities.map((activity, index) => (
        <div key={activity.id} className="timeline-item">
          {/* Connection Line */}
          {index > 0 && <div className="timeline-connector" />}

          {/* Activity Card */}
          <div className="timeline-activity-card">
            {/* Activity Info */}
            <div className="timeline-activity-header">
              <span className="timeline-activity-icon">{activity.icon}</span>
              <div className="timeline-activity-info">
                <h4 className="timeline-activity-name">{activity.name}</h4>
                <span className="timeline-activity-position">
                  Passo {index + 1} di {activities.length}
                </span>
              </div>
            </div>

            {/* Duration Selector */}
            <div className="timeline-duration-selector">
              <label className="duration-label">Durata:</label>
              <div className="duration-options">
                {availableDurations[activity.type]?.map((duration) => (
                  <button
                    key={duration}
                    className={`duration-option-btn ${
                      activity.duration === duration ? 'active' : ''
                    }`}
                    onClick={() => onUpdateDuration(activity.id, duration)}
                  >
                    {duration} min
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="timeline-activity-controls">
              {/* Move Up/Down */}
              <div className="move-controls">
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => onMove(activity.id, 'up')}
                  disabled={index === 0}
                  title="Sposta su"
                >
                  ↑
                </button>
                <button
                  className="btn btn-ghost btn-xs"
                  onClick={() => onMove(activity.id, 'down')}
                  disabled={index === activities.length - 1}
                  title="Sposta giù"
                >
                  ↓
                </button>
              </div>

              {/* Remove */}
              <button
                className="btn btn-ghost btn-xs text-danger"
                onClick={() => onRemove(activity.id)}
                title="Rimuovi"
              >
                ✕ Rimuovi
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Total Duration Summary */}
      <div className="timeline-summary">
        <div className="timeline-summary-content">
          <strong>Durata totale:</strong>
          <span className="timeline-total-duration">
            {activities.reduce((sum, a) => sum + a.duration, 0)} minuti
          </span>
        </div>
      </div>
    </div>
  );
};

export default RoutineTimeline;
