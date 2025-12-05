// src/utils/apiService.js
/**
 * Servizio per gestire le chiamate API a OpenRouter
 * Supporta chiave personalizzata e system prompt contestuale
 */

const DEFAULT_API_KEY = process.env.REACT_APP_OPENROUTER_API_KEY;
const SITE_URL = process.env.REACT_APP_SITE_URL || "https://calmspace.app";
const SITE_NAME = process.env.REACT_APP_SITE_NAME || "CalmSpace";

/**
 * Ottiene la chiave API da usare (personalizzata o default)
 * @param {Object} settings - Le impostazioni dell'app
 * @returns {string} - La chiave API
 */
const getApiKey = (settings) => {
  if (settings?.aiAssistant?.useCustomKey && settings.aiAssistant.customApiKey) {
    return settings.aiAssistant.customApiKey;
  }
  return DEFAULT_API_KEY;
};

/**
 * Ottiene il modello da usare (dalle settings o default)
 * @param {Object} settings - Le impostazioni dell'app
 * @returns {string} - L'ID del modello
 */
const getModel = (settings) => {
  const model = settings?.aiAssistant?.model;

  // Se è "custom", usa il modello personalizzato
  if (model === 'custom' && settings?.aiAssistant?.customModel) {
    return settings.aiAssistant.customModel;
  }

  // Se c'è un modello selezionato, usalo
  if (model && model !== 'custom') {
    return model;
  }

  // Default
  return 'google/gemma-2-9b-it:free';
};

/**
 * Genera il system prompt dinamico con contesto dell'app
 * @param {Object} context - Contesto attuale (emozione, pagina, ecc.)
 * @returns {string} - System prompt completo
 */
const buildSystemPrompt = (context = {}) => {
  const { emotion, intensity, currentPage } = context;

  // Mappa emozioni a nomi leggibili
  const emotionNames = {
    felice: 'felice',
    triste: 'triste',
    arrabbiato: 'arrabbiato/a',
    preoccupato: 'preoccupato/a',
    calmo: 'calmo/a',
    confuso: 'confuso/a',
  };

  // Mappa intensità a descrizioni
  const intensityLabels = {
    1: 'leggera',
    2: 'moderata',
    3: 'intensa',
  };

  // Mappa pagine a nomi leggibili
  const pageNames = {
    '/': 'Home',
    '/emotion': 'Selezione emozioni',
    '/intensity': 'Intensità emozione',
    '/strategies': 'Strategie di coping',
    '/calmspace': 'Il Mio Spazio (relax)',
    '/timer': 'Timer visuale',
    '/routines': 'Routine',
    '/settings': 'Impostazioni',
  };

  // Costruisci sezione contesto
  let contextSection = '';
  if (emotion || currentPage) {
    contextSection = `
CONTESTO ATTUALE DELL'UTENTE:`;

    if (emotion) {
      const emotionName = emotionNames[emotion] || emotion;
      const intensityLabel = intensityLabels[intensity] || '';
      contextSection += `
- L'utente ha indicato di sentirsi: ${emotionName}${intensityLabel ? ` (intensità ${intensityLabel})` : ''}`;
    }

    if (currentPage) {
      const pageName = pageNames[currentPage] || currentPage;
      contextSection += `
- Si trova nella sezione: ${pageName}`;
    }

    contextSection += `
Tieni conto di questo contesto nelle tue risposte. Se l'utente si sente in un certo modo, riconosci la sua emozione e offri supporto appropriato.
`;
  }

  return `Sei l'assistente di CalmSpace, un'app per il benessere emotivo progettata specificamente per persone neurodivergenti (autismo, ADHD, ecc.).

FUNZIONALITÀ DELL'APP che puoi suggerire quando appropriato:
- "Il Mio Spazio": ambiente rilassante con animazioni calmanti (onde del mare, cielo stellato, bolle, pattern geometrici). Perfetto per decomprimere e calmarsi.
- "Respirazione guidata": esercizi di respirazione come 4-7-8 (inspira 4 sec, trattieni 7, espira 8) e box breathing. Ottimi per ansia e stress.
- "Emozioni": aiuta a identificare e dare nome a ciò che si prova. Utile quando non si capisce cosa si sente.
- "Strategie": tecniche concrete per gestire ogni emozione (grounding 5-4-3-2-1, scrittura, movimento, ecc.)
- "Timer visuale": timer con rappresentazione visiva del tempo che passa. Utile per transizioni e routine.
${contextSection}
LINEE GUIDA PER LE TUE RISPOSTE:

1. LINGUAGGIO: Usa frasi chiare, dirette e letterali. Evita metafore, sarcasmo, ironia o espressioni ambigue.

2. BREVITÀ: Rispondi con massimo 3-4 frasi per messaggio. Usa paragrafi corti. Vai dritto al punto.

3. CONCRETEZZA: Quando suggerisci qualcosa, sii specifico. Non dire "fai un esercizio di respirazione", di' "prova a inspirare contando fino a 4, poi espira contando fino a 6".

4. VALIDAZIONE: Riconosci sempre l'emozione dell'utente prima di offrire suggerimenti. Es: "Capisco che ti senti sopraffatto/a. È una sensazione difficile."

5. SCELTE LIMITATE: Quando fai domande, offri 2-3 opzioni specifiche invece di domande aperte. Es: "Preferisci provare un esercizio di respirazione o andare nello spazio calmo?"

6. TONO: Sii calmo, rassicurante e rispettoso. Mai infantilizzante o condiscendente.

7. LIMITI: Non sei un professionista sanitario. Non dare diagnosi o consigli medici. Se qualcuno sembra in crisi seria, suggerisci di contattare un adulto di fiducia o un professionista.

8. INTEGRAZIONE APP: Quando appropriato, guida l'utente verso le funzionalità dell'app che possono aiutarlo. Es: "Se vuoi, posso accompagnarti nello Spazio Calmo dove ci sono animazioni rilassanti."

Ricorda: le persone neurodivergenti possono essere sensibili a sovraccarico sensoriale, cambiamenti improvvisi, e linguaggio ambiguo. Mantieni sempre un approccio prevedibile, chiaro e gentile.`;
};

