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
- **Entry Point**: `src/index.js` - renders the main app
- **Main App**: `src/components/core/App.js` - primary application logic (not `src/App.js` which is unused)
- **Routing**: React Router v6 with client-side routing
- **State Management**: React Context API via `SettingsContext`
- **Storage**: Local storage utilities in `src/utils/storage.js`

### Key Components Organization
```
src/components/
├── core/           # Main app structure
│   ├── App.js      # Primary app component with routing
│   ├── Navigation.js # Draggable home button
│   └── Settings.js # App settings management
├── calm-space/     # Meditation and relaxation tools
├── emotion-support/# Emotion tracking and coping strategies  
├── chat/          # Chatbot functionality
└── timers/        # Visual timers and routines
```

### Settings System
The app uses a comprehensive settings system managed through React Context:
- **Theme**: blue, green, purple, orange color schemes
- **UI Size**: standard, large accessibility options
- **Animation Level**: low, medium performance options
- **Stimulation Level**: low, medium, high sensory options

Settings are persisted in localStorage and applied via CSS classes on the main container.

### Navigation Pattern
- Draggable home button (`Navigation.js`) that persists position in localStorage
- Only visible when not on home page
- Supports both mouse and touch interactions

### State Persistence
The app extensively uses localStorage for:
- User settings (`calmspace-settings` key)
- Last selected emotion (`lastEmotion` key)  
- Home button position (`homeButtonPosition` key)
- Helper message state (`homeButtonHelperSeen` key)

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

## Il Mio Spazio - Animation Redesign (2024)

The "Il Mio Spazio" (My Space) section has been completely redesigned with modern, artistic animations to replace the outdated "anni 90" (90s style) effects. Key improvements:

### Animation Components
- **SimplePatterns.js**: Core component managing four animation patterns with enhanced visual effects
- **CalmSpace.js**: Container component supporting fullscreen mode and section switching

### Animation Types

#### 🫧 Bolle (Bubbles) - COMPLETED ✅
- **Issue Fixed**: Square bubble shapes on left side
- **Solution**: Perfect circular constraints using `aspect-ratio: 1/1` and CSS variables
- **Features**: 
  - 25 main bubbles with 4 types (normal, large, micro, sparkly)
  - 15 foam particles for depth
  - Modern gradients with HSL color variations
  - Realistic floating physics with drift and rotation
  - Enhanced backdrop filters and borders

#### 🌊 Onde (Waves) - COMPLETED ✅  
- **Previous Issues**: Ugly triangular SVG paths, yellow sky gradient
- **Complete Redesign**: Poetic fluid waves using CSS-only approach
- **Features**:
  - Deep ocean gradient (blues from sky to night)
  - 6 organic wave layers using `clip-path` polygons
  - 4 surface waves with delicate reflections  
  - 12 floating particles with organic movement
  - 8 water shimmers with dancing light effects
  - Smooth atmospheric animations over 45s cycles

#### ✨ Stelle (Stars) - COMPLETED ✅
- **Previous Issue**: Stars remained largely unchanged, invisible due to CSS bugs
- **Complete Redesign**: Spectacular modern universe
- **Features**:
  - 60 cross-shaped stars with 5 color variants (white, red, blue, gold, pink)
  - 4 constellations with connecting lines and mathematical positioning
  - 8 spectacular meteors with long luminous trails
  - 6 vibrant nebulae with HSL color control and breathing effects
  - 50 sparkling stardust particles
  - Modern CSS animations with dynamic brightness and blur effects

#### 📐 Geometrico (Geometric) - EXISTING
- Sophisticated geometric patterns with hexagonal grids, concentric circles, rotating shapes
- Fractal elements and energy waves
- Orbiting particles with complex mathematics

### Technical Implementation
- **CSS Variables**: Extensive use for dynamic styling and animation control
- **Modern CSS**: Advanced properties like `clip-path`, `mix-blend-mode`, `backdrop-filter`
- **Performance**: Optimized animations using `transform` and `opacity` for GPU acceleration
- **Responsive**: Fluid layouts that work across all screen sizes
- **Accessibility**: Speed controls (slow/medium) for motion sensitivity

### Animation Architecture
```
src/styles/calmspace-animations.css
├── Modern Bubble Animations    # Lines 100-316
├── Poetic Fluid Waves         # Lines 317-607  
├── Spectacular Star Universe  # Lines 609-786
└── Modern Geometric Patterns  # Lines 787-1087
```

All animations now feature:
- Artistic color palettes
- Organic, natural movement patterns  
- Layered depth and visual hierarchy
- Smooth performance across devices
- Poetic and contemplative aesthetics

## Development Notes

- The project uses Italian language strings throughout the UI
- Components follow a pattern of accepting `settings` props and applying theme classes
- Many components support fullscreen modes with keyboard shortcuts (Escape key)
- The app is designed for both desktop and mobile with touch gesture support
- PWA functionality is enabled via service worker registration

## Testing
Tests are configured with Jest and React Testing Library. Run individual tests with standard Jest patterns.