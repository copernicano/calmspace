/**
 * ═══════════════════════════════════════════════════════════════════
 * Progress Indicator Component
 * ═══════════════════════════════════════════════════════════════════
 *
 * Shows progress through multi-step flows with:
 * - Clear visual step indicators
 * - "X of Y" text representation
 * - Optional labels for each step
 * - Skip/back navigation support
 * - Accessible ARIA labels
 */

import React from 'react';
import '../../styles/design-system.css';
import '../../styles/progress-indicator.css';

const ProgressIndicator = ({
  currentStep,
  totalSteps,
  stepLabels = [],
  onStepClick = null, // Allow jumping to steps if provided
  showStepNumbers = true,
  className = '',
}) => {
  /* ═══════════════════════════════════════════════════════════════════
     Generate Step Array
     ═══════════════════════════════════════════════════════════════════ */

  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  /* ═══════════════════════════════════════════════════════════════════
     Check Step Status
     ═══════════════════════════════════════════════════════════════════ */

  const getStepStatus = (stepNumber) => {
    if (stepNumber < currentStep) return 'completed';
    if (stepNumber === currentStep) return 'current';
    return 'upcoming';
  };

  const isClickable = onStepClick !== null;

  /* ═══════════════════════════════════════════════════════════════════
     Handle Step Click
     ═══════════════════════════════════════════════════════════════════ */

  const handleStepClick = (stepNumber) => {
    if (isClickable && onStepClick) {
      onStepClick(stepNumber);
    }
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className={`progress-indicator ${className}`} role="navigation" aria-label="Progresso">
      {/* Text Progress (always visible for screen readers) */}
      <div className="progress-text" aria-live="polite">
        Passo <strong>{currentStep}</strong> di <strong>{totalSteps}</strong>
      </div>

      {/* Visual Progress Steps */}
      <div className="progress-steps">
        {steps.map((stepNumber, index) => {
          const status = getStepStatus(stepNumber);
          const label = stepLabels[index];

          return (
            <React.Fragment key={stepNumber}>
              {/* Step Circle */}
              <button
                className={`progress-step ${status} ${isClickable ? 'clickable' : ''}`}
                onClick={() => handleStepClick(stepNumber)}
                disabled={!isClickable}
                aria-label={
                  label
                    ? `${label} - Passo ${stepNumber} di ${totalSteps}`
                    : `Passo ${stepNumber} di ${totalSteps}`
                }
                aria-current={status === 'current' ? 'step' : undefined}
              >
                {status === 'completed' ? (
                  <span className="step-icon" aria-hidden="true">✓</span>
                ) : showStepNumbers ? (
                  <span className="step-number">{stepNumber}</span>
                ) : (
                  <span className="step-dot" aria-hidden="true"></span>
                )}

                {/* Step Label (if provided) */}
                {label && (
                  <span className="step-label">{label}</span>
                )}
              </button>

              {/* Connector Line (not after last step) */}
              {index < totalSteps - 1 && (
                <div
                  className={`progress-connector ${
                    stepNumber < currentStep ? 'completed' : ''
                  }`}
                  aria-hidden="true"
                ></div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Progress Bar (alternative visual representation) */}
      <div className="progress-bar-container" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax={totalSteps}>
        <div
          className="progress-bar-fill"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default ProgressIndicator;
