# Cirrus Design System - Design Token Reference

## Overview

This document describes the comprehensive design token system for the Cirrus Layout Token Injector plugin. The system follows an **atomic design** architecture with a **primitive → semantic** token hierarchy, where primitive tokens form the foundation and semantic tokens provide meaningful, context-aware values.

## Architecture

### Token Hierarchy

```
Primitive Tokens (Base Values)
    ↓
Semantic Tokens (Context-Specific)
    ↓
CSS Custom Properties (--semantic-*)
```

**Key Principles:**
- **Primitive tokens** define raw values (colors, spacing units, font sizes, etc.)
- **Semantic tokens** provide meaning and context (e.g., `text-primary`, `spacing-md`, `radius-md`)
- **CSS custom properties** expose tokens for use in stylesheets
- Color tokens support **light and dark modes** automatically
- Non-color tokens (spacing, typography, radius, transition) are mode-independent

---

## Token Categories

The design token system is organized into five main categories:

1. **Color** - Text, surfaces, badges, icons, buttons
2. **Spacing** - Padding, margin, gap values
3. **Typography** - Font sizes, weights, line heights, letter spacing
4. **Border Radius** - Corner radius values
5. **Transition** - Animation durations and easing functions

---

## Primitive Tokens

Primitive tokens are the foundational values organized into scales. These are defined in the `DESIGN_TOKENS.primitive` object.

### Color Primitives

#### Neutral Scale
Base black/white colors used for text, surfaces, and opacity overlays.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.neutral.base` | `#000000` | `#ffffff` |

**Usage:** Used to generate opacity-based surface tokens (neutral-100, neutral-200, etc.)

#### Brand Scale
Primary brand blue colors for interactive elements and surfaces.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.brand.base` | `#327aff` | `#78acfa` |

**Usage:** Used for brand-colored surfaces, icons, and interactive states.

#### Brand Button Scale
Distinct blue colors specifically for brand buttons (different from surface-brand).

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.brandButton.base` | `#0d99ff` | `#0c8ce9` |
| `color.brandButton.pressed` | `#007be5` | `#0a6dc2` |

**Usage:** Primary and pressed states for brand buttons.

#### Inverted Scale
Gray/black colors for inverted surfaces.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.inverted.base` | `#808080` | `#000000` |

**Usage:** Used for inverted surface overlays and special UI states.

#### Badge Hierarchy Primitives

##### Purple Hero
Colors for hero/parent badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.purpleHero.text` | `#831568` | `#fce8f6` |
| `color.purpleHero.stroke` | `#d01b9c` | `#d01b9c` |
| `color.purpleHero.fill` | `rgba(218, 82, 184, 0.2)` | `rgba(131, 21, 104, 0.3)` |
| `color.purpleHero.hover` | `rgba(208, 27, 156, 0.3)` | `rgba(131, 21, 104, 0.4)` |
| `color.purpleHero.pressed` | `rgba(208, 27, 156, 0.5)` | `rgba(131, 21, 104, 0.4)` |

##### Purple Parent
Colors for parent badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.purpleParent.text` | `#6818b1` | `#f7f2fc` |
| `color.purpleParent.stroke` | `#7a2ed6` | `#7a2ed6` |
| `color.purpleParent.fill` | `rgba(104, 24, 177, 0.2)` | `rgba(104, 24, 177, 0.3)` |
| `color.purpleParent.hover` | `rgba(122, 46, 214, 0.25)` | `rgba(122, 46, 214, 0.4)` |
| `color.purpleParent.pressed` | `rgba(122, 46, 214, 0.5)` | `rgba(122, 46, 214, 0.4)` |

##### Blue Child
Colors for child badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.blueChild.text` | `#075292` | `#eaf4fc` |
| `color.blueChild.stroke` | `#0a6dc2` | `#0a6dc2` |
| `color.blueChild.fill` | `rgba(13, 67, 214, 0.2)` | `rgba(13, 67, 214, 0.3)` |
| `color.blueChild.hover` | `rgba(10, 109, 194, 0.3)` | `rgba(10, 109, 194, 0.4)` |
| `color.blueChild.pressed` | `rgba(10, 109, 194, 0.6)` | `rgba(10, 109, 194, 0.4)` |

