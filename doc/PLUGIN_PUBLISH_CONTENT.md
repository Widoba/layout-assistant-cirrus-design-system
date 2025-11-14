# Plugin Publish Content

## Tagline (100 characters max)
**Automatically apply Cirrus design system layout tokens with smart mode detection and nested support.**

---

## Description

### Overview
Layout Assistant - Cirrus Design System streamlines your design workflow by automatically applying layout variables from the Cirrus Native Design System to your Figma frames. Simply name your frames with a prefix, and the plugin intelligently applies spacing, padding, and corner radius tokens while setting the correct variable modes based on your frame hierarchy.

### Key Features

**Smart Variable Application**
- Automatically applies layout tokens (spacing, padding, corner radius) from the "A6 - Layout" collection
- Intelligently sets variable modes based on frame name prefixes
- Processes nested frames recursively, maintaining proper hierarchy throughout your designs

**Intelligent Mode Detection**
The plugin automatically sets variable modes based on your frame naming convention:
- `parent.*` → Sets mode to "parent (default)"
- `child.*` → Sets mode to "child"
- `subChild.*` → Sets mode to "sub-child"
- `hero.*` → Sets mode to "hero"

Modes are automatically configured for three underlying collections:
- A1 - ↔️ Spacing
- A4 - 🧩 Padding
- A5 - ╭ Corner Radius

**Flexible Application Controls**
- Choose which corner radius values to apply (top-left, top-right, bottom-left, bottom-right)
- Select specific padding sides to target (top, bottom, left, right)
- Option to apply variables to nested frames automatically
- Clear variables functionality to reset applied tokens

**Hierarchy Management**
- Automatic frame renaming with prefix support
- **Setup Mode**: Automatically activates when selecting frames without prefixes, providing guided setup with prefix suggestions based on parent hierarchy
- "Auto Adjust" feature detects and fixes skipped hierarchy levels
- Batch rename nested layers while maintaining proper naming conventions
- Visual preview of name changes before applying

**Smart Processing**
- Only processes frames with auto-layout enabled
- Automatically detects frames with correct naming patterns
- Supports batch processing of multiple selected frames
- Real-time selection detection and variable binding status

### How to Use

**Step 1: Prepare Your Frames**
Ensure your frames have auto-layout enabled and are named with one of the allowed prefixes:
- `parent.header`, `parent.main`, `parent.sidebar`
- `child.card`, `child.section`, `child.container`
- `subChild.button`, `subChild.input`, `subChild.text`
- `hero.banner`, `hero.cta`, `hero.hero`

**Step 2: Select Your Frames**
Select one or more frames in your Figma file. The plugin will automatically detect frames with the correct naming patterns and auto-layout enabled.

**Step 3: Apply Variables**
Click "Apply Variables" to:
- Apply layout tokens to all matching frames
- Set the appropriate variable mode based on each frame's prefix
- Process all nested child frames that meet the criteria

**Step 4: Fine-Tune (Optional)**
- Use the corner radius controls to selectively apply corner values
- Adjust padding controls to target specific sides
- Toggle "Apply to Nested" to control recursive processing
- Use the rename panel to fix frame names or adjust hierarchy

**Setup Mode: Quick Start for New Frames**
Setup Mode automatically activates when you select a frame that doesn't have a prefix (i.e., frames not starting with `parent.`, `child.`, `subChild.`, or `hero.`). This streamlined workflow helps you quickly set up new frames:

1. **Select an Unprefixed Frame**: Click on any frame without a prefix in your design
2. **Automatic Dropdown**: A dropdown automatically appears showing available prefix options based on the frame's parent container hierarchy
3. **Choose Your Option**:
   - **Auto**: Let the plugin automatically determine the correct hierarchy level based on parent context
   - **Manual Prefix**: Select a specific prefix (`hero`, `parent`, `child`, or `subchild`) that matches your design intent
4. **Configure Layout**: All layout buttons (corners, padding, nested) are pre-selected by default - adjust as needed
5. **Apply**: Click "Apply Variables" to rename the frame with the selected prefix and apply layout tokens in one action

Setup Mode intelligently filters available prefixes based on what makes sense for the frame's position in the hierarchy, making it easier to choose the correct level without manual calculation.

**Advanced: Fixing Hierarchy**
If your frames skip hierarchy levels (e.g., a `parent.*` frame containing a `subChild.*` frame), use the "Auto Adjust" feature to:
1. Detect skipped hierarchy levels
2. Review suggested prefix changes
3. Select which layers to rename
4. Automatically apply the correct hierarchy

You can also trigger Auto Adjust from Setup Mode by selecting the "Auto" option, which will automatically determine and apply the correct hierarchy based on parent context.

### Prerequisites

- The "Cirrus - Native Design System" team library must be enabled in your Figma file
- The library must contain an "A6 - Layout" collection with these variables:
  - `spacing` - Applied to frame item spacing
  - `padding` - Applied to frame padding properties
  - `corner-radius` - Applied to frame corner radius properties
- Frames must have auto-layout enabled
- Frames should be named with one of the allowed prefixes (parent.*, child.*, subChild.*, hero.*), or use Setup Mode to automatically apply prefixes to unprefixed frames

### Benefits

- **Time-Saving**: Apply layout tokens to entire component hierarchies in seconds
- **Consistency**: Ensures all frames use the correct variable modes from your design system
- **Accuracy**: Automatically maintains proper hierarchy relationships
- **Flexibility**: Fine-grained control over which tokens are applied where
- **Maintainability**: Easy to update design tokens across entire projects

---

## Version Notes

### Latest Update

**✨ New: Setup Mode**
- **Automatic activation** when selecting frames without prefixes
- **Intelligent prefix suggestions** based on parent container hierarchy
- **Streamlined workflow**: Rename and apply variables in one action
- **Auto option** for automatic hierarchy detection
- **Pre-configured defaults**: All layout controls pre-selected for quick setup

Setup Mode makes it easier than ever to get started with the plugin. Simply select any unprefixed frame, choose your hierarchy level (or let Auto detect it), and apply - no manual naming required!

**What's Changed:**
- Setup Mode now automatically activates for frames without prefixes
- Prefix options are intelligently filtered based on parent hierarchy context
- Layout controls are pre-selected by default in Setup Mode for faster workflow
- Auto Adjust functionality integrated directly into Setup Mode dropdown

---

**Note**: This plugin is specifically designed to work with the Cirrus Native Design System. Ensure your design system library is properly configured before use.

