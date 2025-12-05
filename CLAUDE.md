# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CalmSpace is a React-based PWA (Progressive Web App) designed for emotional wellness and relaxation. It provides meditation tools, breathing exercises, emotion tracking, and coping strategies. The app is built with Create React App and includes service worker functionality for offline use.

## Development Commands

- `npm start` - Start development server
- `npm run build` - Create production build 
- `npm test` - Run tests with Jest
- `npm run eject` - Eject from Create React App (not recommended)

## Architecture

### Core Structure
- **Entry Point**: `src/index.js` - renders the main app wrapped in `EnhancedSettingsProvider`
- **Main App**: `src/components/core/App.js` - primary application logic (not `src/App.js` which is unused)
- **Routing**: React Router v7.5 with client-side routing
- **State Management**: React Context API via `EnhancedSettingsContext` (V2 settings system)
- **Storage**: Local storage utilities in `src/utils/storage.js`
- **Animation Library**: GSAP 3.13 for all animations (DO NOT use CSS animations for complex movements)

### Key Components Organization
```
src/components/
├── core/                    # Main app structure
│   ├── App.js               # Primary app component with routing
│   ├── BottomNavigation.js  # Fixed bottom navigation bar (ALWAYS visible)
│   ├── EnhancedSettings.js  # Comprehensive settings UI
│   └── home/
│       └── EnhancedHomePage.js
├── calm-space/              # Meditation and relaxation tools
│   ├── EnhancedCalmSpace.js       # Main container with fullscreen support
│   ├── EnhancedSimplePatterns.js  # Pattern selector
│   ├── BubblesAnimation.js        # GSAP bubble animation
│   ├── WavesAnimation.js          # GSAP organic wave animation
│   ├── StarsAnimation.js          # GSAP stars/meteors animation
│   ├── GeometricAnimation.js      # GSAP geometric patterns
│   └── [Other animation components]
├── emotion-support/         # Emotion tracking and coping strategies
│   ├── EnhancedEmotionSelector.js
│   ├── EnhancedIntensitySlider.js
│   └── EnhancedStrategies.js
├── chat/                    # Chatbot functionality
│   ├── ChatBot.js
│   └── ChatButton.js
└── timers/                  # Visual timers and routines
    ├── EnhancedVisualTimer.js
    └── RoutineBuilder.js
```

### Enhanced Settings System (V2)
The app uses a comprehensive autism-friendly settings system (`EnhancedSettingsContext.js`):

**Appearance Settings:**
- Theme: blue, green, amber, lavender
- Color mode: light, dark, auto
- High contrast mode

**Text & Typography:**
- Text size: standard, large, xlarge
- Dyslexia font support (OpenDyslexic)
- Line spacing: tight, normal, relaxed, loose
- Letter spacing: normal, wide, wider

**Sensory Controls (critical for autism-friendly design):**
- Animation level: off, minimal, standard, full
- Visual intensity: 0.5 to 1.5
- Color saturation: 0.7 to 1.2
- Blur effects toggle
- Shadow intensity: 0 to 1
- Sound enabled with volume control
- Vibration feedback (mobile)

**Cognitive & Focus:**
- Information density: low, medium, high
- Focus mode: minimal, moderate, maximal
- Reduced choices option
- Auto-advance settings

**Preset Profiles:**
- Low-sensory: minimal stimulation for comfort
- High-focus: reduces distractions
- Energy-conserving: reduces cognitive load
- Balanced: general use

Settings persist to `localStorage` with key `calmspace-settings-v2` and are applied via CSS classes and CSS custom properties.

### Navigation Pattern
**CRITICAL:** `BottomNavigation.js` is ALWAYS visible (even in focus mode) to prevent users from getting trapped on a page. This was a critical bug fix - the navigation must never be hidden with `display: none`.

- Fixed bottom navigation bar with 5 tabs: Home, Emozioni, Spazio, Timer, Impostazioni
- Active state indication with visual indicators
- Keyboard accessible with proper ARIA labels
- Responsive design with safe-area-inset support

### State Persistence
The app extensively uses localStorage for:
- User settings V2 (`calmspace-settings-v2` key)
- Legacy settings migration from V1 (`userSettings` key)
- Last selected emotion (`lastEmotion` key)

### Audio Assets
Sound files are stored in `src/assets/sounds/` and include:
- `bubbles.mp3`
- `summer-night.mp3` 
- `waves.mp3`
- `whitenoise-binaural.mp3`

### Styling Architecture
CSS is organized by feature in `src/styles/`:
- `global.css` - Base styles and theme variables
- Component-specific stylesheets (e.g., `calmspace.css`, `emotion.css`)
- Animation-specific styles in `calmspace-animations.css`

## Animation System - GSAP-Based Artistic Animations

**CRITICAL:** All animations in the "Il Mio Spazio" section use GSAP (GreenSock Animation Platform), NOT CSS animations. This is a fundamental architectural decision.

### Animation Philosophy
Animations must look like **artistic illustrations** (Japanese animation, Studio Ghibli style), NOT mathematical graphs or "anni 90" effects. Avoid:
- ❌ Mathematical sine waves or trigonometric patterns
- ❌ Symmetrical, regular shapes
- ❌ Flat, band-like layers
- ❌ Rainbow gradients or neon colors

Instead, create:
- ✅ Organic, asymmetric curves (Bezier paths)
- ✅ Layered depth with varying opacity
- ✅ Artistic color palettes (blues for ocean, purples for space)
- ✅ Natural, fluid movement with parallax

### Animation Components Architecture

Each animation is a standalone React component using GSAP:

