/**
 * 🌊 Waves Animation - ORGANIC ARTISTIC STYLE
 * Illustrated ocean waves like Japanese animation, NOT mathematical sine waves
 */

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const WavesAnimation = () => {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    // ORGANIC WAVE PATHS - asymmetric, artistic curves
    // LAYER 1 - Background (lightest, slowest)
    const wave1Start = "M0 280 C150 260 300 290 450 270 C600 250 750 280 900 260 C1050 240 1200 270 1350 250 L1440 260 L1440 400 L0 400 Z";
    const wave1End = "M0 270 C150 290 300 260 450 280 C600 300 750 270 900 290 C1050 310 1200 280 1350 300 L1440 280 L1440 400 L0 400 Z";

    // LAYER 2 - Middle
    const wave2Start = "M0 300 C200 280 350 320 500 290 C650 260 800 300 950 280 C1100 260 1250 290 1440 270 L1440 400 L0 400 Z";
    const wave2End = "M0 290 C200 310 350 280 500 310 C650 340 800 300 950 320 C1100 340 1250 310 1440 330 L1440 400 L0 400 Z";

    // LAYER 3 - Foreground (darkest, fastest)
    const wave3Start = "M0 330 C180 310 280 350 420 320 C560 290 680 340 820 310 C960 280 1100 330 1260 300 L1440 320 L1440 400 L0 400 Z";
    const wave3End = "M0 320 C180 350 280 310 420 340 C560 370 680 320 820 350 C960 380 1100 340 1260 360 L1440 340 L1440 400 L0 400 Z";

    // Create Layer 1 - Background
    const wave1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    wave1.setAttribute('fill', 'rgba(30, 60, 90, 0.4)');
    wave1.setAttribute('d', wave1Start);
    svg.appendChild(wave1);

    // Create Layer 2 - Middle
    const wave2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    wave2.setAttribute('fill', 'rgba(20, 50, 80, 0.6)');
    wave2.setAttribute('d', wave2Start);
    svg.appendChild(wave2);

    // Create Layer 3 - Foreground
    const wave3 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    wave3.setAttribute('fill', 'rgba(10, 35, 60, 0.9)');
    wave3.setAttribute('d', wave3Start);
    svg.appendChild(wave3);

    // GSAP Animations - morphing between states
    gsap.to(wave1, {
      attr: { d: wave1End },
      duration: 8,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to(wave2, {
      attr: { d: wave2End },
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    gsap.to(wave3, {
      attr: { d: wave3End },
      duration: 4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    // Add subtle sparkles on water surface
    for (let i = 0; i < 12; i++) {
      const sparkle = document.createElement('div');
      const size = 2 + Math.random() * 3;
      const left = Math.random() * 100;
      const top = 65 + Math.random() * 10;

      Object.assign(sparkle.style, {
        position: 'absolute',
        top: `${top}%`,
        left: `${left}%`,
        width: `${size}px`,
        height: `${size}px`,
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(200, 220, 255, 0.3) 100%)',
        borderRadius: '50%',
        zIndex: 10,
        filter: 'blur(0.5px)',
        pointerEvents: 'none',
      });

      svg.parentElement.appendChild(sparkle);

      gsap.fromTo(
        sparkle,
        { opacity: 0, scale: 0.5 },
        {
          opacity: 0.7,
          scale: 1.3,
          duration: 2 + Math.random() * 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: Math.random() * 4,
        }
      );
    }

    // Cleanup
    return () => {
      gsap.killTweensOf([wave1, wave2, wave3]);
      const parent = svg.parentElement;
      if (parent) {
        const sparkles = parent.querySelectorAll('div');
        sparkles.forEach(sparkle => {
          gsap.killTweensOf(sparkle);
          sparkle.remove();
        });
      }
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        overflow: 'hidden',
      }}
    >
      {/* Subtle moon glow */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          right: '20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(200, 220, 255, 0.08) 0%, rgba(150, 180, 220, 0.04) 40%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 2,
          filter: 'blur(60px)',
        }}
      />

      {/* SVG Waves Container */}
      <svg
        ref={svgRef}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '60%',
        }}
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
      />
    </div>
  );
};

export default WavesAnimation;