/**
 * Invia un messaggio all'API di OpenRouter e riceve una risposta
 * @param {string} userMessage - Il messaggio dell'utente
 * @param {Object} options - Opzioni aggiuntive
 * @param {Object} options.settings - Impostazioni dell'app (per API key)
 * @param {Object} options.context - Contesto attuale (emozione, pagina)
 * @returns {Promise<string>} - La risposta del modello
 */
export const sendMessage = async (userMessage, options = {}) => {
  const { settings, context } = options;
  const apiKey = getApiKey(settings);
  const model = getModel(settings);
  const systemPrompt = buildSystemPrompt(context);

  if (!apiKey) {
    throw new Error('API key non configurata');
  }

  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": model,
        "messages": [
          {
            "role": "system",
            "content": systemPrompt
          },
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": userMessage
              }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || `Errore ${response.status}`;

      // Gestisci errori specifici di chiave invalida
      if (response.status === 401 || response.status === 403) {
        throw new Error('API key non valida. Controlla la chiave nelle impostazioni.');
      }

      throw new Error(`Errore API: ${errorMessage}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Errore nell'invio del messaggio:", error);
    throw error;
  }
};

/**
 * Risposte predefinite in caso di errore API
 * @returns {string} - Una risposta di fallback casuale
 */
export const getFallbackResponse = () => {
  const fallbackResponses = [
    "Mi dispiace, ho un problema di connessione. Puoi riprovare tra qualche momento?",
    "Non riesco a rispondere ora. Nel frattempo, che ne dici di provare lo Spazio Calmo o un esercizio di respirazione?",
    "Ho qualche difficoltà tecnica. Se vuoi, puoi esplorare le strategie per le emozioni mentre aspetti.",
    "La connessione non funziona bene. Posso suggerirti di provare la sezione 'Il Mio Spazio' per rilassarti nel frattempo?"
  ];

  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};

/**
 * Testa la connessione API con la chiave fornita
 * @param {string} apiKey - Chiave API da testare
 * @returns {Promise<boolean>} - true se la chiave è valida
 */
export const testApiKey = async (apiKey) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/auth/key", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      }
    });
    return response.ok;
  } catch {
    return false;
  }
};
