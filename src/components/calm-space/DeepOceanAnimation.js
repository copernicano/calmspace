/**
 * ═══════════════════════════════════════════════════════════════════
 * DEEP OCEAN - Profondità Oceanica Bioluminescente
 * ═══════════════════════════════════════════════════════════════════
 *
 * Estetica: Mistica, profonda, ipnotica
 * Ispirazione: Abissi marini, creature bioluminescenti, Subnautica
 */

import React from 'react';

const DeepOceanAnimation = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #001a33 0%, #003d5c 20%, #004d73 40%, #002b4d 70%, #001122 100%)',
      overflow: 'hidden',
    }}>
      {/* Raggi di luce dall'alto */}
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={`light-ray-${i}`}
          style={{
            position: 'absolute',
            top: '-10%',
            left: `${15 + i * 18}%`,
            width: '120px',
            height: '120%',
            background: `linear-gradient(to bottom,
              rgba(100, 200, 255, 0.15) 0%,
              rgba(100, 200, 255, 0.05) 40%,
              transparent 100%
            )`,
            transform: 'rotate(-5deg) skewY(-2deg)',
            filter: 'blur(20px)',
            animation: `sway-light ${20 + i * 5}s infinite ease-in-out`,
            animationDelay: `${i * 2}s`,
          }}
        />
      ))}

      {/* Meduse bioluminescenti */}
      {Array.from({ length: 8 }).map((_, i) => {
        const size = 40 + Math.random() * 80;
        const hue = 180 + Math.random() * 80;
        return (
          <div
            key={`jellyfish-${i}`}
            style={{
              position: 'absolute',
              top: `${-10 + Math.random() * 120}%`,
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              animation: `drift-jellyfish ${30 + Math.random() * 20}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 15}s`,
            }}
          >
            {/* Corpo medusa */}
            <div style={{
              position: 'absolute',
              width: '100%',
              height: '60%',
              borderRadius: '50% 50% 45% 45%',
              background: `radial-gradient(ellipse at top,
                hsla(${hue}, 80%, 70%, 0.6) 0%,
                hsla(${hue}, 70%, 60%, 0.4) 50%,
                hsla(${hue}, 60%, 50%, 0.2) 100%
              )`,
              boxShadow: `0 0 ${size / 2}px hsla(${hue}, 90%, 60%, 0.6),
                          inset 0 0 ${size / 4}px hsla(${hue}, 100%, 80%, 0.4)`,
              animation: `pulse-glow ${3 + Math.random() * 2}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 3}s`,
            }} />
            {/* Tentacoli */}
            {Array.from({ length: 6 }).map((_, j) => (
              <div
                key={`tentacle-${j}`}
                style={{
                  position: 'absolute',
                  top: '55%',
                  left: `${20 + j * 10}%`,
                  width: '2px',
                  height: `${size * 1.2}px`,
                  background: `linear-gradient(to bottom,
                    hsla(${hue}, 70%, 60%, 0.5) 0%,
                    hsla(${hue}, 60%, 50%, 0.3) 50%,
                    transparent 100%
                  )`,
                  transformOrigin: 'top center',
                  animation: `wave-tentacle ${2 + Math.random()}s infinite ease-in-out`,
                  animationDelay: `${j * 0.2}s`,
                  filter: 'blur(1px)',
                }}
              />
            ))}
          </div>
        );
      })}

      {/* Particelle plancton luminoso */}
      {Array.from({ length: 60 }).map((_, i) => {
        const hue = 170 + Math.random() * 70;
        return (
          <div
            key={`plankton-${i}`}
            style={{
              position: 'absolute',
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              borderRadius: '50%',
              background: `hsla(${hue}, 100%, 70%, 0.8)`,
              boxShadow: `0 0 ${8 + Math.random() * 12}px hsla(${hue}, 100%, 60%, 0.6)`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float-plankton ${20 + Math.random() * 30}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 20}s`,
            }}
          />
        );
      })}

      {/* Bolle che salgono */}
      {Array.from({ length: 25 }).map((_, i) => {
        const size = 3 + Math.random() * 12;
        return (
          <div
            key={`bubble-${i}`}
            style={{
              position: 'absolute',
              bottom: '-5%',
              left: `${Math.random() * 100}%`,
              width: `${size}px`,
              height: `${size}px`,
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.4), rgba(200, 230, 255, 0.1))',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              animation: `rise-bubble ${15 + Math.random() * 15}s infinite linear`,
              animationDelay: `${Math.random() * 15}s`,
            }}
          />
        );
      })}

      {/* Coralli luminosi sul fondo */}
      {Array.from({ length: 15 }).map((_, i) => {
        const hue = 280 + Math.random() * 80;
        const height = 60 + Math.random() * 120;
        return (
          <div
            key={`coral-${i}`}
            style={{
              position: 'absolute',
              bottom: '0',
              left: `${i * 6.5}%`,
              width: '20px',
              height: `${height}px`,
              background: `linear-gradient(to top,
                hsla(${hue}, 70%, 40%, 0.4) 0%,
                hsla(${hue}, 80%, 50%, 0.2) 60%,
                transparent 100%
              )`,
              borderRadius: '50% 50% 0 0',
              filter: 'blur(2px)',
              boxShadow: `0 0 15px hsla(${hue}, 90%, 60%, 0.3)`,
              animation: `sway-coral ${5 + Math.random() * 5}s infinite ease-in-out`,
              animationDelay: `${Math.random() * 5}s`,
              transformOrigin: 'bottom center',
            }}
          />
        );
      })}

      <style>{`
        @keyframes drift-jellyfish {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          25% {
            transform: translate(30px, -50px) rotate(5deg);
          }
          50% {
            transform: translate(-20px, -30px) rotate(-3deg);
          }
          75% {
            transform: translate(40px, -70px) rotate(7deg);
          }
          100% {
            transform: translate(0, 0) rotate(0deg);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
        }

        @keyframes wave-tentacle {
          0%, 100% {
            transform: rotate(-5deg);
          }
          50% {
            transform: rotate(5deg);
          }
        }

        @keyframes float-plankton {
          0% {
            transform: translate(0, 0);
            opacity: 0.4;
          }
          25% {
            transform: translate(15px, -30px);
            opacity: 0.8;
          }
          50% {
            transform: translate(-10px, -15px);
            opacity: 1;
          }
          75% {
            transform: translate(20px, -40px);
            opacity: 0.6;
          }
          100% {
            transform: translate(0, 0);
            opacity: 0.4;
          }
        }

        @keyframes rise-bubble {
          0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-110vh) translateX(${-30 + Math.random() * 60}px);
            opacity: 0;
          }
        }

        @keyframes sway-light {
          0%, 100% {
            transform: rotate(-5deg) skewY(-2deg) translateX(0);
            opacity: 0.15;
          }
          50% {
            transform: rotate(-3deg) skewY(-1deg) translateX(20px);
            opacity: 0.25;
          }
        }

        @keyframes sway-coral {
          0%, 100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }
      `}</style>
    </div>
  );
};

export default DeepOceanAnimation;
