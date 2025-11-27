/**
 * ═══════════════════════════════════════════════════════════════════
 * Routine Templates - Predefined Routine Templates
 * ═══════════════════════════════════════════════════════════════════
 */

import React from 'react';
import '../../styles/routine-builder.css';

const RoutineTemplates = ({ onUseTemplate }) => {
  const templates = [
    {
      id: 'morning-routine',
      name: 'Routine del mattino',
      description: 'Inizia la giornata con calma e focus',
      icon: '☀️',
      activities: [
        {
          id: 1,
          type: 'breathing',
          name: 'Respirazione',
          icon: '🫁',
          duration: 3,
          route: '/calm-space?mode=breathing',
        },
        {
          id: 2,
          type: 'meditation',
          name: 'Meditazione',
          icon: '🌊',
          duration: 10,
          route: '/calm-space?mode=patterns',
        },
        {
          id: 3,
          type: 'emotion-check',
          name: 'Check Emozioni',
          icon: '💭',
          duration: 3,
          route: '/emotion',
        },
      ],
    },
    {
      id: 'evening-routine',
      name: 'Routine della sera',
      description: 'Rilassati e prepara il riposo',
      icon: '🌙',
      activities: [
        {
          id: 1,
          type: 'emotion-check',
          name: 'Check Emozioni',
          icon: '💭',
          duration: 5,
          route: '/emotion',
        },
        {
          id: 2,
          type: 'breathing',
          name: 'Respirazione',
          icon: '🫁',
          duration: 5,
          route: '/calm-space?mode=breathing',
        },
        {
          id: 3,
          type: 'meditation',
          name: 'Meditazione',
          icon: '🌊',
          duration: 15,
          route: '/calm-space?mode=patterns',
        },
      ],
    },
    {
      id: 'anxiety-management',
      name: 'Gestione ansia',
      description: 'Calma durante momenti difficili',
      icon: '🛡️',
      activities: [
        {
          id: 1,
          type: 'breathing',
          name: 'Respirazione',
          icon: '🫁',
          duration: 5,
          route: '/calm-space?mode=breathing',
        },
        {
          id: 2,
          type: 'meditation',
          name: 'Meditazione',
          icon: '🌊',
          duration: 10,
          route: '/calm-space?mode=patterns',
        },
        {
          id: 3,
          type: 'breathing',
          name: 'Respirazione',
          icon: '🫁',
          duration: 3,
          route: '/calm-space?mode=breathing',
        },
      ],
    },
    {
      id: 'focus-session',
      name: 'Sessione focus',
      description: 'Concentrazione per studio o lavoro',
      icon: '🎯',
      activities: [
        {
          id: 1,
          type: 'breathing',
          name: 'Respirazione',
          icon: '🫁',
          duration: 2,
          route: '/calm-space?mode=breathing',
        },
        {
          id: 2,
          type: 'timer',
          name: 'Timer',
          icon: '⏱',
          duration: 25,
          route: '/timer',
        },
        {
          id: 3,
          type: 'timer',
          name: 'Timer',
          icon: '⏱',
          duration: 5,
          route: '/timer',
        },
      ],
    },
    {
      id: 'quick-reset',
      name: 'Reset veloce',
      description: 'Breve pausa rigenerante',
      icon: '⚡',
      activities: [
        {
          id: 1,
          type: 'breathing',
          name: 'Respirazione',
          icon: '🫁',
          duration: 3,
          route: '/calm-space?mode=breathing',
        },
        {
          id: 2,
          type: 'meditation',
          name: 'Meditazione',
          icon: '🌊',
          duration: 5,
          route: '/calm-space?mode=patterns',
        },
      ],
    },
  ];

  const getTotalDuration = (template) => {
    return template.activities.reduce((sum, a) => sum + a.duration, 0);
  };

  return (
    <div className="routine-templates-section">
      <h2 className="section-title">Template pronti all'uso</h2>
      <div className="template-cards">
        {templates.map((template) => (
          <div key={template.id} className="template-card">
            <div className="template-icon-large">{template.icon}</div>
            <div className="template-content">
              <h3 className="template-name">{template.name}</h3>
              <p className="template-description">{template.description}</p>
              <div className="template-meta">
                <span className="template-duration">
                  {getTotalDuration(template)} min
                </span>
                <span className="template-activities">
                  {template.activities.length} attività
                </span>
              </div>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onUseTemplate(template)}
            >
              Usa template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoutineTemplates;
