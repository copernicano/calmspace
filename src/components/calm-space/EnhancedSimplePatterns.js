/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Simple Patterns - Modern Beautiful Animations
 * ═══════════════════════════════════════════════════════════════════
 *
 * NEW: Completely redesigned with stunning, soul-touching animations
 */

import React, { useEffect, useRef } from 'react';
import '../../styles/calmspace.css';

// Import new animation components
import BubblesAnimation from './BubblesAnimation';
import WavesAnimation from './WavesAnimation';
import StarsAnimation from './StarsAnimation';
import GeometricAnimation from './GeometricAnimation';
import FireflyMeadowAnimation from './FireflyMeadowAnimation';

// Import sounds
import bubblesSound from '../../assets/sounds/bubbles.mp3';
import wavesSound from '../../assets/sounds/waves.mp3';
import nightSound from '../../assets/sounds/summer-night.mp3';
import whitenoiseBinauralSound from '../../assets/sounds/whitenoise-binaural.mp3';
import forestAmbienceSound from '../../assets/sounds/135796592-morning-forest-ambience.m4a';

const EnhancedSimplePatterns = ({
  isFullscreen,
  visualIntensity = 1,
  audioVolume = 0.5,
  audioEnabled = false,
  activePattern = 'bubbles',
  animationSpeed = 'medium',
  onPatternChange,
  onSpeedChange,
}) => {
  // Audio refs
  const audioRefs = useRef({
    bubbles: new Audio(bubblesSound),
    waves: new Audio(wavesSound),
    stars: new Audio(nightSound),
    abstract: new Audio(whitenoiseBinauralSound),
    countryside: new Audio(forestAmbienceSound),
  });

  // Configure all audio elements
  useEffect(() => {
    Object.values(audioRefs.current).forEach((audio) => {
      audio.loop = true;
      audio.volume = audioVolume;
    });
  }, [audioVolume]);

  // Handle audio playback
  useEffect(() => {
    const stopAllAudio = () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };

    stopAllAudio();

    if (audioEnabled) {
      const currentAudio = audioRefs.current[activePattern];
      if (currentAudio) {
        currentAudio.play().catch((err) => {
          console.log('Audio autoplay prevented:', err);
        });
      }
    }

    return () => stopAllAudio();
  }, [audioEnabled, activePattern]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  /* ═══════════════════════════════════════════════════════════════════
     Render Pattern Display
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div
      className={`pattern-display ${activePattern} speed-${animationSpeed}`}
      style={{
        '--visual-intensity': visualIntensity,
        '--animation-speed-multiplier': animationSpeed === 'slow' ? '1.5' : '1',
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}
    >
      {/* Bubbles Pattern - NEW */}
      {activePattern === 'bubbles' && <BubblesAnimation />}

      {/* Waves Pattern - NEW */}
      {activePattern === 'waves' && <WavesAnimation />}

      {/* Stars Pattern - NEW */}
      {activePattern === 'stars' && <StarsAnimation />}

      {/* Geometric Pattern - NEW */}
      {activePattern === 'abstract' && <GeometricAnimation />}

      {/* Countryside Pattern - Firefly Meadow */}
      {activePattern === 'countryside' && <FireflyMeadowAnimation />}
    </div>
  );
};

export default EnhancedSimplePatterns;
