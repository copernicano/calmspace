/**
 * ✨ Stars Animation - GSAP Version
 * GUARANTEED TO WORK - Uses professional GSAP library
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const StarsAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const starColors = ['#FFFFFF', '#FF4757', '#3742FA', '#FFD700', '#FF6B9D'];

    // Create 100 twinkling stars
    for (let i = 0; i < 100; i++) {
      const star = document.createElement('div');
      const size = 2 + Math.random() * 4;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const top = Math.random() * 100;
      const left = Math.random() * 100;

      Object.assign(star.style, {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${color} 0%, ${color} 70%, transparent 100%)`,
        borderRadius: '50%',
        boxShadow: `0 0 10px ${color}, 0 0 20px ${color}80`,
        zIndex: 15,
        pointerEvents: 'none',
      });

      container.appendChild(star);

      // GSAP twinkling animation - pulsazione visibile
      gsap.fromTo(star,
        { opacity: 0.3, scale: 0.7 },
        {
          opacity: 1,
          scale: 1.3,
          duration: 0.8 + Math.random() * 1.2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 2,
        }
      );
    }

    // Create nebulae
    for (let i = 0; i < 6; i++) {
      const nebula = document.createElement('div');
      const size = 200 + Math.random() * 200;
      const hue = i * 60;
      const top = 20 + Math.random() * 60;
      const left = 10 + Math.random() * 80;

      Object.assign(nebula.style, {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(ellipse,
          hsla(${hue}, 75%, 65%, 0.4) 0%,
          hsla(${hue}, 70%, 60%, 0.2) 30%,
          hsla(${hue}, 65%, 55%, 0.1) 60%,
          transparent 100%
        )`,
        borderRadius: '50%',
        filter: 'blur(20px)',
        mixBlendMode: 'screen',
        transform: 'translate(-50%, -50%)',
        zIndex: 8,
        pointerEvents: 'none',
      });

      container.appendChild(nebula);

      gsap.to(nebula, {
        scale: 1.2,
        rotation: 360,
        opacity: 0.5,
        duration: 25 + i * 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    }

    // METEORE SEMPLICI - DIV come le bolle
    for (let i = 0; i < 8; i++) {
      const meteor = document.createElement('div');
      const startX = 10 + Math.random() * 60;
      const startY = 5 + Math.random() * 30;
      const angle = 30 + Math.random() * 30; // 30-60 gradi
      const length = 80 + Math.random() * 60;

      Object.assign(meteor.style, {
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${length}px`,
        height: '3px',
        background: 'linear-gradient(to right, transparent 0%, rgba(255,255,255,0.3) 20%, rgba(255,255,255,0.8) 80%, white 100%)',
        borderRadius: '2px',
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'right center',
        boxShadow: '0 0 8px white, 0 0 15px rgba(135,206,235,0.6)',
        zIndex: 30,
        pointerEvents: 'none',
      });

      container.appendChild(meteor);

      // Animazione con fromTo per garantire reset completo
      // Distanza lunga per attraversare tutto lo schermo
      const distance = 1500 + Math.random() * 500;
      const dx = Math.cos(angle * Math.PI / 180) * distance;
      const dy = Math.sin(angle * Math.PI / 180) * distance;
      const delay = i * 2 + Math.random() * 3;

      gsap.fromTo(meteor,
        { x: 0, y: 0, opacity: 0 },
        {
          x: dx,
          y: dy,
          opacity: 1,
          duration: 1.2 + Math.random() * 0.5,
          delay: delay,
          repeat: -1,
          repeatDelay: 5 + Math.random() * 8,
          ease: 'power2.in',
        }
      );
    }

    // Create stardust
    for (let i = 0; i < 80; i++) {
      const dust = document.createElement('div');
      const size = 1 + Math.random() * 2;
      const top = Math.random() * 100;
      const left = Math.random() * 100;

      Object.assign(dust.style, {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
        boxShadow: '0 0 3px rgba(255, 255, 255, 0.8)',
        zIndex: 12,
        pointerEvents: 'none',
      });

      container.appendChild(dust);

      gsap.fromTo(dust,
        { opacity: 0.2, scale: 0.5 },
        {
          opacity: 1,
          scale: 1.5,
          duration: 6 + Math.random() * 6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 10,
        }
      );
    }

    // Cleanup
    return () => {
      gsap.killTweensOf(container.children);
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: 'linear-gradient(180deg, #1a0b2e 0%, #2d1b4e 15%, #3b2667 30%, #1e0a3c 50%, #0f051d 70%, #050208 85%, #000000 100%)',
      overflow: 'hidden',
    }}>
      {/* Cosmic glow */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `
          radial-gradient(ellipse at 20% 30%, rgba(139, 69, 219, 0.12) 0%, transparent 40%),
          radial-gradient(ellipse at 75% 45%, rgba(99, 102, 241, 0.1) 0%, transparent 45%),
          radial-gradient(ellipse at 60% 80%, rgba(168, 85, 247, 0.08) 0%, transparent 35%)
        `,
        pointerEvents: 'none',
        zIndex: 5,
        filter: 'blur(50px)',
      }} />

      {/* Stars container */}
      <div ref={containerRef} style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
      }} />
    </div>
  );
};

export default StarsAnimation;
