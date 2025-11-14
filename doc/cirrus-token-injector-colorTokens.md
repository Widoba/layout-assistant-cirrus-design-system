# Cirrus Native Design System - Color Token Reference

## Overview

This document describes the centralized color token system for the Cirrus Layout Token Injector plugin. The system follows a **primitive → semantic** architecture where primitive color scales form the foundation, and semantic tokens reference these primitives to provide meaningful, context-aware color values.

## Architecture

### Token Hierarchy

```
Primitive Tokens (Base Colors)
    ↓
Semantic Tokens (Context-Specific)
    ↓
CSS Custom Properties (--semantic-*)
```

**Key Principles:**
- **Primitive tokens** define raw color values (e.g., `#327aff`, `#000000`)
- **Semantic tokens** provide meaning and context (e.g., `text-primary`, `button-brand-fill-default`)
- **CSS custom properties** expose tokens for use in stylesheets
- All tokens support **light and dark modes** automatically

---

## Primitive Color Scales

Primitive tokens are the foundational color values organized into scales. These are defined in the `COLOR_TOKENS.primitive` object.

### Neutral Scale
Base black/white colors used for text, surfaces, and opacity overlays.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `neutral.base` | `#000000` | `#ffffff` |

**Usage:** Used to generate opacity-based surface tokens (neutral-100, neutral-200, etc.)

### Brand Scale
Primary brand blue colors for interactive elements and surfaces.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `brand.base` | `#327aff` | `#78acfa` |

**Usage:** Used for brand-colored surfaces, icons, and interactive states.

### Brand Button Scale
Distinct blue colors specifically for brand buttons (different from surface-brand).

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `brandButton.base` | `#0d99ff` | `#0c8ce9` |
| `brandButton.pressed` | `#007be5` | `#0a6dc2` |

**Usage:** Primary and pressed states for brand buttons.

### Inverted Scale
Gray/black colors for inverted surfaces.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `inverted.base` | `#808080` | `#000000` |

**Usage:** Used for inverted surface overlays and special UI states.

### White
Pure white color for text and buttons.

| Token | Value |
|-------|-------|
| `white` | `#ffffff` |

**Usage:** Text on colored backgrounds, button text, icons.

### Badge Hierarchy Primitives

#### Purple Hero
Colors for hero/parent badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `purpleHero.text` | `#831568` | `#fce8f6` |
| `purpleHero.stroke` | `#d01b9c` | `#d01b9c` |
| `purpleHero.fill` | `rgba(218, 82, 184, 0.2)` | `rgba(131, 21, 104, 0.3)` |
| `purpleHero.hover` | `rgba(208, 27, 156, 0.3)` | `rgba(131, 21, 104, 0.4)` |
| `purpleHero.pressed` | `rgba(208, 27, 156, 0.5)` | `rgba(131, 21, 104, 0.4)` |

#### Purple Parent
Colors for parent badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `purpleParent.text` | `#6818b1` | `#f7f2fc` |
| `purpleParent.stroke` | `#7a2ed6` | `#7a2ed6` |
| `purpleParent.fill` | `rgba(104, 24, 177, 0.2)` | `rgba(104, 24, 177, 0.3)` |
| `purpleParent.hover` | `rgba(122, 46, 214, 0.25)` | `rgba(122, 46, 214, 0.4)` |
| `purpleParent.pressed` | `rgba(122, 46, 214, 0.5)` | `rgba(122, 46, 214, 0.4)` |

#### Blue Child
Colors for child badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `blueChild.text` | `#075292` | `#eaf4fc` |
| `blueChild.stroke` | `#0a6dc2` | `#0a6dc2` |
| `blueChild.fill` | `rgba(13, 67, 214, 0.2)` | `rgba(13, 67, 214, 0.3)` |
| `blueChild.hover` | `rgba(10, 109, 194, 0.3)` | `rgba(10, 109, 194, 0.4)` |
| `blueChild.pressed` | `rgba(10, 109, 194, 0.6)` | `rgba(10, 109, 194, 0.4)` |

