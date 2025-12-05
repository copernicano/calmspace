/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Strategies - Autism-Friendly with Progressive Disclosure
 * ═══════════════════════════════════════════════════════════════════
 *
 * CRITICAL improvements for cognitive load:
 * - Progressive disclosure (expand/collapse details)
 * - Chunking: title + 1-line action (always visible)
 * - "Why it works" hidden by default
 * - Prominent action buttons
 * - Visual hierarchy clear
 * - Simple language, NO scientific jargon
 * - Scannable layout
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/design-system.css';
import '../../styles/enhanced-emotion.css';

const EnhancedStrategies = ({ emotion, intensity, onBack }) => {
  const { settings } = useEnhancedSettings();
  const navigate = useNavigate();

  const [expandedStrategy, setExpandedStrategy] = useState(null);

  /* ═══════════════════════════════════════════════════════════════════
     Strategies Data - Simplified & Action-Oriented
     ═══════════════════════════════════════════════════════════════════ */

  const strategiesData = {
    felice: [
      {
        id: 'awareness',
        icon: '👁️',
        title: 'Fermati e assapora',
        action: 'Chiudi gli occhi per un momento. Nota dove senti la felicità nel corpo: calore nel petto? Leggerezza? Un sorriso spontaneo? Rimani con questa sensazione per almeno 30 secondi, respirando lentamente.',
        why: 'Il cervello tende a dimenticare velocemente le esperienze positive. Prestare attenzione consapevole prolunga la felicità e crea ricordi più forti. Questo processo si chiama "assaporare" ed è una delle chiavi del benessere.',
        actionButton: null,
      },
      {
        id: 'share',
        icon: '💬',
        title: 'Condividi la gioia',
        action: 'Racconta a qualcuno cosa ti rende felice in questo momento. Può essere di persona, con un messaggio o una chiamata. Descrivi i dettagli: cosa è successo, come ti senti, perché è importante per te.',
        why: 'Condividere le emozioni positive le amplifica e le rende più durature. Inoltre rafforza i legami con le persone a cui tieni. La gioia condivisa è gioia moltiplicata.',
        actionButton: null,
      },
      {
        id: 'gratitude',
        icon: '🙏',
        title: 'Pratica la gratitudine',
        action: 'Scrivi 3 cose specifiche per cui sei grato/a in questo momento. Non generiche come "la famiglia", ma precise: "Sono grato per la risata di stamattina con mia sorella" oppure "per il sole che entra dalla finestra".',
        why: 'La gratitudine specifica attiva i circuiti del piacere nel cervello più di quella generica. Praticarla regolarmente aumenta il benessere generale e aiuta a notare più cose positive nella vita quotidiana.',
        actionButton: null,
      },
      {
        id: 'anchor',
        icon: '⚓',
        title: 'Crea un ricordo',
        action: 'Mentre ti senti felice, fai un gesto che puoi ripetere (es. toccarti il polso, stringere un pugno). Associa quel gesto a questa sensazione. In futuro, ripetere il gesto può aiutarti a richiamare questa emozione.',
        why: 'Questa tecnica di "ancoraggio" crea un\'associazione tra un gesto fisico e uno stato emotivo. Con la pratica, il gesto può evocare la sensazione di felicità anche in momenti difficili.',
        actionButton: null,
      },
    ],
    triste: [
      {
        id: 'breathing',
        icon: '🫁',
        title: 'Respira con calma',
        action: 'Siediti o sdraiati in posizione comoda. Inspira lentamente contando fino a 4, poi espira contando fino a 6. L\'espirazione più lunga attiva il sistema di calma. Ripeti per almeno 2 minuti.',
        why: 'Quando siamo tristi, il respiro diventa superficiale. La respirazione lenta e profonda attiva il nervo vago, che calma il sistema nervoso e aiuta a stabilizzare l\'umore. È come un "reset" per il corpo.',
        actionButton: { label: 'Guida respirazione', path: '/calmspace?mode=breathing' },
      },
      {
        id: 'express',
        icon: '💭',
        title: 'Accogli la tristezza',
        action: 'La tristezza è un\'emozione normale e necessaria. Invece di combatterla, prova a descriverla: "Mi sento triste perché..." Nota dove la senti nel corpo (petto pesante? nodo alla gola?). Piangi se ne senti il bisogno.',
        why: 'Reprimere le emozioni le rende più intense. Accogliere la tristezza e darle un nome attiva la corteccia prefrontale, che aiuta a regolare le emozioni. Piangere rilascia sostanze chimiche che riducono lo stress.',
        actionButton: null,
      },
      {
        id: 'safe-space',
        icon: '🛋️',
        title: 'Trova comfort',
        action: 'Vai in un posto dove ti senti al sicuro. Avvolgiti in una coperta, abbraccia un cuscino, metti una musica che ti piace. Concediti di stare lì senza dover fare nulla. Non c\'è fretta di "stare meglio".',
        why: 'L\'ambiente influenza profondamente come ci sentiamo. Un luogo sicuro e confortevole abbassa i livelli di cortisolo (ormone dello stress) e permette al corpo di recuperare. Il contatto con oggetti morbidi attiva il sistema di sicurezza.',
        actionButton: null,
      },
      {
        id: 'gentle-movement',
        icon: '🚶',
        title: 'Movimento gentile',
        action: 'Non devi fare sport intenso. Una breve passeggiata, anche solo in casa, o qualche stretching leggero può aiutare. Il movimento sposta l\'energia e cambia la prospettiva, anche solo per qualche minuto.',
        why: 'Il movimento rilascia endorfine, sostanze che migliorano naturalmente l\'umore. Non serve un allenamento: anche 5 minuti di camminata leggera possono fare la differenza quando ci si sente giù.',
        actionButton: null,
      },
    ],
    arrabbiato: [
      {
        id: 'breathing-478',
        icon: '🫁',
        title: 'Tecnica 4-7-8',
        action: 'Inspira dal naso contando fino a 4. Trattieni il respiro contando fino a 7. Espira dalla bocca contando fino a 8, facendo un suono "whoosh". Ripeti il ciclo 4-5 volte. Se ti gira la testa, fermati e respira normalmente.',
        why: 'Questa tecnica è un "tranquillante naturale" per il sistema nervoso. L\'espirazione prolungata attiva il sistema parasimpatico, che calma la risposta di "lotta o fuga" tipica della rabbia. Funziona in pochi minuti.',
        actionButton: { label: 'Guida respirazione', path: '/calmspace?mode=breathing' },
      },
      {
        id: 'distance',
        icon: '🚶',
        title: 'Prenditi una pausa',
        action: 'Allontanati dalla situazione che ti ha fatto arrabbiare. Di\': "Ho bisogno di una pausa" e vai in un\'altra stanza o fai una passeggiata. Non tornare finché non ti senti più calmo/a. Servono almeno 20 minuti perché il corpo si calmi.',
        why: 'Quando siamo arrabbiati, il corpo rilascia adrenalina che impiega 20-30 minuti a smaltirsi. Restare nella situazione rischia di far dire o fare cose di cui poi ci pentiamo. La distanza fisica crea distanza emotiva.',
        actionButton: null,
      },
      {
        id: 'physical-release',
        icon: '💪',
        title: 'Scarica l\'energia',
        action: 'La rabbia è energia nel corpo che cerca di uscire. Trova un modo sicuro per scaricarla: stringi forte un cuscino, fai delle flessioni, cammina velocemente, o batti i piedi. L\'importante è non fare male a te o agli altri.',
        why: 'La rabbia attiva il corpo per l\'azione. Se non scarichi questa energia fisica, resta intrappolata e può esplodere. L\'attività fisica intensa brucia l\'adrenalina e aiuta il corpo a tornare in equilibrio.',
        actionButton: null,
      },
      {
        id: 'cold-water',
        icon: '🧊',
        title: 'Acqua fredda',
        action: 'Bagnati il viso con acqua fredda, o tieni in mano cubetti di ghiaccio, o metti un panno freddo sul collo. La sensazione intensa del freddo interrompe il ciclo della rabbia e riporta l\'attenzione al presente.',
        why: 'Il freddo attiva il "riflesso di immersione" che rallenta il battito cardiaco e calma il sistema nervoso. È una tecnica rapida e molto efficace quando la rabbia è intensa e hai bisogno di calmarti velocemente.',
        actionButton: null,
      },
    ],
    preoccupato: [
      {
        id: 'grounding',
        icon: '⚓',
        title: 'Tecnica 5-4-3-2-1',
        action: 'Torna al presente usando i tuoi sensi: guarda 5 oggetti intorno a te e nominali, tocca 4 superfici diverse, ascolta 3 suoni nell\'ambiente, annusa 2 odori, assapora 1 gusto (anche solo la saliva)',
        why: 'Questa tecnica interrompe il ciclo dei pensieri ansiosi riportando l\'attenzione al corpo e all\'ambiente circostante. Funziona perché il cervello non può concentrarsi contemporaneamente sui sensi e sui pensieri preoccupanti.',
        actionButton: null,
      },
      {
        id: 'write',
        icon: '✏️',
        title: 'Scrivi le preoccupazioni',
        action: 'Prendi carta e penna e scrivi tutto ciò che ti preoccupa, senza censurarti. Poi leggi la lista e chiediti: "Posso fare qualcosa per questo?" Se sì, scrivi un\'azione concreta. Se no, lasciala andare.',
        why: 'Scrivere trasferisce i pensieri dalla mente al foglio, liberando spazio mentale. Vedere le preoccupazioni scritte le rende più gestibili e meno spaventose. Dividere tra "controllabile" e "non controllabile" aiuta a focalizzare l\'energia.',
        actionButton: null,
      },
      {
        id: 'reality-check',
        icon: '🔍',
        title: 'Verifica della realtà',
        action: 'Fermati e chiediti: "Qual è la probabilità reale che questo accada?" Poi pensa: "Se accadesse, come potrei gestirlo?" Infine: "Cosa direi a un amico con questa preoccupazione?"',
        why: 'L\'ansia spesso ingigantisce i rischi. Questa tecnica ti aiuta a valutare le situazioni in modo più realistico e a scoprire che hai più risorse di quanto pensi per affrontare le difficoltà.',
        actionButton: null,
      },
      {
        id: 'support',
        icon: '🤝',
        title: 'Parla con qualcuno',
        action: 'Contatta una persona di fiducia e condividi ciò che ti preoccupa. Non devi chiedere soluzioni, a volte basta essere ascoltati. Se le preoccupazioni persistono, considera di parlare con un professionista.',
        why: 'Esprimere le preoccupazioni ad alta voce le rende più concrete e gestibili. Il supporto sociale attiva il sistema di sicurezza del cervello e riduce la risposta allo stress. Non sei solo/a.',
        actionButton: null,
      },
    ],
    calmo: [
      {
        id: 'savor',
        icon: '✨',
        title: 'Goditi questo momento',
        action: 'Fermati e apprezza consapevolmente questa sensazione di calma. Nota come si sente il corpo quando è rilassato: spalle abbassate, respiro lento, muscoli morbidi. Rimani in questo stato per qualche minuto senza fare nulla.',
        why: 'La calma è preziosa e spesso la diamo per scontata. Prestare attenzione a come ci si sente quando stiamo bene aiuta il cervello a riconoscere e cercare più spesso questo stato. È un investimento nel tuo benessere futuro.',
        actionButton: null,
      },
      {
        id: 'body-scan',
        icon: '🧘',
        title: 'Scansione del corpo',
        action: 'Chiudi gli occhi e porta l\'attenzione ai piedi. Sali lentamente: caviglie, polpacci, ginocchia, cosce, bacino, pancia, petto, spalle, braccia, mani, collo, viso. Nota le sensazioni in ogni zona senza giudicare.',
        why: 'La scansione corporea aumenta la connessione mente-corpo e aiuta a riconoscere i segnali fisici delle emozioni. Quando sei calmo/a è il momento ideale per imparare come si sente il corpo in equilibrio.',
        actionButton: { label: 'Meditazione guidata', path: '/calmspace' },
      },
      {
        id: 'journal',
        icon: '📝',
        title: 'Annota cosa funziona',
        action: 'Scrivi cosa ha contribuito a questa calma: cosa hai fatto oggi? Con chi sei stato/a? Cosa hai mangiato? Come hai dormito? Queste informazioni sono preziose per capire cosa ti fa stare bene.',
        why: 'Spesso non sappiamo cosa ci aiuta a stare bene perché non ci facciamo caso. Documentare i momenti di calma crea una "mappa" personale che puoi consultare nei momenti difficili.',
        actionButton: null,
      },
      {
        id: 'share-calm',
        icon: '💚',
        title: 'Diffondi la calma',
        action: 'Quando sei in uno stato di calma, puoi essere una presenza positiva per gli altri. Contatta qualcuno a cui tieni, anche solo per dire "penso a te". La tua energia tranquilla può fare la differenza per qualcun altro.',
        why: 'Condividere stati positivi rafforza le relazioni e amplifica il benessere. Inoltre, sapere di poter essere d\'aiuto aumenta il senso di scopo e la soddisfazione personale.',
        actionButton: null,
      },
    ],
    confuso: [
      {
        id: 'reduce-stimuli',
        icon: '⏸️',
        title: 'Riduci il rumore',
        action: 'Vai in un posto tranquillo. Spegni TV, musica, notifiche. Se possibile abbassa le luci. Siediti in silenzio per qualche minuto. Il cervello ha bisogno di spazio per elaborare quando è sovraccarico.',
        why: 'La confusione spesso nasce da troppi stimoli contemporanei. Ridurre gli input esterni libera risorse mentali per pensare più chiaramente. È come svuotare la RAM di un computer per farlo funzionare meglio.',
        actionButton: null,
      },
      {
        id: 'one-thing',
        icon: '🎯',
        title: 'Una cosa alla volta',
        action: 'Invece di cercare di capire tutto insieme, scegli UNA sola cosa su cui concentrarti. Chiediti: "Qual è la cosa più importante da capire in questo momento?" Ignora temporaneamente tutto il resto.',
        why: 'Il cervello umano non è fatto per il multitasking. Quando ci concentriamo su una cosa alla volta, la qualità del pensiero migliora drasticamente. Le altre cose possono aspettare.',
        actionButton: null,
      },
      {
        id: 'write-it-down',
        icon: '📝',
        title: 'Scrivi tutto',
        action: 'Prendi carta e penna e scrivi tutto ciò che hai in testa, senza ordine. Poi leggi quello che hai scritto e prova a organizzarlo: cosa è collegato? Cosa è importante? Cosa può aspettare?',
        why: 'Scrivere trasferisce i pensieri dalla mente al foglio, liberando spazio mentale. Vedere le cose scritte le rende più concrete e più facili da organizzare. Il caos interno diventa ordine esterno.',
        actionButton: null,
      },
      {
        id: 'ask-help',
        icon: '🤝',
        title: 'Chiedi aiuto',
        action: 'Non devi capire tutto da solo/a. Trova qualcuno di cui ti fidi e spiega la situazione. A volte basta raccontare ad alta voce per fare chiarezza. Oppure chiedi: "Tu come la vedi?"',
        why: 'Un punto di vista esterno può illuminare aspetti che non vediamo. Inoltre, spiegare una situazione a qualcun altro ci costringe a organizzare i pensieri. Chiedere aiuto non è debolezza, è intelligenza.',
        actionButton: null,
      },
    ],
  };

  const strategies = strategiesData[emotion.name] || [];

  // Filter based on intensity and settings
  const getDisplayedStrategies = () => {
    let filtered = [...strategies];

    // Filter by intensity
    if (intensity === 1) {
      filtered = filtered.slice(0, 2); // Show 2 for low intensity
    } else if (intensity === 2) {
      filtered = filtered.slice(0, 3); // Show 3 for medium
    }
    // intensity === 3 shows all 4

    // Further reduce if settings.informationDensity is low
    if (settings.informationDensity === 'low') {
      filtered = filtered.slice(0, Math.min(2, filtered.length));
    }

    return filtered;
  };

  const displayedStrategies = getDisplayedStrategies();

  /* ═══════════════════════════════════════════════════════════════════
     Handlers
     ═══════════════════════════════════════════════════════════════════ */

  const toggleExpand = (strategyId) => {
    setExpandedStrategy(expandedStrategy === strategyId ? null : strategyId);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="strategies-step">
      {/* Back Button */}
      <button className="btn btn-ghost back-button-top" onClick={onBack} aria-label="Torna indietro">
        ← Indietro
      </button>

      {/* Header */}
      <header className="step-header">
        <div className="emotion-badge" style={{ backgroundColor: emotion.color }}>
          <span className="emotion-emoji-small">{emotion.emoji}</span>
          <span className="emotion-name-small">{emotion.name}</span>
        </div>

        <h1 className="step-title">Cosa posso fare</h1>
        <p className="step-description">
          {displayedStrategies.length} strategie per gestire questa emozione
        </p>
      </header>

      {/* Strategies List */}
      <div className="strategies-list">
        {displayedStrategies.map((strategy, index) => {
          const isExpanded = expandedStrategy === strategy.id;

          return (
            <div
              key={strategy.id}
              className={`strategy-card-enhanced ${isExpanded ? 'expanded' : ''}`}
            >
              {/* Always Visible: Icon + Title + Action */}
              <div className="strategy-header">
                <div className="strategy-icon-large" aria-hidden="true">
                  {strategy.icon}
                </div>

                <div className="strategy-main-content">
                  <h3 className="strategy-title-enhanced">{strategy.title}</h3>
                  <p className="strategy-action-text">{strategy.action}</p>
                </div>

                {/* Expand Toggle */}
                <button
                  className="expand-button"
                  onClick={() => toggleExpand(strategy.id)}
                  aria-label={isExpanded ? 'Nascondi dettagli' : 'Mostra dettagli'}
                  aria-expanded={isExpanded}
                >
                  {isExpanded ? '▲' : '▼'}
                </button>
              </div>

              {/* Expandable: "Why it works" */}
              {isExpanded && (
                <div className="strategy-details">
                  <div className="why-section">
                    <strong className="why-label">Perché funziona:</strong>
                    <p className="why-text">{strategy.why}</p>
                  </div>
                </div>
              )}

              {/* Action Button (if available) */}
              {strategy.actionButton && (
                <button
                  className="strategy-action-button btn btn-sm"
                  onClick={() => navigate(strategy.actionButton.path)}
                  style={{ borderColor: emotion.color, color: emotion.color }}
                >
                  {strategy.actionButton.label} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Bottom Actions */}
      <div className="strategies-bottom-actions">
        <button
          className="btn btn-lg btn-block"
          onClick={() => navigate('/calmspace')}
          style={{
            backgroundColor: emotion.color,
            borderColor: emotion.color,
          }}
        >
          Vai al tuo spazio calmo
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => navigate('/')}
        >
          Torna alla home
        </button>
      </div>

      {/* Helper Text */}
      {settings.keyboardNavigationHelp && (
        <div className="keyboard-help">
          <p className="help-text-small">
            Premi <kbd>Spazio</kbd> o <kbd>Enter</kbd> per espandere le strategie
          </p>
        </div>
      )}
    </div>
  );
};

export default EnhancedStrategies;
