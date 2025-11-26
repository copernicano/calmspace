# 🎨 CalmSpace Autism-Friendly Redesign - Integration Guide

## 📋 Overview

Questo documento descrive i nuovi componenti creati per il redesign autism-friendly di CalmSpace e come integrarli nell'app esistente.

---

## ✅ Componenti Completati

### **FASE 1: Design System & Accessibilità**

#### 1.1 Design System (`src/styles/design-system.css`)
Sistema di design completo con:
- **Palette colori calme** con modalità high-contrast
- **Typography dyslexia-friendly** (Atkinson Hyperlegible, Outfit, OpenDyslexic)
- **Spacing system prevedibile** (8px base unit)
- **Animation system opt-in** (default OFF)
- **Sensory control variables** (intensità visiva, saturazione, blur)
- **Component foundations** (buttons, cards, inputs)
- **Focus indicators WCAG AAA**

**File creati:**
- `src/styles/design-system.css`
- `src/styles/fonts.css`

**Come usare:**
```jsx
// Importa nel tuo index.js o App.js
import './styles/fonts.css';
import './styles/design-system.css';
```

---

#### 1.2 Enhanced Settings System

**File creati:**
- `src/contexts/EnhancedSettingsContext.js` - Context con 30+ settings granulari
- `src/components/core/EnhancedSettings.js` - UI settings categorizzata
- `src/styles/enhanced-settings.css` - Stili component

**Features:**
- **6 categorie** di settings: Appearance, Typography, Sensory, Cognitive, Time, Accessibility
- **4 preset profiles**: Low Sensory, High Focus, Energy Conserving, Balanced
- **Controlli granulari**: animazioni, intensità visiva, suoni, vibrazioni, densità info
- **Time awareness**: timer sessioni, break reminders, session limits
- **Dyslexia mode** con font e spaziatura dedicati
- **Export/Import** delle impostazioni

**Come integrare:**

1. **Sostituisci il Provider nel tuo App.js:**

```jsx
// PRIMA (vecchio)
import { SettingsProvider } from './contexts/SettingsContext';

// DOPO (nuovo)
import { EnhancedSettingsProvider } from './contexts/EnhancedSettingsContext';

function App() {
  return (
    <EnhancedSettingsProvider>
      {/* Your app */}
    </EnhancedSettingsProvider>
  );
}
```

2. **Usa il nuovo hook nei componenti:**

```jsx
// PRIMA (vecchio)
import { useContext } from 'react';
import { SettingsContext } from './contexts/SettingsContext';

const { settings, updateSettings } = useContext(SettingsContext);

// DOPO (nuovo)
import { useEnhancedSettings } from './contexts/EnhancedSettingsContext';

const { settings, updateSettings, applyPreset } = useEnhancedSettings();
```

3. **Aggiorna la route per Settings:**

```jsx
// In App.js routes
import EnhancedSettings from './components/core/EnhancedSettings';

<Route path="/settings" element={<EnhancedSettings />} />
```

**Migrazione automatica:** Il nuovo context migra automaticamente le vecchie impostazioni al primo avvio.

---

### **FASE 2: Navigazione & Struttura**

#### 2.1 Enhanced Home Page

**File creati:**
- `src/components/core/home/EnhancedHomePage.js`
- `src/styles/enhanced-home.css`

**Features:**
- **Time-based greeting** (Buongiorno/Buonasera)
- **Visual priority system** - evidenzia ultima attività usata
- **Quick actions** per attività preferite (con stelle)
- **Session timer** integrato (se abilitato)
- **Onboarding modal** per primi utenti (dismissibile)
- **Keyboard navigation help**
- **Favorite system** con localStorage

**Come integrare:**

```jsx
// In App.js routes
import EnhancedHomePage from './components/core/home/EnhancedHomePage';

<Route path="/" element={<EnhancedHomePage />} />
```

**Nota:** Usa `useEnhancedSettings` invece di vecchio `SettingsContext`

---

#### 2.2 Bottom Navigation (sostituisce draggable button)

**File creati:**
- `src/components/core/BottomNavigation.js`
- `src/styles/bottom-navigation.css`

**Features:**
- **Fixed position** (sempre bottom, mai si muove)
- **5 navigation items**: Home, Emozioni, Spazio, Timer, Settings
- **Active indicator** chiaro
- **Large touch targets** (64px min height)
- **Focus mode aware** (si nasconde in maximal focus)
- **Safe area support** per mobile con notch