##### Teal Subchild
Colors for sub-child badge hierarchy level.

| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `color.tealSubchild.text` | `#013a6b` | `#ecf4fc` |
| `color.tealSubchild.stroke` | `#0f92b2` | `#087691` |
| `color.tealSubchild.fill` | `rgba(1, 58, 107, 0.2)` | `rgba(1, 58, 107, 0.3)` |
| `color.tealSubchild.hover` | `rgba(15, 146, 178, 0.3)` | `rgba(15, 146, 178, 0.4)` |
| `color.tealSubchild.pressed` | `rgba(15, 146, 178, 0.6)` | `rgba(15, 146, 178, 0.4)` |

### Spacing Primitives

Spacing primitives use a **4px base unit** system for consistent spacing throughout the interface.

| Token | Value |
|-------|-------|
| `spacing.0` | `0px` |
| `spacing.2` | `2px` |
| `spacing.4` | `4px` |
| `spacing.6` | `6px` |
| `spacing.8` | `8px` |
| `spacing.10` | `10px` |
| `spacing.12` | `12px` |
| `spacing.16` | `16px` |
| `spacing.20` | `20px` |
| `spacing.24` | `24px` |
| `spacing.32` | `32px` |
| `spacing.40` | `40px` |
| `spacing.48` | `48px` |
| `spacing.64` | `64px` |

**Usage:** Base values for semantic spacing tokens. The 4px base unit provides good granularity for UI spacing.

### Typography Primitives

#### Font Sizes
| Token | Value |
|-------|-------|
| `typography.fontSize.xs` | `10px` |
| `typography.fontSize.sm` | `11px` |
| `typography.fontSize.base` | `12px` |
| `typography.fontSize.md` | `13px` |
| `typography.fontSize.lg` | `14px` |
| `typography.fontSize.xl` | `16px` |
| `typography.fontSize.2xl` | `18px` |

#### Font Weights
| Token | Value |
|-------|-------|
| `typography.fontWeight.normal` | `400` |
| `typography.fontWeight.medium` | `450` |
| `typography.fontWeight.semibold` | `500` |
| `typography.fontWeight.bold` | `600` |

#### Line Heights
| Token | Value |
|-------|-------|
| `typography.lineHeight.tight` | `1.2` |
| `typography.lineHeight.normal` | `1.4` |
| `typography.lineHeight.relaxed` | `1.5` |
| `typography.lineHeight.loose` | `1.6` |

#### Letter Spacing
| Token | Value |
|-------|-------|
| `typography.letterSpacing.none` | `0` |
| `typography.letterSpacing.tight` | `0.055px` |

### Border Radius Primitives

| Token | Value |
|-------|-------|
| `radius.none` | `0px` |
| `radius.xs` | `2px` |
| `radius.sm` | `4px` |
| `radius.md` | `6px` |
| `radius.lg` | `8px` |
| `radius.xl` | `12px` |
| `radius.2xl` | `18px` |
| `radius.full` | `50%` |

### Transition Primitives

#### Durations
| Token | Value |
|-------|-------|
| `transition.duration.fast` | `0.15s` |
| `transition.duration.base` | `0.2s` |
| `transition.duration.slow` | `0.3s` |

#### Easing Functions
| Token | Value |
|-------|-------|
| `transition.easing.ease` | `ease` |
| `transition.easing.ease-in-out` | `ease-in-out` |
| `transition.easing.ease-out` | `ease-out` |

---

## Semantic Tokens

Semantic tokens provide context-aware values that reference primitive tokens. They are organized by category and exposed as CSS custom properties with the `--semantic-*` prefix.

### Naming Convention

**Format:** `--semantic-{category}-{variant}-{state}`

**Examples:**
- `--semantic-text-primary`
- `--semantic-spacing-md`
- `--semantic-typography-body-md-size`
- `--semantic-radius-md`
- `--semantic-transition-base`

### Color Semantic Tokens

#### Text Tokens
| Token | Light Mode | Dark Mode | Notes |
|-------|------------|-----------|-------|
| `--semantic-text-primary` | `#2c2c2c` | `#ffffff` | Main text color |
| `--semantic-text-secondary` | `rgba(0, 0, 0, 0.6)` | `rgba(255, 255, 255, 0.6)` | Secondary text with opacity |

