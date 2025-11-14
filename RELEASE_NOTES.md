# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024

### Added
- Centralized design token system with primitive → semantic token architecture
- Centralized UI state management via `updateUIState()` function
- Light/dark mode support with automatic switching
- Comprehensive token documentation

### Changed
- Refactored color system from 517 hardcoded values to centralized token system
- Replaced 137 scattered `setProperty` calls with systematic token application
- Consolidated UI state management from 15+ manual toggles to single function

### Fixed
- Inconsistent UI state updates across different interaction paths
- Dropdown visibility issues in mode transitions
- Layout container enable/disable state synchronization
- Option buttons visibility inconsistencies

## [1.1.0] - 2024

### Added
- Resizable plugin window with drag-to-resize functionality
- Responsive layout system (vertical for narrow windows, horizontal for wide)
- Minimum window size enforcement (360px × 300px)

### Changed
- Improved plugin responsiveness and variable application speed
- Enhanced visual feedback and state indicators

### Fixed
- Variable application issues in complex nested hierarchies
- Edge cases in prefix detection and naming
- Compatibility issues with various Figma file structures

## [1.0.0] - 2024

### Added
- Setup Mode with automatic activation for unprefixed frames
- Intelligent prefix suggestions based on parent container hierarchy
- One-click setup: rename frames and apply tokens in single action
- Auto detection for hierarchy level based on parent context
- Pre-configured defaults for layout controls

### Changed
- Improved UI/UX for prefix selection workflow
- Enhanced context awareness for frame hierarchy

---

[1.2.0]: https://github.com/Widoba/layout-assistant-cirrus-design-system/releases/tag/v1.2.0
[1.1.0]: https://github.com/Widoba/layout-assistant-cirrus-design-system/releases/tag/v1.1.0
[1.0.0]: https://github.com/Widoba/layout-assistant-cirrus-design-system/releases/tag/v1.0.0
