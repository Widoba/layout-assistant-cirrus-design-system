# Centralize UI State Management System

## Problem Analysis

Similar to the button state management issue, UI state changes are scattered across the codebase:

1. **Dropdown visibility**: 15+ places manually toggle `dropdown.classList.add/remove('show')`
2. **Layout container state**: 10+ places toggle `layoutContainer.classList.add/remove('disabled')`
3. **Control visibility**: Spacing vs layout controls shown/hidden in multiple locations
4. **Mode transitions**: Setup/adjust/spacing mode logic scattered across handlers
5. **Option buttons**: `showOptionButtons()`/`hideOptionButtons()` called inconsistently
6. **State synchronization**: `dropdownState` object updated in many places without centralized validation

## Solution Approach

### Phase 1: Create Centralized UI State Manager

- Create `updateUIState()` function that orchestrates all UI component visibility and state
- Consolidate mode detection logic (setup/adjust/spacing modes)
- Create single source of truth for UI state

### Phase 2: Define UI State Structure

- Create `uiState` object that tracks:
  - Current mode (setup/adjust/spacing/none)
  - Dropdown visibility
  - Layout container enabled/disabled
  - Spacing vs layout control visibility
  - Option buttons visibility
- Ensure state is derived from source data (selectedNode, dropdownState, etc.)

### Phase 3: Replace Scattered Updates

- Replace all manual DOM manipulations with calls to `updateUIState()`
- Ensure consistent order: state calculation → DOM updates → button updates
- Add debug logging similar to button state debugging

### Phase 4: Mode Transition Logic

- Centralize mode detection in one place
- Handle transitions explicitly (setup→adjust, adjust→setup, etc.)
- Ensure proper cleanup when transitioning modes

## Implementation Details

### Files to Modify

1. **[src/ui.html](src/ui.html)**

   - Create `updateUIState()` function (similar to `updateAllButtonStates()`)
   - Consolidate dropdown show/hide logic
   - Consolidate layout container enable/disable logic
   - Consolidate spacing/layout control visibility
   - Replace scattered DOM manipulations with centralized calls

### Key Functions to Create

1. **`updateUIState(debugContext = '')`**:

   - Calculates current UI mode from state
   - Updates dropdown visibility
   - Updates layout container state
   - Updates spacing/layout control visibility
   - Updates option buttons visibility
   - Calls `updateAllButtonStates()` at the end
   - Logs debug info if enabled

2. **`getUIMode()`**:

   - Determines current mode: 'setup' | 'adjust' | 'spacing' | 'none'
   - Based on: selectedNode, hasPrefix, dropdownState, directionalExtension

3. **`transitionToMode(newMode)`**:

   - Handles mode transitions explicitly
   - Cleans up previous mode state
   - Applies new mode state

### State Calculation Logic

```javascript
function getUIMode() {
  if (!selectedNode) return 'none';
  if (currentDirectionalExtension === 'row.' || currentDirectionalExtension === 'column.') return 'spacing';
  const hasPrefix = selectedNode.name.startsWith('parent.') || ...;
  if (!hasPrefix && dropdownState.setupMode) return 'setup';
  if (hasPrefix) return 'adjust';
  return 'none';
}
```

### Update Triggers

- Selection changes → `updateUIState()`
- Dropdown state changes → `updateUIState()`
- Mode transitions → `updateUIState()`
- After operations complete → `updateUIState()`

## Benefits

1. **Single source of truth** for UI state
2. **Easier debugging** with centralized logging
3. **Systematic updates** - change logic in one place
4. **Reduced bugs** from inconsistent state
5. **Better maintainability** for future changes

## Risk Mitigation

- Keep existing functions initially, route through centralized function
- Add feature flag for debug mode
- Test each mode transition individually
- Ensure no visual regressions
- Maintain backward compatibility during migration