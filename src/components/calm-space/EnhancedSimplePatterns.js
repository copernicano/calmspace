/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Simple Patterns - With Sensory Customization
 * ═══════════════════════════════════════════════════════════════════
 *
 * Wrapper around existing SimplePatterns with enhanced controls
 */

import React, { useEffect, useRef } from 'react';
import '../../styles/calmspace.css';
import '../../styles/calmspace-animations.css';

// Import sounds
import bubblesSound from '../../assets/sounds/bubbles.mp3';
import wavesSound from '../../assets/sounds/waves.mp3';
import nightSound from '../../assets/sounds/summer-night.mp3';
import whitenoiseBinauralSound from '../../assets/sounds/whitenoise-binaural.mp3';

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
      className={`pattern-display ${activePattern} speed-${animationSpeed} ${
        isFullscreen ? 'fullscreen-mode' : ''
      }`}
      style={{
        '--visual-intensity': visualIntensity,
        '--animation-speed-multiplier': animationSpeed === 'slow' ? '1.5' : '1',
      }}
    >
      {/* Bubbles Pattern */}
      {activePattern === 'bubbles' && (
        <div className="bubbles-pattern">
          {Array.from({ length: 25 }).map((_, i) => (
            <div
              key={i}
              className={`bubble bubble-${(i % 4) + 1}`}
              style={{
                '--delay': `${Math.random() * 5}s`,
                '--size': `${30 + Math.random() * 70}px`,
                '--left': `${Math.random() * 100}%`,
                '--drift': `${Math.random() * 60 - 30}px`,
              }}
            />
          ))}
          {/* Foam particles for depth */}
          {Array.from({ length: 15 }).map((_, i) => (
            <div
              key={`foam-${i}`}
              className="foam-particle"
              style={{
                '--delay': `${Math.random() * 8}s`,
                '--left': `${Math.random() * 100}%`,
                '--drift': `${Math.random() * 40 - 20}px`,
              }}
            />
          ))}
        </div>
      )}

      {/* Waves Pattern */}
      {activePattern === 'waves' && (
        <div className="waves-pattern">
          {/* Deep ocean layers */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className={`wave-layer wave-layer-${i + 1}`}
              style={{
                '--delay': `${i * 0.5}s`,
              }}
            />
          ))}
          {/* Surface waves */}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`surface-${i}`}
              className={`surface-wave surface-wave-${i + 1}`}
              style={{
                '--delay': `${i * 0.3}s`,
              }}
            />
          ))}
          {/* Floating particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`particle-${i}`}
              className="floating-particle"
              style={{
                '--left': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 10}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Stars Pattern */}
      {activePattern === 'stars' && (
        <div className="stars-pattern">
          {/* Cross-shaped stars */}
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className={`star star-${(i % 5) + 1}`}
              style={{
                '--left': `${Math.random() * 100}%`,
                '--top': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 5}s`,
                '--scale': 0.3 + Math.random() * 1.2,
              }}
            />
          ))}
          {/* Meteors */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`meteor-${i}`}
              className="meteor"
              style={{
                '--delay': `${Math.random() * 15 + 5}s`,
                '--duration': `${0.8 + Math.random() * 0.5}s`,
                '--start-x': `${Math.random() * 100}%`,
              }}
            />
          ))}
          {/* Nebulae */}
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`nebula-${i}`}
              className={`nebula nebula-${(i % 3) + 1}`}
              style={{
                '--left': `${20 + Math.random() * 60}%`,
                '--top': `${20 + Math.random() * 60}%`,
                '--hue': Math.random() * 360,
              }}
            />
          ))}
          {/* Stardust */}
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={`dust-${i}`}
              className="stardust"
              style={{
                '--left': `${Math.random() * 100}%`,
                '--top': `${Math.random() * 100}%`,
                '--delay': `${Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Abstract Geometric Pattern */}
      {activePattern === 'abstract' && (
        <div className="abstract-pattern">
          {/* Hexagonal grid */}
          <div className="hex-grid">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="hex"
                style={{
                  '--delay': `${Math.random() * 8}s`,
                  '--row': Math.floor(i / 6),
                  '--col': i % 6,
                }}
              />
            ))}
          </div>
          {/* Concentric circles */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`circle-${i}`}
              className="concentric-circle"
              style={{
                '--size': `${100 + i * 80}px`,
                '--delay': `${i * 0.5}s`,
              }}
            />
          ))}
          {/* Rotating shapes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={`shape-${i}`}
              className={`rotating-shape shape-${(i % 3) + 1}`}
              style={{
                '--angle': `${i * 30}deg`,
                '--distance': `${150 + Math.random() * 100}px`,
                '--delay': `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedSimplePatterns;
