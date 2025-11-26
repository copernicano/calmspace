/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Strategies - Autism-Friendly with Progressive Disclosure
 * ═══════════════════════════════════════════════════════════════════
 *
 * CRITICAL improvements for cognitive load:
 * - Progressive disclosure (expand/collapse details)
 * - Chunking: title + 1-line action (always visible)
 * - "Why it works" hidden by default
 * - Prominent action buttons
 * - Visual hierarchy clear
 * - Simple language, NO scientific jargon
 * - Scannable layout
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/design-system.css';
import '../../styles/enhanced-emotion.css';

const EnhancedStrategies = ({ emotion, intensity, onBack }) => {
  const { settings } = useEnhancedSettings();
  const navigate = useNavigate();

  const [expandedStrategy, setExpandedStrategy] = useState(null);

  /* ═══════════════════════════════════════════════════════════════════
     Strategies Data - Simplified & Action-Oriented
     ═══════════════════════════════════════════════════════════════════ */

  const strategiesData = {
    felice: [
      {
        id: 'awareness',
        icon: '👁️',
        title: 'Consapevolezza',
        action: 'Nota come si sente il tuo corpo in questo momento',
        why: 'Prestare attenzione alle sensazioni positive aiuta a prolungare la felicità.',
        actionButton: null,
      },
      {
        id: 'share',
        icon: '💬',
        title: 'Condividi',
        action: 'Racconta a qualcuno di questo momento positivo',
        why: 'Condividere amplifica le emozioni positive e rafforza i legami.',
        actionButton: null,
      },
      {
        id: 'gratitude',
        icon: '🙏',
        title: 'Gratitudine',
        action: 'Scrivi 3 cose specifiche che ti rendono felice ora',
        why: 'La gratitudine rafforza i circuiti neurali della positività.',
        actionButton: null,
      },
      {
        id: 'anchor',
        icon: '⚓',
        title: 'Crea un ancoraggio',
        action: 'Fai un respiro profondo e un gesto particolare',
        why: 'Questo ti aiuta a richiamare questa felicità in futuro.',
        actionButton: null,
      },
    ],
    triste: [
      {
        id: 'breathing',
        icon: '🫁',
        title: 'Respirazione',
        action: 'Inspira per 4 secondi, espira per 6 secondi',
        why: 'La respirazione lenta calma il sistema nervoso e stabilizza l\'umore.',
        actionButton: { label: 'Pratica respirazione', path: '/calmspace?mode=breathing' },
      },
      {
        id: 'express',
        icon: '💭',
        title: 'Dai un nome',
        action: 'Descrivi a parole cosa senti e dove lo senti nel corpo',
        why: 'Nominare le emozioni aiuta il cervello a regolarle.',
        actionButton: null,
      },
      {
        id: 'safe-space',
        icon: '🛋️',
        title: 'Spazio sicuro',
        action: 'Vai in un posto tranquillo e confortevole',
        why: 'Un ambiente calmo riduce lo stress e aiuta il recupero.',
        actionButton: null,
      },
      {
        id: 'routine',
        icon: '📋',
        title: 'Routine familiare',
        action: 'Fai un\'attività che conosci bene e ti rassicura',
        why: 'Le routine prevedibili creano sicurezza emotiva.',
        actionButton: null,
      },
    ],
    arrabbiato: [
      {
        id: 'breathing-478',
        icon: '🫁',
        title: 'Respirazione 4-7-8',
        action: 'Inspira 4 sec, trattieni 7 sec, espira 8 sec (ripeti 5 volte)',
        why: 'Questa tecnica abbassa rapidamente la risposta di stress.',
        actionButton: { label: 'Pratica ora', path: '/calmspace?mode=breathing' },
      },
      {
        id: 'distance',
        icon: '🚶',
        title: 'Allontanati',
        action: 'Lascia fisicamente la situazione per almeno 15 minuti',
        why: 'La distanza interrompe l\'escalation emotiva.',
        actionButton: null,
      },
      {
        id: 'pressure',
        icon: '✋',
        title: 'Pressione',
        action: 'Usa una palla anti-stress o applica pressione su braccia/gambe',
        why: 'La pressione profonda rilascia serotonina e calma.',
        actionButton: null,
      },
      {
        id: 'focus',
        icon: '🧩',
        title: 'Concentrati su altro',
        action: 'Fai un puzzle, conta all\'indietro, risolvi un problema',
        why: 'Concentrarsi sposta l\'attenzione dalle emozioni al pensiero razionale.',
        actionButton: null,
      },
    ],
    preoccupato: [
      {
        id: 'grounding',
        icon: '⚓',
        title: 'Grounding 5-4-3-2-1',
        action: 'Nota: 5 cose che vedi, 4 che tocchi, 3 che senti, 2 che odori, 1 che gusti',
        why: 'Riporta l\'attenzione al presente, interrompendo l\'ansia.',
        actionButton: null,
      },
      {
        id: 'write',
        icon: '✏️',
        title: 'Scrivi le preoccupazioni',
        action: 'Elenca tutte le preoccupazioni su carta o note',
        why: 'Scrivere le trasferisce dalla mente e riduce il carico.',
        actionButton: null,
      },
      {
        id: 'worry-time',
        icon: '⏱️',
        title: 'Tempo dedicato',
        action: 'Metti un timer di 15 minuti solo per preoccuparti',
        why: 'Limitare il tempo aiuta a contenere l\'ansia.',
        actionButton: { label: 'Imposta timer', path: '/timer' },
      },
      {
        id: 'support',
        icon: '🤝',
        title: 'Chiedi aiuto',
        action: 'Parla con una persona di fiducia o un professionista',
        why: 'Il supporto sociale riduce il carico emotivo.',
        actionButton: null,
      },
    ],
    calmo: [
      {
        id: 'maintain',
        icon: '👍',
        title: 'Mantieni',
        action: 'Continua con attività che preservano questo equilibrio',
        why: 'Sostenere la calma rafforza i circuiti di benessere.',
        actionButton: null,
      },
      {
        id: 'body-scan',
        icon: '🧘',
        title: 'Scansione corpo',
        action: 'Nota come si sente ogni parte del tuo corpo',
        why: 'Aumenta la consapevolezza delle sensazioni positive.',
        actionButton: { label: 'Meditazione guidata', path: '/calmspace' },
      },
      {
        id: 'journal',
        icon: '📝',
        title: 'Scrivi nel diario',
        action: 'Annota cosa ha contribuito a questa calma',
        why: 'Documentare ti aiuta a ricreare la calma in futuro.',
        actionButton: null,
      },
      {
        id: 'deepen',
        icon: '🧘',
        title: 'Approfondisci',
        action: 'Prova una breve meditazione o yoga',
        why: 'Le pratiche contemplative potenziano la calma.',
        actionButton: { label: 'Vai al tuo spazio', path: '/calmspace' },
      },
    ],
    confuso: [
      {
        id: 'reduce-stimuli',
        icon: '⏸️',
        title: 'Riduci stimoli',
        action: 'Vai in un posto tranquillo, riduci luci e rumori',
        why: 'Meno input = più chiarezza mentale.',
        actionButton: null,
      },
      {
        id: 'break-down',
        icon: '📋',
        title: 'Dividi in pezzi',
        action: 'Separa la situazione in parti più piccole e gestibili',
        why: 'Ridurre la complessità aiuta a elaborare.',
        actionButton: null,
      },
      {
        id: 'visual-aid',
        icon: '📊',
        title: 'Usa supporti visivi',
        action: 'Disegna un diagramma o fai una lista',
        why: 'Le immagini riducono il carico sulla memoria.',
        actionButton: null,
      },
      {
        id: 'ask',
        icon: '❓',
        title: 'Chiedi chiarimenti',
        action: 'Fai domande concrete e specifiche',
        why: 'Informazioni precise riducono la confusione.',
        actionButton: null,
      },
    ],
  };

  const strategies = strategiesData[emotion.name] || [];

  // Filter based on intensity and settings
  const getDisplayedStrategies = () => {
    let filtered = [...strategies];

    // Filter by intensity
    if (intensity === 1) {
      filtered = filtered.slice(0, 2); // Show 2 for low intensity
    } else if (intensity === 2) {
      filtered = filtered.slice(0, 3); // Show 3 for medium
    }
    // intensity === 3 shows all 4

    // Further reduce if settings.informationDensity is low
    if (settings.informationDensity === 'low') {
      filtered = filtered.slice(0, Math.min(2, filtered.length));
    }

    return filtered;
  };

  const displayedStrategies = getDisplayedStrategies();

  /* ═══════════════════════════════════════════════════════════════════
     Handlers
     ═══════════════════════════════════════════════════════════════════ */

  const toggleExpand = (strategyId) => {
    setExpandedStrategy(expandedStrategy === strategyId ? null : strategyId);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="strategies-step">
      {/* Back Button */}
      <button className="btn btn-ghost back-button-top" onClick={onBack} aria-label="Torna indietro">
        ← Indietro
      </button>

      {/* Header */}
      <header className="step-header">
        <div className="emotion-badge" style={{ backgroundColor: emotion.color }}>
          <span className="emotion-emoji-small">{emotion.emoji}</span>
          <span className="emotion-name-small">{emotion.name}</span>
        </div>

        <h1 className="step-title">Cosa posso fare</h1>
        <p className="step-description">
          {displayedStrategies.length} strategie per gestire questa emozione
        </p>
      </header>

      {/* Strategies List */}
      <div className="strategies-list">
        {displayedStrategies.map((strategy, index) => {
          const isExpanded = expandedStrategy === strategy.id;

          return (
            <div
              key={strategy.id}
              className={`strategy-card-enhanced ${isExpanded ? 'expanded' : ''}`}
            >
              {/* Always Visible: Icon + Title + Action */}
              <div className="strategy-header">
                <div className="strategy-icon-large" aria-hidden="true">
                  {strategy.icon}
                </div>

                <div className="strategy-main-content">
                  <h3 className="strategy-title-enhanced">{strategy.title}</h3>
                  <p className="strategy-action-text">{strategy.action}</p>
                </div>

                {/* Expand Toggle */}
                <button
                  className="expand-button"
                  onClick={() => toggleExpand(strategy.id)}
                  aria-label={isExpanded ? 'Nascondi dettagli' : 'Mostra dettagli'}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? '▲' : '▼'}
                </button>
              </div>

              {/* Expandable: "Why it works" */}
              {isExpanded && (
                <div className="strategy-details">
                  <div className="why-section">
                    <strong className="why-label">Perché funziona:</strong>
                    <p className="why-text">{strategy.why}</p>
                  </div>
                </div>
              )}

              {/* Action Button (if available) */}
              {strategy.actionButton && (
                <button
                  className="strategy-action-button btn btn-sm"
                  onClick={() => navigate(strategy.actionButton.path)}
                  style={{ borderColor: emotion.color, color: emotion.color }}
                >
                  {strategy.actionButton.label} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="strategies-bottom-actions">
        <button
          className="btn btn-lg btn-block"
          onClick={() => navigate('/calmspace')}
          style={{
            backgroundColor: emotion.color,
            borderColor: emotion.color,
          }}
        >
          Vai al tuo spazio calmo
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => navigate('/')}
        >
          Torna alla home
        </button>
      </div>

      {/* Helper Text */}
      {settings.keyboardNavigationHelp && (
        <div className="keyboard-help">
          <p className="help-text-small">
            Premi <kbd>Spazio</kbd> o <kbd>Enter</kbd> per espandere le strategie
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedStrategies;
