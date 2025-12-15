/**
 * Hand Tracking Utility - MediaPipe Hands
 * Calcola l'apertura della mano (0 = chiusa, 1 = aperta)
 */

import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';

/**
 * Crea e inizializza il sistema di hand tracking
 * @param {HTMLVideoElement} videoElement - Elemento video per la webcam
 * @param {Function} onHandUpdate - Callback chiamata con openness (0-1)
 * @returns {Object} - { start, stop, isRunning }
 */
export function createHandTracker(videoElement, onHandUpdate) {
  let camera = null;
  let hands = null;
  let isRunning = false;

  // Buffer per smoothing
  const smoothingBuffer = [];
  const SMOOTHING_WINDOW = 5;

  // Calibrazione automatica
  let minOpenness = Infinity;
  let maxOpenness = -Infinity;
  let calibrationFrames = 0;
  const CALIBRATION_FRAMES = 30; // ~1 secondo a 30fps

  /**
   * Calcola l'apertura della mano dai landmarks
   * @param {Array} landmarks - 21 punti della mano
   * @returns {number} - Valore raw di apertura
   */
  const calculateRawOpenness = (landmarks) => {
    // Indici landmarks MediaPipe:
    // 0 = polso, 4 = punta pollice, 8 = punta indice,
    // 12 = punta medio, 16 = punta anulare, 20 = punta mignolo
    // 5 = base indice (MCP), 9 = base medio, 13 = base anulare, 17 = base mignolo

    const wrist = landmarks[0];
    const fingerTips = [landmarks[8], landmarks[12], landmarks[16], landmarks[20]];
    const fingerBases = [landmarks[5], landmarks[9], landmarks[13], landmarks[17]];

    // Calcola distanza media punta-base per ogni dito
    let totalExtension = 0;
    for (let i = 0; i < 4; i++) {
      const tip = fingerTips[i];
      const base = fingerBases[i];
      const extension = Math.sqrt(
        Math.pow(tip.x - base.x, 2) +
        Math.pow(tip.y - base.y, 2) +
        Math.pow(tip.z - base.z, 2)
      );
      totalExtension += extension;
    }

    // Aggiungi pollice (distanza punta pollice da polso)
    const thumbTip = landmarks[4];
    const thumbExtension = Math.sqrt(
      Math.pow(thumbTip.x - wrist.x, 2) +
      Math.pow(thumbTip.y - wrist.y, 2) +
      Math.pow(thumbTip.z - wrist.z, 2)
    );
    totalExtension += thumbExtension;

    return totalExtension / 5; // Media delle 5 dita
  };

  /**
   * Applica smoothing al valore
   * @param {number} value - Valore corrente
   * @returns {number} - Valore smoothed
   */
  const applySmoothing = (value) => {
    smoothingBuffer.push(value);
    if (smoothingBuffer.length > SMOOTHING_WINDOW) {
      smoothingBuffer.shift();
    }
    return smoothingBuffer.reduce((a, b) => a + b, 0) / smoothingBuffer.length;
  };

  /**
   * Normalizza il valore usando la calibrazione
   * @param {number} raw - Valore raw
   * @returns {number} - Valore normalizzato 0-1
   */
  const normalizeOpenness = (raw) => {
    // Durante calibrazione, aggiorna min/max
    if (calibrationFrames < CALIBRATION_FRAMES) {
      minOpenness = Math.min(minOpenness, raw);
      maxOpenness = Math.max(maxOpenness, raw);
      calibrationFrames++;
      // Durante calibrazione restituisci 0.5
      return 0.5;
    }

    // Dopo calibrazione, normalizza
    const range = maxOpenness - minOpenness;
    if (range < 0.01) return 0.5; // Range troppo piccolo

    const normalized = (raw - minOpenness) / range;
    return Math.max(0, Math.min(1, normalized));
  };

  /**
   * Callback per risultati MediaPipe
   */
  const onResults = (results) => {
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      // Usa la prima mano rilevata
      const landmarks = results.multiHandLandmarks[0];
      const rawOpenness = calculateRawOpenness(landmarks);
      const smoothedOpenness = applySmoothing(rawOpenness);
      const normalizedOpenness = normalizeOpenness(smoothedOpenness);

      onHandUpdate({
        detected: true,
        openness: normalizedOpenness,
        isCalibrating: calibrationFrames < CALIBRATION_FRAMES,
        calibrationProgress: Math.min(1, calibrationFrames / CALIBRATION_FRAMES)
      });
    } else {
      onHandUpdate({
        detected: false,
        openness: null,
        isCalibrating: false,
        calibrationProgress: 1
      });
    }
  };

  /**
   * Avvia il tracking
   */
  const start = async () => {
    if (isRunning) return;

    // Reset calibrazione
    minOpenness = Infinity;
    maxOpenness = -Infinity;
    calibrationFrames = 0;
    smoothingBuffer.length = 0;

    // Inizializza MediaPipe Hands
    hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 1,
      modelComplexity: 1, // 0=lite, 1=full
      minDetectionConfidence: 0.7,
      minTrackingConfidence: 0.5
    });

    hands.onResults(onResults);

    // Inizializza camera
    camera = new Camera(videoElement, {
      onFrame: async () => {
        if (hands && isRunning) {
          await hands.send({ image: videoElement });
        }
      },
      width: 640,
      height: 480
    });

    await camera.start();
    isRunning = true;
  };

  /**
   * Ferma il tracking
   */
  const stop = () => {
    isRunning = false;

    if (camera) {
      camera.stop();
      camera = null;
    }

    if (hands) {
      hands.close();
      hands = null;
    }

    // Ferma stream webcam
    if (videoElement.srcObject) {
      const tracks = videoElement.srcObject.getTracks();
      tracks.forEach(track => track.stop());
      videoElement.srcObject = null;
    }
  };

  /**
   * Resetta la calibrazione
   */
  const resetCalibration = () => {
    minOpenness = Infinity;
    maxOpenness = -Infinity;
    calibrationFrames = 0;
    smoothingBuffer.length = 0;
  };

  return {
    start,
    stop,
    resetCalibration,
    isRunning: () => isRunning
  };
}

export default createHandTracker;