#### Teal Subchild
Colors for sub-child badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `tealSubchild.text` | `#013a6b` | `#ecf4fc` |
| `tealSubchild.stroke` | `#0f92b2` | `#087691` |
| `tealSubchild.fill` | `rgba(1, 58, 107, 0.2)` | `rgba(1, 58, 107, 0.3)` |
| `tealSubchild.hover` | `rgba(15, 146, 178, 0.3)` | `rgba(15, 146, 178, 0.4)` |
| `tealSubchild.pressed` | `rgba(15, 146, 178, 0.6)` | `rgba(15, 146, 178, 0.4)` |

---

## Semantic Tokens

Semantic tokens provide context-aware color values that reference primitive tokens. They are organized by category and exposed as CSS custom properties with the `--semantic-*` prefix.

### Naming Convention

**Format:** `--semantic-{category}-{variant}-{state}`

**Examples:**
- `--semantic-text-primary`
- `--semantic-surface-neutral-100`
- `--semantic-badge-hero-text`
- `--semantic-button-brand-fill-default`

### Text Tokens

| Token | Light Mode | Dark Mode | Notes |
|-------|------------|-----------|-------|
| `--semantic-text-primary` | `#2c2c2c` | `#ffffff` | Main text color |
| `--semantic-text-secondary` | `rgba(0, 0, 0, 0.6)` | `rgba(255, 255, 255, 0.6)` | Secondary text with opacity |

### Surface Tokens

#### Background
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-surface-bg` | `#ffffff` | `#2c2c2c` |

#### Neutral Scale
Opacity-based overlays using the neutral primitive base.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-surface-neutral-900` | `#000000` | `#ffffff` |
| `--semantic-surface-neutral-800` | `rgba(0, 0, 0, 0.8)` | `rgba(255, 255, 255, 0.8)` |
| `--semantic-surface-neutral-700` | `rgba(0, 0, 0, 0.7)` | `rgba(255, 255, 255, 0.7)` |
| `--semantic-surface-neutral-600` | `rgba(0, 0, 0, 0.6)` | `rgba(255, 255, 255, 0.6)` |
| `--semantic-surface-neutral-500` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.5)` |
| `--semantic-surface-neutral-400` | `rgba(0, 0, 0, 0.4)` | `rgba(255, 255, 255, 0.4)` |
| `--semantic-surface-neutral-300` | `rgba(0, 0, 0, 0.3)` | `rgba(255, 255, 255, 0.3)` |
| `--semantic-surface-neutral-200` | `rgba(0, 0, 0, 0.2)` | `rgba(255, 255, 255, 0.2)` |
| `--semantic-surface-neutral-150` | `rgba(0, 0, 0, 0.15)` | `rgba(255, 255, 255, 0.15)` |
| `--semantic-surface-neutral-120` | `rgba(0, 0, 0, 0.12)` | `rgba(255, 255, 255, 0.12)` |
| `--semantic-surface-neutral-100` | `rgba(0, 0, 0, 0.1)` | `rgba(255, 255, 255, 0.1)` |
| `--semantic-surface-neutral-75` | `rgba(0, 0, 0, 0.07)` | `rgba(255, 255, 255, 0.07)` |
| `--semantic-surface-neutral-50` | `rgba(0, 0, 0, 0.05)` | `rgba(255, 255, 255, 0.05)` |
| `--semantic-surface-neutral-20` | `rgba(0, 0, 0, 0.03)` | `rgba(255, 255, 255, 0.03)` |

#### Brand Scale
Opacity-based overlays using the brand primitive base.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-surface-brand-900` | `#327aff` | `#78acfa` |
| `--semantic-surface-brand-800` | `rgba(50, 122, 255, 0.9)` | `rgba(120, 172, 250, 0.8)` |
| `--semantic-surface-brand-700` | `rgba(50, 122, 255, 0.8)` | `rgba(120, 172, 250, 0.7)` |
| `--semantic-surface-brand-600` | `rgba(50, 122, 255, 0.7)` | `rgba(120, 172, 250, 0.6)` |
| `--semantic-surface-brand-500` | `rgba(50, 122, 255, 0.6)` | `rgba(120, 172, 250, 0.5)` |
| `--semantic-surface-brand-400` | `rgba(50, 122, 255, 0.5)` | `rgba(120, 172, 250, 0.4)` |
| `--semantic-surface-brand-300` | `rgba(50, 122, 255, 0.4)` | `rgba(120, 172, 250, 0.3)` |
| `--semantic-surface-brand-200` | `rgba(50, 122, 255, 0.2)` | `rgba(120, 172, 250, 0.2)` |
| `--semantic-surface-brand-150` | `rgba(50, 122, 255, 0.15)` | `rgba(120, 172, 250, 0.15)` |
| `--semantic-surface-brand-120` | `rgba(50, 122, 255, 0.12)` | `rgba(120, 172, 250, 0.12)` |
| `--semantic-surface-brand-100` | `rgba(50, 122, 255, 0.1)` | `rgba(120, 172, 250, 0.1)` |
| `--semantic-surface-brand-75` | `rgba(50, 122, 255, 0.07)` | `rgba(120, 172, 250, 0.07)` |
| `--semantic-surface-brand-50` | `rgba(50, 122, 255, 0.05)` | `rgba(120, 172, 250, 0.05)` |
| `--semantic-surface-brand-20` | `rgba(50, 122, 255, 0.03)` | `rgba(120, 172, 250, 0.03)` |

