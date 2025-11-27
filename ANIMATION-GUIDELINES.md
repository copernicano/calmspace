# Animation Guidelines for CalmSpace

## Autism-Friendly Animation Principles

This document outlines the animation guidelines for CalmSpace to ensure all motion is accessible and comfortable for autistic users.

---

## Core Principles

### 1. **Animations are OPT-IN, not OPT-OUT**

```css
/* DEFAULT: No animations */
.animations-off * {
  animation: none !important;
  transition: none !important;
}
```

**Why:** Many autistic users are sensitive to motion and unexpected changes. Animations should be disabled by default and enabled only when the user explicitly requests them.

**Settings:** `animationLevel: 'off' | 'minimal' | 'standard' | 'full'`

---

### 2. **Predictable Motion Only**

✅ **Good:**
- Fade in/out
- Smooth scale transforms (0.95 → 1.0)
- Gentle slides (max 20px)
- Opacity changes (0 → 1)

❌ **Avoid:**
- Spinning/rotating elements (unless requested, like breathing circles)
- Bouncing effects
- Elastic/spring animations
- Parallax scrolling
- Auto-playing carousels
- Sudden color changes

---

### 3. **Slow and Gentle Timing**

```css
:root {
  --duration-instant: 0ms;
  --duration-fast: 150ms;
  --duration-normal: 300ms;   /* Default */
  --duration-slow: 500ms;
  --duration-slower: 800ms;

  --animation-easing: cubic-bezier(0.4, 0.0, 0.2, 1); /* Gentle ease-in-out */
}
```

**Standard transition:**
```css
.element {
  transition: all var(--animation-duration) var(--animation-easing);
}
```

---

## Animation Levels

### Level: OFF (Default)
- **What:** NO animations or transitions
- **CSS Class:** `.animations-off`
- **Usage:** All components must respect this

```css
.animations-off .my-component {
  animation: none;
  transition: none;
}
```

### Level: MINIMAL
- **What:** Essential feedback only (hover, focus states)
- **CSS Class:** `.animations-minimal`
- **Allowed:**
  - Button hover opacity changes
  - Focus ring appearance
  - Simple fades (max 200ms)

### Level: STANDARD
- **What:** Smooth UI transitions
- **CSS Class:** `.animations-standard`
- **Allowed:** Everything in MINIMAL plus:
  - Card entrance animations
  - Smooth scrolling
  - Panel expansions

### Level: FULL
- **What:** Full visual experience
- **CSS Class:** `.animations-full`
- **Allowed:** Everything in STANDARD plus:
  - Decorative animations (breathing circles, pattern movements)
  - Complex transitions

---

## Implementation Patterns

### Pattern 1: Respecting Animation Level

```jsx
const MyComponent = () => {
  const { settings } = useEnhancedSettings();

  return (
    <div className={`my-component animations-${settings.animationLevel}`}>
      {/* Content */}
    </div>
  );
};
```

```css
.my-component .animated-element {
  transition: opacity var(--animation-duration) var(--animation-easing);
}

.animations-off .my-component .animated-element {
  transition: none;
}
```

### Pattern 2: Loading States (Use Skeletons, Not Spinners)

✅ **Good - Skeleton Screen:**
```jsx
import { SkeletonLoader } from './components/common/SkeletonLoader';

<SkeletonLoader variant="card" count={3} />
```

❌ **Avoid - Spinning Loader:**
```jsx
// Don't use rapid spinning circles
<div className="spinner"></div>
```

**Why:** Skeleton screens:
- Show structure of what's loading (predictable)
- Can be completely static in `animations-off` mode
- Less sensory overload

### Pattern 3: Conditional Animations

```jsx
const MyComponent = ({ animationLevel }) => {
  const shouldAnimate = animationLevel !== 'off';

  return (
    <motion.div
      initial={shouldAnimate ? { opacity: 0 } : {}}
      animate={shouldAnimate ? { opacity: 1 } : {}}
      transition={shouldAnimate ? { duration: 0.3 } : { duration: 0 }}
    >
      {/* Content */}
    </motion.div>
  );
};
```

---

## Specific Component Guidelines

### Buttons

```css
.btn {
  transition: background-color var(--animation-duration) var(--animation-easing),
              color var(--animation-duration) var(--animation-easing),
              box-shadow var(--animation-duration) var(--animation-easing);
}

.btn:hover {
  /* Subtle shadow increase, no transform */
  box-shadow: var(--shadow-md);
}

.animations-off .btn {
  transition: none;
}

/* ❌ AVOID: */
.btn:hover {
  transform: scale(1.1); /* Too jarring */
}
```

### Cards