#### Surface Tokens

##### Background
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-surface-bg` | `#ffffff` | `#2c2c2c` |

##### Neutral Scale
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

##### Brand Scale
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

##### Inverted Scale
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

#### Badge Tokens

Badge tokens are organized by hierarchy level (hero, parent, child, subChild, adjust).

##### Hero Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-hero-text` | `#831568` | `#fce8f6` |
| `--semantic-badge-hero-icon` | `#831568` | `#fce8f6` |
| `--semantic-badge-hero-fill` | `rgba(218, 82, 184, 0.2)` | `rgba(131, 21, 104, 0.3)` |
| `--semantic-badge-hero-stroke` | `#d01b9c` | `#d01b9c` |
| `--semantic-badge-hero-button-hover` | `rgba(208, 27, 156, 0.3)` | `rgba(131, 21, 104, 0.4)` |
| `--semantic-badge-hero-button-pressed` | `rgba(208, 27, 156, 0.5)` | `rgba(131, 21, 104, 0.4)` |

##### Parent Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-parent-text` | `#6818b1` | `#f7f2fc` |
| `--semantic-badge-parent-icon` | `#6818b1` | `#f7f2fc` |
| `--semantic-badge-parent-fill` | `rgba(104, 24, 177, 0.2)` | `rgba(104, 24, 177, 0.3)` |
| `--semantic-badge-parent-stroke` | `#7a2ed6` | `#7a2ed6` |
| `--semantic-badge-parent-button-hover` | `rgba(122, 46, 214, 0.25)` | `rgba(122, 46, 214, 0.4)` |
| `--semantic-badge-parent-button-pressed` | `rgba(122, 46, 214, 0.5)` | `rgba(122, 46, 214, 0.4)` |

##### Child Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-child-text` | `#075292` | `#eaf4fc` |
| `--semantic-badge-child-icon` | `#075292` | `#eaf4fc` |
| `--semantic-badge-child-fill` | `rgba(13, 67, 214, 0.2)` | `rgba(13, 67, 214, 0.3)` |
| `--semantic-badge-child-stroke` | `#0a6dc2` | `#0a6dc2` |
| `--semantic-badge-child-button-hover` | `rgba(10, 109, 194, 0.3)` | `rgba(10, 109, 194, 0.4)` |
| `--semantic-badge-child-button-pressed` | `rgba(10, 109, 194, 0.6)` | `rgba(10, 109, 194, 0.4)` |

##### Subchild Badge
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-badge-subChild-text` | `#013a6b` | `#ecf4fc` |
| `--semantic-badge-subChild-icon` | `#013a6b` | `#ecf4fc` |
| `--semantic-badge-subChild-fill` | `rgba(1, 58, 107, 0.2)` | `rgba(1, 58, 107, 0.3)` |
| `--semantic-badge-subChild-stroke` | `#0f92b2` | `#087691` |
| `--semantic-badge-subChild-button-hover` | `rgba(15, 146, 178, 0.3)` | `rgba(15, 146, 178, 0.4)` |
| `--semantic-badge-subChild-button-pressed` | `rgba(15, 146, 178, 0.6)` | `rgba(15, 146, 178, 0.4)` |

##### Adjust Badge
Adjust badges reference other semantic tokens (text-primary, surface-neutral-*).

| Token | Light Mode | Dark Mode | References |
|-------|------------|-----------|------------|
| `--semantic-badge-adjust-text` | `#2c2c2c` | `#ffffff` | `text-primary` |
| `--semantic-badge-adjust-icon` | `#000000` | `#ffffff` | `surface-neutral-900` |
| `--semantic-badge-adjust-fill` | `rgba(0, 0, 0, 0)` | `rgba(255, 255, 255, 0)` | Transparent |
| `--semantic-badge-adjust-stroke` | `rgba(0, 0, 0, 0.3)` | `rgba(255, 255, 255, 0.2)` | `surface-neutral-300/200` |
| `--semantic-badge-adjust-button-hover` | `rgba(0, 0, 0, 0.1)` | `rgba(255, 255, 255, 0.15)` | `surface-neutral-100/150` |
| `--semantic-badge-adjust-button-pressed` | `rgba(0, 0, 0, 0.2)` | `rgba(255, 255, 255, 0.3)` | `surface-neutral-200/300` |