#### Inverted Scale
Opacity-based overlays using the inverted primitive base.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-surface-inverted-900` | `#808080` | `#000000` |
| `--semantic-surface-inverted-800` | `rgba(128, 128, 128, 0.8)` | `rgba(0, 0, 0, 0.8)` |
| `--semantic-surface-inverted-700` | `rgba(128, 128, 128, 0.7)` | `rgba(0, 0, 0, 0.7)` |
| `--semantic-surface-inverted-600` | `rgba(128, 128, 128, 0.6)` | `rgba(0, 0, 0, 0.6)` |
| `--semantic-surface-inverted-500` | `rgba(128, 128, 128, 0.5)` | `rgba(0, 0, 0, 0.5)` |
| `--semantic-surface-inverted-400` | `rgba(128, 128, 128, 0.4)` | `rgba(0, 0, 0, 0.4)` |
| `--semantic-surface-inverted-300` | `rgba(128, 128, 128, 0.3)` | `rgba(0, 0, 0, 0.3)` |
| `--semantic-surface-inverted-200` | `rgba(128, 128, 128, 0.2)` | `rgba(0, 0, 0, 0.2)` |
| `--semantic-surface-inverted-150` | `rgba(128, 128, 128, 0.15)` | `rgba(0, 0, 0, 0.15)` |
| `--semantic-surface-inverted-120` | `rgba(128, 128, 128, 0.12)` | `rgba(0, 0, 0, 0.12)` |
| `--semantic-surface-inverted-100` | `rgba(128, 128, 128, 0.1)` | `rgba(0, 0, 0, 0.1)` |
| `--semantic-surface-inverted-75` | `rgba(128, 128, 128, 0.07)` | `rgba(0, 0, 0, 0.07)` |
| `--semantic-surface-inverted-50` | `rgba(128, 128, 128, 0.05)` | `rgba(0, 0, 0, 0.05)` |
| `--semantic-surface-inverted-20` | `rgba(128, 128, 128, 0.03)` | `rgba(0, 0, 0, 0.03)` |

### Badge Tokens

Badge tokens are organized by hierarchy level (hero, parent, child, subChild, adjust).

#### Hero Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-hero-text` | `#831568` | `#fce8f6` |
| `--semantic-badge-hero-icon` | `#831568` | `#fce8f6` |
| `--semantic-badge-hero-fill` | `rgba(218, 82, 184, 0.2)` | `rgba(131, 21, 104, 0.3)` |
| `--semantic-badge-hero-stroke` | `#d01b9c` | `#d01b9c` |
| `--semantic-badge-hero-button-hover` | `rgba(208, 27, 156, 0.3)` | `rgba(131, 21, 104, 0.4)` |
| `--semantic-badge-hero-button-pressed` | `rgba(208, 27, 156, 0.5)` | `rgba(131, 21, 104, 0.4)` |

#### Parent Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-parent-text` | `#6818b1` | `#f7f2fc` |
| `--semantic-badge-parent-icon` | `#6818b1` | `#f7f2fc` |
| `--semantic-badge-parent-fill` | `rgba(104, 24, 177, 0.2)` | `rgba(104, 24, 177, 0.3)` |
| `--semantic-badge-parent-stroke` | `#7a2ed6` | `#7a2ed6` |
| `--semantic-badge-parent-button-hover` | `rgba(122, 46, 214, 0.25)` | `rgba(122, 46, 214, 0.4)` |
| `--semantic-badge-parent-button-pressed` | `rgba(122, 46, 214, 0.5)` | `rgba(122, 46, 214, 0.4)` |

