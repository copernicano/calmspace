// src/components/chat/ChatBot.js
import React, { useState, useRef, useEffect } from 'react';
import { sendMessage, getFallbackResponse } from '../../utils/apiService';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import { getFromStorage } from '../../utils/storage';
import '../../styles/chatbot.css';

/**
 * Suggerimenti dinamici basati sull'emozione e intensità
 * Progettati per essere empatici e contestuali
 */
const getSuggestionsForEmotion = (emotion, intensity) => {
  // Intensità: 1 = leggera, 2 = moderata, 3 = intensa
  const isIntense = intensity === 3;
  const isModerate = intensity === 2;

  const emotionSuggestions = {
    triste: {
      light: [
        "Mi sento un po' giù oggi",
        "Vorrei parlare con qualcuno",
        "Come posso stare meglio?",
      ],
      moderate: [
        "Ho bisogno di sfogarmi",
        "Mi sento solo/a",
        "Puoi aiutarmi a capire cosa provo?",
      ],
      intense: [
        "Non ce la faccio più",
        "Ho bisogno di aiuto adesso",
        "Non so come uscirne",
        "Puoi restare con me?",
      ],
    },
    arrabbiato: {
      light: [
        "Qualcosa mi ha dato fastidio",
        "Come gestisco questa irritazione?",
        "Ho bisogno di calmarmi",
      ],
      moderate: [
        "Sono davvero frustrato/a",
        "Non so come gestire questa rabbia",
        "Aiutami a non esplodere",
      ],
      intense: [
        "Sono furioso/a",
        "Ho bisogno di calmarmi subito",
        "Non voglio fare qualcosa di cui mi pentirò",
        "Come mi sfogo senza fare danni?",
      ],
    },
    preoccupato: {
      light: [
        "Ho qualche pensiero che mi gira in testa",
        "Come smetto di rimuginare?",
        "Mi sento un po' in ansia",
      ],
      moderate: [
        "Non riesco a smettere di pensare",
        "L'ansia mi sta bloccando",
        "Ho paura che succeda qualcosa di brutto",
      ],
      intense: [
        "Sono nel panico",
        "Non riesco a respirare bene",
        "Ho bisogno di calmarmi adesso",
        "Il cuore mi batte fortissimo",
      ],
    },
    confuso: {
      light: [
        "Non capisco bene cosa sento",
        "Puoi aiutarmi a fare chiarezza?",
        "Mi sento un po' perso/a",
      ],
      moderate: [
        "Ho troppi pensieri in testa",
        "Non so da dove iniziare",
        "Mi sento sopraffatto/a",
      ],
      intense: [
        "Non capisco più niente",
        "Ho bisogno che qualcuno mi guidi",
        "Sono completamente bloccato/a",
        "Aiutami a mettere ordine",
      ],
    },
    felice: {
      light: [
        "Mi sento bene oggi!",
        "Voglio condividere qualcosa di positivo",
        "Come mantengo questo stato?",
      ],
      moderate: [
        "Sono davvero contento/a!",
        "È successo qualcosa di bello",
        "Voglio ricordare questo momento",
      ],
      intense: [
        "Sono al settimo cielo!",
        "Non potrei essere più felice",
        "Voglio celebrare questo momento",
        "Come posso diffondere questa gioia?",
      ],
    },
    calmo: {
      light: [
        "Mi sento tranquillo/a",
        "Voglio mantenere questa calma",
        "Cosa posso fare in questo momento?",
      ],
      moderate: [
        "Sono in pace con me stesso/a",
        "Come approfondisco questo stato?",
        "Voglio godermi questo momento",
      ],
      intense: [
        "Mi sento completamente sereno/a",
        "È un momento di grande pace",
        "Voglio preservare questa sensazione",
        "Grazie per essere qui",
      ],
    },
  };

  // Default per quando non c'è emozione selezionata
  const defaultSuggestions = [
    "Come mi sento oggi?",
    "Ho bisogno di parlare",
    "Portami nello Spazio Calmo",
    "Aiutami a rilassarmi",
  ];

  if (!emotion || !emotionSuggestions[emotion]) {
    return defaultSuggestions;
  }

  const emotionData = emotionSuggestions[emotion];
  if (isIntense) return emotionData.intense;
  if (isModerate) return emotionData.moderate;
  return emotionData.light;
};

/**
 * Messaggio di benvenuto contestuale e empatico
 */
