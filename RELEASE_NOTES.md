# Release Notes - Version 1.2.0

## ✨ What's New

**Centralized Design Token System**
- Complete migration to primitive → semantic token architecture
- All color values now centralized in `DESIGN_TOKENS` object for single source of truth
- Semantic tokens (`--semantic-*`) reference primitive color scales for maintainability
- Full light/dark mode support with automatic switching
- Backward compatibility maintained through token aliases

**Centralized UI State Management**
- New `updateUIState()` function orchestrates all UI component visibility and state
- `getUIMode()` provides consistent mode detection (setup/adjust/spacing/none)
- Eliminates scattered DOM manipulations across 15+ locations
- Improved state synchronization and reduced inconsistencies
- Better debugging capabilities with centralized logging

## 🔧 Improvements

**Code Architecture**
- Refactored color system from 517 hardcoded values to centralized token system
- Replaced 137 scattered `setProperty` calls with systematic token application
- Consolidated UI state management from 15+ manual toggles to single function
- Enhanced maintainability with single source of truth for colors and UI state

**Developer Experience**
- Comprehensive token documentation in `cirrus-token-injector-colorTokens.md`
- Clear primitive → semantic token hierarchy
- Improved code organization and type safety
- Better error handling and validation

**Performance**
- Optimized token application with recursive property setting
- Reduced redundant DOM operations through centralized state management
- Faster mode transitions with consolidated logic

## 🐛 Bug Fixes

- Fixed inconsistent UI state updates across different interaction paths
- Resolved dropdown visibility issues in mode transitions
- Improved layout container enable/disable state synchronization
- Fixed option buttons visibility inconsistencies

---

# Release Notes - Version 1.1.0

## ✨ What's New

**Resizable Plugin Window**
- Drag to resize the plugin window using the bottom-right corner handle
- Customize width and height to fit your workflow
- Minimum size enforced (360px × 300px) to keep controls accessible

**Responsive Layout System**
- Adaptive UI that adjusts based on window width
- Vertical layout for narrow windows (<640px)
- Horizontal 3-column layout for wide windows (≥640px)
- Smooth transitions when resizing

## 🔧 Improvements

- Faster variable application and plugin responsiveness
- Better error handling and user feedback
- Performance optimizations for nested frames and batch operations
- Enhanced visual feedback and clearer state indicators

## 🐛 Bug Fixes

- Fixed variable application issues in complex nested hierarchies
- Resolved edge cases in prefix detection and naming
- Improved compatibility with various Figma file structures

---

**Previous Version Highlights:**
- Version 1.0.0: Setup Mode with automatic prefix detection and intelligent hierarchy suggestions




