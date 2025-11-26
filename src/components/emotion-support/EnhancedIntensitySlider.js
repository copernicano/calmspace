/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Intensity Slider - Autism-Friendly
 * ═══════════════════════════════════════════════════════════════════
 *
 * Improvements:
 * - NO sudden background color changes
 * - Clear visual feedback without jarring transitions
 * - Descriptive labels
 * - Skip option for quick navigation
 * - Predictable, calm design
 */

import React, { useState } from 'react';
import '../../styles/design-system.css';
import '../../styles/enhanced-emotion.css';

const EnhancedIntensitySlider = ({
  emotion,
  initialIntensity = 2,
  onSelectIntensity,
  onBack,
  onSkip,
}) => {
  const [intensity, setIntensity] = useState(initialIntensity);

  /* ═══════════════════════════════════════════════════════════════════
     Intensity Labels & Descriptions
     ═══════════════════════════════════════════════════════════════════ */

  const intensityLevels = [
    {
      value: 1,
      label: 'Lieve',
      description: 'Sento un po\' questa emozione, è gestibile',
      emojiSize: 'small',
    },
    {
      value: 2,
      label: 'Moderata',
      description: 'Questa emozione è piuttosto presente',
      emojiSize: 'medium',
    },
    {
      value: 3,
      label: 'Intensa',
      description: 'Questa emozione è molto forte',
      emojiSize: 'large',
    },
  ];

  const currentLevel = intensityLevels.find((level) => level.value === intensity);

  /* ═══════════════════════════════════════════════════════════════════
     Handlers
     ═══════════════════════════════════════════════════════════════════ */

  const handleSliderChange = (e) => {
    setIntensity(parseInt(e.target.value, 10));
  };

  const handleContinue = () => {
    onSelectIntensity(intensity);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="intensity-step">
      {/* Back Button */}
      <button className="btn btn-ghost back-button-top" onClick={onBack} aria-label="Torna indietro">
        ← Indietro
      </button>

      {/* Header */}
      <header className="step-header">
        <h1 className="step-title">
          Quanto mi sento{' '}
          <span style={{ color: emotion.color, fontWeight: 'bold' }}>
            {emotion.name}
          </span>
          ?
        </h1>
        <p className="step-description">
          Seleziona l'intensità dell'emozione che provi
        </p>
      </header>

      {/* Emotion Display (size changes with intensity) */}
      <div className="emotion-display-container">
        <div
          className={`emotion-display-large emotion-size-${currentLevel.emojiSize}`}
          aria-hidden="true"
        >
          <span className="emotion-emoji-animated">{emotion.emoji}</span>
        </div>
      </div>

      {/* Intensity Slider */}
      <div className="intensity-slider-container">
        {/* Segmented Control (Alternative to Slider) */}
        <div className="intensity-segments" role="radiogroup" aria-label="Seleziona intensità">
          {intensityLevels.map((level) => (
            <button
              key={level.value}
              className={`intensity-segment ${intensity === level.value ? 'active' : ''}`}
              onClick={() => setIntensity(level.value)}
              role="radio"
              aria-checked={intensity === level.value}
              style={{
                '--emotion-color': emotion.color,
              }}
            >
              <div className="segment-label">{level.label}</div>
              <div className="segment-description">{level.description}</div>
            </button>
          ))}
        </div>

        {/* Traditional Slider (Alternative) */}
        <div className="slider-wrapper">
          <input
            type="range"
            min="1"
            max="3"
            value={intensity}
            onChange={handleSliderChange}
            className="intensity-range-slider"
            aria-label="Seleziona intensità con slider"
            style={{
              '--slider-percentage': `${((intensity - 1) / 2) * 100}%`,
              '--emotion-color': emotion.color,
            }}
          />
          <div className="slider-labels">
            <span>Lieve</span>
            <span>Moderata</span>
            <span>Intensa</span>
          </div>
        </div>

        {/* Current Selection Display */}
        <div
          className="current-intensity-display"
          style={{ borderColor: emotion.color }}
        >
          <div className="intensity-label-large">{currentLevel.label}</div>
          <div className="intensity-description-text">{currentLevel.description}</div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="intensity-actions">
        <button
          className="btn btn-lg btn-block"
          onClick={handleContinue}
          style={{
            backgroundColor: emotion.color,
            borderColor: emotion.color,
          }}
        >
          Continua
        </button>

        {onSkip && (
          <button className="btn btn-ghost btn-sm" onClick={handleSkip}>
            Salta (usa intensità media)
          </button>
        )}
      </div>
    </div>
  );
};

export default EnhancedIntensitySlider;
