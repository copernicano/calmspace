/**
 * WavesAnimation - GSAP only (no CSS animations)
 * Pattern copiato da BubblesAnimation che funziona
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WavesAnimation = ({ intensity = 1 }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    container.innerHTML = '';

    const W = window.innerWidth;

    // === STARS ===
    for (let i = 0; i < 50; i++) {
      const star = document.createElement('div');
      const size = 1 + Math.random() * 2;
      Object.assign(star.style, {
        position: 'absolute',
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#fff',
        left: `${Math.random() * 100}%`,
        top: `${5 + Math.random() * 25}%`,
        opacity: '0.5',
      });
      container.appendChild(star);

      gsap.to(star, {
        opacity: 0.15,
        duration: 1.5 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      });
    }

    // === MOON ===
    const moon = document.createElement('div');
    Object.assign(moon.style, {
      position: 'absolute',
      top: '8%',
      right: '12%',
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #fffef5 0%, #f0e5c8 60%, #ddd0a0 100%)',
      boxShadow: '0 0 25px 8px rgba(255, 250, 200, 0.3)',
    });
    container.appendChild(moon);

    // === WAVE LAYERS - GSAP ONLY ===
    const waveConfigs = [
      { bottom: '0%', height: '35%', color1: '#5a9ab8', color2: '#3a7090', speed: 18, yOffset: 8 },
      { bottom: '8%', height: '32%', color1: '#4a88a8', color2: '#2a5a7e', speed: 22, yOffset: 10 },
      { bottom: '16%', height: '30%', color1: '#3a7090', color2: '#1e4a6e', speed: 28, yOffset: 12 },
      { bottom: '24%', height: '28%', color1: '#2a5a7e', color2: '#1a3a5c', speed: 35, yOffset: 8 },
      { bottom: '32%', height: '25%', color1: '#1e4a6e', color2: '#152535', speed: 45, yOffset: 6 },
    ];

    waveConfigs.forEach((cfg, idx) => {
      // Creo un contenitore per l'onda
      const waveContainer = document.createElement('div');
      Object.assign(waveContainer.style, {
        position: 'absolute',
        bottom: cfg.bottom,
        left: '0',
        width: '200%',
        height: cfg.height,
        overflow: 'visible',
        zIndex: 10 - idx,
      });

      // Creo l'SVG dell'onda (forma statica)
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('viewBox', '0 0 2400 120');
      svg.setAttribute('preserveAspectRatio', 'none');
      svg.style.width = '100%';
      svg.style.height = '100%';
      svg.style.overflow = 'visible';

      // Path ondulato con CURVE BEZIER (non linee)
      const amplitude = 18 + idx * 4;
      const wavelength = 200 + idx * 30;

      // Costruisco path con curve quadratiche per onde morbide
      let d = `M0,${60 + amplitude}`;
      let foamD = `M0,${60 + amplitude}`;

      for (let x = 0; x < 2400; x += wavelength) {
        const x1 = x + wavelength * 0.25;
        const x2 = x + wavelength * 0.5;
        const x3 = x + wavelength * 0.75;
        const x4 = x + wavelength;

        const y1 = 60 - amplitude; // picco
        const y2 = 60 + amplitude; // valle

        // Curve quadratiche per onde sinusoidali morbide
        d += ` Q${x1},${y1} ${x2},60`;
        d += ` Q${x3},${y2} ${x4},60`;

        foamD += ` Q${x1},${y1} ${x2},60`;
        foamD += ` Q${x3},${y2} ${x4},60`;
      }
      d += ' L2400,120 L0,120 Z';

      // Gradiente
      const defs = document.createElementNS(svgNS, 'defs');
      const grad = document.createElementNS(svgNS, 'linearGradient');
      grad.setAttribute('id', `waveGrad${idx}`);
      grad.setAttribute('x1', '0%');
      grad.setAttribute('y1', '0%');
      grad.setAttribute('x2', '0%');
      grad.setAttribute('y2', '100%');
      const stop1 = document.createElementNS(svgNS, 'stop');
      stop1.setAttribute('offset', '0%');
      stop1.setAttribute('stop-color', cfg.color1);
      const stop2 = document.createElementNS(svgNS, 'stop');
      stop2.setAttribute('offset', '100%');
      stop2.setAttribute('stop-color', cfg.color2);
      grad.appendChild(stop1);
      grad.appendChild(stop2);
      defs.appendChild(grad);
      svg.appendChild(defs);

      // Path riempimento onda
      const path = document.createElementNS(svgNS, 'path');
      path.setAttribute('d', d);
      path.setAttribute('fill', `url(#waveGrad${idx})`);
      svg.appendChild(path);

      // PROFILO BIANCO (schiuma) - più visibile sulle onde in primo piano
      const foamOpacity = 0.3 + (5 - idx) * 0.12;
      const foamWidth = 2 + (5 - idx) * 0.8;

      const foam = document.createElementNS(svgNS, 'path');
      foam.setAttribute('d', foamD);
      foam.setAttribute('fill', 'none');
      foam.setAttribute('stroke', `rgba(255, 255, 255, ${foamOpacity})`);
      foam.setAttribute('stroke-width', foamWidth);
      foam.setAttribute('stroke-linecap', 'round');
      svg.appendChild(foam);

      waveContainer.appendChild(svg);
      container.appendChild(waveContainer);

      // GSAP: scorrimento orizzontale
      gsap.fromTo(waveContainer,
        { x: 0 },
        {
          x: -W,
          duration: cfg.speed / intensity,
          repeat: -1,
          ease: 'none',
        }
      );

      // GSAP: leggero movimento verticale
      gsap.to(waveContainer, {
        y: cfg.yOffset,
        duration: 3 + idx * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: idx * 0.3,
      });
    });

    // === PAPER BOAT ===
    const boat = document.createElement('div');
    Object.assign(boat.style, {
      position: 'absolute',
      bottom: '33%',
      left: '32%',
      width: '130px',
      height: '104px',
      zIndex: '20',
      transformOrigin: 'center 85%',
    });
    boat.innerHTML = `
      <svg viewBox="0 0 100 80" width="130" height="104" style="filter: drop-shadow(3px 5px 8px rgba(0,0,0,0.3));">
        <!-- Vela sinistra -->
        <polygon points="50,2 50,45 18,45" fill="#f8f4e8" stroke="#d4cbb8" stroke-width="1.2"/>
        <!-- Vela destra (ombra) -->
        <polygon points="50,2 50,45 82,45" fill="#ebe5d5" stroke="#d4cbb8" stroke-width="1.2"/>
        <!-- Scafo sinistro -->
        <polygon points="18,45 50,45 46,62 26,62" fill="#f8f4e8" stroke="#d4cbb8" stroke-width="1.2"/>
        <!-- Scafo destro (ombra) -->
        <polygon points="50,45 82,45 74,62 54,62" fill="#ebe5d5" stroke="#d4cbb8" stroke-width="1.2"/>
        <!-- Piega centrale -->
        <line x1="50" y1="2" x2="50" y2="62" stroke="#c8bfa8" stroke-width="1"/>
        <!-- Piega orizzontale -->
        <line x1="18" y1="45" x2="82" y2="45" stroke="#c8bfa8" stroke-width="0.8" opacity="0.6"/>
      </svg>
    `;
    container.appendChild(boat);

    // Boat: bobbing
    gsap.to(boat, {
      y: -15,
      duration: 2.2 / intensity,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Boat: rotation
    gsap.to(boat, {
      rotation: 6,
      duration: 2.8 / intensity,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Boat: drift
    const drift = gsap.timeline({ repeat: -1 });
    drift.to(boat, { x: 70, duration: 20 / intensity, ease: 'sine.inOut' });
    drift.to(boat, { x: -50, duration: 25 / intensity, ease: 'sine.inOut' });
    drift.to(boat, { x: 0, duration: 15 / intensity, ease: 'sine.inOut' });

    // === SPARKLES ===
    for (let i = 0; i < 15; i++) {
      const sparkle = document.createElement('div');
      Object.assign(sparkle.style, {
        position: 'absolute',
        width: '3px',
        height: '3px',
        borderRadius: '50%',
        backgroundColor: 'rgba(255,255,255,0.8)',
        left: `${15 + Math.random() * 70}%`,
        bottom: `${10 + Math.random() * 30}%`,
        zIndex: '15',
        opacity: '0',
      });
      container.appendChild(sparkle);

      gsap.to(sparkle, {
        opacity: 0.6,
        duration: 1.2 + Math.random() * 1.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: Math.random() * 3,
      });
    }

    // Cleanup
    return () => {
      gsap.killTweensOf(container.querySelectorAll('*'));
    };
  }, [intensity]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #050a15 0%, #0a1525 35%, #152535 100%)',
      }}
    />
  );
};

export default WavesAnimation;
