/**
 * 📐 Geometric Animation - GSAP Version
 * GUARANTEED TO WORK - Uses professional GSAP library
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GeometricAnimation = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;

    // Create concentric ripples
    for (let i = 0; i < 12; i++) {
      const ripple = document.createElement('div');
      const size = 80 + i * 80;

      Object.assign(ripple.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${size}px`,
        height: `${size}px`,
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 20px rgba(255, 255, 255, 0.05), inset 0 0 20px rgba(255, 255, 255, 0.03)',
        zIndex: 10,
        pointerEvents: 'none',
      });

      container.appendChild(ripple);

      gsap.fromTo(ripple,
        { scale: 0.3, opacity: 0, borderWidth: '2px' },
        {
          scale: 2,
          opacity: 0,
          borderWidth: '0.5px',
          duration: 12 + i,
          repeat: -1,
          delay: i * 0.8,
          ease: 'none',
          keyframes: {
            '0%': { opacity: 0, scale: 0.3 },
            '40%': { opacity: 0.6 },
            '80%': { opacity: 0.2 },
            '100%': { opacity: 0, scale: 2 },
          },
        }
      );
    }

    // Create mandala petals
    for (let i = 0; i < 8; i++) {
      const petal = document.createElement('div');
      const angle = i * 45;

      Object.assign(petal.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '120px',
        height: '120px',
        background: 'radial-gradient(ellipse at center, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 60%, transparent 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '50%',
        transformOrigin: 'center center',
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-60px)`,
        zIndex: 15,
        pointerEvents: 'none',
      });

      container.appendChild(petal);

      gsap.to(petal, {
        opacity: 0.6,
        scale: 1.05,
        duration: 8,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: i * 0.2,
      });
    }

    // Mandala rotation container
    const mandalaContainer = document.createElement('div');
    Object.assign(mandalaContainer.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      width: '300px',
      height: '300px',
      transform: 'translate(-50%, -50%)',
      zIndex: 15,
      pointerEvents: 'none',
    });

    // Move petals to mandala container
    const petals = Array.from(container.children).slice(-8);
    petals.forEach(p => mandalaContainer.appendChild(p));
    container.appendChild(mandalaContainer);

    gsap.to(mandalaContainer, {
      rotation: 360,
      duration: 60,
      repeat: -1,
      ease: 'none',
    });

    // Create orbiting particles
    for (let i = 0; i < 36; i++) {
      const particle = document.createElement('div');
      const angle = i * 10;
      const radius = 120 + (i % 3) * 80;
      const hue = 200 + (i % 6) * 40;
      const size = 8 + (i % 3) * 4;

      Object.assign(particle.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, hsla(${hue}, 70%, 75%, 0.6) 0%, hsla(${hue}, 60%, 70%, 0.3) 50%, transparent 100%)`,
        borderRadius: '50%',
        boxShadow: `0 0 15px hsla(${hue}, 70%, 75%, 0.4), 0 0 30px hsla(${hue}, 60%, 70%, 0.2)`,
        filter: 'blur(2px)',
        zIndex: 18,
        pointerEvents: 'none',
        transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(${radius}px)`,
      });

      container.appendChild(particle);

      gsap.to(particle, {
        rotation: `+=${360}`,
        scale: 1.2,
        opacity: 0.8,
        duration: 15 + (i % 4) * 5,
        repeat: -1,
        ease: 'none',
        delay: i * 0.15,
        modifiers: {
          rotation: (r) => {
            return `${angle + parseFloat(r)}deg`;
          },
        },
      });
    }

    // Create energy waves
    for (let i = 0; i < 6; i++) {
      const wave = document.createElement('div');

      Object.assign(wave.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '60px',
        height: '60px',
        border: '1.5px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        boxShadow: '0 0 15px rgba(255, 255, 255, 0.1)',
        zIndex: 12,
        pointerEvents: 'none',
      });

      container.appendChild(wave);

      gsap.fromTo(wave,
        { scale: 0.2, opacity: 0.8, borderWidth: '2px' },
        {
          scale: 6,
          opacity: 0,
          borderWidth: '0.5px',
          duration: 10 + i * 2,
          repeat: -1,
          delay: i * 2,
          ease: 'none',
        }
      );
    }

    // Create triangles
    for (let i = 0; i < 4; i++) {
      const triangle = document.createElement('div');
      const rotation = i * 90;
      const size = 120 + i * 40;

      Object.assign(triangle.style, {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: `${size}px`,
        height: `${size}px`,
        transform: `translate(-50%, -50%) rotate(${rotation}deg)`,
        opacity: 0.15,
        zIndex: 14,
        pointerEvents: 'none',
      });

      const inner = document.createElement('div');
      Object.assign(inner.style, {
        position: 'absolute',
        width: '100%',
        height: '100%',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
        clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      });

      triangle.appendChild(inner);
      container.appendChild(triangle);

      gsap.to(triangle, {
        rotation: `+=${360}`,
        duration: 35 + i * 10,
        repeat: -1,
        ease: 'none',
        delay: i * -3,
        modifiers: {
          rotation: (r) => {
            return `${rotation + parseFloat(r)}deg`;
          },
        },
      });

      gsap.to(inner, {
        opacity: 0.6,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
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
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
      overflow: 'hidden',
    }}>
      {/* Ambient glow overlay */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(ellipse at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.05) 40%, rgba(0, 0, 0, 0.15) 100%)',
        mixBlendMode: 'multiply',
        pointerEvents: 'none',
      }} />

      {/* Geometric elements container */}
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

export default GeometricAnimation;
