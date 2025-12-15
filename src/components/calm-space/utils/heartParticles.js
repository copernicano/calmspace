/**
 * Heart Particles System - Bioluminescent Ethereal Heart
 * Sistema di particelle avanzato con effetto "wow"
 *
 * Aesthetic: Deep sea bioluminescence meets aurora borealis
 * - Multi-layer particle system
 * - Flowing organic movement with trails
 * - Pulsing color gradients
 * - Central radiant core
 * - Sparkle effects
 * - Ethereal outer aura
 */

import * as THREE from 'three';

// Palette colori per tema - più vibranti e luminosi
const THEME_PALETTES = {
  blue: {
    core: [0x00d4ff, 0x0099ff, 0x0066ff],      // Cyan to blue
    mid: [0x4da6ff, 0x80bfff, 0x99ccff],        // Light blues
    outer: [0x001a33, 0x003366, 0x004080],      // Deep blues
    sparkle: 0xffffff,
    ambient: 0x0044aa
  },
  green: {
    core: [0x00ff88, 0x00dd66, 0x00bb55],       // Bright greens
    mid: [0x66ffaa, 0x99ffcc, 0xaaffdd],        // Light greens
    outer: [0x002211, 0x003322, 0x004433],      // Deep greens
    sparkle: 0xccffee,
    ambient: 0x00aa44
  },
  amber: {
    core: [0xffaa00, 0xff8800, 0xff6600],       // Orange to gold
    mid: [0xffcc66, 0xffdd88, 0xffeeaa],        // Light golds
    outer: [0x331a00, 0x442200, 0x553300],      // Deep ambers
    sparkle: 0xffffcc,
    ambient: 0xaa6600
  },
  lavender: {
    core: [0xdd88ff, 0xcc66ff, 0xbb44ff],       // Bright purples
    mid: [0xeeccff, 0xddaaff, 0xcc88ff],        // Light purples
    outer: [0x220033, 0x330044, 0x440055],      // Deep purples
    sparkle: 0xffeeff,
    ambient: 0x8844aa
  }
};

/**
 * Genera punti sulla superficie di un cuore 3D con distribuzione migliore
 */
function generateHeartPoints(count, layer = 'core') {
  const positions = new Float32Array(count * 3);
  const velocities = new Float32Array(count * 3);

  // Layer scale - outer layers più grandi
  const layerScale = layer === 'core' ? 1.0 : layer === 'mid' ? 1.3 : 1.6;
  const noiseAmount = layer === 'core' ? 0.02 : layer === 'mid' ? 0.05 : 0.08;

  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;

    // Heart curve parametric equation - più definita
    let x = 16 * Math.pow(Math.sin(t), 3);
    let y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

    // Profondità 3D più drammatica
    const depthFactor = layer === 'core' ? 0.3 : layer === 'mid' ? 0.5 : 0.7;
    let z = (Math.random() - 0.5) * 12 * depthFactor;

    // Scala e centra
    const baseScale = 0.045 * layerScale;
    x = x * baseScale;
    y = y * baseScale + 0.1; // Centra verticalmente
    z = z * baseScale;

    // Rumore organico
    x += (Math.random() - 0.5) * noiseAmount * layerScale;
    y += (Math.random() - 0.5) * noiseAmount * layerScale;
    z += (Math.random() - 0.5) * noiseAmount * layerScale;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    // Velocità iniziali per movimento organico
    velocities[i * 3] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.002;
    velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
  }

  return { positions, velocities };
}

/**
 * Crea shader per particelle luminose con glow
 */
