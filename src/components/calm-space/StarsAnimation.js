/**
 * ✨ Stars Animation - Notte Stellata Magica
 * Cielo notturno sereno con stelle scintillanti e meteore
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const StarsAnimation = () => {
  const containerRef = useRef(null);
  const animationsRef = useRef([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = '';
    animationsRef.current = [];

    // Colori stelle realistici (temperatura stellare)
    const starColors = [
      '#ffffff', // Bianco
      '#fff8f0', // Bianco caldo
      '#ffeedd', // Giallo pallido
      '#aaccff', // Blu pallido
      '#ffddcc', // Arancione pallido
    ];

    // === STELLE FISSE - Sfondo ===
    for (let i = 0; i < 150; i++) {
      const star = document.createElement('div');
      const size = 1 + Math.random() * 2;
      const color = starColors[Math.floor(Math.random() * starColors.length)];
      const brightness = 0.3 + Math.random() * 0.7;

      Object.assign(star.style, {
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        opacity: brightness,
        pointerEvents: 'none',
      });

      container.appendChild(star);

      // Scintillio delicato
      const twinkleAnim = gsap.to(star, {
        opacity: brightness * 0.4,
        duration: 2 + Math.random() * 3,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 5,
      });
      animationsRef.current.push(twinkleAnim);
    }

    // === STELLE BRILLANTI - Con glow ===
    for (let i = 0; i < 25; i++) {
      const star = document.createElement('div');
      const size = 2 + Math.random() * 3;
      const color = starColors[Math.floor(Math.random() * 3)];

      Object.assign(star.style, {
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: color,
        borderRadius: '50%',
        boxShadow: `0 0 ${size * 2}px ${color}, 0 0 ${size * 4}px ${color}80`,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      });

      container.appendChild(star);

      // Pulsazione più evidente
      const pulseAnim = gsap.to(star, {
        scale: 1.5,
        opacity: 0.5,
        duration: 1.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
      animationsRef.current.push(pulseAnim);
    }

    // === NEBULOSE - Senza filter blur (usa gradient morbido) ===
    const nebulaColors = [
      { h: 260, s: 60, l: 50 }, // Viola
      { h: 220, s: 70, l: 45 }, // Blu
      { h: 280, s: 50, l: 40 }, // Magenta scuro
    ];

    for (let i = 0; i < 3; i++) {
      const nebula = document.createElement('div');
      const size = 300 + Math.random() * 200;
      const c = nebulaColors[i];
      const top = 20 + Math.random() * 40;
      const left = 10 + i * 30 + Math.random() * 20;

      Object.assign(nebula.style, {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(ellipse at center,
          hsla(${c.h}, ${c.s}%, ${c.l}%, 0.15) 0%,
          hsla(${c.h}, ${c.s - 10}%, ${c.l - 10}%, 0.08) 40%,
          transparent 70%
        )`,
        borderRadius: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      });

      container.appendChild(nebula);

      // Respirazione lenta della nebulosa
      const nebulaAnim = gsap.to(nebula, {
        scale: 1.15,
        opacity: 0.7,
        duration: 20 + i * 5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
      animationsRef.current.push(nebulaAnim);
    }

    // === METEORE - Movimento fluido ===
    const createMeteor = (index) => {
      const meteor = document.createElement('div');
      const length = 60 + Math.random() * 80;
      const thickness = 1.5 + Math.random();
      const startX = 20 + Math.random() * 50;
      const startY = 5 + Math.random() * 25;
      const angle = 35 + Math.random() * 25;

      Object.assign(meteor.style, {
        position: 'absolute',
        left: `${startX}%`,
        top: `${startY}%`,
        width: `${length}px`,
        height: `${thickness}px`,
        background: `linear-gradient(90deg,
          transparent 0%,
          rgba(255,255,255,0.1) 10%,
          rgba(255,255,255,0.6) 60%,
          rgba(255,255,255,1) 100%
        )`,
        borderRadius: `${thickness}px`,
        transform: `rotate(${angle}deg)`,
        transformOrigin: 'right center',
        opacity: 0,
        pointerEvents: 'none',
        willChange: 'transform, opacity',
      });

      container.appendChild(meteor);

      // Calcola traiettoria
      const rad = angle * Math.PI / 180;
      const distance = 800 + Math.random() * 400;

      // Timeline per controllo preciso
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: 8 + Math.random() * 15,
        delay: index * 3 + Math.random() * 5,
      });

      tl.set(meteor, { x: 0, y: 0, opacity: 0 })
        .to(meteor, {
          opacity: 1,
          duration: 0.1,
        })
        .to(meteor, {
          x: Math.cos(rad) * distance,
          y: Math.sin(rad) * distance,
          duration: 0.8 + Math.random() * 0.4,
          ease: 'power1.in',
        }, '<')
        .to(meteor, {
          opacity: 0,
          duration: 0.2,
        }, '-=0.2');

      animationsRef.current.push(tl);
    };

    // Crea 5 meteore
    for (let i = 0; i < 5; i++) {
      createMeteor(i);
    }

    // === POLVERE STELLARE - Particelle statiche con lieve movimento ===
    for (let i = 0; i < 40; i++) {
      const dust = document.createElement('div');
      const size = 1 + Math.random();

      Object.assign(dust.style, {
        position: 'absolute',
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: 'rgba(255, 255, 255, 0.6)',
        borderRadius: '50%',
        pointerEvents: 'none',
      });

      container.appendChild(dust);

      const dustAnim = gsap.to(dust, {
        opacity: 0.2,
        duration: 4 + Math.random() * 4,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 8,
      });
      animationsRef.current.push(dustAnim);
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
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      background: `linear-gradient(180deg,
        #0a0612 0%,
        #110a1f 15%,
        #1a0f2e 30%,
        #15082a 50%,
        #0d0518 70%,
        #08020f 85%,
        #020105 100%
      )`,
      overflow: 'hidden',
    }}>
      {/* Bagliore cosmico ambientale - senza filter blur */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '15%',
        width: '50%',
        height: '40%',
        background: 'radial-gradient(ellipse at center, rgba(100, 60, 180, 0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute',
        top: '40%',
        right: '10%',
        width: '40%',
        height: '35%',
        background: 'radial-gradient(ellipse at center, rgba(60, 80, 160, 0.06) 0%, transparent 55%)',
        pointerEvents: 'none',
      }} />

      {/* Container stelle */}
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