#### Child Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-child-text` | `#075292` | `#eaf4fc` |
| `--semantic-badge-child-icon` | `#075292` | `#eaf4fc` |
| `--semantic-badge-child-fill` | `rgba(13, 67, 214, 0.2)` | `rgba(13, 67, 214, 0.3)` |
| `--semantic-badge-child-stroke` | `#0a6dc2` | `#0a6dc2` |
| `--semantic-badge-child-button-hover` | `rgba(10, 109, 194, 0.3)` | `rgba(10, 109, 194, 0.4)` |
| `--semantic-badge-child-button-pressed` | `rgba(10, 109, 194, 0.6)` | `rgba(10, 109, 194, 0.4)` |

#### Subchild Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-subChild-text` | `#013a6b` | `#ecf4fc` |
| `--semantic-badge-subChild-icon` | `#013a6b` | `#ecf4fc` |
| `--semantic-badge-subChild-fill` | `rgba(1, 58, 107, 0.2)` | `rgba(1, 58, 107, 0.3)` |
| `--semantic-badge-subChild-stroke` | `#0f92b2` | `#087691` |
| `--semantic-badge-subChild-button-hover` | `rgba(15, 146, 178, 0.3)` | `rgba(15, 146, 178, 0.4)` |
| `--semantic-badge-subChild-button-pressed` | `rgba(15, 146, 178, 0.6)` | `rgba(15, 146, 178, 0.4)` |

#### Adjust Badge
Adjust badges reference other semantic tokens (text-primary, surface-neutral-*).

| Token | Light Mode | Dark Mode | References |
|-------|------------|-----------|------------|
| `--semantic-badge-adjust-text` | `#2c2c2c` | `#ffffff` | `text-primary` |
| `--semantic-badge-adjust-icon` | `#000000` | `#ffffff` | `surface-neutral-900` |
| `--semantic-badge-adjust-fill` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` | Transparent |
| `--semantic-badge-adjust-stroke` | `rgba(0, 0, 0, 0.3)` | `rgba(255, 255, 255, 0.2)` | `surface-neutral-300/200` |
| `--semantic-badge-adjust-button-hover` | `rgba(0, 0, 0, 0.1)` | `rgba(255, 255, 255, 0.15)` | `surface-neutral-100/150` |
| `--semantic-badge-adjust-button-pressed` | `rgba(0, 0, 0, 0.2)` | `rgba(255, 255, 255, 0.3)` | `surface-neutral-200/300` |

### Icon Tokens

#### Neutral Icons
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-icon-neutral-active` | `#2c2c2c` | `#ffffff` |
| `--semantic-icon-neutral-inactive` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.7)` |

#### Brand Icons
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-icon-brand-active` | `#327aff` | `#78acfa` |
| `--semantic-icon-brand-inactive` | `rgba(50, 122, 255, 0.7)` | `rgba(120, 172, 250, 0.6)` |

### Button Tokens

#### Brand Button
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-button-brand-text` | `#ffffff` | `#ffffff` |
| `--semantic-button-brand-fill-default` | `#0d99ff` | `#0c8ce9` |
| `--semantic-button-brand-fill-pressed` | `#007be5` | `#0a6dc2` |
| `--semantic-button-brand-fill-disabled` | `rgba(13, 153, 255, 0.5)` | `rgba(12, 140, 233, 0.5)` |

