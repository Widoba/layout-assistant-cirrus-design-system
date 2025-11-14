# Layout Assistant - Cirrus Design System

A Figma plugin that automatically applies layout variables from the "Cirrus - Native Design System" team library to selected frames with auto-layout. Streamline your design workflow with intelligent prefix detection, automatic mode selection, and batch processing of nested frames.

## ✨ Features

### Core Functionality
- **Automatic Variable Application**: Applies spacing, padding, and corner-radius variables from the "A6 - Layout" collection
- **Intelligent Mode Detection**: Automatically sets variable modes based on frame name prefixes:
  - `parent.*` → Mode: "parent (default)"
  - `child.*` → Mode: "child"
  - `subChild.*` → Mode: "sub-child"
  - `hero.*` → Mode: "hero"
- **Recursive Processing**: Applies variables to all nested frames with auto-layout and allowed names
- **Batch Operations**: Supports processing multiple selected frames and their children simultaneously

### Setup Mode (v1.0.0+)
- **Automatic Activation**: Activates when selecting frames without prefixes
- **Intelligent Prefix Suggestions**: Filters prefix options based on parent container hierarchy
- **One-Click Setup**: Rename frames and apply layout tokens in a single action
- **Auto Detection**: Automatically determines correct hierarchy level based on parent context
- **Pre-Configured Defaults**: Layout controls pre-selected for faster setup

### Resizable Window (v1.1.0+)
- **Drag to Resize**: Adjust plugin window size using the bottom-right corner handle
- **Flexible Dimensions**: Customize width and height to fit your workflow
- **Smart Minimums**: Maintains minimum size (360px × 300px) for accessibility
- **Responsive Layout**: 
  - Vertical layout for narrow windows (<640px)
  - Horizontal 3-column layout for wide windows (≥640px)

### Centralized Design System (v1.2.0+)
- **Primitive → Semantic Token Architecture**: Complete migration to centralized token system
- **Single Source of Truth**: All color values centralized in `DESIGN_TOKENS` object
- **Light/Dark Mode Support**: Automatic mode switching
- **Centralized UI State Management**: Single function orchestrates all UI component visibility
- **Improved Maintainability**: Reduced from 517 hardcoded values to systematic token application

## 📋 Prerequisites

- The "Cirrus - Native Design System" team library must be enabled in your Figma file
- The library must contain an "A6 - Layout" collection with the following variables:
  - `spacing` - Applied to frame item spacing
  - `padding` - Applied to all frame padding properties
  - `corner-radius` - Applied to all frame corner radius properties
- Frames must be named with one of the allowed prefixes (parent.*, child.*, subChild.*, hero.*) OR use Setup Mode for unprefixed frames

## 🚀 Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/Widoba/layout-assistant-cirrus-design-system.git
   cd layout-assistant-cirrus-design-system
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. In Figma, go to **Plugins → Development → Import plugin from manifest**
5. Select the `manifest.json` file from this project

## 💻 Development

### Quick Start

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Development mode with auto-rebuild
npm run dev
```

### Development UI

The plugin includes a development UI mode that can be toggled using the switch at the bottom of the plugin window. This UI provides a foundation for adding new features with the following sections:

1. **Inside Section** - Top section with a neutral background
2. **Active Section** - Middle section with a blue-tinted background (highlighted/active state)
3. **Nested Section** - Bottom expandable section

To switch to the development UI:
1. Run the plugin
2. Toggle the "Development UI" switch at the bottom of the plugin window

The development UI provides a consistent layout structure based on the Figma design. When developing new features, add your UI components within these section containers.

### Project Structure

```
layout-assistant-cirrus-design-system/
├── src/
│   ├── code.ts          # Main plugin logic (runs in Figma)
│   ├── ui.html          # Plugin UI interface
│   └── assets/          # Icons and images
├── dist/                # Build output (generated, not tracked in git)
├── doc/                 # Documentation and design tokens
├── manifest.json        # Plugin configuration
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── webpack.config.js    # Webpack build configuration
```

## 📖 Usage

### Basic Usage

1. Open a Figma file with the "Cirrus - Native Design System" library enabled
2. Name your frames with allowed prefixes:
   - `parent.header`, `parent.main`, etc.
   - `child.card`, `child.section`, etc.
   - `subChild.button`, `subChild.text`, etc.
   - `hero.banner`, `hero.cta`, etc.
3. Select one or more frames (the plugin will find matching frames)
4. Run the plugin from **Plugins → Development → Layout Assistant - Cirrus Design System**
5. Click **"Apply Variables"** to:
   - Apply layout tokens to all frames with auto-layout AND allowed name prefixes
   - Set the appropriate variable mode based on each frame's prefix
   - Process all nested child frames that meet the criteria

### Setup Mode (for unprefixed frames)

1. Select any frame without a prefix (`parent.`, `child.`, `subChild.`, or `hero.`)
2. Setup Mode automatically activates
3. A dropdown appears with prefix options (filtered based on parent hierarchy)
4. Choose **"Auto"** for automatic detection or select a specific prefix
5. Adjust layout controls if needed (pre-selected by default)
6. Click **"Apply Variables"** to rename and apply tokens in one step

### Customizing Layout Controls

The plugin allows you to control which layout properties are applied:

- **Corner Radius**: Toggle individual corners (top-left, top-right, bottom-left, bottom-right)
- **Padding**: Toggle individual sides (top, bottom, left, right)
- **Nested Frames**: Apply to nested children recursively
- **Spacing**: Apply spacing variables to frame item spacing

## 🛠️ Technologies Used

- **TypeScript** - Type-safe development
- **ESBuild** - Fast TypeScript compilation for plugin code
- **Webpack** - UI bundling and asset management
- **Figma Plugin API** - Plugin runtime environment
- **HTML/CSS** - UI implementation

## 📝 Scripts

- `npm run build` - Build both code and UI for production
- `npm run build:code` - Build plugin code only
- `npm run build:ui` - Build UI only
- `npm run dev` - Development mode with watch for both code and UI

## 📚 Documentation

- **[Release Notes](RELEASE_NOTES.md)** - Detailed changelog and version history
- **[Version Notes](VERSION_NOTES.md)** - User-facing feature documentation
- **[Design Tokens](doc/cirrus-token-injector-colorTokens.md)** - Token system documentation

## 🗺️ Roadmap

Recent major updates:
- **v1.2.0**: Centralized design token system and UI state management
- **v1.1.0**: Resizable window and responsive layout system
- **v1.0.0**: Setup Mode with intelligent prefix detection

See [RELEASE_NOTES.md](RELEASE_NOTES.md) for complete changelog.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

---

**Note**: For the latest release notes and detailed version information, see [RELEASE_NOTES.md](RELEASE_NOTES.md) and [VERSION_NOTES.md](VERSION_NOTES.md).
