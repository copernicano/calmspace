/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Settings Context - Autism-Friendly Accessibility
 * ═══════════════════════════════════════════════════════════════════
 *
 * Comprehensive settings system for granular control over:
 * - Visual appearance & stimulation
 * - Sensory input (animations, sounds, vibrations)
 * - Cognitive load & information density
 * - Accessibility features
 * - Time awareness & routines
 */

import React, { createContext, useState, useEffect, useCallback } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

/* ═══════════════════════════════════════════════════════════════════
   Default Settings - Safe, Low-Stimulation Defaults
   ═══════════════════════════════════════════════════════════════════ */

const defaultSettings = {
  /* ─────────────────────────────────────────────────────────────────
     APPEARANCE SETTINGS
     ───────────────────────────────────────────────────────────────── */
  theme: 'blue',                    // blue | green | amber | lavender
  colorMode: 'light',               // light | dark | auto
  highContrast: false,              // Enhanced contrast for visual clarity

  /* ─────────────────────────────────────────────────────────────────
     TEXT & TYPOGRAPHY
     ───────────────────────────────────────────────────────────────── */
  textSize: 'standard',             // standard | large | xlarge
  dyslexiaFont: false,              // Use OpenDyslexic font
  lineSpacing: 'normal',            // tight | normal | relaxed | loose
  letterSpacing: 'normal',          // normal | wide | wider

  /* ─────────────────────────────────────────────────────────────────
     SENSORY CONTROLS - Granular control over stimulation
     ───────────────────────────────────────────────────────────────── */
  // Visual
  animationLevel: 'off',            // off | minimal | standard | full
  visualIntensity: 0.7,             // 0.5 (very low) to 1.5 (high)
  colorSaturation: 0.8,             // 0.7 (muted) to 1.2 (vivid)
  blurEffects: false,               // Enable/disable blur effects
  shadowIntensity: 0.3,             // 0 (none) to 1 (full)

  // Audio
  soundEnabled: false,              // Master audio toggle
  soundVolume: 0.5,                 // 0 to 1
  voiceGuidance: false,             // Text-to-speech for instructions
  audioFeedback: false,             // Click sounds, completion chimes

  // Haptics (mobile)
  vibrationEnabled: false,          // Vibration feedback
  vibrationIntensity: 0.5,          // 0 to 1

  /* ─────────────────────────────────────────────────────────────────
     COGNITIVE & INTERACTION
     ───────────────────────────────────────────────────────────────── */
  informationDensity: 'low',        // low | medium | high
  autoAdvance: false,               // Auto-progress through steps
  confirmDestructive: true,         // Confirm before destructive actions
  reducedChoices: true,             // Show fewer options at once

  // Focus mode
  focusModeEnabled: false,          // Hide all non-essential UI
  focusModeLevel: 'moderate',       // minimal | moderate | maximal

  /* ─────────────────────────────────────────────────────────────────
     TIME AWARENESS & ROUTINES
     ───────────────────────────────────────────────────────────────── */
  showSessionTimer: true,           // Display time in current screen
  showBreakReminders: true,         // Gentle break notifications
  breakInterval: 15,                // Minutes between break reminders (0 = off)
  sessionTimeLimit: 0,              // Max session time in minutes (0 = no limit)
  timeFormat: '24h',                // 12h | 24h

  // Routine preferences
  savedRoutines: [],                // Array of user-created routines
  defaultRoutine: null,             // ID of default routine

  /* ─────────────────────────────────────────────────────────────────
     ACCESSIBILITY FEATURES
     ───────────────────────────────────────────────────────────────── */
  screenReaderOptimized: false,     // Additional ARIA labels
  keyboardNavigationHelp: true,     // Show keyboard shortcuts
  largeClickTargets: true,          // Min 48x48px touch targets
  skipAnimations: true,             // Honor prefers-reduced-motion

  /* ─────────────────────────────────────────────────────────────────
     PRESET PROFILES
     ───────────────────────────────────────────────────────────────── */
  activePreset: 'custom',           // custom | low-sensory | high-focus | energy-conserving

  /* ─────────────────────────────────────────────────────────────────
     DATA & PRIVACY
     ───────────────────────────────────────────────────────────────── */
  saveHistory: true,                // Save emotion logs & session history
  analyticsEnabled: false,          // Usage analytics (always opt-in)

  /* ─────────────────────────────────────────────────────────────────
     LEGACY SUPPORT (for backward compatibility)
     ───────────────────────────────────────────────────────────────── */
  stimulationLevel: 'low',          // Mapped to new settings
  uiSize: 'standard',               // Mapped to textSize
};

