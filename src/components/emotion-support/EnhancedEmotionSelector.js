/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Emotion Selector - Autism-Friendly
 * ═══════════════════════════════════════════════════════════════════
 *
 * Features:
 * - Opzione "Non lo so" per alexitimia
 * - Preview delle strategie principali
 * - ProgressIndicator integrato
 * - Skip navigation (salta intensità)
 * - Feedback chiaro e prevedibile
 * - No background color changes improvvisi
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import { getFromStorage, saveToStorage } from '../../utils/storage';
import ProgressIndicator from '../common/ProgressIndicator';
import SessionTimer from '../common/SessionTimer';
import EnhancedIntensitySlider from './EnhancedIntensitySlider';
import EnhancedStrategies from './EnhancedStrategies';
import '../../styles/design-system.css';
import '../../styles/enhanced-emotion.css';

const EnhancedEmotionSelector = () => {
  const { settings } = useEnhancedSettings();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: select emotion, 2: intensity, 3: strategies
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(2); // Default medio
  const [showPreview, setShowPreview] = useState(null); // For emotion preview

  /* ═══════════════════════════════════════════════════════════════════
     Load Last Emotion
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    const savedEmotion = getFromStorage('lastEmotion');
    if (savedEmotion) {
      try {
        const parsed = JSON.parse(savedEmotion);
        if (parsed.name) {
          // Don't auto-select, just store for "last used" indicator
          // Let user make conscious choice each time
        }
      } catch (e) {
        console.error('Error parsing saved emotion:', e);
      }
    }
  }, []);

  /* ═══════════════════════════════════════════════════════════════════
     Emotions Data (usando colori dal design system)
     ═══════════════════════════════════════════════════════════════════ */

  const emotions = [
    {
      name: 'felice',
      emoji: '😊',
      color: 'var(--emotion-happy)',
      keywords: ['gioia', 'allegria', 'contentezza'],
      topStrategy: 'Condividi questo momento positivo',
    },
    {
      name: 'triste',
      emoji: '😢',
      color: 'var(--emotion-sad)',
      keywords: ['malinconia', 'sconforto', 'vuoto'],
      topStrategy: 'Respirazione diaframmatica profonda',
    },
    {
      name: 'arrabbiato',
      emoji: '😠',
      color: 'var(--emotion-angry)',
      keywords: ['frustrazione', 'rabbia', 'irritazione'],
      topStrategy: 'Allontanati temporaneamente',
    },
    {
      name: 'preoccupato',
      emoji: '😟',
      color: 'var(--emotion-worried)',
      keywords: ['ansia', 'tensione', 'apprensione'],
      topStrategy: 'Tecnica Grounding 5-4-3-2-1',
    },
    {
      name: 'calmo',
      emoji: '😌',
      color: 'var(--emotion-calm)',
      keywords: ['serenità', 'pace', 'rilassamento'],
      topStrategy: 'Consolida questo stato',
    },
    {
      name: 'confuso',
      emoji: '😕',
      color: 'var(--emotion-confused)',
      keywords: ['incertezza', 'disorientamento', 'perplessità'],
      topStrategy: 'Riduci gli stimoli esterni',
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════
     Handlers
     ═══════════════════════════════════════════════════════════════════ */

  const handleEmotionSelect = (emotion) => {
    setSelectedEmotion(emotion);
    saveToStorage('lastEmotion', JSON.stringify(emotion));

    // Se informationDensity è low, salta l'intensità e vai diretto alle strategie
    if (settings.informationDensity === 'low' && settings.reducedChoices) {
      setIntensity(2); // Default medio
      setStep(3);
    } else {
      setStep(2);
    }

    setShowPreview(null); // Close preview
  };

  const handleAlexithymiaOption = () => {
    // Opzione "Non lo so" - guida all'esplorazione
    navigate('/calmspace'); // Vai allo spazio calmo per esplorare
  };

  const handleIntensitySelect = (level) => {
    setIntensity(level);
    setStep(3);
  };

  const handleSkipIntensity = () => {
    setIntensity(2); // Default medio
    setStep(3);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedEmotion(null);
    } else if (step === 3) {
      setStep(2);
    }
  };

  const handleJumpToStep = (targetStep) => {
    // Allow jumping back only
    if (targetStep < step) {
      setStep(targetStep);
    }
  };

  const togglePreview = (emotion) => {
    setShowPreview(showPreview === emotion.name ? null : emotion.name);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Steps
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="enhanced-emotion-container">
      {/* Session Timer */}
      {settings.showSessionTimer && <SessionTimer />}

      {/* Progress Indicator */}
      {step > 1 && (
        <ProgressIndicator
          currentStep={step}
          totalSteps={3}
          stepLabels={['Emozione', 'Intensità', 'Strategie']}
          onStepClick={handleJumpToStep}
          showStepNumbers={true}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STEP 1: Emotion Selection
          ═══════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <div className="emotion-selection-step">
          <header className="step-header">
            <h1 className="step-title">Come mi sento?</h1>
            <p className="step-description">
              Scegli l'emozione che senti in questo momento
            </p>
          </header>

          {/* Emotions Grid */}
          <div className="emotions-grid">
            {emotions.map((emotion) => (
              <div key={emotion.name} className="emotion-card-wrapper">
                <button
                  className="emotion-card"
                  onClick={() => handleEmotionSelect(emotion)}
                  style={{ '--emotion-color': emotion.color }}
                  aria-label={`Mi sento ${emotion.name}`}
                >
                  <span className="emotion-emoji-large" aria-hidden="true">
                    {emotion.emoji}
                  </span>
                  <span className="emotion-name">{emotion.name}</span>

                  {/* Quick preview toggle */}
                  <button
                    className="preview-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePreview(emotion);
                    }}
                    aria-label={`Anteprima strategie per ${emotion.name}`}
                  >
                    {showPreview === emotion.name ? '▲' : '▼'}
                  </button>
                </button>

                {/* Preview Panel (collapsible) */}
                {showPreview === emotion.name && (
                  <div className="emotion-preview">
                    <div className="preview-keywords">
                      <strong>Parole correlate:</strong>
                      <ul>
                        {emotion.keywords.map((keyword, i) => (
                          <li key={i}>{keyword}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="preview-strategy">
                      <strong>Strategia principale:</strong>
                      <p>{emotion.topStrategy}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Alexithymia Option */}
          <div className="alexithymia-section">
            <div className="divider">
              <span>oppure</span>
            </div>

            <button
              className="alexithymia-button btn btn-secondary btn-lg btn-block"
              onClick={handleAlexithymiaOption}
            >
              <span className="alexithymia-icon">❓</span>
              <div className="alexithymia-text">
                <strong>Non lo so</strong>
                <span className="alexithymia-description">
                  Non sono sicuro di cosa sento
                </span>
              </div>
            </button>

            <p className="alexithymia-help">
              È normale non sapere sempre cosa si prova. Ti porteremo in uno spazio calmo
              per esplorare le tue sensazioni.
            </p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STEP 2: Intensity Selection
          ═══════════════════════════════════════════════════════════════ */}
      {step === 2 && selectedEmotion && (
        <EnhancedIntensitySlider
          emotion={selectedEmotion}
          initialIntensity={intensity}
          onSelectIntensity={handleIntensitySelect}
          onBack={handleBack}
          onSkip={handleSkipIntensity}
        />
      )}

      {/* ═══════════════════════════════════════════════════════════════
          STEP 3: Strategies Display
          ═══════════════════════════════════════════════════════════════ */}
      {step === 3 && selectedEmotion && (
        <EnhancedStrategies
          emotion={selectedEmotion}
          intensity={intensity}
          onBack={handleBack}
        />
      )}
    </div>
  );
};

export default EnhancedEmotionSelector;
