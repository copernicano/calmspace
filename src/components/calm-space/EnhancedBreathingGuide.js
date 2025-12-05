/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Breathing Guide - Autism-Friendly
 * ═══════════════════════════════════════════════════════════════════
 *
 * Guided breathing exercise with clear visual feedback
 */

import React, { useState, useEffect } from 'react';
import '../../styles/design-system.css';
import '../../styles/enhanced-calmspace.css';

const EnhancedBreathingGuide = ({ isFullscreen, audioVolume = 0.5, audioEnabled = false }) => {
  const [phase, setPhase] = useState('inhale'); // 'inhale' | 'hold' | 'exhale'
  const [count, setCount] = useState(4);
  const [isActive, setIsActive] = useState(false);

  // Breathing pattern: 4-7-8 or 4-4-4-4 (box breathing)
  const [pattern, setPattern] = useState('box'); // 'box' | '478'

  const patterns = {
    box: {
      name: 'Box Breathing (4-4-4-4)',
      description: 'Respirazione quadrata per calma generale',
      phases: [
        { name: 'inhale', label: 'Inspira', duration: 4 },
        { name: 'hold', label: 'Trattieni', duration: 4 },
        { name: 'exhale', label: 'Espira', duration: 4 },
        { name: 'hold', label: 'Trattieni', duration: 4 },
      ],
    },
    '478': {
      name: 'Respirazione 4-7-8',
      description: 'Tecnica rilassante per ridurre stress',
      phases: [
        { name: 'inhale', label: 'Inspira', duration: 4 },
        { name: 'hold', label: 'Trattieni', duration: 7 },
        { name: 'exhale', label: 'Espira', duration: 8 },
      ],
    },
  };

  const currentPattern = patterns[pattern];
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const currentPhase = currentPattern.phases[currentPhaseIndex];

  /* ═══════════════════════════════════════════════════════════════════
     Breathing Cycle Logic
     ═══════════════════════════════════════════════════════════════════ */

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setCount((prev) => {
        if (prev > 1) {
          return prev - 1;
        } else {
          // Move to next phase
          const nextIndex = (currentPhaseIndex + 1) % currentPattern.phases.length;
          setCurrentPhaseIndex(nextIndex);
          return currentPattern.phases[nextIndex].duration;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, currentPhaseIndex, currentPattern]);

  /* ═══════════════════════════════════════════════════════════════════
     Handlers
     ═══════════════════════════════════════════════════════════════════ */

  const startBreathing = () => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setCount(currentPattern.phases[0].duration);
  };

  const stopBreathing = () => {
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setCount(currentPattern.phases[0].duration);
  };

  const toggleBreathing = () => {
    if (isActive) {
      stopBreathing();
    } else {
      startBreathing();
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     Visual Scale for Animation
     ═══════════════════════════════════════════════════════════════════ */

  const getCircleScale = () => {
    const progress = (currentPhase.duration - count) / currentPhase.duration;

    if (currentPhase.name === 'inhale') {
      return 0.5 + progress * 0.5; // Scale from 0.5 to 1
    } else if (currentPhase.name === 'exhale') {
      return 1 - progress * 0.5; // Scale from 1 to 0.5
    } else {
      return 1; // Hold - stay at 1
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="breathing-guide">
      {/* Pattern Selector (when not active) */}
      {!isActive && (
        <div className="breathing-pattern-selector">
          <h2 className="breathing-title">Scegli una tecnica di respirazione</h2>

          <div className="pattern-options">
            {Object.entries(patterns).map(([key, patternData]) => (
              <button
                key={key}
                className={`pattern-option-card ${pattern === key ? 'active' : ''}`}
                onClick={() => setPattern(key)}
              >
                <h3 className="pattern-name">{patternData.name}</h3>
                <p className="pattern-description">{patternData.description}</p>
              </button>
            ))}
          </div>

          <button className="btn btn-lg btn-block" onClick={startBreathing}>
            Inizia
          </button>
        </div>
      )}

      {/* Breathing Animation (when active) */}
      {isActive && (
        <div className="breathing-animation">
          {/* Animated Circle */}
          <div
            className={`breathing-circle phase-${currentPhase.name}`}
            style={{
              transform: `scale(${getCircleScale()})`,
              transition: 'transform 1s ease-in-out',
            }}
          >
            <div className="breathing-count">{count}</div>
          </div>

          {/* Phase Label */}
          <div className="phase-label">{currentPhase.label}</div>

          {/* Stop Button */}
          <button className="btn btn-ghost stop-breathing-btn" onClick={stopBreathing}>
            Interrompi
          </button>
        </div>
      )}
    </div>
  );
};

export default EnhancedBreathingGuide;