#### Icon Tokens

##### Neutral Icons
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-icon-neutral-active` | `#2c2c2c` | `#ffffff` |
| `--semantic-icon-neutral-inactive` | `rgba(0, 0, 0, 0.5)` | `rgba(255, 255, 255, 0.7)` |

##### Brand Icons
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-icon-brand-active` | `#327aff` | `#78acfa` |
| `--semantic-icon-brand-inactive` | `rgba(50, 122, 255, 0.7)` | `rgba(120, 172, 250, 0.6)` |

#### Button Tokens

##### Brand Button
| Token | Light Mode | Dark Mode |
|-------|------------|-----------|
| `--semantic-button-brand-text` | `#ffffff` | `#ffffff` |
| `--semantic-button-brand-fill-default` | `#0d99ff` | `#0c8ce9` |
| `--semantic-button-brand-fill-pressed` | `#007be5` | `#0a6dc2` |
| `--semantic-button-brand-fill-disabled` | `rgba(13, 153, 255, 0.5)` | `rgba(12, 140, 233, 0.5)` |

##### Secondary Neutral Button
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

##### Secondary Brand Button
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

##### Ghost Neutral Button
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

### Spacing Semantic Tokens

Spacing tokens use a semantic naming system based on common use cases.

| Token | Value | Usage |
|-------|-------|-------|
| `--semantic-spacing-xs` | `2px` | Tight spacing (e.g., list item padding) |
| `--semantic-spacing-sm` | `4px` | Small spacing (e.g., icon gaps) |
| `--semantic-spacing-md` | `8px` | Medium spacing (default, e.g., button padding) |
| `--semantic-spacing-lg` | `12px` | Large spacing (e.g., section gaps) |
| `--semantic-spacing-xl` | `16px` | Extra large spacing (e.g., container padding) |
| `--semantic-spacing-2xl` | `20px` | 2x extra large (e.g., major section spacing) |
| `--semantic-spacing-3xl` | `24px` | 3x extra large (e.g., page margins) |
| `--semantic-spacing-4xl` | `32px` | 4x extra large (e.g., large container spacing) |

**Usage Examples:**
```css
.container {
  padding: var(--semantic-spacing-xl);
  gap: var(--semantic-spacing-lg);
}

.button {
  padding: var(--semantic-spacing-md) var(--semantic-spacing-lg);
  margin-bottom: var(--semantic-spacing-md);
}
```

### Typography Semantic Tokens

Typography tokens combine font size, weight, line height, and letter spacing into semantic roles.

#### Body Text
| Token | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `--semantic-typography-body-xs-size` | `10px` | - | `1.4` | `0` |
| `--semantic-typography-body-xs-weight` | - | `400` | - | - |
| `--semantic-typography-body-xs-line-height` | - | - | `1.4` | - |
| `--semantic-typography-body-xs-letter-spacing` | - | - | - | `0` |
| `--semantic-typography-body-sm-size` | `12px` | - | `1.4` | `0` |
| `--semantic-typography-body-sm-weight` | - | `400` | - | - |
| `--semantic-typography-body-sm-line-height` | - | - | `1.4` | - |
| `--semantic-typography-body-sm-letter-spacing` | - | - | - | `0` |
| `--semantic-typography-body-md-size` | `14px` | - | `1.5` | `0` |
| `--semantic-typography-body-md-weight` | - | `400` | - | - |
| `--semantic-typography-body-md-line-height` | - | - | `1.5` | - |
| `--semantic-typography-body-md-letter-spacing` | - | - | - | `0` |
| `--semantic-typography-body-lg-size` | `16px` | - | `1.5` | `0` |
| `--semantic-typography-body-lg-weight` | - | `400` | - | - |
| `--semantic-typography-body-lg-line-height` | - | - | `1.5` | - |
| `--semantic-typography-body-lg-letter-spacing` | - | - | - | `0` |

