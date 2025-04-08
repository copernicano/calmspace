import React, { useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import '../../styles/timer.css';

function SimpleRoutine({ settings }) {
  // Carica le routine salvate o usa un esempio predefinito
  const [routines, setRoutines] = useState(() => {
    const savedRoutines = getFromStorage('routines');
    if (savedRoutines) {
      try {
        return JSON.parse(savedRoutines);
      } catch (e) {
        console.error('Error parsing saved routines:', e);
        return getDefaultRoutines();
      }
    }
    return getDefaultRoutines();
  });
  
  // Routine attualmente selezionata
  const [selectedRoutine, setSelectedRoutine] = useState(0);
  
  // Attività completate della routine selezionata
  const [completedActivities, setCompletedActivities] = useState(() => {
    const savedCompleted = getFromStorage(`routine_${selectedRoutine}_completed`);
    if (savedCompleted) {
      try {
        return JSON.parse(savedCompleted);
      } catch (e) {
        console.error('Error parsing saved completed activities:', e);
        return [];
      }
    }
    return [];
  });
  
  // Modalità di modifica
  const [editMode, setEditMode] = useState(false);
  // Nome temporaneo per la nuova routine
  const [newRoutineName, setNewRoutineName] = useState('');
  
  // Attività predefinite per routine nuove
  const defaultActivities = [
    { id: 1, name: 'Lavarsi i denti', icon: '🪥' },
    { id: 2, name: 'Fare colazione', icon: '🍳' },
    { id: 3, name: 'Prepararsi per la scuola', icon: '🎒' }
  ];
  
  // Routine predefinite
  function getDefaultRoutines() {
    return [
      {
        id: 1,
        name: 'Mattina',
        activities: [
          { id: 1, name: 'Lavarsi i denti', icon: '🪥' },
          { id: 2, name: 'Fare colazione', icon: '🍳' },
          { id: 3, name: 'Prepararsi per la scuola', icon: '🎒' }
        ]
      },
      {
        id: 2,
        name: 'Sera',
        activities: [
          { id: 1, name: 'Fare i compiti', icon: '📚' },
          { id: 2, name: 'Cena', icon: '🍽️' },
          { id: 3, name: 'Lavarsi i denti', icon: '🪥' },
          { id: 4, name: 'Indossare il pigiama', icon: '👕' }
        ]
      }
    ];
  }
  
  // Salva le routine quando cambiano
  useEffect(() => {
    saveToStorage('routines', JSON.stringify(routines));
  }, [routines]);
  
  // Salva le attività completate quando cambiano
  useEffect(() => {
    saveToStorage(`routine_${selectedRoutine}_completed`, JSON.stringify(completedActivities));
  }, [completedActivities, selectedRoutine]);
  
  // Cambia la routine selezionata
  const handleRoutineChange = (index) => {
    setSelectedRoutine(index);
    
    // Carica le attività completate per questa routine
    const savedCompleted = getFromStorage(`routine_${index}_completed`);
    if (savedCompleted) {
      try {
        setCompletedActivities(JSON.parse(savedCompleted));
      } catch (e) {
        console.error('Error parsing saved completed activities:', e);
        setCompletedActivities([]);
      }
    } else {
      setCompletedActivities([]);
    }
  };
  
  // Toggle lo stato di completamento di un'attività
  const toggleActivity = (activityId) => {
    if (completedActivities.includes(activityId)) {
      setCompletedActivities(completedActivities.filter(id => id !== activityId));
    } else {
      setCompletedActivities([...completedActivities, activityId]);
    }
  };
  
  // Reset delle attività completate
  const resetActivities = () => {
    setCompletedActivities([]);
  };
  
  // Calcola il progresso della routine
  const calculateProgress = () => {
    const totalActivities = routines[selectedRoutine]?.activities.length || 0;
    if (totalActivities === 0) return 0;
    return (completedActivities.length / totalActivities) * 100;
  };
  
  // Aggiunge una nuova routine
  const addRoutine = () => {
    if (newRoutineName.trim() === '') return;
    
    const newRoutine = {
      id: Date.now(),
      name: newRoutineName,
      activities: [...defaultActivities]
    };
    
    setRoutines([...routines, newRoutine]);
    setNewRoutineName('');
    setEditMode(false);
  };
  
  return (
    <div className="routine-content">
      <div className="routine-selector">
        {routines.map((routine, index) => (
          <button
            key={routine.id}
            className={`routine-button ${index === selectedRoutine ? 'active' : ''}`}
            onClick={() => handleRoutineChange(index)}
            aria-label={`Routine ${routine.name}`}
          >
            {routine.name}
          </button>
        ))}
        
        <button
          className="add-routine-button"
          onClick={() => setEditMode(true)}
          aria-label="Aggiungi routine"
        >
          +
        </button>
      </div>
      
      {editMode ? (
        <div className="add-routine-form">
          <input
            type="text"
            value={newRoutineName}
            onChange={(e) => setNewRoutineName(e.target.value)}
            placeholder="Nome routine"
            className="routine-name-input"
            aria-label="Nome della nuova routine"
          />
          <div className="routine-form-buttons">
            <button 
              className="save-routine-button"
              onClick={addRoutine}
              aria-label="Salva routine"
              disabled={newRoutineName.trim() === ''}
            >
              Salva
            </button>
            <button 
              className="cancel-button"
              onClick={() => setEditMode(false)}
              aria-label="Annulla"
            >
              Annulla
            </button>
          </div>
        </div>
      ) : (
        routines.length > 0 && (
          <>
            <div className="routine-progress">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <div className="progress-text">
                {completedActivities.length}/{routines[selectedRoutine]?.activities.length || 0} completate
              </div>
            </div>
            
            <div className="activities-list">
              {routines[selectedRoutine]?.activities.map((activity) => (
                <div 
                  key={activity.id} 
                  className={`activity-item ${completedActivities.includes(activity.id) ? 'completed' : ''}`}
                  onClick={() => toggleActivity(activity.id)}
                >
                  <div className="activity-icon">{activity.icon}</div>
                  <div className="activity-name">{activity.name}</div>
                  <div className="activity-check">
                    {completedActivities.includes(activity.id) ? '✓' : ''}
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="reset-activities-button"
              onClick={resetActivities}
              aria-label="Ricomincia"
            >
              Ricomincia
            </button>
          </>
        )
      )}
    </div>
  );
}

export default SimpleRoutine;