```css
.card {
  transition: box-shadow var(--animation-duration) var(--animation-easing);
}

.card:hover {
  box-shadow: var(--shadow-lg);
}

.animations-off .card {
  transition: none;
}

/* ❌ AVOID: */
.card {
  transition: transform 0.3s;
}
.card:hover {
  transform: translateY(-8px) rotate(2deg); /* Too much movement */
}
```

### Modals & Overlays

```css
/* ✅ Good: Simple fade */
.modal {
  opacity: 0;
  transition: opacity var(--animation-duration) var(--animation-easing);
}

.modal.open {
  opacity: 1;
}

.animations-off .modal {
  transition: none;
}

/* ❌ Avoid: Scale + slide + rotate */
.modal {
  transform: scale(0.8) translateY(-50px) rotate(-5deg);
}
```

### Page Transitions

```jsx
// ✅ Good: Optional fade
<AnimatePresence mode="wait">
  {settings.animationLevel !== 'off' && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  )}
  {settings.animationLevel === 'off' && children}
</AnimatePresence>

// ❌ Avoid: Forced slide transitions
<motion.div
  initial={{ x: 300 }}
  animate={{ x: 0 }}
>
```

---

## Color Transitions

### ✅ Static Palettes (Recommended)

```css
.emotion-card {
  background: var(--color-blue-50);
  border: 2px solid var(--color-blue-200);
}

/* Color doesn't change based on interaction */
```

### ❌ Dynamic Color Changes (Avoid)

```css
/* Don't change background color based on state */
.intensity-slider {
  background: hsl(calc(var(--intensity) * 120), 70%, 50%);
}
```

**Why:** Sudden color changes can be disorienting and cause sensory overload.

**Exception:** Breathing guides where color changes are part of the exercise and clearly communicated.

---

## Accessibility Checklist

Before implementing any animation, ask:

- [ ] Does it respect `animationLevel: 'off'`?
- [ ] Is the duration ≥ 300ms (or uses `var(--animation-duration)`)?
- [ ] Does it use gentle easing (no bounce/elastic)?
- [ ] Can the feature work without the animation?
- [ ] Does it respect `prefers-reduced-motion`?
- [ ] Is the movement predictable and purposeful?
- [ ] Would it be comfortable for someone with vestibular disorders?

### Media Query Support

Always include:

```css
@media (prefers-reduced-motion: reduce) {
  .my-animated-element {
    animation: none;
    transition: none;
  }
}
```

---

## Testing Animations

### Manual Testing Checklist

1. **Test in all animation levels:**
   - Settings → Sensory → Animation Level → OFF/MINIMAL/STANDARD/FULL

2. **Test browser settings:**
   - Enable "Reduce Motion" in OS accessibility settings
   - Verify animations stop

3. **Test with real users:**
   - Get feedback from autistic users
   - Watch for signs of discomfort or confusion

4. **Performance:**
   - Use Chrome DevTools Performance tab
   - Ensure 60fps on low-end devices
   - Check CPU usage

---

## Common Pitfalls

### ❌ Don't:

```css
/* Auto-playing carousel */
.carousel {
  animation: slide 3s infinite;
}

/* Rapid blinking */
@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

/* Aggressive transforms */
.button:active {
  transform: scale(0.8) rotate(10deg);
}

/* Color cycling */
@keyframes rainbow {
  0% { background: red; }
  50% { background: blue; }
  100% { background: green; }
}
```

### ✅ Do:

```css
/* Gentle fade */
.element {
  opacity: 0;
  transition: opacity 300ms ease-in-out;
}

.element.visible {
  opacity: 1;
}

.animations-off .element {
  transition: none;
  opacity: 1; /* Immediately visible */
}
```

---

## Breathing Guide Special Case

The breathing guide is an EXCEPTION because motion is part of the therapeutic exercise:

```css
.breathing-circle {
  transform: scale(var(--scale));
  transition: transform 1s ease-in-out;
}

.phase-inhale {
  --scale: 1;
}

.phase-exhale {
  --scale: 0.5;
}
```

**Requirements:**
- Must be user-initiated (not auto-playing)
- Clear labels ("Inspira", "Espira")
- Smooth, slow timing (1s per phase)
- Predictable pattern (4-4-4-4 or 4-7-8)

---

## Resources

- **Design System:** `src/styles/design-system.css`
- **Loading States:** `src/components/common/LoadingStates.js`
- **Skeleton Loader:** `src/components/common/SkeletonLoader.js`
- **Settings Context:** `src/contexts/EnhancedSettingsContext.js`

---

## Questions?

When in doubt, **err on the side of NO animation**. It's better to have a static, clear interface than a disorienting animated one.

Remember: **Clarity > Cuteness**