**Come integrare:**

1. **Aggiungi nel tuo App.js layout:**

```jsx
import BottomNavigation from './components/core/BottomNavigation';

function App() {
  return (
    <EnhancedSettingsProvider>
      <Router>
        {/* Your routes */}
        <Routes>
          {/* ... */}
        </Routes>

        {/* Add navigation - shows on all pages */}
        <BottomNavigation />
      </Router>
    </EnhancedSettingsProvider>
  );
}
```

2. **Rimuovi il vecchio Navigation.js draggable button:**

```jsx
// RIMUOVI queste linee dal tuo App.js
import Navigation from './components/core/Navigation';
// E rimuovi <Navigation /> dal render
```

**Nota:** La bottom nav si nasconde automaticamente in focus mode maximal e quando `focusModeEnabled && focusModeLevel === 'maximal'`.

---

#### 2.3 Progress Indicators & Session Tracking

**File creati:**
- `src/components/common/ProgressIndicator.js`
- `src/components/common/SessionTimer.js`
- `src/styles/progress-indicator.css`
- `src/styles/session-timer.css`

**ProgressIndicator Features:**
- **Multi-step flows** con visual steps
- **"X of Y" text** sempre visibile
- **Optional step labels**
- **Clickable steps** per jump navigation
- **Progress bar** alternativo
- **ARIA compliant**

**Come usare ProgressIndicator:**

```jsx
import ProgressIndicator from './components/common/ProgressIndicator';

<ProgressIndicator
  currentStep={2}
  totalSteps={4}
  stepLabels={['Seleziona', 'Intensità', 'Strategie', 'Fine']}
  onStepClick={(step) => goToStep(step)} // Optional
  showStepNumbers={true}
/>
```

**SessionTimer Features:**
- **Elapsed time display** real-time
- **Break reminders** a intervalli configurabili
- **Session limit warnings**
- **Gentle notifications** (dismissibili)
- **Rispetta user settings** (show/hide, intervals)

**Come usare SessionTimer:**

```jsx
import SessionTimer from './components/common/SessionTimer';

<SessionTimer
  onBreakReminder={(minutes) => console.log(`Break after ${minutes}min`)}
  onSessionLimitReached={(minutes) => console.log(`Limit reached at ${minutes}min`)}
/>
```

**Nota:** SessionTimer legge automaticamente settings da `useEnhancedSettings` per:
- `settings.showSessionTimer`
- `settings.showBreakReminders`
- `settings.breakInterval`
- `settings.sessionTimeLimit`

---

## 🔧 Setup Completo (Step-by-Step)

### Step 1: Import Fonts & Design System

In `src/index.js` o `src/App.js`:

```jsx
import './styles/fonts.css';
import './styles/design-system.css';
```

### Step 2: Wrap con EnhancedSettingsProvider

In `src/index.js`:

```jsx
import { EnhancedSettingsProvider } from './contexts/EnhancedSettingsContext';

root.render(
  <EnhancedSettingsProvider>
    <App />
  </EnhancedSettingsProvider>
);
```

### Step 3: Update App.js Routes

```jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnhancedHomePage from './components/core/home/EnhancedHomePage';
import EnhancedSettings from './components/core/EnhancedSettings';
import BottomNavigation from './components/core/BottomNavigation';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<EnhancedHomePage />} />
        <Route path="/settings" element={<EnhancedSettings />} />

        {/* Keep existing routes */}
        <Route path="/emotion" element={<EmotionSelector />} />
        <Route path="/calmspace" element={<CalmSpace />} />
        <Route path="/timer" element={<VisualTimer />} />
        {/* ... other routes */}
      </Routes>

      {/* Fixed bottom navigation */}
      <BottomNavigation />
    </Router>
  );
}

export default App;
```

### Step 4: Update Existing Components

In ogni componente esistente che usa settings:

```jsx
// REPLACE
import { useContext } from 'react';
import { SettingsContext } from '../contexts/SettingsContext';
const { settings } = useContext(SettingsContext);

// WITH
import { useEnhancedSettings } from '../contexts/EnhancedSettingsContext';
const { settings } = useEnhancedSettings();
```

### Step 5: Add SessionTimer to Pages (Optional)

In pages dove vuoi mostrare session timer:

```jsx
import SessionTimer from './components/common/SessionTimer';

function YourPage() {
  return (
    <div>
      {/* Header con timer */}
      <SessionTimer />

      {/* Your content */}
    </div>
  );
}
```

