/**
 * ═══════════════════════════════════════════════════════════════════
 * COSMIC GARDEN - Giardino Stellare Respirante
 * ═══════════════════════════════════════════════════════════════════
 *
 * Estetica: Mistica, cosmica, organica
 * Ispirazione: Nebulose, giardini celesti, mandala cosmici
 */

import React from 'react';

const CosmicGardenAnimation = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(ellipse at center, #0a0015 0%, #150520 40%, #0d0220 100%)',
      overflow: 'hidden',
    }}>
      {/* Nebulose respiranti - layer multipli */}
      {[
        { hue: 280, size: '800px', x: '20%', y: '30%', duration: '40s' },
        { hue: 320, size: '600px', x: '70%', y: '50%', duration: '35s' },
        { hue: 200, size: '700px', x: '50%', y: '20%', duration: '45s' },
        { hue: 260, size: '500px', x: '80%', y: '70%', duration: '38s' },
        { hue: 340, size: '650px', x: '15%', y: '75%', duration: '42s' },
      ].map((nebula, i) => (
        <div
          key={`nebula-${i}`}
          style={{
            position: 'absolute',
            width: nebula.size,
            height: nebula.size,
            top: nebula.y,
            left: nebula.x,
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            background: `radial-gradient(circle,
              hsla(${nebula.hue}, 80%, 60%, 0.3) 0%,
              hsla(${nebula.hue + 20}, 70%, 50%, 0.15) 30%,
              hsla(${nebula.hue - 20}, 60%, 40%, 0.08) 60%,
              transparent 100%
            )`,
            filter: 'blur(60px)',
            animation: `breathe-nebula ${nebula.duration} infinite ease-in-out`,
            animationDelay: `${i * 3}s`,
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* Stelle a croce luminose */}
      {Array.from({ length: 80 }).map((_, i) => {
        const size = 2 + Math.random() * 6;
        const hue = 200 + Math.random() * 80;
        return (
          <div
            key={`star-cross-${i}`}
            style={{
              position: 'absolute',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            {/* Centro stella */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `hsla(${hue}, 100%, 90%, 0.9)`,
              boxShadow: `0 0 ${size * 3}px hsla(${hue}, 100%, 70%, 0.6),
                          0 0 ${size * 6}px hsla(${hue}, 100%, 60%, 0.3)`,
              animation: `pulse-star ${3 + Math.random() * 4}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
            }} />
            {/* Raggi croce */}
            <div style={{
              position: 'absolute',
              width: `${size * 3}px`,
              height: '1px',
              background: `linear-gradient(to right,
                transparent 0%,
                hsla(${hue}, 100%, 90%, 0.6) 50%,
                transparent 100%
              )`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(0.5px)',
            }} />
            <div style={{
              position: 'absolute',
              width: '1px',
              height: `${size * 3}px`,
              background: `linear-gradient(to bottom,
                transparent 0%,
                hsla(${hue}, 100%, 90%, 0.6) 50%,
                transparent 100%
              )`,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              filter: 'blur(0.5px)',
            }} />
          </div>
        );
      })}

      {/* Fiori cosmici - elementi organici */}
      {Array.from({ length: 12 }).map((_, i) => {
        const size = 80 + Math.random() * 120;
        const hue = 260 + Math.random() * 100;
        const petalCount = 5 + Math.floor(Math.random() * 3);
        return (
          <div
            key={`cosmic-flower-${i}`}
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              top: `${10 + Math.random() * 80}%`,
              left: `${10 + Math.random() * 80}%`,
              animation: `rotate-flower ${60 + Math.random() * 40}s infinite linear`,
              animationDelay: `${Math.random() * 30}s`,
            }}
          >
            {/* Petali */}
            {Array.from({ length: petalCount }).map((_, j) => (
              <div
                key={`petal-${j}`}
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  transform: `rotate(${(360 / petalCount) * j}deg)`,
                }}
              >
                <div style={{
                  position: 'absolute',
                  width: '40%',
                  height: '60%',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
                  background: `radial-gradient(ellipse at center,
                    hsla(${hue}, 80%, 70%, 0.4) 0%,
                    hsla(${hue + 20}, 70%, 60%, 0.2) 60%,
                    transparent 100%
                  )`,
                  filter: 'blur(3px)',
                  animation: `pulse-petal ${4 + Math.random() * 3}s infinite ease-in-out`,
                  animationDelay: `${j * 0.3}s`,
                }} />
              </div>
            ))}
            {/* Centro fiore */}
            <div style={{
              position: 'absolute',
              width: '30%',
              height: '30%',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderRadius: '50%',
              background: `radial-gradient(circle,
                hsla(${hue + 40}, 90%, 80%, 0.8) 0%,
                hsla(${hue + 60}, 80%, 70%, 0.4) 70%,
                transparent 100%
              )`,
              boxShadow: `0 0 ${size / 3}px hsla(${hue + 40}, 100%, 70%, 0.6)`,
              filter: 'blur(2px)',
            }} />
          </div>
        );
      })}

      {/* Polvere cosmica scintillante */}
      {Array.from({ length: 150 }).map((_, i) => (
        <div
          key={`dust-${i}`}
          style={{
            position: 'absolute',
            width: '1px',
            height: '1px',
            borderRadius: '50%',
            background: 'white',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.6 + 0.2,
            animation: `sparkle ${2 + Math.random() * 4}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 6}s`,
          }}
        />
      ))}

      {/* Filamenti energetici connettivi */}
      {Array.from({ length: 6 }).map((_, i) => {
        const hue = 260 + Math.random() * 60;
        return (
          <svg
            key={`filament-${i}`}
            style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
              opacity: 0.3,
              mixBlendMode: 'screen',
            }}
          >
            <path
              d={`M ${Math.random() * 100} ${Math.random() * 100}
                  Q ${Math.random() * 100} ${Math.random() * 100},
                    ${Math.random() * 100} ${Math.random() * 100}`}
              stroke={`hsl(${hue}, 70%, 60%)`}
              strokeWidth="1"
              fill="none"
              filter="blur(2px)"
              style={{
                animation: `flow-energy ${20 + Math.random() * 20}s infinite ease-in-out`,
              }}
            />
          </svg>
        );
      })}

      <style>{`
        @keyframes breathe-nebula {
          0%, 100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes pulse-star {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }

        @keyframes rotate-flower {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulse-petal {
          0%, 100% {
            opacity: 0.4;
            transform: translateX(-50%) scale(1);
          }
          50% {
            opacity: 0.7;
            transform: translateX(-50%) scale(1.1);
          }
        }

        @keyframes sparkle {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }

        @keyframes flow-energy {
          0%, 100% {
            stroke-dasharray: 100;
            stroke-dashoffset: 0;
          }
          50% {
            stroke-dasharray: 100;
            stroke-dashoffset: 200;
          }
        }
      `}</style>
    </div>
  );
};

export default CosmicGardenAnimation;