#### Label Text
| Token | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `--semantic-typography-label-sm-size` | `11px` | - | `1.4` | `0.055px` |
| `--semantic-typography-label-sm-weight` | - | `450` | - | - |
| `--semantic-typography-label-sm-line-height` | - | - | `1.4` | - |
| `--semantic-typography-label-sm-letter-spacing` | - | - | - | `0.055px` |
| `--semantic-typography-label-md-size` | `13px` | - | `1.4` | `0` |
| `--semantic-typography-label-md-weight` | - | `500` | - | - |
| `--semantic-typography-label-md-line-height` | - | - | `1.4` | - |
| `--semantic-typography-label-md-letter-spacing` | - | - | - | `0` |
| `--semantic-typography-label-lg-size` | `14px` | - | `1.4` | `0` |
| `--semantic-typography-label-lg-weight` | - | `500` | - | - |
| `--semantic-typography-label-lg-line-height` | - | - | `1.4` | - |
| `--semantic-typography-label-lg-letter-spacing` | - | - | - | `0` |

#### Heading Text
| Token | Size | Weight | Line Height | Letter Spacing |
|-------|------|--------|-------------|----------------|
| `--semantic-typography-heading-sm-size` | `14px` | - | `1.4` | `0` |
| `--semantic-typography-heading-sm-weight` | - | `600` | - | - |
| `--semantic-typography-heading-sm-line-height` | - | - | `1.4` | - |
| `--semantic-typography-heading-sm-letter-spacing` | - | - | - | `0` |
| `--semantic-typography-heading-md-size` | `18px` | - | `1.4` | `0` |
| `--semantic-typography-heading-md-weight` | - | `600` | - | - |
| `--semantic-typography-heading-md-line-height` | - | - | `1.4` | - |
| `--semantic-typography-heading-md-letter-spacing` | - | - | - | `0` |

**Usage Examples:**
```css
.body-text {
  font-size: var(--semantic-typography-body-md-size);
  font-weight: var(--semantic-typography-body-md-weight);
  line-height: var(--semantic-typography-body-md-line-height);
}

.heading {
  font-size: var(--semantic-typography-heading-md-size);
  font-weight: var(--semantic-typography-heading-md-weight);
}
```

### Border Radius Semantic Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--semantic-radius-none` | `0px` | No rounding |
| `--semantic-radius-xs` | `2px` | Small elements (e.g., badges) |
| `--semantic-radius-sm` | `4px` | Small components (e.g., inputs) |
| `--semantic-radius-md` | `6px` | Default components (e.g., buttons) |
| `--semantic-radius-lg` | `8px` | Large components (e.g., cards) |
| `--semantic-radius-xl` | `12px` | Modals and large cards |
| `--semantic-radius-full` | `50%` | Circular elements (e.g., avatars) |

**Usage Examples:**
```css
.button {
  border-radius: var(--semantic-radius-md);
}

.modal {
  border-radius: var(--semantic-radius-xl);
}

.avatar {
  border-radius: var(--semantic-radius-full);
}
```

### Transition Semantic Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--semantic-transition-fast` | `0.15s ease` | Quick interactions (e.g., hover states) |
| `--semantic-transition-base` | `0.2s ease` | Default transitions (most common) |
| `--semantic-transition-slow` | `0.3s ease` | Slower animations (e.g., accordions) |

**Usage Examples:**
```css
.button {
  transition: all var(--semantic-transition-base);
}

.accordion-icon {
  transition: transform var(--semantic-transition-slow);
}
```

---

## Implementation Details

### Token Structure in Code

All tokens are centralized in the `DESIGN_TOKENS` constant object in `src/ui.html`:

```javascript
const DESIGN_TOKENS = {
  primitive: {
    color: { /* color primitives */ },
    spacing: { /* spacing primitives */ },
    typography: { /* typography primitives */ },
    radius: { /* border-radius primitives */ },
    transition: { /* transition primitives */ }
  },
  semantic: {
    light: {
      /* Light mode semantic tokens */
    },
    dark: {
      /* Dark mode semantic tokens */
    }
  }
}
```

### Dynamic Token Application

The token system uses two initialization functions:

