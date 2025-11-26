/**
 * ═══════════════════════════════════════════════════════════════════
 * Enhanced Settings Component - Autism-Friendly UI
 * ═══════════════════════════════════════════════════════════════════
 *
 * Organized settings interface with:
 * - Clear categories
 * - Visual previews
 * - Preset profiles
 * - Progressive disclosure
 * - Immediate feedback
 */

import React, { useState } from 'react';
import { useEnhancedSettings } from '../../contexts/EnhancedSettingsContext';
import '../../styles/design-system.css';
import '../../styles/enhanced-settings.css';

const EnhancedSettings = () => {
  const {
    settings,
    updateSettings,
    resetSettings,
    applyPreset,
    getPresets,
    exportSettings,
  } = useEnhancedSettings();

  // Track which category is expanded
  const [expandedCategory, setExpandedCategory] = useState('appearance');

  /* ═══════════════════════════════════════════════════════════════════
     Category Toggling
     ═══════════════════════════════════════════════════════════════════ */

  const toggleCategory = (category) => {
    setExpandedCategory(expandedCategory === category ? null : category);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Preset Handling
     ═══════════════════════════════════════════════════════════════════ */

  const presets = getPresets();

  const handlePresetSelect = (presetId) => {
    applyPreset(presetId);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Export Settings
     ═══════════════════════════════════════════════════════════════════ */

  const handleExport = () => {
    const data = exportSettings();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `calmspace-settings-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  /* ═══════════════════════════════════════════════════════════════════
     Render Component
     ═══════════════════════════════════════════════════════════════════ */

  return (
    <div className="enhanced-settings-container">
      {/* ─────────────────────────────────────────────────────────────
          Header with Title & Actions
          ───────────────────────────────────────────────────────────── */}
      <header className="settings-header">
        <h1 className="settings-title">Impostazioni</h1>
        <div className="settings-actions">
          <button
            className="btn btn-ghost btn-sm"
            onClick={handleExport}
            aria-label="Esporta impostazioni"
          >
            📥 Esporta
          </button>
          <button
            className="btn btn-ghost btn-sm"
            onClick={resetSettings}
            aria-label="Ripristina impostazioni predefinite"
          >
            ↺ Ripristina
          </button>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          Quick Presets
          ───────────────────────────────────────────────────────────── */}
      <section className="settings-section">
        <h2 className="section-title">🎯 Profili Rapidi</h2>
        <p className="section-description">
          Applica configurazioni predefinite per situazioni comuni
        </p>

        <div className="preset-grid">
          {presets.map(preset => (
            <button
              key={preset.id}
              className={`preset-card ${settings.activePreset === preset.id ? 'active' : ''}`}
              onClick={() => handlePresetSelect(preset.id)}
              aria-pressed={settings.activePreset === preset.id}
            >
              <div className="preset-name">{preset.name}</div>
              <div className="preset-description">{preset.description}</div>
              {settings.activePreset === preset.id && (
                <div className="preset-badge badge badge-success">✓ Attivo</div>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          APPEARANCE CATEGORY
          ═══════════════════════════════════════════════════════════════ */}
      <SettingsCategory
        id="appearance"
        icon="🎨"
        title="Aspetto"
        description="Colori, tema e stile visivo"
        expanded={expandedCategory === 'appearance'}
        onToggle={() => toggleCategory('appearance')}
      >
        {/* Theme Color */}
        <SettingGroup
          label="Tema colori"
          description="Scegli il colore principale dell'app"
        >
          <div className="option-grid option-grid-4">
            <ThemeOption
              value="blue"
              label="Blu Sereno"
              color="var(--color-blue-500)"
              active={settings.theme === 'blue'}
              onChange={() => updateSettings({ theme: 'blue' })}
            />
            <ThemeOption
              value="green"
              label="Verde Calmo"
              color="var(--color-green-500)"
              active={settings.theme === 'green'}
              onChange={() => updateSettings({ theme: 'green' })}
            />
            <ThemeOption
              value="amber"
              label="Ambra Caldo"
              color="var(--color-amber-500)"
              active={settings.theme === 'amber'}
              onChange={() => updateSettings({ theme: 'amber' })}
            />
            <ThemeOption
              value="lavender"
              label="Lavanda Soft"
              color="var(--color-lavender-500)"
              active={settings.theme === 'lavender'}
              onChange={() => updateSettings({ theme: 'lavender' })}
            />
          </div>
        </SettingGroup>

        {/* High Contrast */}
        <SettingGroup
          label="Alto contrasto"
          description="Aumenta il contrasto per migliore leggibilità"
        >
          <ToggleSwitch
            checked={settings.highContrast}
            onChange={(checked) => updateSettings({ highContrast: checked })}
            label="Abilita alto contrasto"
          />
        </SettingGroup>
      </SettingsCategory>

      {/* ═══════════════════════════════════════════════════════════════
          TEXT & TYPOGRAPHY CATEGORY
          ═══════════════════════════════════════════════════════════════ */}
      <SettingsCategory
        id="typography"
        icon="📝"
        title="Testo"
        description="Dimensioni, font e spaziatura"
        expanded={expandedCategory === 'typography'}
        onToggle={() => toggleCategory('typography')}
      >
        {/* Text Size */}
        <SettingGroup
          label="Dimensione testo"
          description="Regola la grandezza del testo"
        >
          <SegmentedControl
            options={[
              { value: 'standard', label: 'Standard' },
              { value: 'large', label: 'Grande' },
              { value: 'xlarge', label: 'Extra Grande' },
            ]}
            value={settings.textSize}
            onChange={(value) => updateSettings({ textSize: value })}
          />
        </SettingGroup>

        {/* Dyslexia Font */}
        <SettingGroup
          label="Font per dislessia"
          description="Usa OpenDyslexic, font progettato per dislessia"
        >
          <ToggleSwitch
            checked={settings.dyslexiaFont}
            onChange={(checked) => updateSettings({ dyslexiaFont: checked })}
            label="Abilita font dislessia"
          />
        </SettingGroup>

        {/* Line Spacing */}
        <SettingGroup
          label="Spaziatura righe"
          description="Distanza tra le righe di testo"
        >
          <SegmentedControl
            options={[
              { value: 'tight', label: 'Stretta' },
              { value: 'normal', label: 'Normale' },
              { value: 'relaxed', label: 'Rilassata' },
              { value: 'loose', label: 'Larga' },
            ]}
            value={settings.lineSpacing}
            onChange={(value) => updateSettings({ lineSpacing: value })}
          />
        </SettingGroup>

        {/* Letter Spacing */}
        <SettingGroup
          label="Spaziatura lettere"
          description="Distanza tra le lettere"
        >
          <SegmentedControl
            options={[
              { value: 'normal', label: 'Normale' },
              { value: 'wide', label: 'Larga' },
              { value: 'wider', label: 'Extra Larga' },
            ]}
            value={settings.letterSpacing}
            onChange={(value) => updateSettings({ letterSpacing: value })}
          />
        </SettingGroup>
      </SettingsCategory>

      {/* ═══════════════════════════════════════════════════════════════
          SENSORY CONTROLS CATEGORY
          ═══════════════════════════════════════════════════════════════ */}
      <SettingsCategory
        id="sensory"
        icon="👁️"
        title="Controlli Sensoriali"
        description="Animazioni, suoni, intensità visiva"
        expanded={expandedCategory === 'sensory'}
        onToggle={() => toggleCategory('sensory')}
      >
        {/* Animation Level */}
        <SettingGroup
          label="Livello animazioni"
          description="Controlla movimento e transizioni"
          highlighted
        >
          <SegmentedControl
            options={[
              { value: 'off', label: 'Nessuna' },
              { value: 'minimal', label: 'Minime' },
              { value: 'standard', label: 'Standard' },
              { value: 'full', label: 'Complete' },
            ]}
            value={settings.animationLevel}
            onChange={(value) => updateSettings({ animationLevel: value })}
          />
        </SettingGroup>

        {/* Visual Intensity */}
        <SettingGroup
          label="Intensità visiva"
          description="Controlla saturazione colori e effetti"
        >
          <RangeSlider
            min={0.5}
            max={1.5}
            step={0.1}
            value={settings.visualIntensity}
            onChange={(value) => updateSettings({ visualIntensity: value })}
            labels={['Molto Bassa', 'Bassa', 'Media', 'Alta', 'Molto Alta']}
          />
        </SettingGroup>

        {/* Blur Effects */}
        <SettingGroup
          label="Effetti sfocatura"
          description="Applica sfocature decorative (può ridurre leggibilità)"
        >
          <ToggleSwitch
            checked={settings.blurEffects}
            onChange={(checked) => updateSettings({ blurEffects: checked })}
            label="Abilita sfocature"
          />
        </SettingGroup>

        {/* Sound */}
        <SettingGroup
          label="Suoni"
          description="Audio di sottofondo e feedback"
        >
          <ToggleSwitch
            checked={settings.soundEnabled}
            onChange={(checked) => updateSettings({ soundEnabled: checked })}
            label="Abilita suoni"
          />

          {settings.soundEnabled && (
            <div className="nested-setting">
              <RangeSlider
                min={0}
                max={1}
                step={0.1}
                value={settings.soundVolume}
                onChange={(value) => updateSettings({ soundVolume: value })}
                labels={['🔇 Muto', '🔉 Basso', '🔊 Alto']}
                showValue
                valueFormat={(val) => `${Math.round(val * 100)}%`}
              />
            </div>
          )}
        </SettingGroup>

        {/* Vibration (mobile) */}
        <SettingGroup
          label="Vibrazione"
          description="Feedback tattile (solo mobile)"
        >
          <ToggleSwitch
            checked={settings.vibrationEnabled}
            onChange={(checked) => updateSettings({ vibrationEnabled: checked })}
            label="Abilita vibrazione"
          />
        </SettingGroup>
      </SettingsCategory>

      {/* ═══════════════════════════════════════════════════════════════
          COGNITIVE & FOCUS CATEGORY
          ═══════════════════════════════════════════════════════════════ */}
      <SettingsCategory
        id="cognitive"
        icon="🧠"
        title="Cognitivo e Focus"
        description="Densità informazioni e modalità concentrazione"
        expanded={expandedCategory === 'cognitive'}
        onToggle={() => toggleCategory('cognitive')}
      >
        {/* Information Density */}
        <SettingGroup
          label="Densità informazioni"
          description="Quantità di testo e dettagli mostrati"
          highlighted
        >
          <SegmentedControl
            options={[
              { value: 'low', label: 'Bassa' },
              { value: 'medium', label: 'Media' },
              { value: 'high', label: 'Alta' },
            ]}
            value={settings.informationDensity}
            onChange={(value) => updateSettings({ informationDensity: value })}
          />
        </SettingGroup>

        {/* Focus Mode */}
        <SettingGroup
          label="Modalità Focus"
          description="Nascondi elementi non essenziali per concentrazione"
        >
          <ToggleSwitch
            checked={settings.focusModeEnabled}
            onChange={(checked) => updateSettings({ focusModeEnabled: checked })}
            label="Abilita modalità focus"
          />

          {settings.focusModeEnabled && (
            <div className="nested-setting">
              <SegmentedControl
                options={[
                  { value: 'minimal', label: 'Minimale' },
                  { value: 'moderate', label: 'Moderato' },
                  { value: 'maximal', label: 'Massimo' },
                ]}
                value={settings.focusModeLevel}
                onChange={(value) => updateSettings({ focusModeLevel: value })}
              />
            </div>
          )}
        </SettingGroup>

        {/* Reduced Choices */}
        <SettingGroup
          label="Scelte ridotte"
          description="Mostra meno opzioni alla volta per ridurre sovraccarico"
        >
          <ToggleSwitch
            checked={settings.reducedChoices}
            onChange={(checked) => updateSettings({ reducedChoices: checked })}
            label="Limita numero di scelte"
          />
        </SettingGroup>

        {/* Confirm Destructive */}
        <SettingGroup
          label="Conferme di sicurezza"
          description="Chiedi conferma prima di azioni irreversibili"
        >
          <ToggleSwitch
            checked={settings.confirmDestructive}
            onChange={(checked) => updateSettings({ confirmDestructive: checked })}
            label="Richiedi conferme"
          />
        </SettingGroup>
      </SettingsCategory>

      {/* ═══════════════════════════════════════════════════════════════
          TIME AWARENESS CATEGORY
          ═══════════════════════════════════════════════════════════════ */}
      <SettingsCategory
        id="time"
        icon="⏱️"
        title="Gestione Tempo"
        description="Timer sessioni e promemoria pause"
        expanded={expandedCategory === 'time'}
        onToggle={() => toggleCategory('time')}
      >
        {/* Session Timer */}
        <SettingGroup
          label="Timer sessione"
          description="Mostra quanto tempo passi in ogni schermata"
        >
          <ToggleSwitch
            checked={settings.showSessionTimer}
            onChange={(checked) => updateSettings({ showSessionTimer: checked })}
            label="Mostra timer sessione"
          />
        </SettingGroup>

        {/* Break Reminders */}
        <SettingGroup
          label="Promemoria pause"
          description="Ricevi notifiche gentili per fare pausa"
        >
          <ToggleSwitch
            checked={settings.showBreakReminders}
            onChange={(checked) => updateSettings({ showBreakReminders: checked })}
            label="Abilita promemoria pause"
          />

          {settings.showBreakReminders && (
            <div className="nested-setting">
              <label className="input-label">
                Intervallo pause (minuti)
              </label>
              <input
                type="number"
                className="input"
                min="5"
                max="60"
                step="5"
                value={settings.breakInterval}
                onChange={(e) => updateSettings({ breakInterval: parseInt(e.target.value) })}
              />
            </div>
          )}
        </SettingGroup>

        {/* Session Time Limit */}
        <SettingGroup
          label="Limite tempo sessione"
          description="Durata massima prima di suggerire pausa (0 = illimitato)"
        >
          <input
            type="number"
            className="input"
            min="0"
            max="120"
            step="5"
            value={settings.sessionTimeLimit}
            onChange={(e) => updateSettings({ sessionTimeLimit: parseInt(e.target.value) })}
            placeholder="0 = Nessun limite"
          />
        </SettingGroup>
      </SettingsCategory>

      {/* ═══════════════════════════════════════════════════════════════
          ACCESSIBILITY CATEGORY
          ═══════════════════════════════════════════════════════════════ */}
      <SettingsCategory
        id="accessibility"
        icon="♿"
        title="Accessibilità"
        description="Screen reader, navigazione tastiera"
        expanded={expandedCategory === 'accessibility'}
        onToggle={() => toggleCategory('accessibility')}
      >
        {/* Screen Reader */}
        <SettingGroup
          label="Ottimizzato screen reader"
          description="Etichette ARIA aggiuntive per lettori schermo"
        >
          <ToggleSwitch
            checked={settings.screenReaderOptimized}
            onChange={(checked) => updateSettings({ screenReaderOptimized: checked })}
            label="Attiva ottimizzazioni"
          />
        </SettingGroup>

        {/* Keyboard Navigation */}
        <SettingGroup
          label="Aiuto navigazione tastiera"
          description="Mostra scorciatoie e suggerimenti tastiera"
        >
          <ToggleSwitch
            checked={settings.keyboardNavigationHelp}
            onChange={(checked) => updateSettings({ keyboardNavigationHelp: checked })}
            label="Mostra aiuti tastiera"
          />
        </SettingGroup>

        {/* Large Click Targets */}
        <SettingGroup
          label="Target click grandi"
          description="Pulsanti e link più grandi (min 48x48px)"
        >
          <ToggleSwitch
            checked={settings.largeClickTargets}
            onChange={(checked) => updateSettings({ largeClickTargets: checked })}
            label="Usa target grandi"
          />
        </SettingGroup>
      </SettingsCategory>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════════════
   Sub-Components
   ═══════════════════════════════════════════════════════════════════ */

/** Settings Category (Accordion) */
const SettingsCategory = ({ id, icon, title, description, expanded, onToggle, children }) => (
  <section className={`settings-category ${expanded ? 'expanded' : ''}`}>
    <button
      className="category-header"
      onClick={onToggle}
      aria-expanded={expanded}
      aria-controls={`category-${id}`}
    >
      <div className="category-icon" aria-hidden="true">{icon}</div>
      <div className="category-info">
        <h2 className="category-title">{title}</h2>
        <p className="category-description">{description}</p>
      </div>
      <div className="category-chevron" aria-hidden="true">
        {expanded ? '▲' : '▼'}
      </div>
    </button>

    {expanded && (
      <div className="category-content" id={`category-${id}`}>
        {children}
      </div>
    )}
  </section>
);

/** Setting Group (Individual setting) */
const SettingGroup = ({ label, description, highlighted, children }) => (
  <div className={`setting-group ${highlighted ? 'highlighted' : ''}`}>
    <div className="setting-label-wrapper">
      <label className="setting-label">{label}</label>
      {description && <p className="setting-description">{description}</p>}
    </div>
    <div className="setting-control">
      {children}
    </div>
  </div>
);

/** Theme Option Button */
const ThemeOption = ({ value, label, color, active, onChange }) => (
  <button
    className={`theme-option ${active ? 'active' : ''}`}
    onClick={onChange}
    aria-pressed={active}
    aria-label={label}
  >
    <div
      className="theme-color-preview"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    />
    <span className="theme-label">{label}</span>
    {active && <span className="theme-check" aria-hidden="true">✓</span>}
  </button>
);

/** Toggle Switch */
const ToggleSwitch = ({ checked, onChange, label }) => (
  <label className="toggle-switch">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="toggle-input"
    />
    <span className="toggle-slider" aria-hidden="true"></span>
    <span className="toggle-label">{label}</span>
  </label>
);

/** Segmented Control */
const SegmentedControl = ({ options, value, onChange }) => (
  <div className="segmented-control" role="radiogroup">
    {options.map(option => (
      <button
        key={option.value}
        className={`segment ${value === option.value ? 'active' : ''}`}
        onClick={() => onChange(option.value)}
        role="radio"
        aria-checked={value === option.value}
      >
        {option.label}
      </button>
    ))}
  </div>
);

/** Range Slider with Labels */
const RangeSlider = ({ min, max, step, value, onChange, labels, showValue, valueFormat }) => {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="range-slider-wrapper">
      <div className="range-slider-container">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="range-slider"
          style={{
            '--slider-percentage': `${percentage}%`
          }}
        />
        {showValue && (
          <div className="range-value">
            {valueFormat ? valueFormat(value) : value.toFixed(1)}
          </div>
        )}
      </div>

      {labels && (
        <div className="range-labels">
          {labels.map((label, i) => (
            <span key={i} className="range-label">{label}</span>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnhancedSettings;
