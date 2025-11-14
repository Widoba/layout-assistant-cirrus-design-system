# Color Token Centralization - Primitive to Semantic Structure

## Audit Summary

**Current State:**

- 532 CSS variable references
- 517 hardcoded color values  
- 137 JavaScript `setProperty` calls in `updateColorMode()`
- Inconsistent token naming (e.g., `--badge-hero-hero-text` has redundant prefixes)
- Colors defined in JavaScript with hardcoded hex/rgba values

**Migration Complexity:** Medium - Single file (`src/ui.html`), but extensive usage. Backward compatibility via aliases recommended.

## Recommendations

### 1. Naming Convention: `--primitive-{color}-{shade}` → `--semantic-{category}-{variant}`

**Recommendation: Option B** (`--primitive-blue-500` not `--color-primitive-blue-500`)

- Cleaner, more standard (matches Material Design, Tailwind patterns)
- Less verbose, easier to read
- Example: `--primitive-blue-500` → `--semantic-text-primary`

### 2. Implementation Approach: Hybrid (Centralized JS + CSS Cascade)

**Recommendation: Centralized JavaScript data structure with CSS custom properties**

- **Why:** Maintains dynamic dark mode switching while enabling CSS cascade benefits
- **Structure:** 
  - Create `COLOR_TOKENS` object with primitive scales (light/dark)
  - Semantic tokens reference primitives via `var(--primitive-...)`
  - JavaScript sets primitives, CSS handles semantic inheritance
- **Benefits:** Robustness (CSS cascade), efficiency (no runtime overhead for static), maintainability (single source of truth)

### 3. Backward Compatibility Strategy: Aliases → Migration

**Recommendation: Create aliases initially, then systematic migration**

- Phase 1: Add new primitive/semantic tokens + create aliases for old tokens
- Phase 2: Migrate high-impact areas (widespread hardcoded values)
- Phase 3: Gradually replace old token references
- **Risk:** Low - aliases ensure no breaking changes
- **Effort:** Medium - systematic but manageable in single file

## Implementation Plan

### Phase 1: Create Primitive Color Scales

