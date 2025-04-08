// src/utils/apiService.js
/**
 * Servizio per gestire le chiamate API a OpenRouter
 */

// Questo andrebbe idealmente in un file .env o gestito lato server
// Per sviluppo, puoi inserirlo qui ma non committare questo file con la chiave
const OPENROUTER_API_KEY = "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";
const SITE_URL = "https://calmspace.app"; // Modifica con il tuo URL effettivo
const SITE_NAME = "CalmSpace";

/**
 * System prompt specializzato per interagire con utenti autistici
 * Fornisce linee guida al modello di linguaggio
 */
const SYSTEM_PROMPT = `
Sei un assistente di supporto emotivo specializzato nell'aiutare persone con disturbo dello spettro autistico.
Seguire queste linee guida nelle tue interazioni:

1. Usa un linguaggio chiaro, diretto e letterale. Evita metafore, sarcasmo o espressioni ambigue.
2. Rispondi con frasi brevi e concise. Usa paragrafi corti.
3. Sii paziente, rispettoso e non giudicante, indipendentemente da ciò che viene condiviso.
4. Focalizzati su strategie concrete di autoregolazione ed espressione emotiva.
5. Quando suggerisci tecniche di respirazione o calma, sii molto specifico e dettagliato.
6. Se qualcuno sembra in crisi, suggerisci gentilmente di utilizzare le funzioni di CalmSpace come lo spazio calma o le guide di respirazione.
7. Non fingere di essere un operatore sanitario o fornire diagnosi o consigli medici.
8. Usa un tono rassicurante ma non infantilizzante.
9. Limita le opzioni quando fai domande (meglio 2-3 scelte specifiche che domande aperte).
10. Rispondi con un massimo di 3-4 frasi per messaggio.

Ricorda che le persone possono essere sensibili a certe parole o toni, quindi mantieni un approccio calmo, positivo e concreto.
`;

/**
 * Invia un messaggio all'API di OpenRouter e riceve una risposta
 * @param {string} userMessage - Il messaggio dell'utente
 * @returns {Promise<string>} - La risposta del modello
 */
export const sendMessage = async (userMessage) => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "HTTP-Referer": SITE_URL,
        "X-Title": SITE_NAME,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        "model": "qwen/qwen2.5-vl-3b-instruct:free",
        "messages": [
          {
            "role": "system",
            "content": SYSTEM_PROMPT
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
      const errorData = await response.json();
      throw new Error(`Errore API: ${errorData.error?.message || 'Errore sconosciuto'}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Errore nell'invio del messaggio:", error);
    throw error;
  }
};

// Risposte predefinite in caso di errore API
export const getFallbackResponse = () => {
  const fallbackResponses = [
    "Mi dispiace, ho un problema di connessione. Puoi riprovare tra qualche momento?",
    "Non riesco a rispondere ora. Forse potresti provare con le altre funzioni di CalmSpace nel frattempo?",
    "Ho qualche difficoltà a ricevere la tua richiesta. Che ne dici di provare uno degli esercizi di respirazione?"
  ];
  
  return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
};