1. **`initializeDesignTokens()`** - Sets mode-independent tokens (spacing, typography, radius, transition)
2. **`updateColorMode()`** - Sets mode-dependent color tokens based on light/dark mode

**Process:**
1. `initializeDesignTokens()` runs on page load to set all non-color tokens
2. `updateColorMode()` detects the current color scheme using `window.matchMedia('(prefers-color-scheme: dark)')`
3. Selects the appropriate semantic token set from `DESIGN_TOKENS.semantic[mode]`
4. Uses the `setTokenProperties()` helper function to recursively set CSS custom properties on `:root`
5. Explicitly sets commonly-used tokens with proper naming conventions
6. Creates backward-compatible aliases for old token names

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
  padding: var(--semantic-spacing-xl);
  margin-bottom: var(--semantic-spacing-lg);
  border-radius: var(--semantic-radius-md);
  font-size: var(--semantic-typography-body-md-size);
  transition: all var(--semantic-transition-base);
}

.brand-button {
  background: var(--semantic-button-brand-fill-default);
  color: var(--semantic-button-brand-text);
  padding: var(--semantic-spacing-md) var(--semantic-spacing-lg);
  border-radius: var(--semantic-radius-md);
}

.brand-button:hover {
  background: var(--semantic-button-brand-fill-pressed);
}
```

---

## Migration Guide

### Backward Compatibility

The system maintains **backward-compatible aliases** for old color token names to ensure no breaking changes during migration. Old token names continue to work but should be migrated to the new `--semantic-*` naming convention.

### Old vs. New Token Names

#### Color Tokens

##### Text Tokens
| Old Name | New Name |
|----------|----------|
| `--text-text-primary` | `--semantic-text-primary` |
| `--text-text-secondary` | `--semantic-text-secondary` |

##### Surface Tokens
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

##### Badge Tokens
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

##### Icon Tokens
| Old Name | New Name |
|----------|----------|
| `--icon-neutral-active` | `--semantic-icon-neutral-active` |
| `--icon-neutral-inactive` | `--semantic-icon-neutral-inactive` |
| `--icon-brand-active` | `--semantic-icon-brand-active` |
| `--icon-brand-inactive` | `--semantic-icon-brand-inactive` |

##### Button Tokens
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
4. **Replace hardcoded values**: Migrate hardcoded spacing, typography, radius, and transition values to tokens
5. **Test**: Verify colors render correctly in both light and dark modes
6. **Remove old aliases**: Once migration is complete, old aliases can be removed (future cleanup)

### Benefits of Migration

- **Consistency**: All tokens follow the same naming pattern
- **Clarity**: Semantic names are more descriptive
- **Maintainability**: Single source of truth in `DESIGN_TOKENS`
- **Scalability**: Easy to add new tokens or modify existing ones
- **Type Safety**: Easier to discover and use tokens correctly
- **Future-proof**: Foundation for potential TypeScript/design token tooling

---

## Best Practices

### 1. Always Use Semantic Tokens

Prefer semantic tokens over hardcoded values or direct primitive references:

```css
/* ✅ Good */
padding: var(--semantic-spacing-md);
font-size: var(--semantic-typography-body-md-size);
border-radius: var(--semantic-radius-md);
color: var(--semantic-text-primary);

/* ❌ Avoid */
padding: 8px;
font-size: 14px;
border-radius: 6px;
color: #2c2c2c;
```

### 2. Use Appropriate Semantic Context

Choose tokens that match the semantic meaning:

```css
/* ✅ Good - semantic meaning matches */
.button { 
  background: var(--semantic-button-brand-fill-default);
  padding: var(--semantic-spacing-md) var(--semantic-spacing-lg);
}