#### Secondary Neutral Button
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-button-secondary-neutral-text-default` | `#2c2c2c` | `#ffffff` |
| `--semantic-button-secondary-neutral-fill-default` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` |
| `--semantic-button-secondary-neutral-fill-pressed` | `rgba(0, 0, 0, 0.07)` | `rgba(255, 255, 255, 0.15)` |
| `--semantic-button-secondary-neutral-fill-disabled` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` |
| `--semantic-button-secondary-neutral-stroke-default` | `rgba(0, 0, 0, 0.1)` | `rgba(255, 255, 255, 0.4)` |
| `--semantic-button-secondary-neutral-stroke-pressed` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` |
| `--semantic-button-secondary-neutral-stroke-disabled` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` |
| `--semantic-button-secondary-neutral-disabled` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.5)` |

#### Secondary Brand Button
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-button-secondary-brand-text-default` | `#2c2c2c` | `#ffffff` |
| `--semantic-button-secondary-brand-fill-default` | `rgba(50, 122, 255, 0)` | `rgba(120, 172, 250, 0)` |
| `--semantic-button-secondary-brand-fill-pressed` | `rgba(50, 122, 255, 0.07)` | `rgba(120, 172, 250, 0.2)` |
| `--semantic-button-secondary-brand-fill-disabled` | `rgba(50, 122, 255, 0)` | `rgba(120, 172, 250, 0)` |
| `--semantic-button-secondary-brand-stroke-default` | `rgba(50, 122, 255, 0.5)` | `rgba(120, 172, 250, 0.4)` |
| `--semantic-button-secondary-brand-stroke-pressed` | `rgba(50, 122, 255, 0)` | `rgba(120, 172, 250, 0)` |
| `--semantic-button-secondary-brand-stroke-disabled` | `rgba(50, 122, 255, 0)` | `rgba(120, 172, 250, 0)` |
| `--semantic-button-secondary-brand-disabled` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.5)` |

#### Ghost Neutral Button
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-button-ghost-neutral-text-default` | `#2c2c2c` | `#ffffff` |
| `--semantic-button-ghost-neutral-text-pressed` | `#2c2c2c` | `#ffffff` |
| `--semantic-button-ghost-neutral-text-disabled` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.5)` |
| `--semantic-button-ghost-neutral-icon-default` | `#2c2c2c` | `#ffffff` |
| `--semantic-button-ghost-neutral-icon-hover` | `rgba(0, 0, 0, 0.7)` | `rgba(255, 255, 255, 0.7)` |
| `--semantic-button-ghost-neutral-icon-pressed` | `#2c2c2c` | `#ffffff` |
| `--semantic-button-ghost-neutral-icon-disabled` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.5)` |
| `--semantic-button-ghost-neutral-fill-default` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` |
| `--semantic-button-ghost-neutral-fill-hover` | `rgba(0, 0, 0, 0.2)` | `rgba(255, 255, 255, 0.2)` |
| `--semantic-button-ghost-neutral-fill-pressed` | `rgba(0, 0, 0, 0.1)` | `rgba(255, 255, 255, 0.1)` |
| `--semantic-button-ghost-neutral-fill-disabled` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` |

---

## Implementation Details

### Token Structure in Code

All tokens are centralized in the `COLOR_TOKENS` constant object in `src/ui.html`:

```javascript
const COLOR_TOKENS = {
  primitive: {
    // Primitive color scales (see above)
  },
  semantic: {
    light: {
      // Light mode semantic tokens
    },
    dark: {
      // Dark mode semantic tokens
    }
  }
}
```

### Dynamic Token Application

The `updateColorMode()` function:
1. Detects the current color scheme (light/dark) using `window.matchMedia('(prefers-color-scheme: dark)')`
2. Selects the appropriate semantic token set from `COLOR_TOKENS.semantic[mode]`
3. Uses the `setTokenProperties()` helper function to recursively set CSS custom properties on `:root`
4. Explicitly sets commonly-used tokens (text, surface, badge, icon, button) with proper naming conventions
5. Creates backward-compatible aliases for old token names to ensure no breaking changes

**Helper Function: `setTokenProperties()`**
- Recursively traverses the token object structure
- Converts camelCase keys to kebab-case CSS custom property names
- Sets tokens with the `--semantic-*` prefix automatically
- Handles nested objects (e.g., `badge.hero.text` → `--semantic-badge-hero-text`)

### CSS Usage

Use semantic tokens in your CSS:

```css
.my-component {
  color: var(--semantic-text-primary);
  background: var(--semantic-surface-bg);
  border: 1px solid var(--semantic-surface-neutral-200);
}

.brand-button {
  background: var(--semantic-button-brand-fill-default);
  color: var(--semantic-button-brand-text);
}

