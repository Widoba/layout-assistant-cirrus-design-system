# Layout Assistant - Cirrus Design System

A Figma plugin that automatically applies layout variables from the "Cirrus - Native Design System" team library to selected frames with auto-layout.

## Features

- Applies spacing, padding, and corner-radius variables from the "A6 - Layout" collection
- **Automatically sets variable modes based on frame name prefixes:**
  - `parent.*` → Mode: "parent (default)"
  - `child.*` → Mode: "child"
  - `subChild.*` → Mode: "sub-child"
  - `hero.*` → Mode: "hero"
- **Sets modes for three underlying collections:**
  - A1 - ↔️ Spacing
  - A4 - 🧩 Padding
  - A5 - ╭ Corner Radius
- **Recursively applies variables to all nested frames with auto-layout and allowed names**
- Supports batch processing of multiple selected frames and their children
- Automatically detects and processes only frames with auto-layout and correct naming

## Prerequisites

- The "Cirrus - Native Design System" team library must be enabled in your Figma file
- The library must contain an "A6 - Layout" collection with the following variables:
  - `spacing` - Applied to frame item spacing
  - `padding` - Applied to all frame padding properties
  - `corner-radius` - Applied to all frame corner radius properties
- Frames must be named with one of the allowed prefixes (parent.*, child.*, subChild.*, hero.*)

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the plugin:
   ```bash
   npm run build
   ```
4. In Figma, go to Plugins → Development → Import plugin from manifest
5. Select the `manifest.json` file from this project

## Development

### Automatic Rebuilding

To develop the plugin with automatic rebuilding:

```bash
npm run dev
```

This will watch for changes and automatically rebuild the plugin.

### Development UI

The plugin includes a development UI mode that can be toggled using the switch at the bottom of the plugin window. This UI provides a foundation for adding new features with the following sections:

1. **Inside Section** - Top section with a neutral background
2. **Active Section** - Middle section with a blue-tinted background (highlighted/active state)
3. **Nested Section** - Bottom expandable section

To switch to the development UI:
1. Run the plugin
2. Toggle the "Development UI" switch at the bottom of the plugin window

The development UI provides a consistent layout structure based on the Figma design. When developing new features, add your UI components within these section containers.

## Usage

1. Open a Figma file with the "Cirrus - Native Design System" library enabled
2. Name your frames with allowed prefixes:
   - `parent.header`, `parent.main`, etc.
   - `child.card`, `child.section`, etc.
   - `subChild.button`, `subChild.text`, etc.
   - `hero.banner`, `hero.cta`, etc.
3. Select one or more frames (the plugin will find matching frames)
4. Run the plugin from Plugins → Development → Layout Assistant - Cirrus Design System
5. Click "Apply Variables" to:
   - Apply layout tokens to all frames with auto-layout AND allowed name prefixes
   - Set the appropriate variable mode based on each frame's prefix
   - Process all nested child frames that meet the criteria

## Project Structure

- `src/code.ts` - Main plugin logic that runs in Figma
- `src/ui.html` - Plugin UI interface
- `manifest.json` - Plugin configuration
- `webpack.config.js` - Build configuration
- `tsconfig.json` - TypeScript configuration

## Technologies Used

- TypeScript
- ESBuild (for TypeScript compilation)
- Webpack (for UI bundling)
- Figma Plugin API
- HTML/CSS for UI

## License

ISC