/* ❌ Avoid - using surface token for button */
.button { 
  background: var(--semantic-surface-brand-900);
}
```

### 3. Provide Fallback Values

Include fallback values for better error handling:

```css
/* ✅ Good */
color: var(--semantic-text-primary, #2c2c2c);
padding: var(--semantic-spacing-md, 8px);

/* ⚠️ Acceptable (fallback optional but recommended) */
color: var(--semantic-text-primary);
```

### 4. Reference Other Tokens When Appropriate

Some tokens intentionally reference others (like adjust badges):

```css
/* ✅ Good - adjust badge references text-primary */
.adjust-badge { color: var(--semantic-badge-adjust-text); }
```

### 5. Use Consistent Spacing Scale

Stick to the semantic spacing tokens rather than mixing values:

```css
/* ✅ Good - consistent spacing scale */
.container {
  padding: var(--semantic-spacing-xl);
  gap: var(--semantic-spacing-lg);
}

/* ❌ Avoid - mixing semantic and hardcoded */
.container {
  padding: var(--semantic-spacing-xl);
  gap: 10px; /* Should use --semantic-spacing-md or --semantic-spacing-lg */
}
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

### Current Implementation (v2.0)

✅ **Completed:**
- Unified `DESIGN_TOKENS` structure with all token categories
- Primitive color scales defined with light/dark mode values
- Primitive spacing scale with 4px base unit
- Primitive typography scale (font sizes, weights, line heights, letter spacing)
- Primitive border-radius scale
- Primitive transition scale (durations and easing)
- Semantic tokens organized by category (color, spacing, typography, radius, transition)
- Centralized token definitions in `src/ui.html`
- `initializeDesignTokens()` function for mode-independent tokens
- `updateColorMode()` function refactored to use centralized tokens
- `setTokenProperties()` helper function for recursive token application
- Backward-compatible aliases for all old color token names
- Comprehensive migration of hardcoded values to tokens
- Comprehensive documentation

**Implementation Note:** Currently, semantic tokens contain hardcoded color values rather than CSS `var()` references to primitives. This approach was chosen for:
- Simplicity and direct control
- Better browser compatibility
- Easier debugging
- No performance overhead from CSS variable resolution chains

Future enhancements could migrate to CSS variable references if needed (e.g., `semantic-text-primary: var(--primitive-neutral-900)`).

---

## Future Considerations

### Potential Enhancements

1. **CSS Variable References**: Future implementation could use CSS `var()` references in semantic tokens (e.g., `semantic-text-primary: var(--primitive-neutral-900)`)
2. **Design Token Export**: Export tokens to JSON/TypeScript for use in other tools
3. **Token Validation**: Add runtime validation to ensure all tokens are defined
4. **Theme Variants**: Extend beyond light/dark to support custom themes
5. **Opacity Utilities**: Create utility functions for dynamic opacity adjustments
6. **Gradual Migration**: Continue replacing any remaining old token references with new `--semantic-*` names throughout the codebase
7. **Shadow/Elevation Tokens**: Add shadow tokens for depth and elevation
8. **Breakpoint Tokens**: Add responsive breakpoint tokens if needed

---

## Notes

- **Figma Export**: The Figma design system export provides the authoritative source of truth for all color values
- **Opacity Differences**: Some tokens have different opacity values between light and dark modes (e.g., hero-fill: 0.2 light / 0.3 dark)
- **Button Brand Colors**: Button brand colors (`#0d99ff` / `#0c8ce9`) are distinct from surface-brand-900 (`#327aff` / `#78acfa`)
- **Badge Colors**: Badge hierarchy colors are extracted as primitives to maintain consistency
- **Token References**: Some semantic tokens reference others (e.g., adjust-text → text-primary) - this pattern is intentional and documented
- **Base Unit**: The 4px base unit for spacing provides good granularity (2px, 4px, 8px, 12px, 16px, 20px, 24px, 32px)
- **Mode Independence**: Spacing, typography, radius, and transition tokens are mode-independent (same values for light and dark)

---

## Summary

This token system provides:
- ✅ **Unified** design token structure (`DESIGN_TOKENS`)
- ✅ **Primitive → Semantic** architecture for all token categories
- ✅ **Light/Dark mode** support for color tokens
- ✅ **4px base unit** spacing system
- ✅ **Comprehensive** token coverage (color, spacing, typography, radius, transition)
- ✅ **Backward compatibility** via aliases
- ✅ **Consistent naming** with `--semantic-*` prefix
- ✅ **Comprehensive documentation** for all tokens
- ✅ **Atomic design** principles alignment

For questions or updates to this system, refer to the implementation in `src/ui.html` and the `DESIGN_TOKENS` constant.

