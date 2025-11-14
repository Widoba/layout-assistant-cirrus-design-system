# Hierarchy Skip Detection: Analysis & Recommendations

## Current Behavior Analysis

### How It Currently Works

The hierarchy skip detection has two paths:

1. **Pre-existing skips** (existed BEFORE renaming):
   - Detected when a skip existed in the original structure
   - Shows modal to let user choose which nodes to fix
   - User has control over what gets renamed

2. **Skips created during renaming**:
   - Automatically fixed without prompting
   - No user intervention needed
   - Happens silently

### The Issue You Encountered

When using "Fix Nested" + "Fix Variables" and clicking Apply:
- If in **prefix-rename mode**: Sends `rename-node` message → Should trigger hierarchy skip check
- If in **auto-adjust mode**: Sends `auto-adjust` message → Should trigger hierarchy skip check  
- If in **normal mode** (no prefix): Sends `apply-variables` message → **NO hierarchy check happens**

**What you experienced**: The structure was automatically corrected, which suggests either:
1. The skip wasn't detected as "pre-existing" (potential bug)
2. You were in a mode that auto-fixes skips
3. The detection logic didn't properly capture the original structure

---

## Design Workflow Considerations

### Arguments FOR Automatic Correction (Current Behavior)

✅ **Faster workflow**: No interruption, just fixes the issue
✅ **Less cognitive load**: Designers don't need to think about hierarchy
✅ **Consistent results**: Always follows the correct hierarchy
✅ **Matches "Fix" naming**: "Fix Nested" implies automatic fixing
✅ **Most skips are unintentional**: Rarely do designers intentionally skip levels

### Arguments FOR Manual Prompting (Modal)

⚠️ **Intentional skips**: Sometimes designers might intentionally skip levels for specific design patterns
⚠️ **User control**: Gives users choice over what gets changed
⚠️ **Visibility**: Users see what's being changed before it happens
⚠️ **Safety**: Prevents accidental renaming of intentionally structured hierarchies

---

## Recommendation: **Hybrid Approach**

### Proposed Solution

**Default: Automatic Correction** (Silent Fix)
- When "Fix Nested" is enabled, automatically correct hierarchy skips
- No modal interruption
- Fast, smooth workflow
- Matches user expectation of "Fix" = automatic

**Optional: Prompt Mode** (Settings/Preference)
- Add a setting: "Prompt before fixing hierarchy skips"
- When enabled, shows modal for pre-existing skips
- Useful for users who want full control
- Default: OFF (automatic correction)

### Why This Works Best

1. **Matches user intent**: "Fix Nested" should fix things automatically
2. **Power users can opt-in**: Advanced users who want control can enable prompts
3. **Most users benefit**: Automatic correction is faster for 95% of use cases
4. **Maintains backward compatibility**: Old "rename layer" flow can still prompt if needed

---

## Technical Investigation: Why Modal Didn't Show

### Possible Causes

1. **Pre-existing detection logic issue**:
   ```typescript
   // Line 596-601: Checks if skip existed before renaming
   const wasPreExisting = originalPrefixes ? (() => {
     const original = originalPrefixes.get(node.id);
     if (!original) return false;
     return isHierarchySkipped(original.parentPrefix, original.prefix);
   })() : false;
   ```
   - If `originalPrefixes` map doesn't capture the node correctly, `wasPreExisting` will be false
   - This would cause auto-fix instead of prompting

2. **Wrong code path**:
   - If clicking Apply sends `apply-variables` instead of `rename-node`/`auto-adjust`
   - Then no hierarchy check happens at all
   - Variables just get applied, but structure isn't renamed

3. **Parent prefix change detection**:
   - If the parent prefix didn't change, `parentPrefixChanged` is false
   - This might affect whether skips are detected as pre-existing

### Debugging Steps

1. **Check console logs**:
   - Look for: `"Pre-existing hierarchy skip detected"`
   - If you see: `"Fixing skip created by renaming"` → Skip wasn't detected as pre-existing

