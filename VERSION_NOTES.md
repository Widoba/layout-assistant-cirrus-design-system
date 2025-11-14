# Version Notes

## Latest Update - Version 1.1.0

### ✨ What's New

**🪟 Resizable Plugin Window**
- **Drag to Resize**: Click and drag the resize handle in the bottom-right corner to adjust the plugin window size
- **Flexible Dimensions**: Customize both width and height to fit your workflow
- **Smart Minimums**: Window automatically maintains a minimum size (360px wide × 300px tall) to ensure all controls remain accessible
- **Real-Time Updates**: Changes apply instantly as you drag, giving you immediate visual feedback

**📐 Responsive Layout System**
- **Adaptive UI**: The plugin interface automatically adjusts its layout based on window width
- **Vertical Layout (Narrow Windows)**: When the window is less than 640px wide, sections stack vertically for easy navigation on smaller screens
- **Horizontal Layout (Wide Windows)**: When the window is 640px or wider, sections arrange side-by-side in a 3-column layout, giving you more screen space and better visibility
- **Seamless Transitions**: Layout changes smoothly as you resize, maintaining usability at any size

**Enhanced User Experience & Performance**
- Improved plugin responsiveness and faster variable application
- Better error handling and user feedback
- Refined UI/UX for smoother workflow

### 🔧 Improvements

- **Customizable Workspace**: Resize the plugin window to match your screen setup and preferences
- **Better Space Utilization**: Wide layouts allow you to see more information at once without scrolling
- **Flexible Workflow**: Choose the layout that works best for your design process - compact vertical view or expanded horizontal view
- **Performance Optimizations**: Faster processing of nested frames and batch operations
- **Error Handling**: More informative error messages and graceful handling of edge cases
- **UI Polish**: Enhanced visual feedback and clearer state indicators

### 🐛 Bug Fixes

- Fixed issues with variable application in complex nested hierarchies
- Resolved edge cases in prefix detection and naming
- Improved compatibility with various Figma file structures

### 📝 Technical Updates

- Code optimizations for better maintainability
- Improved type safety and error checking
- Enhanced documentation and code comments

---

## Version 1.0.0

### ✨ New Feature: Setup Mode

**Setup Mode** streamlines the workflow for setting up new frames with layout tokens. It automatically activates when you select frames without prefixes, providing a guided setup experience.

#### Key Features:
- **Automatic Activation**: Setup Mode activates automatically when selecting frames without prefixes (`parent.`, `child.`, `subChild.`, or `hero.`)
- **Intelligent Prefix Suggestions**: Available prefix options are filtered based on the frame's parent container hierarchy, making it easier to choose the correct level
- **One-Click Setup**: Rename frames and apply layout tokens in a single action
- **Auto Option**: Let the plugin automatically determine the correct hierarchy level based on parent context
- **Pre-Configured Defaults**: All layout controls (corners, padding, nested) are pre-selected by default for faster setup

#### How It Works:
1. Select any frame without a prefix
2. A dropdown automatically appears with prefix options
3. Choose "Auto" for automatic detection or select a specific prefix
4. Adjust layout controls if needed (pre-selected by default)
5. Click "Apply Variables" to rename and apply tokens in one step

#### Benefits:
- **Faster Onboarding**: No need to manually name frames before applying tokens
- **Smarter Suggestions**: Prefix options are contextually filtered based on hierarchy
- **Reduced Errors**: Auto option eliminates guesswork in hierarchy selection
- **Improved UX**: Streamlined workflow for both new and existing users

### What's Changed:

- ✅ Setup Mode automatically activates for unprefixed frames
- ✅ Prefix dropdown intelligently filters options based on parent hierarchy
- ✅ Layout controls are pre-selected by default in Setup Mode
- ✅ Auto Adjust functionality integrated into Setup Mode dropdown
- ✅ Improved UI/UX for prefix selection workflow

### Improvements:

- **Workflow Enhancement**: Setup Mode reduces the manual steps required to set up new frames
- **Context Awareness**: The plugin now understands frame hierarchy context for better suggestions
- **User Experience**: More intuitive interface for first-time users and faster workflow for experienced users

---

*For detailed usage instructions, see the plugin documentation.*