const getWelcomeMessage = (emotion, intensity) => {
  if (!emotion) {
    return "Ciao. Sono qui per te, pronto ad ascoltarti. Come ti senti in questo momento?";
  }

  const isIntense = intensity === 3;
  const isModerate = intensity === 2;

  const emotionMessages = {
    triste: {
      light: "Ciao. Ho notato che ti senti un po' giù. Va bene sentirsi così qualche volta. Vuoi raccontarmi cosa c'è?",
      moderate: "Ciao. Vedo che la tristezza ti sta pesando. Sono qui per ascoltarti, senza giudizio. Cosa ti passa per la mente?",
      intense: "Ciao. Sento che stai attraversando un momento molto difficile. Non sei solo/a. Sono qui con te, prenditi tutto il tempo che ti serve. Cosa posso fare per te adesso?",
    },
    arrabbiato: {
      light: "Ciao. Capisco che qualcosa ti ha irritato. È normale provare fastidio. Vuoi dirmi cosa è successo?",
      moderate: "Ciao. La rabbia che senti è valida. Ogni emozione ha un motivo. Sono qui per aiutarti a gestirla. Cosa ti ha fatto arrabbiare?",
      intense: "Ciao. Sento che la rabbia è molto forte in questo momento. Prima di tutto, facciamo un respiro insieme. Sono qui per te. Quando ti senti pronto/a, dimmi cosa sta succedendo.",
    },
    preoccupato: {
      light: "Ciao. Un po' di preoccupazione è naturale. Parliamone insieme, spesso aiuta a vedere le cose più chiaramente. Cosa ti preoccupa?",
      moderate: "Ciao. L'ansia può essere davvero scomoda. Ricorda: i pensieri non sono fatti. Sono qui per aiutarti a trovare un po' di calma. Cosa ti sta agitando?",
      intense: "Ciao. So che l'ansia intensa fa paura. Ma sei al sicuro qui, in questo momento. Facciamo un respiro lento insieme: inspira... espira... Sono qui con te. Dimmi cosa senti.",
    },
    confuso: {
      light: "Ciao. A volte le emozioni sono un po' confuse, ed è normale. Proviamo a fare chiarezza insieme. Cosa ti sembra poco chiaro?",
      moderate: "Ciao. Quando ci sentiamo sopraffatti, è difficile vedere la strada. Sono qui per aiutarti a mettere ordine, un passo alla volta. Da dove vuoi iniziare?",
      intense: "Ciao. Capisco che ti senti perso/a in questo momento. Non devi capire tutto subito. Rallentiamo insieme. Dimmi una sola cosa che senti, la prima che ti viene in mente.",
    },
    felice: {
      light: "Ciao! Che bello sentirti di buon umore. La felicità merita di essere celebrata. Cosa ti rende felice oggi?",
      moderate: "Ciao! La tua gioia si percepisce. È meraviglioso avere momenti così. Vuoi raccontarmi cosa è successo di bello?",
      intense: "Ciao! Wow, sento tanta energia positiva! Questi momenti sono preziosi. Sono felice di condividere questo momento con te. Cosa ti ha portato così tanta gioia?",
    },
    calmo: {
      light: "Ciao. È bello sentirti tranquillo/a. La calma è un dono. C'è qualcosa che vorresti fare o di cui parlare?",
      moderate: "Ciao. La serenità che provi è preziosa. Questo è un buon momento per riflettere o semplicemente essere. Come posso esserti utile?",
      intense: "Ciao. Sento una pace profonda da parte tua. Questi momenti di completa serenità sono rari e belli. Godiamoci questo spazio insieme. C'è qualcosa che desideri?",
    },
  };

  const emotionData = emotionMessages[emotion];
  if (!emotionData) {
    return "Ciao. Sono qui per te. Come posso aiutarti oggi?";
  }

  if (isIntense) return emotionData.intense;
  if (isModerate) return emotionData.moderate;
  return emotionData.light;
};

