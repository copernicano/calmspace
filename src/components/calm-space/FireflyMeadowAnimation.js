/**
 * ═══════════════════════════════════════════════════════════════════
 * FIREFLY MEADOW - Prato di Lucciole al Crepuscolo
 * ═══════════════════════════════════════════════════════════════════
 *
 * Estetica: Poetica, nostalgica, magica
 * Ispirazione: La città incantata (Ghibli), prati estivi al tramonto
 */

import React from 'react';

const FireflyMeadowAnimation = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #2d1b4e 0%, #3d2857 15%, #4a3567 30%, #5a6f3a 60%, #3d5228 85%, #2a3818 100%)',
      overflow: 'hidden',
    }}>
      {/* Cielo stellato crepuscolare */}
      {Array.from({ length: 120 }).map((_, i) => (
        <div
          key={`twilight-star-${i}`}
          style={{
            position: 'absolute',
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            borderRadius: '50%',
            background: 'white',
            top: `${Math.random() * 40}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.7 + 0.3,
            boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
            animation: `gentle-twinkle ${3 + Math.random() * 4}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 7}s`,
          }}
        />
      ))}

      {/* Lucciole magiche - principale attrazione */}
      {Array.from({ length: 60 }).map((_, i) => {
        const size = 4 + Math.random() * 8;
        const hue = 45 + Math.random() * 20; // Giallo-verde
        const startX = Math.random() * 100;
        const startY = 30 + Math.random() * 60;
        return (
          <div
            key={`firefly-${i}`}
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              left: `${startX}%`,
              top: `${startY}%`,
              animation: `firefly-dance ${15 + Math.random() * 20}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 15}s`,
            }}
          >
            {/* Corpo lucciola */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: `radial-gradient(circle,
                hsla(${hue}, 100%, 70%, 1) 0%,
                hsla(${hue}, 90%, 60%, 0.8) 40%,
                hsla(${hue}, 80%, 50%, 0.3) 70%,
                transparent 100%
              )`,
              boxShadow: `
                0 0 ${size * 2}px hsla(${hue}, 100%, 60%, 0.9),
                0 0 ${size * 4}px hsla(${hue}, 90%, 50%, 0.6),
                0 0 ${size * 6}px hsla(${hue}, 80%, 40%, 0.3)
              `,
              animation: `firefly-glow ${1 + Math.random() * 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
            {/* Scia luminosa */}
            <div style={{
              position: 'absolute',
              width: `${size * 2}px`,
              height: '2px',
              top: '50%',
              left: '-50%',
              transform: 'translateY(-50%)',
              background: `linear-gradient(to left,
                hsla(${hue}, 100%, 70%, 0.6) 0%,
                hsla(${hue}, 80%, 50%, 0.3) 50%,
                transparent 100%
              )`,
              filter: 'blur(2px)',
              opacity: 0.7,
            }} />
          </div>
        );
      })}

      {/* Farfalle notturne delicate */}
      {Array.from({ length: 15 }).map((_, i) => {
        const size = 15 + Math.random() * 25;
        return (
          <div
            key={`moth-${i}`}
            style={{
              position: 'absolute',
              width: `${size}px`,
              height: `${size}px`,
              top: `${10 + Math.random() * 70}%`,
              left: `${Math.random() * 100}%`,
              animation: `moth-flutter ${20 + Math.random() * 25}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          >
            {/* Ala sinistra */}
            <div style={{
              position: 'absolute',
              width: '50%',
              height: '70%',
              left: '0',
              top: '15%',
              borderRadius: '80% 20% 60% 40%',
              background: 'radial-gradient(ellipse at 30% 30%, rgba(230, 220, 240, 0.4), rgba(180, 170, 200, 0.2))',
              transformOrigin: 'right center',
              animation: `wing-left ${0.4 + Math.random() * 0.3}s infinite ease-in-out`,
            }} />
            {/* Ala destra */}
            <div style={{
              position: 'absolute',
              width: '50%',
              height: '70%',
              right: '0',
              top: '15%',
              borderRadius: '20% 80% 40% 60%',
              background: 'radial-gradient(ellipse at 70% 30%, rgba(230, 220, 240, 0.4), rgba(180, 170, 200, 0.2))',
              transformOrigin: 'left center',
              animation: `wing-right ${0.4 + Math.random() * 0.3}s infinite ease-in-out`,
            }} />
            {/* Corpo */}
            <div style={{
              position: 'absolute',
              width: '20%',
              height: '80%',
              left: '40%',
              top: '10%',
              borderRadius: '50%',
              background: 'rgba(150, 140, 160, 0.5)',
            }} />
          </div>
        );
      })}

      {/* Erba alta ondeggiante */}
      {Array.from({ length: 80 }).map((_, i) => {
        const height = 40 + Math.random() * 80;
        const x = (i / 80) * 100;
        return (
          <div
            key={`grass-${i}`}
            style={{
              position: 'absolute',
              bottom: '0',
              left: `${x}%`,
              width: '3px',
              height: `${height}px`,
              background: `linear-gradient(to top,
                rgba(60, 80, 40, 0.8) 0%,
                rgba(70, 100, 50, 0.6) 50%,
                rgba(90, 120, 60, 0.3) 80%,
                transparent 100%
              )`,
              borderRadius: '50% 50% 0 0',
              transformOrigin: 'bottom center',
              animation: `grass-sway ${4 + Math.random() * 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              filter: 'blur(0.5px)',
            }}
          />
        );
      })}

      {/* Fiori selvaggi luminosi */}
      {Array.from({ length: 35 }).map((_, i) => {
        const hue = 280 + Math.random() * 60;
        const size = 8 + Math.random() * 15;
        return (
          <div
            key={`flower-${i}`}
            style={{
              position: 'absolute',
              bottom: `${Math.random() * 30}%`,
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            {/* Petali - 5 petali per fiore */}
            {[0, 72, 144, 216, 288].map((angle, j) => (
              <div
                key={`petal-${j}`}
                style={{
                  position: 'absolute',
                  width: '60%',
                  height: '60%',
                  top: '20%',
                  left: '20%',
                  borderRadius: '50% 50% 50% 0',
                  background: `radial-gradient(ellipse at 30% 30%,
                    hsla(${hue}, 70%, 80%, 0.7) 0%,
                    hsla(${hue}, 60%, 60%, 0.4) 70%,
                    transparent 100%
                  )`,
                  transform: `rotate(${angle}deg) translateY(-40%)`,
                  transformOrigin: 'center center',
                }}
              />
            ))}
            {/* Centro fiore */}
            <div style={{
              position: 'absolute',
              width: '30%',
              height: '30%',
              top: '35%',
              left: '35%',
              borderRadius: '50%',
              background: `radial-gradient(circle, hsla(${hue + 40}, 90%, 70%, 0.9), hsla(${hue + 60}, 80%, 60%, 0.5))`,
              boxShadow: `0 0 ${size / 2}px hsla(${hue}, 100%, 70%, 0.6)`,
              animation: `flower-pulse ${3 + Math.random() * 3}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 4}s`,
            }} />
          </div>
        );
      })}

      {/* Particelle di polline fluttuanti */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`pollen-${i}`}
          style={{
            position: 'absolute',
            width: `${1 + Math.random() * 3}px`,
            height: `${1 + Math.random() * 3}px`,
            borderRadius: '50%',
            background: 'rgba(255, 250, 220, 0.6)',
            top: `${30 + Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            boxShadow: '0 0 4px rgba(255, 250, 220, 0.8)',
            animation: `pollen-drift ${20 + Math.random() * 30}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 20}s`,
          }}
        />
      ))}

      {/* Nebbia magica al suolo */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`mist-${i}`}
          style={{
            position: 'absolute',
            bottom: '0',
            left: `${i * 25 - 10}%`,
            width: '60%',
            height: '25%',
            background: 'radial-gradient(ellipse at center, rgba(200, 190, 220, 0.15), transparent 70%)',
            filter: 'blur(30px)',
            animation: `mist-flow ${40 + i * 10}s infinite ease-in-out`,
            animationDelay: `${i * 5}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes firefly-dance {
          0% {
            transform: translate(0, 0);
          }
          15% {
            transform: translate(${-40 + Math.random() * 80}px, ${-50 - Math.random() * 40}px);
          }
          30% {
            transform: translate(${-60 + Math.random() * 120}px, ${-30 - Math.random() * 60}px);
          }
          45% {
            transform: translate(${-30 + Math.random() * 60}px, ${-70 - Math.random() * 50}px);
          }
          60% {
            transform: translate(${-80 + Math.random() * 160}px, ${-40 - Math.random() * 70}px);
          }
          75% {
            transform: translate(${-50 + Math.random() * 100}px, ${-60 - Math.random() * 50}px);
          }
          100% {
            transform: translate(0, 0);
          }
        }

        @keyframes firefly-glow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.8);
          }
          50% {
            opacity: 1;
            transform: scale(1.2);
          }
        }

        @keyframes moth-flutter {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(${-80 + Math.random() * 160}px, ${-50 - Math.random() * 50}px) rotate(${-15 + Math.random() * 30}deg);
          }
          50% {
            transform: translate(${-100 + Math.random() * 200}px, ${-80 - Math.random() * 60}px) rotate(${-20 + Math.random() * 40}deg);
          }
          75% {
            transform: translate(${-60 + Math.random() * 120}px, ${-40 - Math.random() * 70}px) rotate(${-10 + Math.random() * 20}deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @keyframes wing-left {
          0%, 100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(-45deg);
          }
        }

        @keyframes wing-right {
          0%, 100% {
            transform: rotateY(0deg);
          }
          50% {
            transform: rotateY(45deg);
          }
        }

        @keyframes grass-sway {
          0%, 100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        @keyframes flower-pulse {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.15);
          }
        }

        @keyframes pollen-drift {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translate(${-30 + Math.random() * 60}px, ${-80 - Math.random() * 60}px);
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(${-50 + Math.random() * 100}px, ${-120 - Math.random() * 80}px);
            opacity: 0;
          }
        }

        @keyframes mist-flow {
          0%, 100% {
            transform: translateX(0);
            opacity: 0.15;
          }
          50% {
            transform: translateX(30px);
            opacity: 0.25;
          }
        }

        @keyframes gentle-twinkle {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default FireflyMeadowAnimation;
