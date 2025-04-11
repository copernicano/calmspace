import React, { createContext, useState, useEffect } from 'react';
import { getFromStorage, saveToStorage } from '../utils/storage';

// Impostazioni predefinite
const defaultSettings = {
  theme: 'blue', // opzioni: blue, green, purple, orange
  animationLevel: 'low', // opzioni: low, medium
  uiSize: 'standard', // opzioni: standard, large
  stimulationLevel: 'low', // opzioni: low, medium, high
};

// Creazione del contesto
export const SettingsContext = createContext({
  settings: defaultSettings,
  updateSettings: () => {} // Funzione vuota come fallback
});

export const SettingsProvider = ({ children }) => {
  // Stato iniziale caricato dal localStorage o valori predefiniti
  const [settings, setSettings] = useState(() => {
    const savedSettings = getFromStorage('userSettings');
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  // Aggiorna il localStorage quando le impostazioni cambiano
  useEffect(() => {
    saveToStorage('userSettings', JSON.stringify(settings));
  }, [settings]);

  // Funzione per aggiornare le impostazioni
  const updateSettings = (newSettings) => {
    setSettings(prevSettings => ({
      ...prevSettings,
      ...newSettings
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};