### Step 6: Use ProgressIndicator in Multi-Step Flows

In componenti come `EmotionSelector.js`:

```jsx
import ProgressIndicator from './components/common/ProgressIndicator';

function EmotionSelector() {
  const [step, setStep] = useState(1);

  return (
    <div>
      <ProgressIndicator
        currentStep={step}
        totalSteps={3}
        stepLabels={['Emozione', 'Intensità', 'Strategie']}
      />

      {/* Your step content */}
    </div>
  );
}
```

---

## 🎨 CSS Classes Utility

Il design system fornisce utility classes:

```jsx
// Buttons
<button className="btn btn-primary">Primario</button>
<button className="btn btn-secondary">Secondario</button>
<button className="btn btn-lg">Grande</button>
<button className="btn btn-block">Full Width</button>

// Cards
<div className="card">Base card</div>
<div className="card card-interactive">Clickable card</div>
<div className="card card-accent">Con bordo colorato</div>

// Inputs
<input className="input" />
<input className="input input-error" />

// Badges
<span className="badge">Default</span>
<span className="badge badge-success">Success</span>

// Flex utilities
<div className="flex flex-col gap-4">...</div>
<div className="flex items-center justify-between">...</div>
```

---

## 🎯 Settings Available

Tutti i settings disponibili in `useEnhancedSettings()`:

```javascript
{
  // APPEARANCE
  theme: 'blue' | 'green' | 'amber' | 'lavender',
  colorMode: 'light' | 'dark' | 'auto',
  highContrast: boolean,

  // TEXT & TYPOGRAPHY
  textSize: 'standard' | 'large' | 'xlarge',
  dyslexiaFont: boolean,
  lineSpacing: 'tight' | 'normal' | 'relaxed' | 'loose',
  letterSpacing: 'normal' | 'wide' | 'wider',

  // SENSORY CONTROLS
  animationLevel: 'off' | 'minimal' | 'standard' | 'full',
  visualIntensity: 0.5 to 1.5,
  colorSaturation: 0.7 to 1.2,
  blurEffects: boolean,
  shadowIntensity: 0 to 1,

  soundEnabled: boolean,
  soundVolume: 0 to 1,
  voiceGuidance: boolean,
  audioFeedback: boolean,

  vibrationEnabled: boolean,
  vibrationIntensity: 0 to 1,

  // COGNITIVE & INTERACTION
  informationDensity: 'low' | 'medium' | 'high',
  autoAdvance: boolean,
  confirmDestructive: boolean,
  reducedChoices: boolean,

  focusModeEnabled: boolean,
  focusModeLevel: 'minimal' | 'moderate' | 'maximal',

  // TIME AWARENESS
  showSessionTimer: boolean,
  showBreakReminders: boolean,
  breakInterval: number (minutes),
  sessionTimeLimit: number (minutes, 0 = no limit),
  timeFormat: '12h' | '24h',

  // ACCESSIBILITY
  screenReaderOptimized: boolean,
  keyboardNavigationHelp: boolean,
  largeClickTargets: boolean,
  skipAnimations: boolean,

  // PRESET
  activePreset: 'custom' | 'low-sensory' | 'high-focus' | 'energy-conserving',

  // DATA
  saveHistory: boolean,
  analyticsEnabled: boolean
}
```

---

## 🧪 Testing Checklist

### Funzionalità Base
- [ ] Settings salvano e caricano correttamente da localStorage
- [ ] Preset profiles applicano le impostazioni corrette
- [ ] Bottom navigation evidenzia correttamente la pagina attiva
- [ ] Home page mostra ultima attività usata
- [ ] Sistema di favorites funziona (add/remove stars)
- [ ] Onboarding appare solo al primo utilizzo

### Accessibilità
- [ ] Focus indicators visibili con keyboard Tab
- [ ] Screen reader announce step changes in ProgressIndicator
- [ ] All buttons hanno min 44x44px touch target
- [ ] High contrast mode aumenta contrasto
- [ ] Dyslexia font applica font e spaziatura
- [ ] Animations OFF disabilita tutte le animazioni

### Time Awareness
- [ ] Session timer aggiorna ogni secondo
- [ ] Break reminders appaiono agli intervalli corretti
- [ ] Session limit warning appare al limite
- [ ] Notifications sono dismissibili

### Responsive
- [ ] Layout funziona su mobile (320px+)
- [ ] Bottom nav è usabile su schermi piccoli
- [ ] Settings accordion funziona su mobile
- [ ] Cards home responsive su tutte le dimensioni