function ChatBot({ onClose, emotion: emotionProp, intensity: intensityProp, currentPage }) {
  const { settings } = useEnhancedSettings();
  const [userMessage, setUserMessage] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Leggi emozione da localStorage se non passata come prop
  const [emotionState, setEmotionState] = useState({ emotion: emotionProp, intensity: intensityProp });

  useEffect(() => {
    // Sempre prova a leggere da localStorage per avere i dati più aggiornati
    const savedEmotion = getFromStorage('lastEmotion');
    if (savedEmotion) {
      try {
        const parsed = JSON.parse(savedEmotion);
        if (parsed.name) {
          // Usa emozione e intensità da localStorage
          setEmotionState({
            emotion: parsed.name,
            intensity: parsed.intensity || intensityProp || 2
          });
          return;
        }
      } catch (e) {
        console.error('Error parsing saved emotion:', e);
      }
    }
    // Fallback ai props se localStorage è vuoto
    if (emotionProp) {
      setEmotionState({ emotion: emotionProp, intensity: intensityProp || 2 });
    }
  }, [emotionProp, intensityProp]);

  const { emotion, intensity } = emotionState;

  // Inizializza la conversazione con messaggio di benvenuto contestuale
  useEffect(() => {
    const welcomeMessage = getWelcomeMessage(emotion, intensity);
    setConversation([{ role: 'assistant', content: welcomeMessage }]);
  }, [emotion, intensity]);

  // Scorrimento automatico alla fine dei messaggi
  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  // Focus automatico sull'input quando il componente si monta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!userMessage.trim()) return;

    // Aggiungi il messaggio dell'utente alla conversazione
    const newMessage = { role: 'user', content: userMessage };
    setConversation(prevConversation => [...prevConversation, newMessage]);

    // Resetta il campo di input
    const messageToSend = userMessage;
    setUserMessage('');

    // Mostra l'indicatore di caricamento
    setIsLoading(true);

    try {
      // Chiama l'API con contesto
      const response = await sendMessage(messageToSend, {
        settings,
        context: {
          emotion,
          intensity,
          currentPage,
        }
      });

      // Aggiungi la risposta del bot alla conversazione
      setConversation(prevConversation => [
        ...prevConversation,
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      // In caso di errore, mostra una risposta predefinita
      console.error("Errore durante l'invio del messaggio:", error);
      setConversation(prevConversation => [
        ...prevConversation,
        { role: 'assistant', content: getFallbackResponse() }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Suggerimenti dinamici basati sull'emozione e intensità
  const suggestions = getSuggestionsForEmotion(emotion, intensity);

  const handleSuggestionClick = (suggestion) => {
    setUserMessage(suggestion);
    inputRef.current?.focus();
  };

  // Classe del container basata sulle impostazioni
  const containerClass = `chatbot-container theme-${settings.theme} text-size-${settings.textSize}`;

  // Indicatore visivo dell'emozione corrente
  const emotionIndicator = emotion ? (
    <div className="emotion-indicator" style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderRadius: '12px',
      fontSize: '0.8rem',
    }}>
      <span>{getEmotionEmoji(emotion)}</span>
      <span style={{ textTransform: 'capitalize' }}>{emotion}</span>
      {intensity && (
        <span style={{ opacity: 0.8 }}>
          {'●'.repeat(intensity)}{'○'.repeat(3 - intensity)}
        </span>
      )}
    </div>
  ) : null;

  return (
    <div className={containerClass}>
      <div className="chatbot-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <h2 className="chatbot-title">Assistente</h2>
          {emotionIndicator}
        </div>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Chiudi"
        >
          ✕
        </button>
      </div>

      <div className="messages-container">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
          >
            <div className="message-content">
              {msg.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="message assistant-message">
            <div className="loading-indicator">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="suggestions-container">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            className="suggestion-button"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <form className="input-container" onSubmit={handleSendMessage}>
        <input
          type="text"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          placeholder="Scrivi come ti senti..."
          className="message-input"
          ref={inputRef}
          aria-label="Messaggio"
        />
        <button
          type="submit"
          className="send-button"
          disabled={isLoading || !userMessage.trim()}
          aria-label="Invia"
        >
          <span className="send-icon">➤</span>
        </button>
      </form>

      <div className="chatbot-footer">
        <p className="footer-text">
          Sono qui per supportarti, ma non sostituisco l'aiuto di un professionista.
        </p>
      </div>
    </div>
  );
}

/**
 * Helper per ottenere l'emoji dell'emozione
 */
function getEmotionEmoji(emotion) {
  const emojis = {
    felice: '😊',
    triste: '😢',
    arrabbiato: '😠',
    preoccupato: '😰',
    calmo: '😌',
    confuso: '😕',
  };
  return emojis[emotion] || '💭';
}

export default ChatBot;
