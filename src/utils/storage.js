/**
 * Recupera un valore dal localStorage
 * @param {string} key - La chiave da cercare
 * @return {string|null} - Il valore memorizzato o null se non esiste
 */
export const getFromStorage = (key) => {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return null;
  }
};

/**
 * Salva un valore nel localStorage
 * @param {string} key - La chiave da utilizzare
 * @param {string} value - Il valore da memorizzare
 * @return {boolean} - True se il salvataggio è riuscito, false altrimenti
 */
export const saveToStorage = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error('Error writing to localStorage:', error);
    return false;
  }
};

/**
 * Rimuove un valore dal localStorage
 * @param {string} key - La chiave da rimuovere
 * @return {boolean} - True se la rimozione è riuscita, false altrimenti
 */
export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Error removing from localStorage:', error);
    return false;
  }
};