/* ═══════════════════════════════════════════════════════════════════
   Preset Configurations
   ═══════════════════════════════════════════════════════════════════ */

const presetConfigurations = {
  'low-sensory': {
    name: 'Bassa Stimolazione',
    description: 'Minima stimolazione sensoriale per massimo comfort',
    settings: {
      animationLevel: 'off',
      visualIntensity: 0.5,
      colorSaturation: 0.7,
      blurEffects: false,
      shadowIntensity: 0,
      soundEnabled: false,
      vibrationEnabled: false,
      informationDensity: 'low',
      focusModeEnabled: true,
      focusModeLevel: 'maximal',
    }
  },

  'high-focus': {
    name: 'Massima Concentrazione',
    description: 'Riduce le distrazioni per focalizzare l\'attenzione',
    settings: {
      animationLevel: 'minimal',
      visualIntensity: 0.8,
      informationDensity: 'low',
      focusModeEnabled: true,
      focusModeLevel: 'maximal',
      showSessionTimer: true,
      showBreakReminders: true,
      breakInterval: 20,
      reducedChoices: true,
      soundEnabled: false,
    }
  },

  'energy-conserving': {
    name: 'Risparmio Energie',
    description: 'Riduce la fatica cognitiva e sensoriale',
    settings: {
      animationLevel: 'off',
      visualIntensity: 0.6,
      informationDensity: 'low',
      autoAdvance: true,
      reducedChoices: true,
      textSize: 'large',
      lineSpacing: 'relaxed',
      soundEnabled: false,
      vibrationEnabled: false,
      sessionTimeLimit: 30,
    }
  },

  'balanced': {
    name: 'Bilanciato',
    description: 'Impostazioni equilibrate per uso generale',
    settings: {
      animationLevel: 'minimal',
      visualIntensity: 1,
      colorSaturation: 1,
      informationDensity: 'medium',
      soundEnabled: false,
      showSessionTimer: true,
      showBreakReminders: true,
      breakInterval: 30,
    }
  }
};

/* ═══════════════════════════════════════════════════════════════════
   Settings Context Creation
   ═══════════════════════════════════════════════════════════════════ */

export const EnhancedSettingsContext = createContext({
  settings: defaultSettings,
  updateSettings: () => {},
  resetSettings: () => {},
  applyPreset: () => {},
  getPresets: () => {},
  exportSettings: () => {},
  importSettings: () => {},
});

/* ═══════════════════════════════════════════════════════════════════
   Settings Provider Component
   ═══════════════════════════════════════════════════════════════════ */

