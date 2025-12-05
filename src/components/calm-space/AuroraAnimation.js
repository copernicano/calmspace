/**
 * ═══════════════════════════════════════════════════════════════════
 * AURORA BOREALIS - Luci Nordiche Danzanti
 * ═══════════════════════════════════════════════════════════════════
 *
 * Estetica: Poetica, mistica, fluida
 * Ispirazione: Notti artiche, Studio Ghibli, fenomeni naturali
 */

import React from 'react';

const AuroraAnimation = () => {
  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #0a0e27 0%, #1a1f3a 30%, #2d1f3d 70%, #1a0f2e 100%)',
      overflow: 'hidden',
    }}>
      {/* Stelle di sfondo */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={`star-${i}`}
          style={{
            position: 'absolute',
            width: `${1 + Math.random() * 2}px`,
            height: `${1 + Math.random() * 2}px`,
            background: 'white',
            borderRadius: '50%',
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animation: `twinkle ${2 + Math.random() * 3}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}

      {/* Onde Aurora - Layer multipli */}
      {[
        { color: 'rgba(0, 255, 150, 0.15)', delay: '0s', duration: '25s', blur: '60px' },
        { color: 'rgba(100, 200, 255, 0.12)', delay: '3s', duration: '30s', blur: '80px' },
        { color: 'rgba(150, 100, 255, 0.1)', delay: '6s', duration: '35s', blur: '100px' },
        { color: 'rgba(255, 150, 200, 0.08)', delay: '9s', duration: '40s', blur: '120px' },
        { color: 'rgba(0, 255, 200, 0.18)', delay: '12s', duration: '28s', blur: '70px' },
        { color: 'rgba(100, 255, 150, 0.14)', delay: '15s', duration: '33s', blur: '90px' },
      ].map((wave, i) => (
        <div
          key={`aurora-${i}`}
          style={{
            position: 'absolute',
            top: '10%',
            left: '-20%',
            width: '140%',
            height: '60%',
            background: `radial-gradient(ellipse at center, ${wave.color} 0%, transparent 70%)`,
            filter: `blur(${wave.blur})`,
            animation: `aurora-flow ${wave.duration} infinite ease-in-out`,
            animationDelay: wave.delay,
            transformOrigin: 'center center',
            mixBlendMode: 'screen',
          }}
        />
      ))}

      {/* Raggi verticali aurora */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={`ray-${i}`}
          style={{
            position: 'absolute',
            bottom: '0',
            left: `${5 + i * 8}%`,
            width: '2px',
            height: `${40 + Math.random() * 30}%`,
            background: `linear-gradient(to top,
              rgba(${100 + Math.random() * 155}, ${200 + Math.random() * 55}, ${150 + Math.random() * 105}, 0.4) 0%,
              transparent 100%
            )`,
            filter: 'blur(3px)',
            animation: `ray-shimmer ${8 + Math.random() * 6}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 8}s`,
            transformOrigin: 'bottom center',
          }}
        />
      ))}

      {/* Particelle luminose fluttuanti */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          style={{
            position: 'absolute',
            width: `${3 + Math.random() * 8}px`,
            height: `${3 + Math.random() * 8}px`,
            borderRadius: '50%',
            background: `radial-gradient(circle,
              rgba(${150 + Math.random() * 105}, ${200 + Math.random() * 55}, 255, 0.8) 0%,
              rgba(${100 + Math.random() * 155}, ${150 + Math.random() * 105}, 255, 0.3) 50%,
              transparent 100%
            )`,
            top: `${20 + Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            filter: 'blur(2px)',
            animation: `float-particle ${15 + Math.random() * 20}s infinite ease-in-out`,
            animationDelay: `${Math.random() * 10}s`,
          }}
        />
      ))}

      <style>{`
        @keyframes aurora-flow {
          0% {
            transform: translateY(0) translateX(0) scaleX(1) skewY(0deg);
            opacity: 1;
          }
          25% {
            transform: translateY(-8%) translateX(3%) scaleX(1.1) skewY(2deg);
            opacity: 0.9;
          }
          50% {
            transform: translateY(-5%) translateX(-2%) scaleX(1.05) skewY(-1deg);
            opacity: 1;
          }
          75% {
            transform: translateY(-10%) translateX(5%) scaleX(1.15) skewY(3deg);
            opacity: 0.85;
          }
          100% {
            transform: translateY(0) translateX(0) scaleX(1) skewY(0deg);
            opacity: 1;
          }
        }

        @keyframes ray-shimmer {
          0%, 100% {
            opacity: 0.3;
            transform: scaleY(1) scaleX(1);
          }
          50% {
            opacity: 0.8;
            transform: scaleY(1.2) scaleX(1.5);
          }
        }

        @keyframes float-particle {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          50% {
            transform: translate(${-50 + Math.random() * 100}px, ${-30 - Math.random() * 40}px) scale(1.2);
            opacity: 1;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translate(${-30 + Math.random() * 60}px, ${-60 - Math.random() * 60}px) scale(0.8);
            opacity: 0;
          }
        }

        @keyframes twinkle {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.4);
          }
        }
      `}</style>
    </div>
  );
};

export default AuroraAnimation;