---

## 🚀 Prossimi Passi (TODO)

### FASE 3: Sezione Emozioni
- [ ] Ridisegnare Emotion Selector con preview
- [ ] Aggiungere opzione "Non lo so" per alexitimia
- [ ] Implementare Strategies con progressive disclosure
- [ ] Migliorare Intensity Slider

### FASE 4: Il Mio Spazio
- [ ] Persistent control bar per meditazione
- [ ] Session management con gentle warnings
- [ ] Sensory customization per patterns

### FASE 5: Timer & Routines
- [ ] Potenziare Visual Timer con pause
- [ ] Creare Routine Builder
- [ ] Implementare Break Reminders system

### FASE 6 & 7: Polish
- [ ] Loading states con skeleton screens
- [ ] Additional animation refinements
- [ ] Testing completo con utenti autistici

---

## 📚 Resources

### Font Resources
- [Atkinson Hyperlegible](https://brailleinstitute.org/freefont) - Designed for low vision
- [Outfit](https://fonts.google.com/specimen/Outfit) - Geometric friendly sans
- [OpenDyslexic](https://opendyslexic.org/) - Dyslexia-friendly font

### Accessibility Guidelines
- [WCAG 2.1 AAA](https://www.w3.org/WAI/WCAG21/quickref/)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [Autism & UX](https://www.w3.org/WAI/people-use-web/abilities-barriers/#autism)

---

## 💡 Tips & Best Practices

### Quando usare ProgressIndicator
✅ **USA** in:
- Multi-step forms (emotion → intensity → strategies)
- Guided experiences
- Tutorial/onboarding

❌ **NON usare** in:
- Single-page views
- Free-form exploration
- Non-linear navigation

### Quando usare SessionTimer
✅ **USA** in:
- Pagine dove utente può rimanere a lungo (meditazione, breathing)
- Features intensive (emotion tracking, journal)

❌ **NON usare** in:
- Settings page
- Quick actions/transient pages

### Focus Mode Levels
- **Minimal**: Riduce visual weight di UI secondaria
- **Moderate**: Nasconde label di nav items non attivi
- **Maximal**: Nasconde bottom nav completamente (solo ESC o back button)

---

## 🐛 Troubleshooting

### Problem: "useEnhancedSettings must be used within EnhancedSettingsProvider"
**Solution:** Wrappa tutta l'app con `<EnhancedSettingsProvider>` in index.js

### Problem: Fonts non caricano
**Solution:** Verifica che `src/styles/fonts.css` sia importato PRIMA di design-system.css

### Problem: Settings non si salvano
**Solution:** Check localStorage quota. Clear old settings: `localStorage.removeItem('userSettings')`

### Problem: Bottom nav copre contenuto
**Solution:** Aggiungi padding bottom ai container: `padding-bottom: var(--space-24)`

### Problem: Animations non si disabilitano
**Solution:** Verifica che body abbia classe `.animations-off`. Check che `applySettingsToDOM()` sia chiamato.

---

## ✉️ Contatti & Supporto

Per domande o problemi:
1. Check questo README
2. Review codice con commenti inline
3. Test con vari preset profiles per capire comportamenti

---

## 📝 Changelog

### v2.0.0 - Redesign Autism-Friendly (2025-01-26)

**Added:**
- Design System completo con sensory controls
- Enhanced Settings con 30+ opzioni granulari
- 4 preset profiles (Low Sensory, High Focus, etc.)
- Bottom Navigation fisso (sostituisce draggable)
- Enhanced Home Page con favorites e visual priority
- Progress Indicator component
- Session Timer con break reminders
- Dyslexia font support
- High contrast mode
- Focus mode (3 livelli)
- Time awareness features

**Changed:**
- Settings Context → Enhanced Settings Context
- Home Page completamente ridisegnata
- Navigation draggable → Fixed bottom bar
- Default animations OFF (opt-in)
- Typography con spaziatura aumentata

**Removed:**
- Draggable floating home button
- Always-on animations
- Auto-advance forzato

---

**🎨 Design Philosophy: "Soft Precision"**

Chiarezza matematica del design svizzero + morbidezza di elementi naturali = interfaccia prevedibile, rassicurante e completamente controllabile.

Ogni pixel ha uno scopo. Nessuno stimolo non richiesto. Controllo totale all'utente.

---

End of Integration Guide