.brand-button:hover {
  background: var(--semantic-button-brand-fill-pressed);
}
```

---

## Migration Guide

### Backward Compatibility

The system maintains **backward-compatible aliases** for old token names to ensure no breaking changes during migration. Old token names continue to work but should be migrated to the new `--semantic-*` naming convention.

### Old vs. New Token Names

#### Text Tokens
| Old Name | New Name |
|----------|----------|
| `--text-text-primary` | `--semantic-text-primary` |
| `--text-text-secondary` | `--semantic-text-secondary` |

#### Surface Tokens
| Old Name | New Name |
|----------|----------|
| `--surface-bg-bg` | `--semantic-surface-bg` |
| `--surface-neutral-100` | `--semantic-surface-neutral-100` |
| `--surface-neutral-200` | `--semantic-surface-neutral-200` |
| `--surface-neutral-300` | `--semantic-surface-neutral-300` |
| `--surface-neutral-120` | `--semantic-surface-neutral-120` |
| `--surface-neutral-75` | `--semantic-surface-neutral-75` |
| `--surface-neutral-150` | `--semantic-surface-neutral-150` |
| `--surface-brand-200` | `--semantic-surface-brand-200` |
| `--surface-brand-300` | `--semantic-surface-brand-300` |
| `--surface-brand-500` | `--semantic-surface-brand-500` |
| `--surface-inverted-100` | `--semantic-surface-inverted-100` |
| `--surface-inverted-200` | `--semantic-surface-inverted-200` |

**Note:** Only commonly-used surface tokens have backward-compatible aliases. For other shades, use the new `--semantic-surface-*` naming convention.

#### Badge Tokens
| Old Name | New Name |
|----------|----------|
| `--badge-hero-hero-text` | `--semantic-badge-hero-text` |
| `--badge-hero-hero-icon` | `--semantic-badge-hero-icon` |
| `--badge-hero-hero-fill` | `--semantic-badge-hero-fill` |
| `--badge-hero-hero-stroke` | `--semantic-badge-hero-stroke` |
| `--badge-hero-hero-button-hover` | `--semantic-badge-hero-button-hover` |
| `--badge-hero-hero-button-pressed` | `--semantic-badge-hero-button-pressed` |
| `--badge-parent-parent-*` | `--semantic-badge-parent-*` |
| `--badge-child-child-*` | `--semantic-badge-child-*` |
| `--badge-sub-child-subChild-*` | `--semantic-badge-subChild-*` |

#### Icon Tokens
| Old Name | New Name |
|----------|----------|
| `--icon-neutral-active` | `--semantic-icon-neutral-active` |
| `--icon-neutral-inactive` | `--semantic-icon-neutral-inactive` |
| `--icon-brand-active` | `--semantic-icon-brand-active` |
| `--icon-brand-inactive` | `--semantic-icon-brand-inactive` |

#### Button Tokens
| Old Name | New Name |
|----------|----------|
| `--button-brand-text` | `--semantic-button-brand-text` |
| `--button-brand-fill-default` | `--semantic-button-brand-fill-default` |
| `--button-brand-fill-hover` | `--semantic-button-brand-fill-pressed` (hover uses pressed value) |
| `--button-brand-fill-pressed` | `--semantic-button-brand-fill-pressed` |
| `--button-brand-fill-disabled` | `--semantic-button-brand-fill-disabled` |
| `--button-secondary-neutral-button-secondary-neutral-*` | `--semantic-button-secondary-neutral-*` |
| `--button-secondary-brand-button-secondary-brand-*` | `--semantic-button-secondary-brand-*` |

**Note:** The `--button-secondary-brand-button-secondary-brand-fill-active` and `--button-secondary-brand-button-secondary-brand-stroke-active` aliases also exist for active states.

### Migration Steps

1. **Identify old token usage**: Search for old token names in your CSS/HTML
2. **Replace with new names**: Update to `--semantic-*` naming convention
3. **Remove redundant prefixes**: Clean up names like `badge-hero-hero-*` → `badge-hero-*`
4. **Test**: Verify colors render correctly in both light and dark modes
5. **Remove old aliases**: Once migration is complete, old aliases can be removed (future cleanup)

### Benefits of Migration

- **Consistency**: All tokens follow the same naming pattern
- **Clarity**: Semantic names are more descriptive
- **Maintainability**: Single source of truth in `COLOR_TOKENS`
- **Type Safety**: Easier to discover and use tokens correctly
- **Future-proof**: Foundation for potential TypeScript/design token tooling

---

## Best Practices

### 1. Always Use Semantic Tokens
Prefer semantic tokens over hardcoded colors or direct primitive references:

```css
/* ✅ Good */
color: var(--semantic-text-primary);