**BubblesAnimation.js** - Floating bubbles with realistic physics
- 25+ bubbles with varied sizes and types
- GSAP for float, drift, and rotation animations
- Radial gradients for depth
- Foam particles for surface detail

**WavesAnimation.js** - Organic ocean waves (recently redesigned)
- **3 SVG layers** with different speeds (parallax effect)
- **Hand-crafted Bezier paths** (NOT sin/cos functions)
- Path morphing with `gsap.to(path, { attr: { d: newPath } })`
- Organic curves: `M 0,280 C 150,260 300,290 ...`
- Night ocean gradient background
- 12 sparkle particles on surface
- Duration: 4s (foreground), 6s (middle), 8s (background)

**StarsAnimation.js** - Starry night with meteors
- 100 twinkling stars with GSAP scale/opacity animations
- 6 nebulae with color breathing effects
- **12 meteors** with realistic physics:
  - 4 different trajectory angles (-30°, -45°, -60°, -70°)
  - Trail rotation aligned to movement direction
  - Speed: 0.5-2 seconds (fast like real meteors)
  - Random spawn delays (0-120s) for natural frequency
  - `power2.in` easing for acceleration
- 80 stardust particles with subtle sparkle

**GeometricAnimation.js** - Abstract geometric patterns
- Hexagonal grids, concentric circles
- Rotating shapes with mathematical precision
- Fractal elements and energy waves

### GSAP Animation Patterns

**Basic GSAP Setup:**
```javascript
useEffect(() => {
  const element = document.createElement('div');
  container.appendChild(element);

  gsap.to(element, {
    x: 100,
    y: 50,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut'
  });

  return () => gsap.killTweensOf(element);
}, []);
```

**SVG Path Morphing:**
```javascript
const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
path.setAttribute('d', startPath);

gsap.to(path, {
  attr: { d: endPath },
  duration: 8,
  repeat: -1,
  yoyo: true,
  ease: 'sine.inOut'
});
```

**Cleanup is CRITICAL:**
Always use `gsap.killTweensOf()` in the cleanup function to prevent memory leaks.

### Performance Considerations
- Use `transform` (x, y, scale, rotate) for GPU acceleration
- Avoid animating `width`, `height`, `top`, `left` directly
- Limit number of animated elements on screen
- Use `will-change: transform` sparingly
- Test on mobile devices for 60fps performance

## CSS Design System

The app uses a comprehensive design system with CSS custom properties defined in `src/styles/design-system.css`:

### CSS Custom Properties
**Theme Colors** are applied dynamically via classes:
- `.theme-blue`, `.theme-green`, `.theme-amber`, `.theme-lavender`
- Each theme defines `--theme-primary`, `--theme-surface`, `--theme-background`

**Dynamic Variables** set by settings:
- `--visual-intensity`: Controls brightness/saturation (0.5-1.5)
- `--color-saturation`: Color vibrancy (0.7-1.2)
- `--shadow-intensity`: Shadow opacity (0-1)
- `--blur-amount`: Blur filter amount
- `--leading-normal`: Line height
- `--tracking-normal`: Letter spacing

### CSS Class Patterns
Components receive settings-based classes from the main container:
- `theme-{blue|green|amber|lavender}` - Color scheme
- `text-size-{standard|large|xlarge}` - Typography scale
- `animations-{off|minimal|standard|full}` - Animation level
- `focus-mode-{minimal|moderate|maximal}` - UI simplification
- `high-contrast` - Enhanced contrast mode
- `dyslexia-font` - OpenDyslexic font

### Styling Best Practices
- Use CSS custom properties for dynamic values
- Respect `prefers-reduced-motion` media query
- Ensure 48x48px minimum touch targets
- Test with all theme combinations
- Maintain WCAG AA contrast ratios (AAA in high-contrast mode)

## Development Notes

- **Language**: Italian UI strings throughout (labels, buttons, messages)
- **Accessibility-First**: Designed for neurodivergent users (autism-friendly)
- **Keyboard Support**: Escape key exits fullscreen, Tab navigation works everywhere
- **Touch & Mouse**: All interactions support both input methods
- **PWA Features**: Service worker enables offline functionality
- **No External APIs**: All functionality is client-side (privacy-focused)

## Common Development Patterns

### Adding a New Animation
1. Create `[Name]Animation.js` in `src/components/calm-space/`
2. Use GSAP for all animations (import from 'gsap')
3. Create elements in `useEffect`, animate with GSAP
4. **Always** cleanup with `gsap.killTweensOf()` in return function
5. Add to `EnhancedSimplePatterns.js` pattern selector
6. Follow artistic style guide (organic, illustrated, NOT mathematical)

### Modifying Settings
1. Update `defaultSettings` in `EnhancedSettingsContext.js`
2. Add UI control in `EnhancedSettings.js`
3. Apply via CSS class or custom property in `applySettingsToDOM()`
4. Test with preset profiles (low-sensory, high-focus, etc.)

### Navigation Bug Prevention
**NEVER** hide `BottomNavigation` with `display: none`. Users must always have a way to navigate back. Use opacity/transparency if needed to reduce visual weight in focus mode.

## Testing
Tests are configured with Jest and React Testing Library. Run individual tests with standard Jest patterns.

## Known Issues & Technical Debt
- Legacy `src/App.js` exists but is unused (entry point is `src/components/core/App.js`)
- Some legacy components (non-Enhanced versions) may still exist but are not used in routes
- Audio file `135796592-morning-forest-ambience.m4a` referenced but may be missing
- per ogni modifica sostanziosa nel frontend usa sempre il plugin frontend-designer per ottenere risultati migliori