1. Extract all unique color values from current system
2. Organize into primitive scales:

   - `primitive-neutral` (grays/blacks/whites)
   - `primitive-brand` (blues: #327AFF, #0D99FF, #78ACFA, etc.)
   - `primitive-purple` (hero/parent badge colors: #831568, #681B81, #7A2ED6, etc.)
   - `primitive-blue` (child/sub-child: #075292, #0A6DC2, #0F92B2, etc.)
   - `primitive-teal` (sub-child: #087691, #013A6B, etc.)

3. Define scales with light/dark mode values (e.g., `primitive-neutral-900: { light: '#000000', dark: '#FFFFFF' }`)

### Phase 2: Create Semantic Token Layer

1. Map semantic tokens to primitives:

   - `semantic-text-primary` → `primitive-neutral-900`
   - `semantic-text-secondary` → `primitive-neutral-600` (with opacity)
   - `semantic-surface-bg` → `primitive-neutral-50` (light) / `primitive-neutral-900` (dark)
   - `semantic-badge-hero-text` → `primitive-purple-700`
   - `semantic-button-brand-fill` → `primitive-brand-500`
   - etc.

2. Create semantic tokens that reference primitives: `var(--primitive-brand-500)`

### Phase 3: Centralize Token Definitions

1. Create `COLOR_TOKENS` constant object in JavaScript:
   ```javascript
   const COLOR_TOKENS = {
     primitive: {
       neutral: { 50: {...}, 100: {...}, ... },
       brand: { 200: {...}, 300: {...}, ... },
       purple: { 600: {...}, 700: {...}, ... },
       // etc.
     },
     semantic: {
       text: { primary: 'var(--primitive-neutral-900)', ... },
       surface: { bg: 'var(--primitive-neutral-50)', ... },
       // etc.
     }
   }
   ```

2. Refactor `updateColorMode()` to:

   - Set primitive tokens from `COLOR_TOKENS.primitive`
   - Set semantic tokens from `COLOR_TOKENS.semantic` (which reference primitives)
   - Create backward-compatible aliases for old token names

### Phase 4: Replace Hardcoded Values (Systematic)

1. **High-impact replacements** (appear in multiple places):

   - `#0d99ff` / `#0D99FF` → `var(--semantic-button-brand-fill-default)`
   - `#2C2C2C` → `var(--semantic-text-primary)` or `var(--semantic-surface-bg)`
   - `#FFFFFF` / `#fff` → `var(--primitive-neutral-50)`
   - `rgba(0, 0, 0, 0.1)` → `var(--semantic-surface-neutral-100)`
   - `rgba(255, 255, 255, 0.1)` → `var(--semantic-surface-neutral-100)` (dark mode)

2. **Pattern-based replacement**:

   - Find all instances of common colors
   - Replace with appropriate semantic tokens
   - Keep one-off decorative colors for now (low priority)

### Phase 5: Update Documentation

1. Update `cirrus-token-injector-colorTokens.md` with new structure
2. Document primitive scales
3. Document semantic token mappings
4. Include migration guide for future reference

## Files to Modify

1. **src/ui.html** (primary)

   - Add `COLOR_TOKENS` constant
   - Refactor `updateColorMode()` function
   - Replace hardcoded colors in CSS
   - Add backward-compatible aliases

2. **cirrus-token-injector-colorTokens.md** (documentation)

   - Restructure to show primitive → semantic hierarchy
   - Document all scales and mappings

## Success Criteria

- ✅ All color values centralized in `COLOR_TOKENS` object
- ✅ Primitive scales defined with light/dark mode values
- ✅ Semantic tokens reference primitives (not hardcoded values)
- ✅ Widespread hardcoded colors replaced with tokens
- ✅ Backward compatibility maintained via aliases
- ✅ Dark/light mode switching works correctly
- ✅ Documentation updated

## Notes

- **Key Findings from Figma Export:**
  - ✅ Figma export provides authoritative source of truth for all color values
  - ✅ Some tokens already reference others (e.g., `adjust-text` → `{text.text-primary}`) - good pattern to follow
  - ✅ Surface scales are opacity-based (rgba with varying opacity) - these become semantic tokens
  - ✅ Button brand colors (`#0d99ff` / `#0c8ce9`) are different from surface-brand-900 (`#327aff` / `#78acfa`)
  - ⚠️ Badge colors are hardcoded hex values - need to extract as primitives
  - ⚠️ Some opacity values differ between light/dark (e.g., hero-fill: 0.2 light / 0.3 dark)
  - ✅ Figma uses `{category.token}` syntax for references - we'll use CSS `var(--semantic-category-token)`

- **Token Naming Cleanup:**
  - `--badge-hero-hero-text` → `--semantic-badge-hero-text` (remove redundant `hero`)
  - `--button-secondary-neutral-button-secondary-neutral-text-default` → `--semantic-button-secondary-neutral-text-default` (remove redundant prefix)

  - **Plan Progress:**
    - **DONE:**
        - ✅ Extract and catalog all unique color values from current system, identify color families (neutral, brand, purple, blue, teal)
        - ✅ Create COLOR_TOKENS object with primitive color scales (neutral, brand, purple, blue, teal) with light/dark mode values
        - ✅ Map semantic tokens to primitives (text, surface, badge, button, icon tokens)
        - ✅ Refactor updateColorMode() to use COLOR_TOKENS object and set primitive tokens, then semantic tokens that reference primitives
        - ✅ Create backward compatible aliases for old token names (e.g., `--badge-hero-hero-text` → `--semantic-badge-hero-text`)
        - ✅ Replace widespread hardcoded colors (#0d99ff, #2C2C2C, #FFFFFF, rgba patterns) with semantic token references
        - ✅ Fix ambiguous color formats (hex with alpha like #8315684d → proper rgba(), inconsistent casing)
        - ✅ Update cirrus-token-injector-colorTokens.md with new primitive → semantic structure and migration notes
    - **COMPLETED:**
        - All phases of the migration plan have been successfully completed
        - Documentation is comprehensive and up-to-date
        - System is production-ready with full backward compatibility