# Hierarchy Skip Functionality Test Guide

This document provides a step-by-step process to test and trigger the hierarchy skip popover/modal.

## Understanding Hierarchy Skip Detection

The plugin detects when frames skip hierarchy levels:
- **Hierarchy levels**: `parent.` (level 1) → `child.` (level 2) → `subChild.` (level 3)
- **Skip detected when**: The difference between parent and child levels is **more than 1**
- **Examples of skips**:
  - `parent.` → `subChild.` (skips `child.`) ✅ **TRIGGERS MODAL**
  - `parent.` → `child.` (normal hierarchy) ❌ No skip
  - `child.` → `subChild.` (normal hierarchy) ❌ No skip

**IMPORTANT**: The skip must exist **BEFORE** you rename/auto-adjust. The plugin only prompts for pre-existing skips, not ones created during renaming.

---

## Test Setup (Create the Structure)

### Step 1: Create Parent Frame
1. Create a new Frame in Figma
2. Enable Auto Layout on the frame
3. Name it: `parent.TestContainer`
4. Make sure it has some visual styling (fill or stroke) so it's detected as a visual frame

### Step 2: Create Child Frame with Skip
1. Inside `parent.TestContainer`, create another Frame
2. Enable Auto Layout on this child frame
3. **IMPORTANT**: Name it `subChild.SkippedLevel` (NOT `child.SkippedLevel`)
   - This creates a skip: `parent.` → `subChild.` (skips `child.`)
4. Add some visual styling to make it a visual frame

### Step 3: Optional - Add More Nested Frames
For a more comprehensive test, you can add:
- Another `subChild.AnotherSkipped` frame directly under `parent.TestContainer`
- Or create a deeper structure like:
  - `parent.TestContainer`
    - `subChild.Level1` (skip)
      - `subChild.Level2` (nested skip)

---

## Test Process (Trigger the Modal)

### Method 0: Quick Test Button (UI Only)

**Note**: This only tests the modal UI appearance, not the actual detection logic.

1. **Open** the plugin
2. Look for the **"Test Modal"** button in the UI (usually in the dev/debug area)
3. Click the **"Test Modal"** button
4. **Expected Result**: 
   - The hierarchy skip modal should appear immediately
   - Shows sample test data with 3 example skipped nodes
   - This helps verify the modal UI is working correctly

**Note**: This button only tests the modal display. To test the actual detection logic, use Method 1 or 2 below.

---

### Method 1: Using Rename with Nested Renaming

1. **Select** the `parent.TestContainer` frame
2. **Open** the plugin
3. In the plugin UI, use the **rename feature**:
   - Enter a new name with a prefix (e.g., `parent.NewContainer`)
   - **CRITICAL**: Enable the **"Rename Nested"** option (checkbox)
   - Click **Rename** (or Apply with rename)
4. **Expected Result**: 
   - The hierarchy skip modal should appear
   - It should list `subChild.SkippedLevel` (and any other skipped frames)
   - The modal shows the current prefix (`subChild.`) and suggested prefix (`child.`)

### Method 2: Using Auto Adjust with Nested Renaming

1. **Select** the `parent.TestContainer` frame
2. **Open** the plugin
3. Use the **"Auto Adjust"** feature:
   - **CRITICAL**: Enable the **"Rename Nested"** option (checkbox)
   - Click **Auto Adjust**
4. **Expected Result**: 
   - The hierarchy skip modal should appear
   - Lists all frames that skip hierarchy levels

---

## Why It Might Not Be Triggering

### Common Issues:

1. **Skip wasn't pre-existing**
   - The skip must exist BEFORE you run rename/auto-adjust
   - If you create the skip during renaming, the plugin fixes it automatically (no modal)

2. **"Rename Nested" not enabled**
   - The nested renaming must be enabled for the check to run
   - Without it, the plugin doesn't traverse nested children

3. **Frame structure issues**
   - Frames must have auto-layout enabled
   - Frames must have valid prefixes (`parent.`, `child.`, `subChild.`, `hero.`)
   - The skipped frame must be a direct child (or nested child) of the parent

4. **Wrong hierarchy levels**
   - Remember: `parent.` (1) → `child.` (2) → `subChild.` (3)
   - Only skips of more than 1 level trigger the modal
   - `hero.` is special and doesn't follow hierarchy rules

---

## Verification Checklist

Before testing, verify:
- [ ] Parent frame has prefix (`parent.`, `child.`, `hero.`)
- [ ] Child frame has prefix (`subChild.` to create skip)
- [ ] Both frames have auto-layout enabled
- [ ] Child frame is nested inside parent frame
- [ ] Structure exists BEFORE running rename/auto-adjust
- [ ] "Rename Nested" option is enabled in plugin UI

---

## Expected Modal Behavior

When the modal appears, you should see:
1. **Title**: "Hierarchy Skip Detected"
2. **Description**: Explains that some layers skip hierarchy levels
3. **List of skipped nodes**: 
   - Shows the path to each skipped frame
   - Shows current prefix (e.g., `subChild.`)
   - Shows suggested prefix (e.g., `child.`)
4. **Action buttons**:
   - Checkboxes to select which nodes to rename
   - "Apply" button to rename selected nodes
   - "Cancel" button to skip renaming

---

## Example Test Scenario

```
Structure:
└── parent.TestContainer (level 1)
    ├── subChild.SkippedLevel (level 3) ← SKIP! (parent → subChild, skips child)
    └── child.NormalLevel (level 2) ← No skip
        └── subChild.NestedNormal (level 3) ← No skip
```

**Action**: Select `parent.TestContainer`, enable "Rename Nested", and rename or auto-adjust.

**Expected**: Modal shows `subChild.SkippedLevel` as needing correction to `child.SkippedLevel`.

---

## Debugging Tips

If the modal still doesn't appear:

1. **Check browser console** (in plugin UI):
   - Look for console.log messages starting with "Pre-existing hierarchy skip detected"
   - Should see: `Pre-existing hierarchy skip detected: parent. to subChild. in [path]`

2. **Check Figma console** (for plugin code):
   - Open Figma → Plugins → Development → Open Console
   - Look for debug messages about hierarchy skip detection

3. **Verify the structure**:
   - Make sure the child frame is actually nested inside the parent
   - Check that prefixes are exactly correct (including the period)
   - Ensure both frames have auto-layout enabled

4. **Try a simpler test**:
   - Create: `parent.Test` containing `subChild.Skip`
   - Make sure both have auto-layout
   - Select `parent.Test`, enable "Rename Nested", rename to `parent.NewTest`

---

## Quick Test Script

```
1. Create frame → Auto Layout ON → Name: "parent.Test"
2. Create frame inside → Auto Layout ON → Name: "subChild.Skip"
3. Select "parent.Test"
4. Open plugin
5. Enable "Rename Nested" checkbox
6. Rename to "parent.NewTest" OR use Auto Adjust
7. Modal should appear showing "subChild.Skip"
```