/* ❌ Avoid */
color: #2c2c2c;
color: var(--primitive-neutral-base);
```

### 2. Use Appropriate Semantic Context
Choose tokens that match the semantic meaning:

```css
/* ✅ Good - semantic meaning matches */
.button { background: var(--semantic-button-brand-fill-default); }

/* ❌ Avoid - using surface token for button */
.button { background: var(--semantic-surface-brand-900); }
```

### 3. Provide Fallback Values
Include fallback colors for better error handling:

```css
/* ✅ Good */
color: var(--semantic-text-primary, #2c2c2c);

/* ⚠️ Acceptable (fallback optional but recommended) */
color: var(--semantic-text-primary);
```

### 4. Reference Other Tokens When Appropriate
Some tokens intentionally reference others (like adjust badges):

```css
/* ✅ Good - adjust badge references text-primary */
.adjust-badge { color: var(--semantic-badge-adjust-text); }
```

---

## Token Naming Cleanup

The migration addressed several naming inconsistencies:

- **Removed redundant prefixes**: `--badge-hero-hero-text` → `--semantic-badge-hero-text`
- **Standardized format**: All tokens now use `--semantic-{category}-{variant}-{state}`
- **Consistent casing**: kebab-case throughout
- **Clear hierarchy**: Category → variant → state structure

---

## Implementation Status

### Current Implementation (v1.0)

✅ **Completed:**
- Primitive color scales defined with light/dark mode values
- Semantic tokens organized by category (text, surface, badge, icon, button)
- Centralized `COLOR_TOKENS` object in `src/ui.html`
- `updateColorMode()` function refactored to use centralized tokens
- `setTokenProperties()` helper function for recursive token application
- Backward-compatible aliases for all old token names
- Comprehensive documentation

**Implementation Note:** Currently, semantic tokens contain hardcoded color values rather than CSS `var()` references to primitives. This approach was chosen for:
- Simplicity and direct control
- Better browser compatibility
- Easier debugging
- No performance overhead from CSS variable resolution chains

Future enhancements could migrate to CSS variable references if needed (e.g., `semantic-text-primary: var(--primitive-neutral-900)`).

## Future Considerations

### Potential Enhancements

1. **CSS Variable References**: Future implementation could use CSS `var()` references in semantic tokens (e.g., `semantic-text-primary: var(--primitive-neutral-900)`)
2. **Design Token Export**: Export tokens to JSON/TypeScript for use in other tools
3. **Token Validation**: Add runtime validation to ensure all tokens are defined
4. **Theme Variants**: Extend beyond light/dark to support custom themes
5. **Opacity Utilities**: Create utility functions for dynamic opacity adjustments
6. **Gradual Migration**: Continue replacing old token references with new `--semantic-*` names throughout the codebase

---

## Notes

- **Figma Export**: The Figma design system export provides the authoritative source of truth for all color values
- **Opacity Differences**: Some tokens have different opacity values between light and dark modes (e.g., hero-fill: 0.2 light / 0.3 dark)
- **Button Brand Colors**: Button brand colors (`#0d99ff` / `#0c8ce9`) are distinct from surface-brand-900 (`#327aff` / `#78acfa`)
- **Badge Colors**: Badge hierarchy colors are extracted as primitives to maintain consistency
- **Token References**: Some semantic tokens reference others (e.g., adjust-text → text-primary) - this pattern is intentional and documented

---

## Summary

This token system provides:
- ✅ **Centralized** color definitions in `COLOR_TOKENS`
- ✅ **Primitive → Semantic** architecture for maintainability
- ✅ **Light/Dark mode** support with automatic switching
- ✅ **Backward compatibility** via aliases
- ✅ **Consistent naming** with `--semantic-*` prefix
- ✅ **Comprehensive documentation** for all tokens

For questions or updates to this system, refer to the implementation in `src/ui.html` and the `COLOR_TOKENS` constant.
