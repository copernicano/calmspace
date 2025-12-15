/**
 * 🫧 Bubbles Animation - GSAP Version
 * Immersive underwater experience with smooth fluid bubbles
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const BubblesAnimation = () => {
  const containerRef = useRef(null);
  const animationsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const parent = container.parentElement;

    // Clear any existing content
    container.innerHTML = '';
    animationsRef.current = [];

    // Get container dimensions for responsive sizing
    const getContainerHeight = () => parent?.clientHeight || window.innerHeight;

    // Create bubbles - varied sizes for depth effect
    const bubbleCount = 35;

    for (let i = 0; i < bubbleCount; i++) {
      const bubble = document.createElement('div');
      // Size varies from small (20px) to large (120px)
      const size = 20 + Math.random() * 100;
      const startX = Math.random() * 100;
      const hue = 195 + Math.random() * 35; // Blue-cyan range

      // Bubble with beautiful glass effect
      Object.assign(bubble.style, {
        position: 'absolute',
        bottom: '-150px',
        left: `${startX}%`,
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: `radial-gradient(circle at 30% 30%,
          rgba(255, 255, 255, 0.5) 0%,
          rgba(255, 255, 255, 0.2) 25%,
          hsla(${hue}, 80%, 80%, 0.2) 50%,
          hsla(${hue}, 70%, 60%, 0.1) 75%,
          transparent 100%
        )`,
        border: '1.5px solid rgba(255, 255, 255, 0.4)',
        boxShadow: `
          0 0 ${size * 0.3}px hsla(${hue}, 80%, 70%, 0.5),
          inset 0 0 ${size * 0.2}px rgba(255, 255, 255, 0.3),
          inset -${size * 0.1}px ${size * 0.1}px ${size * 0.15}px rgba(255, 255, 255, 0.1)
        `,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      });

      // Glossy highlight
      const highlight = document.createElement('div');
      Object.assign(highlight.style, {
        position: 'absolute',
        top: '12%',
        left: '18%',
        width: '30%',
        height: '25%',
        background: 'rgba(255, 255, 255, 0.9)',
        borderRadius: '50%',
        filter: 'blur(2px)',
        transform: 'rotate(-20deg)',
      });
      bubble.appendChild(highlight);

      // Secondary highlight for realism
      const highlight2 = document.createElement('div');
      Object.assign(highlight2.style, {
        position: 'absolute',
        top: '25%',
        left: '55%',
        width: '12%',
        height: '10%',
        background: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        filter: 'blur(1px)',
      });
      bubble.appendChild(highlight2);

      container.appendChild(bubble);

      // Animation parameters - slower and more organic
      const containerHeight = getContainerHeight();
      const duration = 25 + Math.random() * 45; // 25-70 seconds
      const driftX = (Math.random() - 0.5) * 180;
      const delay = Math.random() * 20;
      const wobbleAmount = 10 + Math.random() * 20;

      // Main rise animation
      const riseAnim = gsap.fromTo(bubble,
        {
          y: 0,
          x: 0,
          scale: 0.2,
          opacity: 0,
        },
        {
          y: -(containerHeight + 200),
          x: driftX,
          scale: 0.6 + Math.random() * 0.5,
          duration: duration,
          delay: delay,
          repeat: -1,
          ease: 'none',
          onUpdate: function() {
            // Fade in/out based on progress
            const progress = this.progress();
            if (progress < 0.1) {
              bubble.style.opacity = progress * 10;
            } else if (progress > 0.9) {
              bubble.style.opacity = (1 - progress) * 10;
            } else {
              bubble.style.opacity = '0.85';
            }
          }
        }
      );

      // Gentle wobble animation
      const wobbleAnim = gsap.to(bubble, {
        x: `+=${wobbleAmount}`,
        duration: 2 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random(),
      });

      animationsRef.current.push(riseAnim, wobbleAnim);
    }

    // Cleanup
    return () => {
      animationsRef.current.forEach(anim => anim.kill());
      animationsRef.current = [];
    };
  }, []);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(180deg,
        #020a18 0%,
        #051428 10%,
        #0a2040 25%,
        #0f3060 40%,
        #1e4a80 55%,
        #2d6aa0 70%,
        #3d8ac0 85%,
        #4da0d8 100%
      )`,
      overflow: 'hidden',
    }}>
      {/* Underwater light rays */}
      <div style={{
        position: 'absolute',
        top: '-20%',
        left: '10%',
        width: '80%',
        height: '80%',
        background: `radial-gradient(ellipse 80% 50% at 50% 0%,
          rgba(120, 200, 255, 0.15) 0%,
          rgba(80, 160, 220, 0.08) 40%,
          transparent 70%
        )`,
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Additional light beam effects */}
      <div style={{
        position: 'absolute',
        top: '0',
        left: '20%',
        width: '15%',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(180, 220, 255, 0.08) 0%, transparent 60%)',
        transform: 'skewX(-15deg)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />
      <div style={{
        position: 'absolute',
        top: '0',
        right: '25%',
        width: '10%',
        height: '100%',
        background: 'linear-gradient(180deg, rgba(180, 220, 255, 0.06) 0%, transparent 50%)',
        transform: 'skewX(10deg)',
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Bubbles container */}
      <div ref={containerRef} style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 2,
      }} />

      {/* Subtle depth overlay at bottom */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '30%',
        background: 'linear-gradient(180deg, transparent 0%, rgba(5, 20, 40, 0.5) 100%)',
        pointerEvents: 'none',
        zIndex: 3,
      }} />
    </div>
  );
};

export default BubblesAnimation;