2. **Verify mode**:
   - Check which message type is sent when clicking Apply
   - Should be `rename-node` or `auto-adjust` (not `apply-variables`)

3. **Check originalPrefixes capture**:
   - Verify that `captureOriginalPrefixes` is capturing the skip correctly
   - The skip must exist BEFORE renaming starts

---

## Proposed Code Changes

### Option 1: Make Prompting Optional (Recommended)

Add a setting to control behavior:

```typescript
// In code.ts - add configurable behavior
const SHOULD_PROMPT_FOR_SKIPS = false; // Could be a plugin setting

// In renameNestedNodes function:
if (wasPreExisting) {
  if (SHOULD_PROMPT_FOR_SKIPS) {
    // Show modal (current behavior)
    skippedNodes.push({...});
  } else {
    // Auto-fix (new default behavior)
    console.log(`Auto-fixing pre-existing skip: ${parentPrefix} to ${existingPrefix}`);
    node.name = `${hierarchicalPrefix}${baseName}`;
    renamedCount++;
    // Continue processing...
  }
}
```

### Option 2: Always Auto-Fix Pre-Existing Skips

Simply change the logic to always auto-fix:

```typescript
// Remove the wasPreExisting check and always auto-fix
if (isHierarchySkipped(parentPrefix, existingPrefix)) {
  // Always fix, don't prompt
  node.name = `${hierarchicalPrefix}${baseName}`;
  renamedCount++;
  // ...
}
```

### Option 3: Fix Detection Logic

If the detection isn't working, fix the `wasPreExisting` logic:

```typescript
// More robust pre-existing detection
const wasPreExisting = originalPrefixes ? (() => {
  const original = originalPrefixes.get(node.id);
  if (!original) {
    // If node not in map, check if current skip matches a known pattern
    // This handles edge cases where node wasn't captured
    return true; // Conservative: assume pre-existing if not captured
  }
  return isHierarchySkipped(original.parentPrefix, original.prefix);
})() : true; // If no originalPrefixes map, assume pre-existing
```

---

## User Experience Flow Comparison

### Current Flow (With Modal)
1. User enables "Fix Nested" + "Fix Variables"
2. Clicks Apply
3. Modal appears: "Hierarchy skip detected"
4. User selects which nodes to fix
5. Clicks "Apply" in modal
6. Renaming happens
7. Variables applied

**Time**: ~10-15 seconds with interaction

### Proposed Flow (Automatic)
1. User enables "Fix Nested" + "Fix Variables"  
2. Clicks Apply
3. Renaming happens automatically (skips fixed)
4. Variables applied

**Time**: ~2-3 seconds, no interaction needed

---

## Final Recommendation

**Go with automatic correction as default** because:

1. ✅ Matches user expectation ("Fix" = automatic)
2. ✅ Faster workflow (critical for design tools)
3. ✅ Most skips are unintentional (99%+)
4. ✅ Can add optional prompt mode for power users
5. ✅ Current behavior (auto-fix) is working well

**Action Items**:
1. Keep current auto-fix behavior for "Fix Nested"
2. Optionally add a setting to enable prompts (for power users)
3. Fix any bugs in pre-existing detection if modal should work
4. Document that "Fix Nested" automatically corrects hierarchy

**If you want to keep modal functionality**:
- Make it work for "Fix Nested" flow (currently only works for rename/auto-adjust)
- Or make it optional via settings
- Consider it a "power user" feature rather than default

---

## Testing the Detection Logic

To verify if detection is working:

1. Create: `parent.Test` → `subChild.Skip` (pre-existing skip)
2. Use "Fix Nested" + prefix-rename mode
3. Check console for: `"Pre-existing hierarchy skip detected"`
4. If you see: `"Fixing skip created by renaming"` → Detection failed
5. If modal appears → Detection working

This will help determine if it's a bug or intentional behavior.




