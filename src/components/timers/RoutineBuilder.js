/**
 * ═══════════════════════════════════════════════════════════════════
 * Routine Builder - Create and Execute Activity Sequences
 * ═══════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Create custom activity sequences
 * - Predefined templates (morning, evening, anxiety management)
 * - Visual timeline
 * - Auto-transitions with optional confirmations
 * - Save/load custom routines
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import RoutineTemplates from './RoutineTemplates';
import RoutineTimeline from './RoutineTimeline';
import RoutineExecutor from './RoutineExecutor';
import '../../styles/design-system.css';
import '../../styles/routine-builder.css';

const RoutineBuilder = () => {
  const { settings } = useEnhancedSettings();
  const navigate = useNavigate();

  // View State
  const [view, setView] = useState('list'); // 'list' | 'builder' | 'executor'

  // Routine Management
  const [savedRoutines, setSavedRoutines] = useState([]);
  const [currentRoutine, setCurrentRoutine] = useState(null);
  const [editingRoutine, setEditingRoutine] = useState(null);

  // Builder State
  const [routineName, setRoutineName] = useState('');
  const [routineDescription, setRoutineDescription] = useState('');
  const [activities, setActivities] = useState([]);

  // Execution State
  const [executingRoutine, setExecutingRoutine] = useState(null);

  /* ═══════════════════════════════════════════════════════════════════
     Available Activities
     ═══════════════════════════════════════════════════════════════════ */

  const availableActivities = [
    {
      id: 'breathing',
      name: 'Respirazione',
      icon: '🫁',
      description: 'Esercizio di respirazione guidata',
      durationOptions: [2, 3, 5, 10],
      defaultDuration: 5,
      route: '/calm-space?mode=breathing',
    },
    {
      id: 'meditation',
      name: 'Meditazione',
      icon: '🌊',
      description: 'Visualizzazione pattern calmanti',
      durationOptions: [5, 10, 15, 20],
      defaultDuration: 10,
      route: '/calm-space?mode=patterns',
    },
    {
      id: 'timer',
      name: 'Timer',
      icon: '⏱',
      description: 'Timer per pausa o focus',
      durationOptions: [5, 10, 15, 20, 25, 30],
      defaultDuration: 5,
      route: '/timer',
    },
    {
      id: 'emotion-check',
      name: 'Check Emozioni',
      icon: '💭',
      description: 'Riconoscimento emotivo',
      durationOptions: [3, 5],
      defaultDuration: 3,
      route: '/emotion',
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════
     Load/Save Routines from localStorage
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    const saved = localStorage.getItem('calmspace-routines');
    if (saved) {
      try {
        setSavedRoutines(JSON.parse(saved));
      } catch (err) {
        console.error('Error loading routines:', err);
      }
    }
  }, []);

  const saveRoutinesToStorage = (routines) => {
    localStorage.setItem('calmspace-routines', JSON.stringify(routines));
  };

  /* ═══════════════════════════════════════════════════════════════════
     Routine CRUD Operations
     ═══════════════════════════════════════════════════════════════════ */

  const createNewRoutine = () => {
    setEditingRoutine(null);
    setRoutineName('');
    setRoutineDescription('');
    setActivities([]);
    setView('builder');
  };

  const editRoutine = (routine) => {
    setEditingRoutine(routine);
    setRoutineName(routine.name);
    setRoutineDescription(routine.description);
    setActivities([...routine.activities]);
    setView('builder');
  };

  const saveRoutine = () => {
    if (!routineName.trim()) {
      alert('Inserisci un nome per la routine');
      return;
    }

    if (activities.length === 0) {
      alert('Aggiungi almeno un\'attività alla routine');
      return;
    }

    const routine = {
      id: editingRoutine?.id || Date.now(),
      name: routineName,
      description: routineDescription,
      activities: activities,
      createdAt: editingRoutine?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let updatedRoutines;
    if (editingRoutine) {
      // Update existing
      updatedRoutines = savedRoutines.map((r) =>
        r.id === editingRoutine.id ? routine : r
      );
    } else {
      // Create new
      updatedRoutines = [...savedRoutines, routine];
    }

    setSavedRoutines(updatedRoutines);
    saveRoutinesToStorage(updatedRoutines);

    // Reset and go back to list
    setView('list');
    setEditingRoutine(null);
  };

  const deleteRoutine = (routineId) => {
    if (window.confirm('Sei sicuro di voler eliminare questa routine?')) {
      const updatedRoutines = savedRoutines.filter((r) => r.id !== routineId);
      setSavedRoutines(updatedRoutines);
      saveRoutinesToStorage(updatedRoutines);
    }
  };

  const useTemplate = (template) => {
    setRoutineName(template.name);
    setRoutineDescription(template.description);
    setActivities([...template.activities]);
    setView('builder');
  };

  /* ═══════════════════════════════════════════════════════════════════
     Activity Management in Builder
     ═══════════════════════════════════════════════════════════════════ */

  const addActivity = (activityType) => {
    const template = availableActivities.find((a) => a.id === activityType);
    if (!template) return;

    const newActivity = {
      id: Date.now(),
      type: activityType,
      name: template.name,
      icon: template.icon,
      duration: template.defaultDuration,
      route: template.route,
    };

    setActivities([...activities, newActivity]);
  };

  const updateActivityDuration = (activityId, duration) => {
    setActivities(
      activities.map((a) =>
        a.id === activityId ? { ...a, duration: duration } : a
      )
    );
  };

  const removeActivity = (activityId) => {
    setActivities(activities.filter((a) => a.id !== activityId));
  };

  const moveActivity = (activityId, direction) => {
    const index = activities.findIndex((a) => a.id === activityId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === activities.length - 1)
    ) {
      return;
    }

    const newActivities = [...activities];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newActivities[index], newActivities[newIndex]] = [
      newActivities[newIndex],
      newActivities[index],
    ];

    setActivities(newActivities);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Routine Execution
     ═══════════════════════════════════════════════════════════════════ */

  const startRoutine = (routine) => {
    setExecutingRoutine(routine);
    setView('executor');
  };

  const stopRoutine = () => {
    setExecutingRoutine(null);
    setView('list');
  };

  /* ═══════════════════════════════════════════════════════════════════
     Calculate Total Duration
     ═══════════════════════════════════════════════════════════════════ */

  const getTotalDuration = (routine) => {
    return routine.activities.reduce((sum, activity) => sum + activity.duration, 0);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render: Routine List View
     ═══════════════════════════════════════════════════════════════════ */

  const renderRoutineList = () => (
    <div className="routine-list-view">
      <header className="routine-header">
        <h1 className="routine-title">Le mie routine</h1>
        <p className="routine-subtitle">
          Crea sequenze di attività per guidare la tua pratica quotidiana
        </p>
      </header>

      {/* Action Buttons */}
      <div className="routine-actions">
        <button className="btn btn-primary btn-lg" onClick={createNewRoutine}>
          + Crea nuova routine
        </button>
      </div>

      {/* Templates Section */}
      <RoutineTemplates onUseTemplate={useTemplate} />

      {/* Saved Routines */}
      {savedRoutines.length > 0 && (
        <div className="saved-routines-section">
          <h2 className="section-title">Routine salvate</h2>
          <div className="routine-cards">
            {savedRoutines.map((routine) => (
              <div key={routine.id} className="routine-card">
                <div className="routine-card-header">
                  <h3 className="routine-card-title">{routine.name}</h3>
                  <div className="routine-card-meta">
                    <span className="routine-duration">
                      {getTotalDuration(routine)} min
                    </span>
                    <span className="routine-activities-count">
                      {routine.activities.length} attività
                    </span>
                  </div>
                </div>

                {routine.description && (
                  <p className="routine-card-description">{routine.description}</p>
                )}

                <div className="routine-card-activities">
                  {routine.activities.map((activity, index) => (
                    <span key={index} className="activity-badge">
                      {activity.icon} {activity.name} ({activity.duration}m)
                    </span>
                  ))}
                </div>

                <div className="routine-card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => startRoutine(routine)}
                  >
                    ▶ Inizia
                  </button>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => editRoutine(routine)}
                  >
                    Modifica
                  </button>
                  <button
                    className="btn btn-ghost btn-sm text-danger"
                    onClick={() => deleteRoutine(routine.id)}
                  >
                    Elimina
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {savedRoutines.length === 0 && (
        <div className="empty-state">
          <span className="empty-state-icon">📋</span>
          <p className="empty-state-text">
            Non hai ancora creato nessuna routine personalizzata
          </p>
          <p className="empty-state-hint">
            Prova uno dei template qui sopra o crea la tua routine
          </p>
        </div>
      )}
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════
     Render: Routine Builder View
     ═══════════════════════════════════════════════════════════════════ */

  const renderRoutineBuilder = () => (
    <div className="routine-builder-view">
      <header className="routine-header">
        <h1 className="routine-title">
          {editingRoutine ? 'Modifica routine' : 'Nuova routine'}
        </h1>
        <button className="btn btn-ghost btn-sm" onClick={() => setView('list')}>
          ← Indietro
        </button>
      </header>

      {/* Routine Info */}
      <div className="routine-info-section">
        <div className="form-group">
          <label htmlFor="routine-name" className="form-label">
            Nome routine *
          </label>
          <input
            id="routine-name"
            type="text"
            value={routineName}
            onChange={(e) => setRoutineName(e.target.value)}
            placeholder="Es. Routine del mattino"
            className="form-input"
            maxLength={50}
          />
        </div>

        <div className="form-group">
          <label htmlFor="routine-description" className="form-label">
            Descrizione (facoltativa)
          </label>
          <textarea
            id="routine-description"
            value={routineDescription}
            onChange={(e) => setRoutineDescription(e.target.value)}
            placeholder="Breve descrizione della routine..."
            className="form-textarea"
            rows="3"
            maxLength={200}
          />
        </div>
      </div>

      {/* Activity Selector */}
      <div className="activity-selector-section">
        <h2 className="section-title">Aggiungi attività</h2>
        <div className="activity-selector-grid">
          {availableActivities.map((activity) => (
            <button
              key={activity.id}
              className="activity-selector-card"
              onClick={() => addActivity(activity.id)}
            >
              <span className="activity-icon">{activity.icon}</span>
              <span className="activity-name">{activity.name}</span>
              <span className="activity-add-icon">+</span>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {activities.length > 0 && (
        <div className="timeline-section">
          <h2 className="section-title">
            Timeline routine ({getTotalDuration({ activities })} min totali)
          </h2>
          <RoutineTimeline
            activities={activities}
            onUpdateDuration={updateActivityDuration}
            onRemove={removeActivity}
            onMove={moveActivity}
          />
        </div>
      )}

      {/* Save Button */}
      <div className="builder-actions">
        <button
          className="btn btn-primary btn-lg"
          onClick={saveRoutine}
          disabled={!routineName.trim() || activities.length === 0}
        >
          {editingRoutine ? 'Salva modifiche' : 'Salva routine'}
        </button>
        <button className="btn btn-ghost" onClick={() => setView('list')}>
          Annulla
        </button>
      </div>
    </div>
  );

  /* ═══════════════════════════════════════════════════════════════════
     Render: Main Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="routine-builder-container">
      {view === 'list' && renderRoutineList()}
      {view === 'builder' && renderRoutineBuilder()}
      {view === 'executor' && executingRoutine && (
        <RoutineExecutor
          routine={executingRoutine}
          onComplete={stopRoutine}
          onCancel={stopRoutine}
        />
      )}
    </div>
  );
};

export default RoutineBuilder;
