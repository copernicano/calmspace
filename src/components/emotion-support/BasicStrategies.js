import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/emotion.css';

function BasicStrategies({ emotion, intensity, onBack }) {
  const navigate = useNavigate();
  
  // Strategie in base all'emozione e all'intensità
  const getStrategies = () => {
    // Determina quali strategie mostrare in base all'emozione e all'intensità
    const strategies = {
      felice: [
        { 
          title: 'Consapevolezza', 
          description: 'Nota consapevolmente tutte le sensazioni positive', 
          explanation: 'Prestare attenzione a come la felicità si manifesta nel tuo corpo aiuta a prolungare l\'esperienza positiva e a creare memoria emotiva.',
          icon: '👁️' 
        },
        { 
          title: 'Condivisione sociale', 
          description: 'Condividi questo stato positivo con persone di fiducia', 
          explanation: 'La condivisione di esperienze positive amplifica il benessere attraverso il rafforzamento dei legami sociali e il rilascio di ossitocina.',
          icon: '🗣️' 
        },
        { 
          title: 'Gratitudine', 
          description: 'Prendi nota di 3 aspetti specifici che ti rendono felice', 
          explanation: 'La pratica della gratitudine rafforza i circuiti neurali associati alle emozioni positive e aumenta il benessere generale.',
          icon: '🙏' 
        },
        { 
          title: 'Ancoraggio sensoriale', 
          description: 'Crea un\'associazione tra questa felicità e un gesto o respirazione', 
          explanation: 'Creare un "ancoraggio" ti permette di richiamare più facilmente questo stato emotivo positivo in futuro.',
          icon: '⚓' 
        }
      ],
      triste: [
        { 
          title: 'Respirazione diaframmatica', 
          description: 'Inspira per 4 secondi, espira per 6, concentrandoti sul diaframma', 
          explanation: 'La respirazione lenta e profonda attiva il sistema nervoso parasimpatico, riducendo lo stress e stabilizzando l\'umore.',
          icon: '🫁' 
        },
        { 
          title: 'Espressione emotiva', 
          description: 'Dai un nome preciso a ciò che senti e come si manifesta', 
          explanation: 'L\'etichettatura delle emozioni attiva la corteccia prefrontale e aiuta a regolare le regioni limbiche, riducendo l\'intensità emotiva.',
          icon: '🗣️' 
        },
        { 
          title: 'Spazio sensoriale', 
          description: 'Vai in un ambiente con stimoli sensoriali prevedibili e confortevoli', 
          explanation: 'Un ambiente controllato riduce il carico cognitivo e permette al sistema nervoso di recuperare equilibrio.',
          icon: '🧘' 
        },
        { 
          title: 'Routine strutturata', 
          description: 'Segui una sequenza familiare di attività che ti dà comfort', 
          explanation: 'Le routine prevedibili creano sicurezza e riducono l\'ansia, permettendo di elaborare le emozioni difficili.',
          icon: '📋' 
        }
      ],
      arrabbiato: [
        { 
          title: 'Respirazione 4-7-8', 
          description: 'Inspira per 4, trattieni per 7, espira per 8 secondi, ripeti 5 volte', 
          explanation: 'Questa tecnica di respirazione abbassa rapidamente la risposta di combattimento-fuga e riduce i livelli di cortisolo nel sangue.',
          icon: '🫁' 
        },
        { 
          title: 'Distanza temporanea', 
          description: 'Allontanati fisicamente per almeno 15 minuti dalla fonte di stress', 
          explanation: 'La separazione fisica interrompe il ciclo di escalation emotiva e dà tempo alla corteccia prefrontale di riprendere controllo.',
          icon: '🚶' 
        },
        { 
          title: 'Stimolazione sensoriale', 
          description: 'Usa una pressione profonda o una palla anti-stress per regolazione', 
          explanation: 'La pressione profonda rilascia serotonina e riduce l\'attivazione dell\'amigdala, calmando la risposta di rabbia.',
          icon: '✋' 
        },
        { 
          title: 'Ridirezionamento cognitivo', 
          description: 'Impegnati in un\'attività che richiede concentrazione mentale', 
          explanation: 'Concentrarsi su un\'attività cognitiva impegnativa sposta l\'attività cerebrale dalle aree emotive a quelle razionali.',
          icon: '🧩' 
        }
      ],
      preoccupato: [
        { 
          title: 'Grounding 5-4-3-2-1', 
          description: 'Nota 5 cose che vedi, 4 che tocchi, 3 che senti, 2 che odori, 1 che gusti', 
          explanation: 'Questa tecnica riporta l\'attenzione al momento presente, interrompendo il ciclo di pensieri ansiosi.',
          icon: '⚓' 
        },
        { 
          title: 'Esternalizzazione', 
          description: 'Scrivi tutte le preoccupazioni in forma concreta e specifica', 
          explanation: 'Scrivere le preoccupazioni le trasferisce dalla mente alla carta, riducendo il carico cognitivo e permettendo l\'analisi razionale.',
          icon: '✏️' 
        },
        { 
          title: 'Tempo dedicato alla preoccupazione', 
          description: 'Stabilisci 15 minuti al giorno dedicati esclusivamente alle preoccupazioni', 
          explanation: 'Limitare il tempo di preoccupazione aiuta a contenere l\'ansia e ad evitare che si diffonda in altri momenti della giornata.',
          icon: '⏱️' 
        },
        { 
          title: 'Supporto strutturato', 
          description: 'Chiedi supporto specifico a una persona di fiducia o a un professionista', 
          explanation: 'Il supporto sociale mirato riduce il carico emotivo e offre prospettive alternative ai pensieri ansiosi.',
          icon: '🤝' 
        }
      ],
      calmo: [
        { 
          title: 'Consolidamento', 
          description: 'Continua con attività che mantengono questo stato di equilibrio', 
          explanation: 'Sostenere lo stato di calma rafforza i circuiti neurali associati all\'equilibrio emotivo, rendendolo più accessibile in futuro.',
          icon: '👍' 
        },
        { 
          title: 'Scansione corporea', 
          description: 'Nota metodicamente le sensazioni fisiche della calma nel tuo corpo', 
          explanation: 'La consapevolezza delle sensazioni di calma migliora la propriocezione emotiva e crea memoria somatica positiva.',
          icon: '🧠' 
        },
        { 
          title: 'Diario dell\'equilibrio', 
          description: 'Registra cosa ha contribuito a questa calma per riferimento futuro', 
          explanation: 'Documentare i fattori che portano alla calma crea un repertorio personale di strategie efficaci basate sulla tua esperienza.',
          icon: '📝' 
        },
        { 
          title: 'Pratiche integrative', 
          description: 'Introduci una breve pratica di meditazione o yoga per approfondire la calma', 
          explanation: 'Le pratiche contemplative potenziano lo stato di calma esistente, creando un ciclo virtuoso di regolazione emotiva.',
          icon: '🧘' 
        }
      ],
      confuso: [
        { 
          title: 'Decompressione sensoriale', 
          description: 'Riduci gli stimoli esterni e crea uno spazio di quiete', 
          explanation: 'Ridurre gli input sensoriali diminuisce il carico cognitivo, permettendo al cervello di elaborare le informazioni più efficacemente.',
          icon: '⏸️' 
        },
        { 
          title: 'Segmentazione', 
          description: 'Suddividi l\'esperienza o il problema in singoli elementi gestibili', 
          explanation: 'Scomporre situazioni complesse in componenti più piccole riduce il sovraccarico cognitivo e permette l\'elaborazione sequenziale.',
          icon: '📋' 
        },
        { 
          title: 'Struttura visiva', 
          description: 'Utilizza diagrammi o liste per organizzare le informazioni visivamente', 
          explanation: 'Gli aiuti visivi riducono la necessità di tenere le informazioni nella memoria di lavoro, liberando risorse cognitive.',
          icon: '📊' 
        },
        { 
          title: 'Richiesta di chiarificazione', 
          description: 'Chiedi informazioni specifiche usando domande concrete e mirate', 
          explanation: 'Formulare richieste precise aiuta a ottenere le informazioni necessarie senza il sovraccarico di dettagli non pertinenti.',
          icon: '❓' 
        }
      ]
    };
    
    // Filtra in base all'intensità
    let filteredStrategies = strategies[emotion.name] || [];
    
    // Se l'intensità è alta (3), visualizza tutte le strategie
    // Se è media (2), visualizza le prime tre
    // Se è bassa (1), visualizza solo le prime due
    if (intensity < 3) {
      filteredStrategies = filteredStrategies.slice(0, intensity + 1);
    }
    
    return filteredStrategies;
  };
  
  // Naviga allo spazio calmo
  const goToCalmSpace = () => {
    navigate('/calmspace');
  };
  
  return (
    <div className="strategies-container" style={{ backgroundColor: `${emotion.color}30` }}>
      <button className="back-button" onClick={onBack} aria-label="Torna indietro">
        ← Indietro
      </button>
      
      <h1 className="strategies-title">
        Cosa posso fare quando mi sento <span style={{ color: emotion.color }}>{emotion.name}</span>
      </h1>
      
      <div className="emotion-display">
        <span className="emotion-emoji large">{emotion.emoji}</span>
      </div>
      
      <div className="strategies-list">
        {getStrategies().map((strategy, index) => (
          <div key={index} className="strategy-card">
            <div className="strategy-icon">{strategy.icon}</div>
            <div className="strategy-content">
              <h2 className="strategy-title">{strategy.title}</h2>
              <p className="strategy-description">{strategy.description}</p>
              {strategy.explanation && (
                <p className="strategy-explanation">
                  <strong>Perché funziona:</strong> {strategy.explanation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      
      <div className="action-buttons">
        <button 
          className="calmspace-button"
          onClick={goToCalmSpace}
          aria-label="Vai al tuo spazio"
          style={{ backgroundColor: emotion.color }}
        >
          Vai al tuo spazio
        </button>
        
        <button 
          className="home-button-alt"
          onClick={() => navigate('/')}
          aria-label="Torna alla home"
        >
          Torna alla home
        </button>
      </div>
    </div>
  );
}
export default BasicStrategies;