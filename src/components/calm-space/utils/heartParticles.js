/**
 * Heart Particles System - Three.js
 * Sistema di particelle a forma di cuore con animazione espansione/contrazione
 */

import * as THREE from 'three';

// Colori tema (corrispondono ai temi CalmSpace)
const THEME_COLORS = {
  blue: {
    primary: 0x3b82d6,
    secondary: 0x60a5fa,
    glow: 0x93c5fd
  },
  green: {
    primary: 0x22c55e,
    secondary: 0x4ade80,
    glow: 0x86efac
  },
  amber: {
    primary: 0xf59e0b,
    secondary: 0xfbbf24,
    glow: 0xfde68a
  },
  lavender: {
    primary: 0x9061f9,
    secondary: 0xac94fa,
    glow: 0xcabffd
  }
};

/**
 * Genera punti sulla superficie di un cuore 3D
 * Equazione parametrica del cuore
 * @param {number} count - Numero di punti
 * @returns {Float32Array} - Array di posizioni xyz
 */
function generateHeartPoints(count) {
  const positions = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    // Parametri casuali per distribuzione uniforme sulla superficie
    const u = Math.random() * Math.PI * 2;

    // Equazione parametrica del cuore (variante 3D)
    const scale = 0.8;

    // Heart curve parametric equation
    const t = u;
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    let z = (Math.random() - 0.5) * 8; // Profondità casuale per effetto 3D

    // Normalizza e scala
    x = x * scale * 0.05;
    y = y * scale * 0.05;
    z = z * scale * 0.05;

    // Aggiungi un po' di rumore per effetto organico
    const noise = 0.02;
    x += (Math.random() - 0.5) * noise;
    y += (Math.random() - 0.5) * noise;
    z += (Math.random() - 0.5) * noise;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }

  return positions;
}

/**
 * Crea il sistema di particelle cuore
 * @param {HTMLElement} container - Container DOM
 * @param {string} theme - Tema colore (blue, green, amber, lavender)
 * @returns {Object} - { scene, camera, renderer, particles, update, setExpansion, setTheme, dispose }
 */
export function createHeartParticleSystem(container, theme = 'blue') {
  // Configurazione
  const isMobile = window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 800 : 1500;

  // Setup Three.js
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    60,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 3;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Genera geometria cuore
  const basePositions = generateHeartPoints(PARTICLE_COUNT);

  // Geometry
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(basePositions.slice(), 3));

  // Attributi custom per animazione
  const originalPositions = basePositions.slice();
  const sizes = new Float32Array(PARTICLE_COUNT);
  const colors = new Float32Array(PARTICLE_COUNT * 3);

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    sizes[i] = 0.02 + Math.random() * 0.03;
  }

  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // Shader Material per particelle luminose
  const vertexShader = `
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    varying float vSize;

    void main() {
      vColor = color;
      vSize = size;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;
    varying float vSize;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      // Glow effect
      float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
      alpha = pow(alpha, 1.5);

      // Core brightness
      float core = 1.0 - smoothstep(0.0, 0.2, dist);

      vec3 finalColor = vColor + core * 0.5;
      gl_FragColor = vec4(finalColor, alpha * 0.9);
    }
  `;

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  // Crea particelle
  const particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Stato
  let currentExpansion = 0.5; // 0 = contratto, 1 = espanso
  let targetExpansion = 0.5;
  let animationId = null;

  // Applica colori tema
  const applyThemeColors = (themeName) => {
    const themeColors = THEME_COLORS[themeName] || THEME_COLORS.blue;
    const colorAttr = geometry.attributes.color;

    const primary = new THREE.Color(themeColors.primary);
    const secondary = new THREE.Color(themeColors.secondary);
    const glow = new THREE.Color(themeColors.glow);

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Mischia colori per varietà
      const t = Math.random();
      let color;
      if (t < 0.4) {
        color = primary;
      } else if (t < 0.7) {
        color = secondary;
      } else {
        color = glow;
      }

      colorAttr.array[i * 3] = color.r;
      colorAttr.array[i * 3 + 1] = color.g;
      colorAttr.array[i * 3 + 2] = color.b;
    }

    colorAttr.needsUpdate = true;
  };

  // Applica colori iniziali
  applyThemeColors(theme);

  /**
   * Aggiorna espansione delle particelle
   * @param {number} expansion - Valore 0-1 (0=contratto, 1=espanso)
   */
  const setExpansion = (expansion) => {
    targetExpansion = Math.max(0, Math.min(1, expansion));
  };

  /**
   * Cambia tema colore
   * @param {string} newTheme - Nome tema
   */
  const setTheme = (newTheme) => {
    if (THEME_COLORS[newTheme]) {
      applyThemeColors(newTheme);
    }
  };

  /**
   * Loop di animazione
   */
  const update = () => {
    // Smooth interpolation verso target
    currentExpansion += (targetExpansion - currentExpansion) * 0.08;

    const positionAttr = geometry.attributes.position;

    // Scala basata su espansione (0.6 contratto, 1.4 espanso)
    const scale = 0.6 + currentExpansion * 0.8;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;

      // Posizione originale scalata
      positionAttr.array[i3] = originalPositions[i3] * scale;
      positionAttr.array[i3 + 1] = originalPositions[i3 + 1] * scale;
      positionAttr.array[i3 + 2] = originalPositions[i3 + 2] * scale;

      // Leggero movimento organico
      const time = Date.now() * 0.001;
      const offset = i * 0.01;
      positionAttr.array[i3] += Math.sin(time + offset) * 0.005;
      positionAttr.array[i3 + 1] += Math.cos(time * 1.1 + offset) * 0.005;
    }

    positionAttr.needsUpdate = true;

    // Leggera rotazione
    particles.rotation.y = Math.sin(Date.now() * 0.0003) * 0.1;
    particles.rotation.x = Math.cos(Date.now() * 0.0002) * 0.05;

    renderer.render(scene, camera);
  };

  /**
   * Gestisce resize
   */
  const handleResize = () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };

  window.addEventListener('resize', handleResize);

  /**
   * Cleanup
   */
  const dispose = () => {
    window.removeEventListener('resize', handleResize);

    if (animationId) {
      cancelAnimationFrame(animationId);
    }

    geometry.dispose();
    material.dispose();
    renderer.dispose();

    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };

  return {
    scene,
    camera,
    renderer,
    particles,
    update,
    setExpansion,
    setTheme,
    dispose
  };
}

export default createHeartParticleSystem;