export const EnhancedSettingsProvider = ({ children }) => {
  // ───────────────────────────────────────────────────────────────────
  // State Management
  // ───────────────────────────────────────────────────────────────────

  const [settings, setSettings] = useState(() => {
    // Load from storage or use defaults
    const savedSettings = getFromStorage('calmspace-settings-v2');

    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        // Merge with defaults to ensure new settings exist
        return { ...defaultSettings, ...parsed };
      } catch (error) {
        console.error('Failed to parse saved settings:', error);
        return defaultSettings;
      }
    }

    // Check for legacy settings and migrate
    const legacySettings = getFromStorage('userSettings');
    if (legacySettings) {
      try {
        const legacy = JSON.parse(legacySettings);
        return migrateLegacySettings(legacy);
      } catch (error) {
        console.error('Failed to migrate legacy settings:', error);
      }
    }

    return defaultSettings;
  });

  // ───────────────────────────────────────────────────────────────────
  // Persist settings to localStorage
  // ───────────────────────────────────────────────────────────────────

  useEffect(() => {
    saveToStorage('calmspace-settings-v2', JSON.stringify(settings));

    // Apply settings to DOM for CSS variables
    applySettingsToDOM(settings);
  }, [settings]);

  // ───────────────────────────────────────────────────────────────────
  // Settings Actions
  // ───────────────────────────────────────────────────────────────────

  const updateSettings = useCallback((newSettings) => {
    setSettings(prevSettings => {
      const updated = { ...prevSettings, ...newSettings };

      // If preset was manually changed, mark as custom
      if (Object.keys(newSettings).some(key => key !== 'activePreset')) {
        updated.activePreset = 'custom';
      }

      return updated;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
  }, []);

  const applyPreset = useCallback((presetName) => {
    const preset = presetConfigurations[presetName];
    if (!preset) {
      console.error(`Preset '${presetName}' not found`);
      return;
    }

    setSettings(prevSettings => ({
      ...prevSettings,
      ...preset.settings,
      activePreset: presetName,
    }));
  }, []);

  const getPresets = useCallback(() => {
    return Object.entries(presetConfigurations).map(([id, preset]) => ({
      id,
      name: preset.name,
      description: preset.description,
    }));
  }, []);

  const exportSettings = useCallback(() => {
    const exportData = {
      version: 2,
      timestamp: new Date().toISOString(),
      settings,
    };
    return JSON.stringify(exportData, null, 2);
  }, [settings]);

  const importSettings = useCallback((jsonString) => {
    try {
      const data = JSON.parse(jsonString);
      if (data.version === 2 && data.settings) {
        setSettings({ ...defaultSettings, ...data.settings });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to import settings:', error);
      return false;
    }
  }, []);

  // ───────────────────────────────────────────────────────────────────
  // Context Value
  // ───────────────────────────────────────────────────────────────────

  const contextValue = {
    settings,
    updateSettings,
    resetSettings,
    applyPreset,
    getPresets,
    exportSettings,
    importSettings,
  };

  return (
    <EnhancedSettingsContext.Provider value={contextValue}>
      {children}
    </EnhancedSettingsContext.Provider>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Helper Functions
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Migrate legacy settings to new structure
 */
function migrateLegacySettings(legacy) {
  return {
    ...defaultSettings,
    theme: legacy.theme || 'blue',
    textSize: legacy.uiSize === 'large' ? 'large' : 'standard',
    animationLevel: legacy.animationLevel === 'medium' ? 'minimal' : 'off',
    visualIntensity: legacy.stimulationLevel === 'high' ? 1.2 :
                     legacy.stimulationLevel === 'medium' ? 1 : 0.7,
  };
}

/**
 * Apply settings to DOM via CSS classes and variables
 */
function applySettingsToDOM(settings) {
  const root = document.documentElement;
  const body = document.body;

  // Remove all existing setting classes
  body.className = body.className
    .split(' ')
    .filter(c => !c.startsWith('theme-') &&
                 !c.startsWith('text-size-') &&
                 !c.startsWith('animations-') &&
                 !c.startsWith('sensory-'))
    .join(' ');

  // Apply theme
  body.classList.add(`theme-${settings.theme}`);

  // Apply text size
  body.classList.add(`text-size-${settings.textSize}`);

  // Apply animation level
  body.classList.add(`animations-${settings.animationLevel}`);

  // Apply high contrast
  if (settings.highContrast) {
    body.classList.add('high-contrast');
  }

  // Apply dyslexia font
  if (settings.dyslexiaFont) {
    body.classList.add('dyslexia-mode');
  }

  // Apply focus mode
  if (settings.focusModeEnabled) {
    body.classList.add('focus-mode');
    body.classList.add(`focus-mode-${settings.focusModeLevel}`);
  }

  // Apply CSS variables for granular controls
  root.style.setProperty('--visual-intensity', settings.visualIntensity);
  root.style.setProperty('--color-saturation', settings.colorSaturation);
  root.style.setProperty('--shadow-intensity', settings.shadowIntensity);
  root.style.setProperty('--blur-amount', settings.blurEffects ? '4px' : '0px');

  // Line and letter spacing
  const lineHeightMap = {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  };
  root.style.setProperty('--leading-normal', lineHeightMap[settings.lineSpacing] || 1.5);

  const letterSpacingMap = {
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
  };
  root.style.setProperty('--tracking-normal', letterSpacingMap[settings.letterSpacing] || '0');
}

/* ═══════════════════════════════════════════════════════════════════
   Custom Hook for Easy Access
   ═══════════════════════════════════════════════════════════════════ */

export const useEnhancedSettings = () => {
  const context = React.useContext(EnhancedSettingsContext);

  if (!context) {
    throw new Error('useEnhancedSettings must be used within EnhancedSettingsProvider');
  }

  return context;
};

export default EnhancedSettingsContext;