function createParticleShader(isCore = false) {
  const vertexShader = `
    attribute float size;
    attribute vec3 customColor;
    attribute float alpha;
    attribute float pulsePhase;

    varying vec3 vColor;
    varying float vAlpha;
    varying float vPulse;

    uniform float time;
    uniform float expansion;

    void main() {
      vColor = customColor;
      vAlpha = alpha;

      // Pulsazione individuale per ogni particella
      float pulse = sin(time * 2.0 + pulsePhase) * 0.5 + 0.5;
      vPulse = pulse;

      // Dimensione che pulsa
      float dynamicSize = size * (0.8 + pulse * 0.4);

      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = dynamicSize * (350.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = isCore ? `
    varying vec3 vColor;
    varying float vAlpha;
    varying float vPulse;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      // Glow intenso per il core
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 1.5);

      // Centro super luminoso
      float core = 1.0 - smoothstep(0.0, 0.15, dist);
      core = pow(core, 2.0);

      // Colore con bloom
      vec3 finalColor = vColor * (1.0 + core * 2.0 + vPulse * 0.5);
      float finalAlpha = glow * vAlpha * (0.7 + vPulse * 0.3);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  ` : `
    varying vec3 vColor;
    varying float vAlpha;
    varying float vPulse;

    void main() {
      float dist = length(gl_PointCoord - vec2(0.5));
      if (dist > 0.5) discard;

      // Glow morbido per outer layers
      float glow = 1.0 - smoothstep(0.0, 0.5, dist);
      glow = pow(glow, 2.5);

      vec3 finalColor = vColor * (1.0 + vPulse * 0.3);
      float finalAlpha = glow * vAlpha * (0.4 + vPulse * 0.2);

      gl_FragColor = vec4(finalColor, finalAlpha);
    }
  `;

  return { vertexShader, fragmentShader };
}

/**
 * Crea il sistema di particelle cuore multi-layer
 */
export function createHeartParticleSystem(container, theme = 'blue') {
  const isMobile = window.innerWidth < 768;

  // Configurazione particelle per layer
  const config = {
    core: { count: isMobile ? 400 : 800, sizeMin: 0.03, sizeMax: 0.08 },
    mid: { count: isMobile ? 300 : 600, sizeMin: 0.02, sizeMax: 0.05 },
    outer: { count: isMobile ? 200 : 400, sizeMin: 0.015, sizeMax: 0.04 },
    sparkles: { count: isMobile ? 30 : 60 },
    ambient: { count: isMobile ? 50 : 100 }
  };

  // Setup Three.js
  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    50,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.z = 4;

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  // Gruppo principale per trasformazioni
  const heartGroup = new THREE.Group();
  scene.add(heartGroup);

  // Storage per layers
  const layers = {};
  let targetExpansion = 0.5;
  let currentExpansion = 0.5;
  let time = 0;

  /**
   * Crea un layer di particelle
   */
  function createLayer(name, layerConfig, palette, layerType) {
    const { positions, velocities } = generateHeartPoints(layerConfig.count, layerType);

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Attributi custom
    const sizes = new Float32Array(layerConfig.count);
    const colors = new Float32Array(layerConfig.count * 3);
    const alphas = new Float32Array(layerConfig.count);
    const pulsePhases = new Float32Array(layerConfig.count);

    const colorArray = palette[layerType] || palette.core;

    for (let i = 0; i < layerConfig.count; i++) {
      sizes[i] = layerConfig.sizeMin + Math.random() * (layerConfig.sizeMax - layerConfig.sizeMin);

      // Scegli colore dal palette
      const color = new THREE.Color(colorArray[Math.floor(Math.random() * colorArray.length)]);
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      alphas[i] = layerType === 'core' ? 0.9 : layerType === 'mid' ? 0.6 : 0.35;
      pulsePhases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('pulsePhase', new THREE.BufferAttribute(pulsePhases, 1));

    const shader = createParticleShader(layerType === 'core');

    const material = new THREE.ShaderMaterial({
      vertexShader: shader.vertexShader,
      fragmentShader: shader.fragmentShader,
      uniforms: {
        time: { value: 0 },
        expansion: { value: 0.5 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    heartGroup.add(particles);

    return {
      particles,
      geometry,
      material,
      originalPositions: positions.slice(),
      velocities,
      config: layerConfig
    };
  }

  /**
   * Crea sparkles - particelle luminose casuali
   */
  function createSparkles(count, palette) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const alphas = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Posizione casuale nell'area del cuore
      const t = Math.random() * Math.PI * 2;
      let x = 16 * Math.pow(Math.sin(t), 3) * 0.055;
      let y = (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * 0.055 + 0.1;
      let z = (Math.random() - 0.5) * 0.5;

      positions[i * 3] = x + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 1] = y + (Math.random() - 0.5) * 0.2;
      positions[i * 3 + 2] = z;

      sizes[i] = 0.02 + Math.random() * 0.04;
      alphas[i] = 0;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));

    const material = new THREE.ShaderMaterial({
      vertexShader: `
        attribute float size;
        attribute float alpha;
        varying float vAlpha;

        void main() {
          vAlpha = alpha;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = size * (400.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vAlpha;
        uniform vec3 color;

        void main() {
          float dist = length(gl_PointCoord - vec2(0.5));
          if (dist > 0.5) discard;

          float glow = 1.0 - smoothstep(0.0, 0.3, dist);
          glow = pow(glow, 1.5);

          gl_FragColor = vec4(color, glow * vAlpha);
        }
      `,
      uniforms: {
        color: { value: new THREE.Color(palette.sparkle) }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const sparkles = new THREE.Points(geometry, material);
    heartGroup.add(sparkles);

    return { sparkles, geometry, material, phases, alphas };
  }

  /**
   * Crea alone ambient
   */
  function createAmbientGlow(palette) {
    // Alone centrale grande
    const glowGeometry = new THREE.PlaneGeometry(3, 3);
    const glowMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 color;
        uniform float intensity;
        uniform float time;

        void main() {
          vec2 center = vUv - 0.5;
          float dist = length(center);

          // Pulsazione
          float pulse = sin(time * 1.5) * 0.1 + 0.9;

          // Glow radiale con forma cuore approssimata
          float glow = 1.0 - smoothstep(0.0, 0.4 * pulse, dist);
          glow = pow(glow, 3.0);

          gl_FragColor = vec4(color, glow * intensity * 0.3);
        }
      `,
      uniforms: {
        color: { value: new THREE.Color(palette.ambient) },
        intensity: { value: 1.0 },
        time: { value: 0 }
      },
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });

    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    glow.position.z = -0.5;
    glow.position.y = 0.1;
    heartGroup.add(glow);

    return { glow, material: glowMaterial };
  }

  // Inizializza con palette corrente
  const palette = THEME_PALETTES[theme] || THEME_PALETTES.blue;

  layers.core = createLayer('core', config.core, palette, 'core');
  layers.mid = createLayer('mid', config.mid, palette, 'mid');
  layers.outer = createLayer('outer', config.outer, palette, 'outer');
  layers.sparkles = createSparkles(config.sparkles.count, palette);
  layers.ambient = createAmbientGlow(palette);

  /**
   * Aggiorna espansione
   */
  const setExpansion = (value) => {
    targetExpansion = Math.max(0, Math.min(1, value));
  };

  /**
   * Cambia tema
   */
  const setTheme = (newTheme) => {
    if (!THEME_PALETTES[newTheme]) return;
    const newPalette = THEME_PALETTES[newTheme];

    // Aggiorna colori di tutti i layer
    ['core', 'mid', 'outer'].forEach(layerName => {
      const layer = layers[layerName];
      const colorArray = newPalette[layerName];
      const colors = layer.geometry.attributes.customColor.array;

      for (let i = 0; i < layer.config.count; i++) {
        const color = new THREE.Color(colorArray[Math.floor(Math.random() * colorArray.length)]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
      }
      layer.geometry.attributes.customColor.needsUpdate = true;
    });

    // Aggiorna sparkles e ambient
    layers.sparkles.material.uniforms.color.value.set(newPalette.sparkle);
    layers.ambient.material.uniforms.color.value.set(newPalette.ambient);
  };

  /**
   * Loop di aggiornamento
   */
  const update = () => {
    time += 0.016; // ~60fps

    // Smooth interpolation espansione
    currentExpansion += (targetExpansion - currentExpansion) * 0.08;

    // Scala basata su espansione (0.5 contratto, 1.5 espanso)
    const scale = 0.5 + currentExpansion * 1.0;

    // Aggiorna ogni layer
    ['core', 'mid', 'outer'].forEach((layerName, layerIndex) => {
      const layer = layers[layerName];
      const positionAttr = layer.geometry.attributes.position;
      const originalPos = layer.originalPositions;

      // Layer specifico timing
      const layerTime = time + layerIndex * 0.5;

      for (let i = 0; i < layer.config.count; i++) {
        const i3 = i * 3;

        // Posizione base scalata
        let x = originalPos[i3] * scale;
        let y = originalPos[i3 + 1] * scale;
        let z = originalPos[i3 + 2] * scale;

        // Movimento organico fluido
        const noiseScale = layerName === 'core' ? 0.01 : layerName === 'mid' ? 0.015 : 0.02;
        const speed = layerName === 'core' ? 1.0 : layerName === 'mid' ? 0.8 : 0.6;

        x += Math.sin(layerTime * speed + i * 0.1) * noiseScale * scale;
        y += Math.cos(layerTime * speed * 1.1 + i * 0.1) * noiseScale * scale;
        z += Math.sin(layerTime * speed * 0.7 + i * 0.15) * noiseScale * 0.5 * scale;

        positionAttr.array[i3] = x;
        positionAttr.array[i3 + 1] = y;
        positionAttr.array[i3 + 2] = z;
      }

      positionAttr.needsUpdate = true;
      layer.material.uniforms.time.value = time;
      layer.material.uniforms.expansion.value = currentExpansion;
    });

    // Aggiorna sparkles
    const sparkleAlphas = layers.sparkles.geometry.attributes.alpha.array;
    const sparklePhases = layers.sparkles.phases;
    for (let i = 0; i < config.sparkles.count; i++) {
      // Sparkle casuale che appare e scompare
      const sparkleTime = (time * 2 + sparklePhases[i]) % (Math.PI * 2);
      const intensity = Math.max(0, Math.sin(sparkleTime) * 2 - 1);
      sparkleAlphas[i] = intensity * currentExpansion;
    }
    layers.sparkles.geometry.attributes.alpha.needsUpdate = true;

    // Aggiorna ambient glow
    layers.ambient.material.uniforms.time.value = time;
    layers.ambient.material.uniforms.intensity.value = 0.5 + currentExpansion * 0.5;

    // Rotazione dolce del cuore
    heartGroup.rotation.y = Math.sin(time * 0.3) * 0.15;
    heartGroup.rotation.x = Math.cos(time * 0.2) * 0.05;

    // Scala del gruppo basata su respiro
    const breathScale = 0.9 + currentExpansion * 0.2;
    heartGroup.scale.setScalar(breathScale);

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

    // Dispose layers
    Object.values(layers).forEach(layer => {
      if (layer.geometry) layer.geometry.dispose();
      if (layer.material) layer.material.dispose();
    });

    renderer.dispose();

    if (container.contains(renderer.domElement)) {
      container.removeChild(renderer.domElement);
    }
  };

  return {
    scene,
    camera,
    renderer,
    update,
    setExpansion,
    setTheme,
    dispose
  };
}

export default createHeartParticleSystem;
