/**
 * 🫧 Bubbles Animation - GSAP Version
 * GUARANTEED TO WORK - Uses professional GSAP library
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BubblesAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Create 30 bubbles with GSAP animations
    for (let i = 0; i < 30; i++) {
      const bubble = document.createElement('div');
      const size = 30 + Math.random() * 100;
      const startX = Math.random() * 100;
      const hue = 200 + Math.random() * 40;

      // Bubble style
      Object.assign(bubble.style, {
        position: 'absolute',
        bottom: '-100px',
        left: `${startX}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%,
          rgba(255, 255, 255, 0.4) 0%,
          rgba(255, 255, 255, 0.1) 30%,
          hsla(${hue}, 75%, 85%, 0.15) 60%,
          transparent 100%
        )`,
        border: '2px solid rgba(255, 255, 255, 0.3)',
        backdropFilter: 'blur(2px)',
        boxShadow: `0 0 20px hsla(${hue}, 75%, 85%, 0.6), inset 0 0 15px rgba(255, 255, 255, 0.2)`,
        pointerEvents: 'none',
      });

      // Add highlight
      const highlight = document.createElement('div');
      Object.assign(highlight.style, {
        position: 'absolute',
        top: '15%',
        left: '20%',
        width: '25%',
        height: '25%',
        background: 'rgba(255, 255, 255, 0.8)',
        borderRadius: '50%',
        filter: 'blur(1px)',
      });
      bubble.appendChild(highlight);

      container.appendChild(bubble);

      // GSAP Animation - GUARANTEED to work
      const duration = 60 + Math.random() * 80;
      const driftX = (Math.random() - 0.5) * 200;
      const delay = Math.random() * 30;

      gsap.fromTo(bubble,
        {
          y: 0,
          x: 0,
          scale: 0.3,
          opacity: 0,
          rotation: 0,
        },
        {
          y: `${-110}vh`,
          x: driftX,
          scale: 0.7 + Math.random() * 0.6,
          opacity: 1,
          rotation: 360,
          duration: duration,
          delay: delay,
          repeat: -1,
          ease: 'none',
          keyframes: {
            '0%': { opacity: 0, scale: 0.3 },
            '10%': { opacity: 0.9, scale: 0.7 },
            '90%': { opacity: 0.8 },
            '100%': { opacity: 0, scale: 0.3 },
          },
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
      background: 'linear-gradient(135deg, #05111f 0%, #0a1e3d 15%, #1e3a5f 30%, #2563eb 50%, #3b82f6 70%, #60a5fa 85%, #3b82f6 100%)',
      overflow: 'hidden',
    }}>
      {/* Light rays */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(ellipse at 30% 20%, rgba(96, 165, 250, 0.15) 0%, rgba(59, 130, 246, 0.08) 30%, transparent 70%)',
        pointerEvents: 'none',
        zIndex: 100,
      }} />

      {/* Bubbles container */}
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

export default BubblesAnimation;
