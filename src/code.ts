// This plugin will apply variables from the "cirrus - native design system" team library
// to selected frames with auto-layout and their nested children

// Show the plugin UI
figma.showUI(__html__, { 
  width: 400, 
  height: 480, // Increased height to accommodate the rename panel
  title: "Layout Assistant - Cirrus Design System"
});

// Send initial selection state
notifySelectionChange();

// Listen for selection changes
figma.on('selectionchange', () => {
  notifySelectionChange();
});

// Types for our messages
interface ApplyVariablesMessage {
  type: 'apply-variables';
  corners?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  padding?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  applyToNested?: boolean;
  applyToSpacing?: boolean;
}

interface ClearVariablesMessage {
  type: 'clear-variables';
  corners?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  padding?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
  applyToNested?: boolean;
  applyToSpacing?: boolean;
}

interface CancelMessage {
  type: 'cancel';
}

interface RenameNodeMessage {
  type: 'rename-node';
  nodeId: string;
  newName: string;
  applyAfter: boolean;
  renameNested: boolean;
  applyToNested?: boolean;
  applyToSpacing?: boolean;
  corners?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  padding?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
}

interface AutoAdjustMessage {
  type: 'auto-adjust';
  nodeId: string;
  applyAfter: boolean;
  renameNested: boolean;
  applyToNested?: boolean;
  applyToSpacing?: boolean;
  corners?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  };
  padding?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  };
}

interface ErrorMessage {
  type: 'error';
  message: string;
}

interface SuccessMessage {
  type: 'success';
  message: string;
}

interface UIToggleMessage {
  type: 'ui-toggle-change';
  useNewUi: boolean;
}

interface ResizeHeightMessage {
  type: 'resize-height';
  height: number;
}

interface ResizeWidthMessage {
  type: 'resize-width';
  width: number;
}

interface ResizeMessage {
  type: 'resize';
  width: number;
  height: number;
}

interface GetSpacingVariableModeMessage {
  type: 'get-spacing-variable-mode';
  nodeId: string;
}

interface UpdateSpacingVariableModeMessage {
  type: 'update-spacing-variable-mode';
  mode: string; // Variable mode for A3 ↔️ Spacing collection (none, x-small, small, medium, standard, large, x-large)
}

interface GetLayoutVariableModesMessage {
  type: 'get-layout-variable-modes';
  nodeId: string;
}

interface UpdateLayoutVariableModeMessage {
  type: 'update-layout-variable-mode';
  collectionName: 'A1 📐 Layout' | 'A2 📦 Padding' | 'A3 ↔️ Spacing' | 'A4 ╭ Corner Radius';
  mode: string; // Variable mode name
}

interface GetAvailableVariableModesMessage {
  type: 'get-available-variable-modes';
  collectionName: 'A1 📐 Layout' | 'A2 📦 Padding' | 'A3 ↔️ Spacing' | 'A4 ╭ Corner Radius';
}

interface RemoveDirectionalPrefixMessage {
  type: 'remove-directional-prefix';
  nodeId: string;
}

interface AddDirectionalPrefixMessage {
  type: 'add-directional-prefix';
  nodeId: string;
}

interface SelectionChangeMessage {
  type: 'selection-change';
  node: {
    id: string;
    name: string;
    type: string;
  } | null;
  parentNode: {
    id: string;
    name: string;
    type: string;
  } | null;
  childNodes?: {
    id: string;
    name: string;
    type: string;
    level?: number;
    hasChildren?: boolean;
    children?: {
      id: string;
      name: string;
      type: string;
      level?: number;
    }[];
    nestedCount?: number;
  }[];
  variableBindings?: {
    corners: {
      topLeft: boolean;
      topRight: boolean;
      bottomLeft: boolean;
      bottomRight: boolean;
    };
    padding: {
      top: boolean;
      bottom: boolean;
      left: boolean;
      right: boolean;
    };
    spacing?: boolean;
  };
  directionalExtension?: 'row.' | 'column.' | null;
  layoutDirection?: 'row' | 'column' | null;
}

interface RenameSuccessMessage {
  type: 'rename-success';
  nodeId: string;
  newName: string;
}

type Message = 
  | ApplyVariablesMessage 
  | ClearVariablesMessage 
  | CancelMessage 
  | RenameNodeMessage 
  | AutoAdjustMessage
  | ErrorMessage 
  | SuccessMessage 
  | SelectionChangeMessage 
  | RenameSuccessMessage
  | HierarchySkipMessage
  | HierarchySkipResponseMessage
  | UIToggleMessage
  | ResizeHeightMessage
  | ResizeWidthMessage
  | ResizeMessage
  | GetSpacingVariableModeMessage
  | UpdateSpacingVariableModeMessage
  | GetLayoutVariableModesMessage
  | UpdateLayoutVariableModeMessage
  | GetAvailableVariableModesMessage
  | RemoveDirectionalPrefixMessage
  | AddDirectionalPrefixMessage;

// Define allowed prefixes for frame names and their corresponding mode names
const PREFIX_TO_MODE: { [key: string]: string } = {
  'parent.': 'parent (default)',
  'child.': 'child',
  'subChild.': 'sub-child',
  'hero.': 'hero'
};

const ALLOWED_PREFIXES = Object.keys(PREFIX_TO_MODE);

// Names of the collections that need mode setting
const MODE_COLLECTION_NAMES = [
  'spacing-primitive',
  'padding-primitive', 
  'corner-radius-primitive'
];

// Mapping of new collection names to old names for backwards compatibility
const COLLECTION_NAME_FALLBACKS: Record<string, string[]> = {
  'spacing-primitive': ['A1 - ↔️ Spacing'],
  'padding-primitive': ['A4 - 🧩 Padding'],
  'corner-radius-primitive': ['A5 - ╭ Corner Radius'],
  'A1 📐 Layout': ['📐 Layout', 'A6 - Layout'],
  'A2 📦 Padding': ['📦 Padding'],
  'A3 ↔️ Spacing': ['↔️ Spacing'],
  'A4 ╭ Corner Radius': ['╭ Corner Radius'],
  // Also allow reverse lookup: old names can find new names
  '📐 Layout': ['A1 📐 Layout', 'A6 - Layout']
};

// Helper function to find a collection by name with backwards compatibility fallback
function findCollectionWithFallback(
  collections: VariableCollection[],
  newName: string
): VariableCollection | null {
  // Try new name first
  let collection = collections.find(c => c.name === newName);
  if (collection) {
    return collection;
  }
  
  // Try old names if available
  const fallbackNames = COLLECTION_NAME_FALLBACKS[newName];
  if (fallbackNames) {
    for (const oldName of fallbackNames) {
      collection = collections.find(c => c.name === oldName);
      if (collection) {
        console.log(`⚠️ Using backwards compatibility: Found "${oldName}" instead of "${newName}"`);
        return collection;
      }
    }
  }
  
  return null;
}

// Helper function to find a library collection by name with backwards compatibility fallback
function findLibraryCollectionWithFallback(
  availableCollections: LibraryVariableCollection[],
  newName: string,
  preferCirrus: boolean = true
): LibraryVariableCollection | null {
  // Try new name first
  let libCollection = availableCollections.find(c => {
    const libraryName = (c.libraryName || '').toLowerCase();
    const matchesName = c.name === newName;
    const matchesLibrary = !preferCirrus || (libraryName.includes('cirrus') && libraryName.includes('native design system'));
    return matchesName && matchesLibrary;
  });
  
  if (libCollection) {
    return libCollection;
  }
  
  // Try new name without library filter
  libCollection = availableCollections.find(c => c.name === newName);
  if (libCollection) {
    return libCollection;
  }
  
  // Try old names if available
  const fallbackNames = COLLECTION_NAME_FALLBACKS[newName];
  if (fallbackNames) {
    for (const oldName of fallbackNames) {
      // Try with library filter first
      libCollection = availableCollections.find(c => {
        const libraryName = (c.libraryName || '').toLowerCase();
        const matchesName = c.name === oldName;
        const matchesLibrary = !preferCirrus || (libraryName.includes('cirrus') && libraryName.includes('native design system'));
        return matchesName && matchesLibrary;
      });
      
      if (libCollection) {
        console.log(`⚠️ Using backwards compatibility: Found library collection "${oldName}" instead of "${newName}"`);
        return libCollection;
      }
      
      // Try without library filter
      libCollection = availableCollections.find(c => c.name === oldName);
      if (libCollection) {
        console.log(`⚠️ Using backwards compatibility: Found library collection "${oldName}" instead of "${newName}"`);
        return libCollection;
      }
    }
  }
  
  return null;
}

// Helper function to check if a collection with the given name (or its fallback names) was already found
function hasCollectionWithName(
  collections: VariableCollection[],
  newName: string
): boolean {
  // Check if collection with new name exists
  if (collections.find(c => c.name === newName)) {
    return true;
  }
  
  // Check if collection with any fallback name exists
  const fallbackNames = COLLECTION_NAME_FALLBACKS[newName];
  if (fallbackNames) {
    for (const oldName of fallbackNames) {
      if (collections.find(c => c.name === oldName)) {
        return true;
      }
    }
  }
  
  return false;
}

// Define the hierarchical relationships between prefixes
// This maps each prefix to its "child" level prefix
// Hierarchy: hero -> parent -> child -> subChild
const HIERARCHY_MAP: Record<string, string> = {
  'parent.': 'child.',
  'child.': 'subChild.',
  'subChild.': 'subChild.', // Stays the same at the lowest level
  'hero.': 'parent.' // Hero children are parent level, then parent -> child -> subChild
};

// Function to notify UI of selection changes
async function notifySelectionChange() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 1) {
    const node = selection[0];
    // Ensure current page is loaded (required for dynamic-page access)
    await figma.currentPage.loadAsync();
    
    // Safely get parent node if it exists
    // After loading the current page, parent should be accessible, but wrap in try-catch for safety
    let parentNode: { id: string; name: string; type: string; } | null = null;
    try {
      if (node.parent && node.parent.type !== 'PAGE') {
        // Only include parent if it's not the page itself (we don't want to show the page as parent)
        parentNode = {
          id: node.parent.id,
          name: node.parent.name,
          type: node.parent.type
        };
      }
    } catch (error) {
      // If accessing parent fails (e.g., in dynamic-page mode), just skip it
      console.log('Could not access parent node:', error);
      parentNode = null;
    }
    
    // Get child nodes if the selected node has children (hierarchically organized)
    let childNodes: { id: string; name: string; type: string; level?: number; hasChildren?: boolean; children?: any[]; nestedCount?: number; }[] = [];
    if ('children' in node && node.children) {
      // Helper function to recursively collect children with nesting levels and organize hierarchically
      const collectChildrenHierarchical = (children: readonly SceneNode[], level: number = 1, maxLevel: number = 4): any[] => {
        const result: any[] = [];
        
        for (const child of children) {
          // Only include children with prefixes (filter out items without prefixes)
          // Use hasAllowedPrefix to recognize base prefixes even with row/column extensions
          const hasPrefix = hasAllowedPrefix(child.name);
          
          // Skip items without prefixes
          if (!hasPrefix) {
            continue;
          }
          
          const childData: any = {
            id: child.id,
            name: child.name,
            type: child.type,
            level: level
          };
          
          // Recursively collect nested children if this child has children and we haven't exceeded max level
          if (level < maxLevel && 'children' in child && child.children.length > 0) {
            // Always recurse into children to find all nested layers with prefixes
            const nestedChildren = collectChildrenHierarchical(child.children, level + 1, maxLevel);
            
            if (nestedChildren.length > 0) {
              childData.hasChildren = true;
              childData.children = nestedChildren;
              childData.nestedCount = nestedChildren.length;
            }
          }
          
          result.push(childData);
        }
        
        return result;
      };
      
      // Start collecting from direct children (increased max level to 4 for deeper nesting)
      childNodes = collectChildrenHierarchical(node.children, 1, 4);
      
      // Limit to first 30 top-level items to avoid overwhelming the UI
      childNodes = childNodes.slice(0, 30);
    }
    
    // Query variable bindings if node is a FrameNode
    let variableBindings: SelectionChangeMessage['variableBindings'] | undefined;
    let directionalExtension: 'row.' | 'column.' | null = null;
    let layoutDirection: 'row' | 'column' | null = null;
    if (node.type === 'FRAME') {
      const frame = node as FrameNode;
      const boundVars = frame.boundVariables;
      
      variableBindings = {
        corners: {
          topLeft: !!boundVars?.topLeftRadius,
          topRight: !!boundVars?.topRightRadius,
          bottomLeft: !!boundVars?.bottomLeftRadius,
          bottomRight: !!boundVars?.bottomRightRadius
        },
        padding: {
          top: !!boundVars?.paddingTop,
          bottom: !!boundVars?.paddingBottom,
          left: !!boundVars?.paddingLeft,
          right: !!boundVars?.paddingRight
        },
        spacing: !!boundVars?.itemSpacing
      };
      
      // Check for directional extension (column. or row.)
      directionalExtension = getDirectionalExtension(node.name);
      
      // Get layout direction for the frame
      layoutDirection = getLayoutDirection(frame);
    }
    
    figma.ui.postMessage({
      type: 'selection-change',
      node: {
        id: node.id,
        name: node.name,
        type: node.type
      },
      parentNode: parentNode,
      childNodes: childNodes,
      variableBindings: variableBindings,
      directionalExtension: directionalExtension,
      layoutDirection: layoutDirection
    } as SelectionChangeMessage);
  } else {
    figma.ui.postMessage({
      type: 'selection-change',
      node: null,
      parentNode: null,
      childNodes: [],
      variableBindings: undefined
    } as SelectionChangeMessage);
  }
}

// Directional layout extensions
const DIRECTIONAL_EXTENSIONS = ['row.', 'column.'];

// Function to check if a frame name has a directional extension
function hasDirectionalExtension(name: string): boolean {
  return DIRECTIONAL_EXTENSIONS.some(ext => name.includes(`.${ext}`));
}

// Function to get the directional extension from a frame name
function getDirectionalExtension(name: string): 'row.' | 'column.' | null {
  if (name.includes('.row.')) {
    return 'row.';
  }
  if (name.includes('.column.')) {
    return 'column.';
  }
  return null;
}

// Function to get the base prefix (parent/child/subChild/hero) even when row/column extension exists
function getExistingPrefix(name: string): string | null {
  // First check if there's a directional extension
  const directionalExt = getDirectionalExtension(name);
  
  if (directionalExt) {
    // Remove the directional extension temporarily to check for base prefix
    // The pattern is: prefix.directional.baseName (e.g., "child.column.Frame 20")
    // We need to remove ".column." or ".row." but preserve the prefix structure
    
    // Find where the directional extension appears in the name
    // Note: getDirectionalExtension finds ".column." which includes the dot BEFORE column
    // So if we have "child.column.Frame 20", ".column." starts at index 5 (the dot after "child.")
    const extPattern = `.${directionalExt}`;
    const extIndex = name.indexOf(extPattern);
    
    if (extIndex !== -1) {
      // The part before the extension should include the trailing dot of the prefix
      // So if extIndex is 5 and we have "child.column.Frame 20":
      // - beforeExt should be "child." (indices 0-5, which is 6 characters including the dot)
      // - afterExt should be "Frame 20" (everything after ".column.")
      const beforeExt = name.substring(0, extIndex + 1); // Include the dot after the prefix
      const afterExt = name.substring(extIndex + extPattern.length);
      const nameWithoutDirection = beforeExt + afterExt;
      
      // Now check if nameWithoutDirection starts with a known prefix
      for (const prefix of ALLOWED_PREFIXES) {
        if (nameWithoutDirection.startsWith(prefix)) {
          return prefix;
        }
      }
      
      // Also check if the part before the extension itself is a prefix
      // This handles cases where the name is exactly "child.column." (no base name)
      for (const prefix of ALLOWED_PREFIXES) {
        if (beforeExt === prefix || beforeExt.endsWith(prefix)) {
          return prefix;
        }
      }
    }
  } else {
    // No directional extension, check normally
    for (const prefix of ALLOWED_PREFIXES) {
      if (name.startsWith(prefix)) {
        return prefix;
      }
    }
  }
  return null;
}

// Function to get the base name (without prefix and directional extension)
function getBaseName(name: string): string {
  const prefix = getExistingPrefix(name);
  const directionalExt = getDirectionalExtension(name);
  
  let nameWithoutPrefix = name;
  if (prefix) {
    nameWithoutPrefix = name.substring(prefix.length);
  }
  
  if (directionalExt) {
    // Remove the directional extension (format: prefix.directional.baseName)
    // The directional extension appears after the prefix, so we need to remove it from nameWithoutPrefix
    // e.g., if name is "child.column.something", after removing prefix we have "column.something"
    // We need to remove "column." to get "something"
    
    // First, try exact match at the start
    if (nameWithoutPrefix.startsWith(directionalExt)) {
      nameWithoutPrefix = nameWithoutPrefix.substring(directionalExt.length);
    } else if (nameWithoutPrefix.startsWith(`.${directionalExt}`)) {
      // Handle case where there's a dot before the extension (shouldn't happen but be safe)
      nameWithoutPrefix = nameWithoutPrefix.substring(directionalExt.length + 1);
    } else {
      // Fallback: try replacing the extension pattern (with or without leading dot)
      const beforeReplace = nameWithoutPrefix;
      // Try with leading dot first
      nameWithoutPrefix = nameWithoutPrefix.replace(new RegExp(`\\.${directionalExt.replace('.', '\\.')}`), '');
      // If that didn't change anything, try without leading dot
      if (nameWithoutPrefix === beforeReplace) {
        nameWithoutPrefix = nameWithoutPrefix.replace(new RegExp(`${directionalExt.replace('.', '\\.')}`), '');
      }
    }
    
    // Double-check: if baseName still contains the directional extension, remove it
    if (nameWithoutPrefix.includes(directionalExt)) {
      nameWithoutPrefix = nameWithoutPrefix.replace(new RegExp(`${directionalExt.replace('.', '\\.')}`), '');
    }
  }
  
  return nameWithoutPrefix;
}

// Message type for hierarchy skip prompt
interface HierarchySkipMessage {
  type: 'hierarchy-skip-prompt';
  skippedNodes: {
    id: string;
    path: string;
    currentPrefix: string;
    suggestedPrefix: string;
  }[];
}

// Message type for hierarchy skip response
interface HierarchySkipResponseMessage {
  type: 'hierarchy-skip-response';
  nodesToRename: string[]; // Array of node IDs to rename
}

// Function to rename a node and optionally its nested children
async function renameNode(nodeId: string, newName: string, renameNested: boolean = false): Promise<boolean> {
  try {
    // For dynamic-page access, ensure current page is loaded first
    // This ensures parent nodes are accessible
    await figma.currentPage.loadAsync();
    
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) {
      throw new Error(`Node with ID ${nodeId} not found`);
    }
    
    // If the node is a PageNode, load it first (required for dynamic-page access)
    if (node.type === 'PAGE') {
      await node.loadAsync();
    }
    
    // For dynamic-page access, avoid accessing node.parent directly as it may trigger synchronous getNodeById
    // The parent reference should be available once currentPage is loaded, but we don't need to access it here
    // for the rename operation
    
    // Capture the ORIGINAL prefix BEFORE renaming (needed for detecting pre-existing skips)
    // This is critical - we need the original prefix to properly check hierarchy before vs after renaming
    const originalPrefix = getExistingPrefix(node.name) || 'parent.';
    
    // Get the new prefix from the new name
    const newPrefix = getExistingPrefix(newName);
    if (!newPrefix) {
      throw new Error('New name does not have a valid prefix');
    }
    
    // Rename the main node
    node.name = newName;
    
    // Count of renamed nodes (including the main node)
    let renamedCount = 1;
    
    // Recursively rename nested nodes if requested
    if (renameNested && 'children' in node) {
      // Load PageNode before accessing children (required for dynamic-page access)
      if (node.type === 'PAGE') {
        await (node as PageNode).loadAsync();
      }
      // Ensure we're working with SceneNode children
      const children = node.children as SceneNode[];
      
      // Capture original prefix structure using the ORIGINAL prefix (before renaming)
      // This allows us to detect skips that existed before renaming vs those created by renaming
      const originalPrefixes = captureOriginalPrefixes(children, originalPrefix);
      
      // Use the new hierarchical renaming logic with skipped hierarchy detection
      // Pass NEW prefix as parentPrefix so nested nodes are checked against the NEW hierarchy
      // Also pass a flag indicating if parent prefix changed (for refresh logic)
      const parentPrefixChanged = originalPrefix !== newPrefix;
      const result = await renameNestedNodes(children, newPrefix, "", [], originalPrefixes, parentPrefixChanged, 'setup');
      renamedCount += result.renamedCount;
      
      // If we found nodes with skipped hierarchy levels, prompt the user
      if (result.skippedNodes.length > 0) {
        // Store the skipped nodes for later processing
        pendingSkippedNodes = result.skippedNodes;
        
        // Format the skipped nodes for the UI
        const skippedNodesForUI = result.skippedNodes.map(node => ({
          id: node.node.id,
          path: node.path,
          currentPrefix: node.currentPrefix,
          suggestedPrefix: node.suggestedPrefix
        }));
        
        // Send a message to the UI to prompt the user
        figma.ui.postMessage({
          type: 'hierarchy-skip-prompt',
          skippedNodes: skippedNodesForUI
        } as HierarchySkipMessage);
        
        // We'll handle the response in the main message handler
        // For now, just report what we've done so far
        figma.notify(`Renamed ${renamedCount} layers. Found ${result.skippedNodes.length} layers with skipped hierarchy levels.`);
        return true;
      }
    }
    
    // Send success message
    figma.ui.postMessage({
      type: 'rename-success',
      nodeId: nodeId,
      newName: newName
    } as RenameSuccessMessage);
    
    // Notify about renamed count if more than just the main node
    if (renamedCount > 1) {
      figma.notify(`Renamed ${renamedCount} layers following hierarchy rules`);
    }
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    figma.ui.postMessage({
      type: 'error',
      message: `Failed to rename: ${errorMessage}`
    } as ErrorMessage);
    
    return false;
  }
}

// Function to handle renaming nodes after user selection
async function renameSkippedNodes(nodeIds: string[], skippedNodes: NonConformingNode[]): Promise<number> {
  let renamedCount = 0;
  
  for (const nodeId of nodeIds) {
    // Find the corresponding skipped node info
    const nodeInfo = skippedNodes.find(n => n.node.id === nodeId);
    if (nodeInfo) {
      const node = await figma.getNodeByIdAsync(nodeId);
      if (node) {
        // Rename the node using the suggested prefix
        node.name = `${nodeInfo.suggestedPrefix}${nodeInfo.baseName}`;
        renamedCount++;
        console.log(`Renamed node from ${nodeInfo.currentPrefix}${nodeInfo.baseName} to ${nodeInfo.suggestedPrefix}${nodeInfo.baseName}`);
      }
    }
  }
  
  return renamedCount;
}

// Type definition for nodes that don't follow the hierarchy
interface NonConformingNode {
  node: SceneNode;
  currentPrefix: string;
  suggestedPrefix: string;
  baseName: string;
  path: string; // Path to the node for display purposes
}

// Define the hierarchy levels for detecting skips
const HIERARCHY_LEVELS: Record<string, number> = {
  'parent.': 1,
  'child.': 2,
  'subChild.': 3,
  'hero.': 0 // Special case, not in the regular hierarchy
};

// Function to check if hierarchy is skipped between parent and child
function isHierarchySkipped(parentPrefix: string, childPrefix: string): boolean {
  // Hero is a special case and doesn't follow the hierarchy
  if (parentPrefix === 'hero.' || childPrefix === 'hero.') {
    return false;
  }
  
  const parentLevel = HIERARCHY_LEVELS[parentPrefix];
  const childLevel = HIERARCHY_LEVELS[childPrefix];
  
  // If levels are more than 1 apart, hierarchy is skipped
  return Math.abs(childLevel - parentLevel) > 1;
}

// Function to scan tree and capture original prefix structure before renaming
function captureOriginalPrefixes(
  nodes: readonly SceneNode[],
  parentPrefix: string,
  originalPrefixes: Map<string, { prefix: string; parentPrefix: string }> = new Map()
): Map<string, { prefix: string; parentPrefix: string }> {
  for (const node of nodes) {
    const existingPrefix = getExistingPrefix(node.name);
    if (existingPrefix) {
      // Store original prefix and parent prefix for this node
      originalPrefixes.set(node.id, {
        prefix: existingPrefix,
        parentPrefix: parentPrefix
      });
      
      // Recursively capture children's prefixes
      if ('children' in node) {
        captureOriginalPrefixes(node.children, existingPrefix, originalPrefixes);
      }
    } else {
      // Node has no prefix, but still process children with current parent prefix
      if ('children' in node) {
        captureOriginalPrefixes(node.children, parentPrefix, originalPrefixes);
      }
    }
  }
  
  return originalPrefixes;
}

// Function to recursively rename nested nodes that have prefixes
async function renameNestedNodes(
  nodes: readonly SceneNode[], 
  parentPrefix: string, 
  nodePath: string = "",
  skippedNodes: NonConformingNode[] = [],
  originalPrefixes?: Map<string, { prefix: string; parentPrefix: string }>,
  parentPrefixChanged: boolean = false,
  mode: 'setup' | 'adjust' = 'setup'
): Promise<{renamedCount: number, skippedNodes: NonConformingNode[]}> {
  let renamedCount = 0;
  
  for (const node of nodes) {
    // Build the path to this node for display purposes
    const currentPath = nodePath ? `${nodePath} > ${node.name}` : node.name;
    
    // Check if this node has a prefix
    const existingPrefix = getExistingPrefix(node.name);
    if (existingPrefix) {
      // Get the base name
      const baseName = getBaseName(node.name);
      
      // Check if frame already has a directional extension
      const existingDirectionalExt = getDirectionalExtension(node.name);
      
      // Determine the appropriate prefix based on hierarchy
      const hierarchicalPrefix = HIERARCHY_MAP[parentPrefix] || parentPrefix;
      
      // Check if hierarchy is skipped
      if (isHierarchySkipped(parentPrefix, existingPrefix)) {
        // Check if this skip existed in the original structure before renaming
        const wasPreExisting = originalPrefixes ? (() => {
          const original = originalPrefixes.get(node.id);
          if (!original) return false;
          // Check if the skip existed in the original structure
          return isHierarchySkipped(original.parentPrefix, original.prefix);
        })() : false;
        
        // Only flag skips that existed before we started renaming
        if (wasPreExisting) {
          // Add to skipped nodes for user prompt
          skippedNodes.push({
            node: node,
            currentPrefix: existingPrefix,
            suggestedPrefix: hierarchicalPrefix,
            baseName: baseName,
            path: currentPath
          });
          
          console.log(`Pre-existing hierarchy skip detected: ${parentPrefix} to ${existingPrefix} in ${currentPath}`);
          
          // Continue processing children with the existing prefix (don't rename yet, user will decide)
          if ('children' in node) {
            // Ensure current page is loaded before accessing children (required for dynamic-page access)
            await figma.currentPage.loadAsync();
            const result = await renameNestedNodes(node.children, existingPrefix, currentPath, skippedNodes, originalPrefixes, false, mode);
            renamedCount += result.renamedCount;
            // skippedNodes is passed by reference, so it's already updated
          }
        } else {
          // Skip was created by renaming - fix it by renaming the node
          // Build new name with directional extension if needed
          let newName = `${hierarchicalPrefix}${baseName}`;
          
          // Check if this is a directional layout container (for nested frames)
          if (node.type === 'FRAME' && 'layoutMode' in node && node.layoutMode !== 'NONE') {
            const isDirectional = isDirectionalLayoutContainer(node as FrameNode, mode);
            if (isDirectional) {
              const direction = getLayoutDirection(node as FrameNode);
              newName = `${hierarchicalPrefix}${direction}.${baseName}`;
            } else if (existingDirectionalExt) {
              // Preserve existing directional extension
              newName = `${hierarchicalPrefix}${existingDirectionalExt}${baseName}`;
            }
          } else if (existingDirectionalExt) {
            // Preserve existing directional extension for non-frames (shouldn't happen, but safe)
            newName = `${hierarchicalPrefix}${existingDirectionalExt}${baseName}`;
          }
          
          node.name = newName;
          renamedCount++;
          
          // Recursively process children with the corrected prefix as the parent prefix
          if ('children' in node) {
            // Ensure current page is loaded before accessing children (required for dynamic-page access)
            await figma.currentPage.loadAsync();
            // Ensure we're working with SceneNode children
            const children = node.children as SceneNode[];
            const result = await renameNestedNodes(
              children, 
              hierarchicalPrefix, 
              currentPath,
              skippedNodes,
              originalPrefixes,
              false,
              mode
            );
            renamedCount += result.renamedCount;
            // skippedNodes is passed by reference, so it's already updated
          }
        }
      } else {
        // Check if the existing prefix follows the hierarchical convention
        // hierarchicalPrefix is what the node SHOULD have based on the NEW parent prefix
        // existingPrefix is what the node CURRENTLY has
        if (existingPrefix === hierarchicalPrefix) {
          // Node already follows the hierarchy with the NEW parent prefix
          // However, if the parent prefix changed, we should refresh the node to ensure
          // it gets properly updated with new variable bindings/modes
          if (parentPrefixChanged) {
            // Parent prefix changed - refresh node by renaming (even if to same name)
            // This ensures the node is properly updated with new hierarchy context
            // Build new name, checking for directional layout container
            let newName = `${hierarchicalPrefix}${baseName}`;
            
            // Check if this is a directional layout container (for nested frames)
            if (node.type === 'FRAME' && 'layoutMode' in node && node.layoutMode !== 'NONE') {
              const frame = node as FrameNode;
              const isDirectional = isDirectionalLayoutContainer(frame, mode);
              
              if (isDirectional) {
                const direction = getLayoutDirection(frame);
                newName = `${hierarchicalPrefix}${direction}.${baseName}`;
              } else if (existingDirectionalExt) {
                // Check if layout direction changed - update extension if needed
                const currentDirection = getLayoutDirection(frame);
                const expectedExt = `${currentDirection}.`;
                
                if (existingDirectionalExt !== expectedExt) {
                  // Direction changed - update extension
                  newName = `${hierarchicalPrefix}${expectedExt}${baseName}`;
                } else {
                  // Preserve existing directional extension
                  newName = `${hierarchicalPrefix}${existingDirectionalExt}${baseName}`;
                }
              }
            } else if (existingDirectionalExt) {
              // Preserve existing directional extension
              newName = `${hierarchicalPrefix}${existingDirectionalExt}${baseName}`;
            }
            
            node.name = newName;
            renamedCount++;
          } else {
            // Node already follows the hierarchy and parent didn't change - no action needed
            // But check if layout direction changed for directional containers
            if (existingDirectionalExt && node.type === 'FRAME' && 'layoutMode' in node && node.layoutMode !== 'NONE') {
              const frame = node as FrameNode;
              const currentDirection = getLayoutDirection(frame);
              const expectedExt = `${currentDirection}.`;
              
              if (existingDirectionalExt !== expectedExt) {
                // Direction changed - update extension
                const newName = `${hierarchicalPrefix}${expectedExt}${baseName}`;
                node.name = newName;
                renamedCount++;
              }
            }
            // Don't increment renamedCount since we didn't actually rename, but still process children
          }
        } else {
          // Node doesn't follow hierarchy - needs to be renamed to match new parent prefix
          // Build new name, checking for directional layout container
          let newName = `${hierarchicalPrefix}${baseName}`;
          
          // Check if this is a directional layout container (for nested frames)
          if (node.type === 'FRAME' && 'layoutMode' in node && node.layoutMode !== 'NONE') {
            const frame = node as FrameNode;
            const isDirectional = isDirectionalLayoutContainer(frame, mode);
            
            if (isDirectional) {
              const direction = getLayoutDirection(frame);
              newName = `${hierarchicalPrefix}${direction}.${baseName}`;
            } else if (existingDirectionalExt) {
              // Preserve existing directional extension if frame is no longer directional
              newName = `${hierarchicalPrefix}${existingDirectionalExt}${baseName}`;
            }
          } else if (existingDirectionalExt) {
            // Preserve existing directional extension
            newName = `${hierarchicalPrefix}${existingDirectionalExt}${baseName}`;
          }
          
          node.name = newName;
          renamedCount++;
        }
        
        // Always recursively process children with this node's prefix as the parent prefix
        // This ensures nested structures are fully processed even if current node already had correct prefix
        // For recursive calls, pass false for parentPrefixChanged since we're processing deeper levels
        if ('children' in node) {
          // Ensure current page is loaded before accessing children (required for dynamic-page access)
          await figma.currentPage.loadAsync();
          // Ensure we're working with SceneNode children
          const children = node.children as SceneNode[];
          const result = await renameNestedNodes(
            children, 
            hierarchicalPrefix, 
            currentPath,
            skippedNodes,
            originalPrefixes,
            false,
            mode
          );
          renamedCount += result.renamedCount;
          // skippedNodes is passed by reference, so it's already updated
        }
      }
    } else {
      // If node doesn't have a prefix, check if it's a frame with auto-layout
      // If so, add the appropriate hierarchical prefix
      if (node.type === 'FRAME' && 
          'layoutMode' in node && 
          node.layoutMode !== 'NONE') {
        // Check if this frame has a directional extension but no recognized prefix
        // This can happen if getExistingPrefix failed to find the prefix due to the extension
        const directionalExt = getDirectionalExtension(node.name);
        
        // If there's a directional extension, try to extract the prefix more carefully
        let actualPrefix: string | null = null;
        let actualBaseName = node.name;
        
        if (directionalExt) {
          // Try to find prefix before the directional extension
          const extPattern = `.${directionalExt}`;
          const extIndex = node.name.indexOf(extPattern);
          
          if (extIndex !== -1) {
            const partBeforeExt = node.name.substring(0, extIndex);
            // Check if this part ends with a known prefix
            for (const prefix of ALLOWED_PREFIXES) {
              if (partBeforeExt === prefix || partBeforeExt.endsWith(prefix)) {
                actualPrefix = prefix;
                // Get the base name: everything after prefix.directionalExtension
                actualBaseName = node.name.substring(prefix.length + extPattern.length);
                break;
              }
            }
          }
        }
        
        // Determine the appropriate prefix based on hierarchy
        const hierarchicalPrefix = HIERARCHY_MAP[parentPrefix] || parentPrefix;
        
        // Only add prefix if we're not at subChild level (stop recursion at subChild)
        if (hierarchicalPrefix !== 'subChild.' || parentPrefix !== 'subChild.') {
          // Use the extracted base name if we found a prefix, otherwise use the full name
          const baseName = actualPrefix ? actualBaseName : node.name;
          
          // Check if this is a directional layout container
          const frame = node as FrameNode;
          const isDirectional = isDirectionalLayoutContainer(frame, mode);
          
          let newName = `${hierarchicalPrefix}${baseName}`;
          if (isDirectional) {
            const direction = getLayoutDirection(frame);
            newName = `${hierarchicalPrefix}${direction}.${baseName}`;
          } else if (directionalExt && actualPrefix) {
            // Frame has directional extension but is no longer directional - preserve extension
            newName = `${hierarchicalPrefix}${directionalExt}${baseName}`;
          }
          
          node.name = newName;
          renamedCount++;
          
          // Recursively process children with this node's new prefix as the parent prefix
          if ('children' in node) {
            // Ensure current page is loaded before accessing children (required for dynamic-page access)
            await figma.currentPage.loadAsync();
            // Ensure we're working with SceneNode children
            const children = node.children as SceneNode[];
            const result = await renameNestedNodes(
              children, 
              hierarchicalPrefix, 
              currentPath,
              skippedNodes,
              originalPrefixes,
              false,
              mode
            );
            renamedCount += result.renamedCount;
            // skippedNodes is passed by reference, so it's already updated
          }
        } else {
          // At subChild level, don't add prefix but still process children
          if ('children' in node) {
            await figma.currentPage.loadAsync();
            const children = node.children as SceneNode[];
            const result = await renameNestedNodes(
              children, 
              parentPrefix, 
              currentPath,
              skippedNodes,
              originalPrefixes,
              false,
              mode
            );
            renamedCount += result.renamedCount;
          }
        }
      } else {
        // If node doesn't have a prefix and isn't a frame with auto-layout, just process its children if any
        if ('children' in node) {
          // Ensure current page is loaded before accessing children (required for dynamic-page access)
          await figma.currentPage.loadAsync();
          // Ensure we're working with SceneNode children
          const children = node.children as SceneNode[];
          const result = await renameNestedNodes(
            children, 
            parentPrefix, 
            currentPath,
            skippedNodes,
            originalPrefixes,
            false,
            mode
          );
          renamedCount += result.renamedCount;
          // skippedNodes is passed by reference, so it's already updated
        }
      }
    }
  }
  
  return { renamedCount, skippedNodes };
}

// Store skipped nodes for later processing
let pendingSkippedNodes: NonConformingNode[] = [];

// Function to determine appropriate prefix based on parent node
async function determineHierarchyPrefix(node: BaseNode): Promise<string> {
  // Default to 'parent.' if no parent or can't determine
  let suggestedPrefix = 'parent.';
  
  try {
    // Ensure current page is loaded first
    await figma.currentPage.loadAsync();
    
    // Check if node has a parent (not a page)
    if (node.parent && node.parent.type !== 'PAGE') {
      const parentPrefix = getExistingPrefix(node.parent.name);
      
      if (parentPrefix) {
        // Use HIERARCHY_MAP to determine the appropriate child level based on parent prefix
        // Hierarchy: hero -> parent -> child -> subChild
        suggestedPrefix = HIERARCHY_MAP[parentPrefix] || 'parent.';
      } else {
        // Parent exists but has no prefix - default to 'parent.'
        suggestedPrefix = 'parent.';
      }
    } else {
      // No parent or parent is page - default to 'parent.'
      suggestedPrefix = 'parent.';
    }
  } catch (error) {
    // If we can't determine parent, default to 'parent.'
    suggestedPrefix = 'parent.';
  }
  
  return suggestedPrefix;
}

// Function to auto-adjust a node's hierarchy based on its parent
async function autoAdjustNode(nodeId: string): Promise<boolean> {
  try {
    // For dynamic-page access, ensure current page is loaded first
    // This ensures parent nodes are accessible
    await figma.currentPage.loadAsync();
    
    const node = await figma.getNodeByIdAsync(nodeId);
    if (!node) {
      throw new Error(`Node with ID ${nodeId} not found`);
    }
    
    // If the node is a PageNode, load it first (required for dynamic-page access)
    if (node.type === 'PAGE') {
      await node.loadAsync();
    }
    
    // For dynamic-page access, avoid accessing node.parent directly as it may trigger synchronous getNodeById
    // The parent reference should be available once currentPage is loaded, but we don't need to access it here
    
    // Determine the appropriate prefix based on parent
    const suggestedPrefix = await determineHierarchyPrefix(node);
    
    // Get the base name without prefix
    const baseName = getBaseName(node.name);
    
    // Create the new name with the suggested prefix
    const newName = `${suggestedPrefix}${baseName}`;
    
    // Rename the node
    node.name = newName;
    
    // Send success message
    figma.ui.postMessage({
      type: 'rename-success',
      nodeId: nodeId,
      newName: newName
    } as RenameSuccessMessage);
    
    figma.notify(`Auto-adjusted to ${newName} based on hierarchy`);
    
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    figma.ui.postMessage({
      type: 'error',
      message: `Failed to auto-adjust: ${errorMessage}`
    } as ErrorMessage);
    
    return false;
  }
}

// Handle messages from the UI
figma.ui.onmessage = async (msg: Message) => {
  if (msg.type === 'apply-variables') {
    try {
      // Run full variable application process (spacing mode handled separately via update-spacing-variable-mode)
      const applyToNested = msg.applyToNested || false;
      const applyToSpacing = msg.applyToSpacing !== undefined ? msg.applyToSpacing : true;
      
      await applyVariablesToSelection(
        false, // don't clear first
        msg.corners,
        msg.padding,
        applyToNested,
        applyToSpacing
      );
      
      // Refresh selection to update UI with new variable bindings
      notifySelectionChange();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'get-spacing-variable-mode') {
    try {
      const node = await figma.getNodeByIdAsync(msg.nodeId);
      if (node && 'itemSpacing' in node) {
        const frame = node as FrameNode;
        const mode = await getSpacingVariableMode(frame);
        figma.ui.postMessage({
          type: 'spacing-variable-mode',
          mode: mode
        });
      } else {
        figma.ui.postMessage({
          type: 'spacing-variable-mode',
          mode: null
        });
      }
    } catch (error) {
      console.error('Error getting spacing variable mode:', error);
      figma.ui.postMessage({
        type: 'spacing-variable-mode',
        mode: null
      });
    }
  } else if (msg.type === 'update-spacing-variable-mode') {
    try {
      // Update spacing variable mode immediately when user interacts with spacing control
      if (figma.currentPage.selection.length === 0) {
        throw new Error('Please select a frame');
      }
      
      const selectedFrame = figma.currentPage.selection[0] as FrameNode;
      
      if (!selectedFrame || selectedFrame.type !== 'FRAME') {
        throw new Error('Please select a frame');
      }
      
      if ('itemSpacing' in selectedFrame) {
        const spacingModeSet = await setSpacingVariableMode(selectedFrame, msg.mode);
        const layoutModeSet = await setLayoutCollectionToManualMode(selectedFrame);
        
        if (spacingModeSet && layoutModeSet) {
          figma.ui.postMessage({
            type: 'success',
            message: `Spacing mode set to "${msg.mode}"`
          } as SuccessMessage);
          figma.notify(`Spacing: ${msg.mode}`);
        } else {
          const errors = [];
          if (!spacingModeSet) errors.push('spacing mode');
          if (!layoutModeSet) errors.push('layout mode');
          throw new Error(`Failed to set ${errors.join(' and ')}`);
        }
      } else {
        throw new Error('Selected frame does not support spacing');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'get-layout-variable-modes') {
    try {
      const node = await figma.getNodeByIdAsync(msg.nodeId);
      if (node && node.type === 'FRAME') {
        const frame = node as FrameNode;
        const modes = await getAllLayoutVariableModes(frame);
        figma.ui.postMessage({
          type: 'layout-variable-modes',
          modes: modes
        });
      } else {
        figma.ui.postMessage({
          type: 'layout-variable-modes',
          modes: { layout: null, padding: null, spacing: null, cornerRadius: null }
        });
      }
    } catch (error) {
      console.error('Error getting layout variable modes:', error);
      figma.ui.postMessage({
        type: 'layout-variable-modes',
        modes: { layout: null, padding: null, spacing: null, cornerRadius: null }
      });
    }
  } else if (msg.type === 'update-layout-variable-mode') {
    try {
      if (figma.currentPage.selection.length === 0) {
        throw new Error('Please select a frame');
      }
      
      const selectedFrame = figma.currentPage.selection[0] as FrameNode;
      
      if (!selectedFrame || selectedFrame.type !== 'FRAME') {
        throw new Error('Please select a frame');
      }
      
      const success = await setVariableModeForCollection(selectedFrame, msg.collectionName, msg.mode);
      
      if (success) {
        // If setting A1 Layout to "manual", also ensure it's set
        if (msg.collectionName === 'A1 📐 Layout' && msg.mode.toLowerCase() === 'manual') {
          await setLayoutCollectionToManualMode(selectedFrame);
        }
        
        figma.ui.postMessage({
          type: 'success',
          message: `${msg.collectionName} mode set to "${msg.mode}"`
        } as SuccessMessage);
        
        // Refresh the modes to update UI
        const modes = await getAllLayoutVariableModes(selectedFrame);
        figma.ui.postMessage({
          type: 'layout-variable-modes',
          modes: modes
        });
      } else {
        throw new Error(`Failed to set ${msg.collectionName} mode to "${msg.mode}"`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'get-available-variable-modes') {
    try {
      const availableModes = await getAvailableVariableModesForCollection(msg.collectionName);
      figma.ui.postMessage({
        type: 'available-variable-modes',
        collectionName: msg.collectionName,
        modes: availableModes
      });
    } catch (error) {
      console.error('Error getting available variable modes:', error);
      figma.ui.postMessage({
        type: 'available-variable-modes',
        collectionName: msg.collectionName,
        modes: []
      });
    }
  } else if (msg.type === 'clear-variables') {
    try {
      const applyToSpacing = msg.applyToSpacing !== undefined ? msg.applyToSpacing : false;
      await clearVariablesFromSelection(msg.corners, msg.padding, msg.applyToNested, applyToSpacing);
      
      // Refresh selection to update UI with cleared variable bindings
      notifySelectionChange();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'rename-node') {
    try {
      // Clear any pending skipped nodes from previous operations
      pendingSkippedNodes = [];
      
      const success = await renameNode(msg.nodeId, msg.newName, msg.renameNested);
      
      if (success) {
        // Notify selection change to update UI with new name
        notifySelectionChange();
        
        if (msg.applyAfter) {
          // Reload the node tree to ensure renamed nested nodes are accessible
          // This is critical after renaming nested nodes
          await figma.currentPage.loadAsync();
          const nodeAfterRename = await figma.getNodeByIdAsync(msg.nodeId);
          if (nodeAfterRename && 'children' in nodeAfterRename) {
            // Ensure children are loaded by accessing them
            if (nodeAfterRename.type === 'PAGE') {
              await (nodeAfterRename as PageNode).loadAsync();
            }
            // Force refresh by accessing children
            const _ = nodeAfterRename.children;
          }
          
          // Apply variables after renaming if requested
          // Use a small delay to ensure the rename has propagated
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // If renameNested was true, we should always apply to nested (the nested nodes were just renamed)
          // Also clear first when renameNested is true to ensure fresh variable bindings with new hierarchy
          const shouldApplyToNested = msg.renameNested || (msg.applyToNested || false);
          const shouldClearFirst = msg.renameNested; // Clear existing variables when nested nodes were renamed
          const applyToSpacing = msg.applyToSpacing !== undefined ? msg.applyToSpacing : true;
          await applyVariablesToSelection(
            shouldClearFirst, // clear first if nested nodes were renamed to ensure fresh bindings
            msg.corners,
            msg.padding,
            shouldApplyToNested,
            applyToSpacing
          );
          
          // Refresh selection to update UI with new variable bindings after applying
          notifySelectionChange();
        } else {
          // Even if applyAfter is false, refresh selection to update UI with renamed node
          // (already called notifySelectionChange() above, but ensure it's called here too for consistency)
          notifySelectionChange();
        }
      }
    } catch (error) {
      console.error('Error in rename-node handler:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'auto-adjust') {
    try {
      // Clear any pending skipped nodes from previous operations
      pendingSkippedNodes = [];
      
      // Capture original prefix of the selected node BEFORE renaming (needed for detecting pre-existing skips)
      // This is used as the "parent prefix" when capturing original prefixes of nested children
      await figma.currentPage.loadAsync();
      const originalNode = await figma.getNodeByIdAsync(msg.nodeId);
      // Get the original prefix of the selected node itself (this will be the "parent" for its children)
      const originalSelectedPrefix = originalNode ? (getExistingPrefix(originalNode.name) || 'parent.') : 'parent.';
      
      const success = await autoAdjustNode(msg.nodeId);
      
      if (success) {
        if (msg.renameNested) {
          // Get the node to access its name (which was already renamed in autoAdjustNode)
          const node = await figma.getNodeByIdAsync(msg.nodeId);
          if (node && 'children' in node) {
            // Load PageNode before accessing children (required for dynamic-page access)
            if (node.type === 'PAGE') {
              await (node as PageNode).loadAsync();
            }
            // Get the new prefix from the renamed node
            const newPrefix = getExistingPrefix(node.name) || 'parent.';
            
            // Ensure we're working with SceneNode children
            const children = node.children as SceneNode[];
            
            // Capture original prefix structure using the ORIGINAL selected node's prefix
            // This is the "parent prefix" for the children being processed
            // This allows us to detect skips that existed before renaming
            const originalPrefixes = captureOriginalPrefixes(children, originalSelectedPrefix);
            
            // Apply hierarchical renaming to children
            // Check if parent prefix changed for refresh logic
            const parentPrefixChanged = originalSelectedPrefix !== newPrefix;
            const result = await renameNestedNodes(children, newPrefix, "", [], originalPrefixes, parentPrefixChanged, 'adjust');
            
            if (result.renamedCount > 0) {
              figma.notify(`Renamed ${result.renamedCount} nested layers to follow hierarchy`);
            }
            
            // Handle any skipped nodes (only pre-existing skips)
            if (result.skippedNodes.length > 0) {
              pendingSkippedNodes = result.skippedNodes;
              
              // Format the skipped nodes for the UI
              const skippedNodesForUI = result.skippedNodes.map(node => ({
                id: node.node.id,
                path: node.path,
                currentPrefix: node.currentPrefix,
                suggestedPrefix: node.suggestedPrefix
              }));
              
              // Send a message to the UI to prompt the user
              figma.ui.postMessage({
                type: 'hierarchy-skip-prompt',
                skippedNodes: skippedNodesForUI
              } as HierarchySkipMessage);
            }
          }
        }
        
        if (msg.applyAfter) {
          // Reload the node tree to ensure renamed nested nodes are accessible
          // This is critical after renaming nested nodes
          await figma.currentPage.loadAsync();
          const nodeAfterRename = await figma.getNodeByIdAsync(msg.nodeId);
          if (nodeAfterRename && 'children' in nodeAfterRename) {
            // Ensure children are loaded by accessing them
            if (nodeAfterRename.type === 'PAGE') {
              await (nodeAfterRename as PageNode).loadAsync();
            }
            // Force refresh by accessing children
            const _ = nodeAfterRename.children;
          }
          
          // Apply variables after auto-adjusting
          // If renameNested was true, we should always apply to nested (the nested nodes were just renamed)
          // Also clear first when renameNested is true to ensure fresh variable bindings with new hierarchy
          const shouldApplyToNested = msg.renameNested || (msg.applyToNested || false);
          const shouldClearFirst = msg.renameNested; // Clear existing variables when nested nodes were renamed
          const applyToSpacing = msg.applyToSpacing !== undefined ? msg.applyToSpacing : true;
          await applyVariablesToSelection(
            shouldClearFirst, // clear first if nested nodes were renamed to ensure fresh bindings
            msg.corners,
            msg.padding,
            shouldApplyToNested,
            applyToSpacing
          );
          
          // Refresh selection to update UI with new variable bindings after applying
          notifySelectionChange();
        } else {
          // Even if applyAfter is false, refresh selection to update UI after auto-adjust
          notifySelectionChange();
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'hierarchy-skip-response') {
    try {
      // Process the user's selection of nodes to rename
      if (pendingSkippedNodes.length > 0 && msg.nodesToRename.length > 0) {
        const renamedCount = await renameSkippedNodes(msg.nodesToRename, pendingSkippedNodes);
        figma.notify(`Renamed ${renamedCount} additional layers to follow hierarchy rules`);
        
        // Clear the pending nodes
        pendingSkippedNodes = [];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'ui-toggle-change') {
    // Handle UI toggle change
    // You can add any specific logic needed when UI changes
    // For example, storing a plugin-level preference
  } else if (msg.type === 'resize-height') {
    // Resize the plugin window (enforce minimum height of 300px)
    const height = Math.max(300, msg.height);
    figma.ui.resize(400, height);
  } else if (msg.type === 'resize-width') {
    // Resize the plugin window width (enforce minimum width of 360px)
    const width = Math.max(360, msg.width);
    figma.ui.resize(width, 480);
  } else if (msg.type === 'resize') {
    // Resize the plugin window (both width and height, enforce minimum width of 360px and minimum height of 300px)
    const width = Math.max(360, msg.width);
    const height = Math.max(300, msg.height);
    figma.ui.resize(width, height);
  } else if (msg.type === 'remove-directional-prefix') {
    try {
      const node = await figma.getNodeByIdAsync(msg.nodeId);
      if (!node || node.type !== 'FRAME') {
        figma.ui.postMessage({
          type: 'error',
          message: 'Selected node is not a frame'
        } as ErrorMessage);
        return;
      }
      
      const frame = node as FrameNode;
      const directionalExt = getDirectionalExtension(frame.name);
      
      if (!directionalExt) {
        figma.ui.postMessage({
          type: 'error',
          message: 'Frame does not have a directional prefix'
        } as ErrorMessage);
        return;
      }
      
      // Remove directional extension from name
      const prefix = getExistingPrefix(frame.name);
      const baseName = getBaseName(frame.name);
      const newName = prefix ? `${prefix}${baseName}` : baseName;
      frame.name = newName;
      
      // Refresh selection to update UI
      notifySelectionChange();
      
      figma.ui.postMessage({
        type: 'success',
        message: 'Removed directional prefix'
      } as SuccessMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'add-directional-prefix') {
    try {
      const node = await figma.getNodeByIdAsync(msg.nodeId);
      if (!node || node.type !== 'FRAME') {
        figma.ui.postMessage({
          type: 'error',
          message: 'Selected node is not a frame'
        } as ErrorMessage);
        return;
      }
      
      const frame = node as FrameNode;
      
      // Check if frame already has a directional extension
      const existingDirectionalExt = getDirectionalExtension(frame.name);
      if (existingDirectionalExt) {
        figma.ui.postMessage({
          type: 'error',
          message: 'Frame already has a directional prefix'
        } as ErrorMessage);
        return;
      }
      
      // Check if frame has padding or corner radius variables bound
      const hasPadding = !!(
        frame.boundVariables?.paddingTop ||
        frame.boundVariables?.paddingBottom ||
        frame.boundVariables?.paddingLeft ||
        frame.boundVariables?.paddingRight
      );
      
      const hasCornerRadius = !!(
        frame.boundVariables?.topLeftRadius ||
        frame.boundVariables?.topRightRadius ||
        frame.boundVariables?.bottomLeftRadius ||
        frame.boundVariables?.bottomRightRadius
      );
      
      if (hasPadding || hasCornerRadius) {
        figma.ui.postMessage({
          type: 'error',
          message: 'Cannot add directional prefix to frame with padding or corner radius variables bound'
        } as ErrorMessage);
        return;
      }
      
      // Determine layout direction
      const direction = getLayoutDirection(frame);
      const prefix = getExistingPrefix(frame.name);
      const baseName = getBaseName(frame.name);
      const newName = prefix ? `${prefix}${direction}.${baseName}` : `${direction}.${baseName}`;
      frame.name = newName;
      
      // Refresh selection to update UI
      notifySelectionChange();
      
      figma.ui.postMessage({
        type: 'success',
        message: `Added ${direction} directional prefix`
      } as SuccessMessage);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      figma.ui.postMessage({
        type: 'error',
        message: errorMessage
      } as ErrorMessage);
    }
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Helper function to check if a frame name has an allowed prefix (including row/column extensions)
function hasAllowedPrefix(frameName: string): boolean {
  // Check for base prefix directly
  if (ALLOWED_PREFIXES.some(prefix => frameName.startsWith(prefix))) {
    return true;
  }
  
  // Check for base prefix with directional extension (e.g., parent.row., child.column.)
  const directionalExt = getDirectionalExtension(frameName);
  if (directionalExt) {
    const nameWithoutDirection = frameName.replace(`.${directionalExt}`, '');
    return ALLOWED_PREFIXES.some(prefix => nameWithoutDirection.startsWith(prefix));
  }
  
  return false;
}

// Helper function to get the mode name for a frame based on its prefix (ignores row/column extensions)
function getModeForFrame(frameName: string): string | null {
  const basePrefix = getExistingPrefix(frameName);
  if (basePrefix) {
    return PREFIX_TO_MODE[basePrefix] || null;
  }
  return null;
}

// Helper function to get the prefix for a frame (base prefix only, without directional extension)
function getPrefixForFrame(frameName: string): string | null {
  return getExistingPrefix(frameName);
}

// Helper function to find all frames with auto-layout and allowed names in a node tree
// Stops recursion at subChild level
async function findAllAutoLayoutFrames(nodes: readonly SceneNode[], recursive: boolean = true, currentLevel: number = 0): Promise<FrameNode[]> {
  const autoLayoutFrames: FrameNode[] = [];
  
  for (const node of nodes) {
    // Check if current node is a frame with auto-layout and has an allowed name prefix
    if (node.type === 'FRAME' && 
        'layoutMode' in node && 
        node.layoutMode !== 'NONE' &&
        hasAllowedPrefix(node.name)) {
      autoLayoutFrames.push(node);
      
      // Check if this frame has subChild prefix - if so, stop recursing
      // Use getExistingPrefix to handle row/column extensions
      const framePrefix = getExistingPrefix(node.name);
      const hasSubChildPrefix = framePrefix === 'subChild.';
      
      // Recursively check children if:
      // 1. recursive is true
      // 2. The current frame doesn't have subChild prefix (stop at subChild level)
      // 3. The node has children
      if (recursive && !hasSubChildPrefix && 'children' in node) {
        // Ensure current page is loaded before accessing children (required for dynamic-page access)
        await figma.currentPage.loadAsync();
        const childFrames = await findAllAutoLayoutFrames(node.children, true, currentLevel + 1);
        autoLayoutFrames.push(...childFrames);
      }
    } else if (recursive && 'children' in node) {
      // If node doesn't have a prefix but has children, still recurse (for finding nested frames)
      // But check if we should stop based on level
      await figma.currentPage.loadAsync();
      const childFrames = await findAllAutoLayoutFrames(node.children, true, currentLevel + 1);
      autoLayoutFrames.push(...childFrames);
    }
  }
  
  return autoLayoutFrames;
}

// Helper function to group frames by their prefix
function groupFramesByPrefix(frames: FrameNode[]): Map<string, FrameNode[]> {
  const grouped = new Map<string, FrameNode[]>();
  
  for (const frame of frames) {
    const prefix = getPrefixForFrame(frame.name);
    if (prefix) {
      if (!grouped.has(prefix)) {
        grouped.set(prefix, []);
      }
      grouped.get(prefix)!.push(frame);
    }
  }
  
  return grouped;
}

// Helper function to set variable modes for a group of frames with the same hierarchy
async function setVariableModesForHierarchy(
  frames: FrameNode[],
  prefix: string,
  modeCollections: VariableCollection[]
): Promise<number> {
  const modeName = PREFIX_TO_MODE[prefix];
  if (!modeName) {
    console.error(`No mode found for prefix ${prefix}`);
    return 0;
  }

  let successCount = 0;
  
  // For each collection, find the correct mode
  const modeIds: Map<VariableCollection, string> = new Map();
  
  for (const collection of modeCollections) {
    const mode = collection.modes.find(m => m.name.toLowerCase() === modeName.toLowerCase());
    if (mode) {
      modeIds.set(collection, mode.modeId);
    } else {
      console.warn(`Mode "${modeName}" not found in ${collection.name}`);
    }
  }
  
  // Now apply the modes to all frames in this hierarchy level
  for (const frame of frames) {
    let frameSuccess = true;
    
    for (const [collection, modeId] of modeIds) {
      try {
        frame.setExplicitVariableModeForCollection(collection, modeId);
      } catch (error) {
        console.error(`Failed to set ${collection.name} mode on ${frame.name}:`, error);
        frameSuccess = false;
      }
    }
    
    if (frameSuccess) {
      successCount++;
    }
  }
  
  return successCount;
}

// Helper function to check if a frame has A1 Layout collection mode set to "manual"
async function hasManualLayoutMode(frame: FrameNode, layoutCollection: VariableCollection): Promise<boolean> {
  try {
    // Check explicitVariableModes to see if A1 Layout has an explicit mode set
    const explicitModeId = frame.explicitVariableModes[layoutCollection.id];
    if (!explicitModeId) {
      return false; // No explicit mode set
    }
    
    // Find the mode name for this mode ID
    const mode = layoutCollection.modes.find(m => m.modeId === explicitModeId);
    if (!mode) {
      return false;
    }
    
    // Check if the mode name is "manual" (case-insensitive)
    return mode.name.toLowerCase() === 'manual';
  } catch (error) {
    console.error('Error checking manual layout mode:', error);
    return false;
  }
}

// Helper function to get all master collection variable modes for a frame
async function getAllMasterCollectionModes(
  frame: FrameNode,
  masterCollections: VariableCollection[]
): Promise<Map<VariableCollection, string>> {
  const preservedModes = new Map<VariableCollection, string>();
  
  for (const collection of masterCollections) {
    const explicitModeId = frame.explicitVariableModes[collection.id];
    if (explicitModeId) {
      preservedModes.set(collection, explicitModeId);
    }
  }
  
  return preservedModes;
}

// Helper function to recursively find all frames (including nested) that need mode preservation
async function findAllFramesRecursively(nodes: readonly SceneNode[]): Promise<FrameNode[]> {
  const frames: FrameNode[] = [];
  
  for (const node of nodes) {
    if (node.type === 'FRAME') {
      frames.push(node as FrameNode);
    }
    
    // Recursively process children
    if ('children' in node) {
      await figma.currentPage.loadAsync();
      const childFrames = await findAllFramesRecursively(node.children as SceneNode[]);
      frames.push(...childFrames);
    }
  }
  
  return frames;
}

// Helper function to get the current spacing collection variable mode ID for a frame
async function getSpacingCollectionVariableModeId(frame: FrameNode): Promise<string | null> {
  try {
    // Find A3 ↔️ Spacing collection
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    let spacingCollection = findCollectionWithFallback(localCollections, 'A3 ↔️ Spacing');
    
    if (!spacingCollection) {
      // Try from library if not found locally
      const availableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      const libCollection = findLibraryCollectionWithFallback(availableCollections, 'A3 ↔️ Spacing', true);
      
      if (libCollection) {
        const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libCollection.key);
        if (libraryVars && libraryVars.length > 0) {
          const firstVar = await figma.variables.importVariableByKeyAsync(libraryVars[0].key);
          if (firstVar) {
            const collection = await figma.variables.getVariableCollectionByIdAsync(firstVar.variableCollectionId);
            if (collection) {
              spacingCollection = collection;
            }
          }
        }
      }
    }
    
    if (!spacingCollection) {
      return null;
    }
    
    // Get the current mode name using the existing helper function
    const modeName = await getSpacingVariableMode(frame);
    if (!modeName) {
      return null;
    }
    
    // Find the mode ID that corresponds to this mode name
    const mode = spacingCollection.modes.find(m => 
      m.name.toLowerCase() === modeName.toLowerCase()
    );
    
    return mode ? mode.modeId : null;
  } catch (error) {
    console.error('Error getting spacing collection variable mode ID:', error);
    return null;
  }
}

// Helper function to set variable modes for master collections (A1 📐 Layout, A2 📦 Padding, A3 ↔️ Spacing, A4 ╭ Corner Radius)
// These are master variable collections for manual adjustment, set to "standard" (default) mode
// Names are prefixed with A1-A4 to ensure alphabetical ordering in the properties panel
// For rows/columns, preserves their existing spacing collection variable mode
async function setMasterCollectionModes(
  frames: FrameNode[]
): Promise<number> {
  const masterCollectionNames = [
    'A1 📐 Layout',
    'A2 📦 Padding',
    'A3 ↔️ Spacing',
    'A4 ╭ Corner Radius'
  ];
  
  // Get all local collections
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  
  // Find master collections
  const masterCollections: VariableCollection[] = [];
  for (const collectionName of masterCollectionNames) {
    const collection = findCollectionWithFallback(localCollections, collectionName);
    if (collection) {
      masterCollections.push(collection);
    }
  }
  
  // If not found locally, try from library
  if (masterCollections.length < masterCollectionNames.length) {
    const availableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    
    for (const collectionName of masterCollectionNames) {
      if (!hasCollectionWithName(masterCollections, collectionName)) {
        const libCollection = findLibraryCollectionWithFallback(availableCollections, collectionName, true);
        
        if (libCollection) {
          // Import at least one variable to make the collection available
          try {
            const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libCollection.key);
            
            if (libraryVars && libraryVars.length > 0) {
              const firstVar = await figma.variables.importVariableByKeyAsync(libraryVars[0].key);
              
              if (firstVar) {
                const collection = await figma.variables.getVariableCollectionByIdAsync(firstVar.variableCollectionId);
                
                if (collection) {
                  masterCollections.push(collection);
                }
              }
            }
          } catch (error) {
            console.error(`Error importing ${collectionName}:`, error);
          }
        }
      }
    }
  }
  
  if (masterCollections.length === 0) {
    return 0;
  }
  
  // Find the "standard" mode for each collection (usually the first/default mode)
  let successCount = 0;
  
  // Create a map of collection names to collections for quick lookup
  const collectionMap = new Map<string, VariableCollection>();
  for (const collection of masterCollections) {
    collectionMap.set(collection.name, collection);
  }
  
  // Find the layout collection for checking manual mode
  const layoutCollectionName = 'A1 📐 Layout';
  let layoutCollection: VariableCollection | undefined = collectionMap.get(layoutCollectionName);
  if (!layoutCollection) {
    const fallbackNames = COLLECTION_NAME_FALLBACKS[layoutCollectionName];
    if (fallbackNames) {
      for (const oldName of fallbackNames) {
        layoutCollection = collectionMap.get(oldName);
        if (layoutCollection) break;
      }
    }
  }
  
  // Find the spacing collection for preserving row/column modes
  const spacingCollectionName = 'A3 ↔️ Spacing';
  let spacingCollection: VariableCollection | undefined = collectionMap.get(spacingCollectionName);
  if (!spacingCollection) {
    const fallbackNames = COLLECTION_NAME_FALLBACKS[spacingCollectionName];
    if (fallbackNames) {
      for (const oldName of fallbackNames) {
        spacingCollection = collectionMap.get(oldName);
        if (spacingCollection) break;
      }
    }
  }
  
  // Collect all frames including nested structures for checking manual mode
  const allFramesToCheck: FrameNode[] = [];
  for (const frame of frames) {
    allFramesToCheck.push(frame);
    // Recursively find nested frames
    if ('children' in frame) {
      await figma.currentPage.loadAsync();
      const nestedFrames = await findAllFramesRecursively(frame.children as SceneNode[]);
      allFramesToCheck.push(...nestedFrames);
    }
  }
  
  // Build a map of frames that have manual layout mode (including nested)
  const framesWithManualMode = new Set<string>(); // Using frame.id as key
  if (layoutCollection) {
    for (const frame of allFramesToCheck) {
      const hasManual = await hasManualLayoutMode(frame, layoutCollection);
      if (hasManual) {
        framesWithManualMode.add(frame.id);
      }
    }
  }
  
  for (const frame of frames) {
    let frameSuccess = true;
    
    // Check if this frame or any of its nested frames has manual layout mode
    const shouldPreserveAllModes = framesWithManualMode.has(frame.id);
    
    // If manual mode is detected, preserve ALL master collection variable modes
    let preservedAllModes: Map<VariableCollection, string> | null = null;
    if (shouldPreserveAllModes) {
      preservedAllModes = await getAllMasterCollectionModes(frame, masterCollections);
    }
    
    // Check if this frame is a row or column (has directional extension)
    const isRowOrColumn = getDirectionalExtension(frame.name) !== null;
    
    // If it's a row/column and we're not preserving all modes, capture the current spacing collection variable mode
    // Only preserve if the frame has a bound spacing variable
    let preservedSpacingModeId: string | null = null;
    if (!shouldPreserveAllModes && isRowOrColumn && spacingCollection && frame.boundVariables?.itemSpacing) {
      preservedSpacingModeId = await getSpacingCollectionVariableModeId(frame);
      if (preservedSpacingModeId) {
      }
    }
    
    // Iterate through masterCollectionNames in the desired order
    for (const collectionName of masterCollectionNames) {
      // Find the collection by name (check both new name and fallback names)
      let collection: VariableCollection | undefined = collectionMap.get(collectionName);
      
      // If not found with new name, try fallback names
      if (!collection) {
        const fallbackNames = COLLECTION_NAME_FALLBACKS[collectionName];
        if (fallbackNames) {
          for (const oldName of fallbackNames) {
            collection = collectionMap.get(oldName);
            if (collection) break;
          }
        }
      }
      
      if (!collection) {
        // Collection not found, skip it
        continue;
      }
      
      // If manual mode is detected, skip setting ALL master collection modes
      if (shouldPreserveAllModes && preservedAllModes) {
        const preservedModeId = preservedAllModes.get(collection);
        if (preservedModeId) {
          continue;
        }
      }
      
      // Skip setting spacing collection mode for rows/columns if we have a preserved mode
      if (!shouldPreserveAllModes && isRowOrColumn && collection === spacingCollection && preservedSpacingModeId) {
        continue;
      }
      
      try {
        // Find the "standard" mode - it's usually the first mode or the one named "standard"
        let standardModeId: string | null = null;
        
        // First try to find a mode explicitly named "standard"
        const standardMode = collection.modes.find(m => 
          m.name.toLowerCase() === 'standard' || 
          m.name.toLowerCase() === 'default'
        );
        
        if (standardMode) {
          standardModeId = standardMode.modeId;
        } else if (collection.modes.length > 0) {
          // If no "standard" mode found, use the first mode (usually the default)
          standardModeId = collection.modes[0].modeId;
        }
        
        if (standardModeId) {
          frame.setExplicitVariableModeForCollection(collection, standardModeId);
        } else {
          console.warn(`No standard mode found for collection ${collection.name}`);
          frameSuccess = false;
        }
      } catch (error) {
        console.error(`Failed to set master collection mode for ${collection.name} on frame ${frame.name}:`, error);
        frameSuccess = false;
      }
    }
    
    // Restore preserved modes
    if (shouldPreserveAllModes && preservedAllModes) {
      // Restore ALL master collection modes for frames with manual layout mode
      for (const [collection, modeId] of preservedAllModes) {
        try {
          frame.setExplicitVariableModeForCollection(collection, modeId);
          const mode = collection.modes.find(m => m.modeId === modeId);
          const modeName = mode ? mode.name : modeId;
        } catch (error) {
          console.error(`Failed to restore ${collection.name} mode for ${frame.name}:`, error);
        }
      }
    } else if (isRowOrColumn && preservedSpacingModeId && spacingCollection) {
      // Restore the preserved spacing mode for rows/columns if we skipped setting it
      try {
        frame.setExplicitVariableModeForCollection(spacingCollection, preservedSpacingModeId);
      } catch (error) {
        console.error(`Failed to restore spacing collection mode for ${frame.name}:`, error);
      }
    }
    
    
    if (frameSuccess) {
      successCount++;
    }
  }
  
  return successCount;
}

// Lookup table for spacing-primitive values by hierarchy prefix and mode
const SPACING_PRIMITIVE_LOOKUP: Record<string, Record<string, string>> = {
  'spacing - standard': {
    'parent (default)': '16px',
    'child': '8px',
    'sub-child': '4px',
    'hero': '24px'
  },
  'spacing - small': {
    'parent (default)': '8px',
    'child': '4px',
    'sub-child': '2px',
    'hero': '16px'
  },
  'spacing - x-small': {
    'parent (default)': '4px',
    'child': '2px',
    'sub-child': '2px',
    'hero': '8px'
  },
  'spacing - medium': {
    'parent (default)': '12px',
    'child': '8px',
    'sub-child': '4px',
    'hero': '18px'
  },
  'spacing - large': {
    'parent (default)': '24px',
    'child': '16px',
    'sub-child': '8px',
    'hero': '40px'
  },
  'spacing - x-large': {
    'parent (default)': '32px',
    'child': '24px',
    'sub-child': '16px',
    'hero': '56px'
  }
};

// Mapping from spacing-primitive variable names to spacing master collection modes
const SPACING_PRIMITIVE_TO_MASTER_MODE: Record<string, string> = {
  'spacing - standard': 'standard',
  'spacing - x-small': 'x-small',
  'spacing - small': 'small',
  'spacing - medium': 'medium',
  'spacing - large': 'large',
  'spacing - x-large': 'x-large'
};

// Helper function to get the current spacing variable mode from A3 ↔️ Spacing collection
// Uses lookup table based on bound value and hierarchy prefix
async function getSpacingVariableMode(frame: FrameNode): Promise<string | null> {
  try {
    // Check if frame has a bound spacing variable
    if (!('itemSpacing' in frame) || !frame.boundVariables?.itemSpacing) {
      return null;
    }
    
    // Get the bound variable
    const boundVariableId = frame.boundVariables.itemSpacing.id;
    const variable = await figma.variables.getVariableByIdAsync(boundVariableId);
    
    if (!variable) {
      return null;
    }
    
    // Get the hierarchy prefix from the frame name
    const prefix = getExistingPrefix(frame.name);
    const modeName = prefix ? PREFIX_TO_MODE[prefix] : 'parent (default)';
    
    // Resolve the variable value for this frame to get the actual pixel value
    const resolved = variable.resolveForConsumer(frame);
    if (!resolved || resolved.resolvedType !== 'FLOAT' || typeof resolved.value !== 'number') {
      return null;
    }
    
    // Convert resolved value to pixels (Figma uses points, 1pt = 1px at 100% zoom)
    const pixelValue = `${Math.round(resolved.value)}px`;
    
    // Look up which spacing-primitive variable this value corresponds to
    for (const [primitiveName, valuesByMode] of Object.entries(SPACING_PRIMITIVE_LOOKUP)) {
      if (valuesByMode[modeName] === pixelValue) {
        // Map to spacing master collection mode
        const masterMode = SPACING_PRIMITIVE_TO_MASTER_MODE[primitiveName];
        return masterMode;
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error getting spacing variable mode:', error);
    return null;
  }
}

// Helper function to set A1 📐 Layout collection to "manual" mode
async function setLayoutCollectionToManualMode(frame: FrameNode): Promise<boolean> {
  try {
    // Find A1 📐 Layout collection
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    let layoutCollection = findCollectionWithFallback(localCollections, 'A1 📐 Layout');
    
    if (!layoutCollection) {
      // Try from library if not found locally
      const availableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      const libCollection = findLibraryCollectionWithFallback(availableCollections, 'A1 📐 Layout', true);
      
      if (libCollection) {
        const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libCollection.key);
        if (libraryVars && libraryVars.length > 0) {
          const firstVar = await figma.variables.importVariableByKeyAsync(libraryVars[0].key);
          if (firstVar) {
            const collection = await figma.variables.getVariableCollectionByIdAsync(firstVar.variableCollectionId);
            if (collection) {
              layoutCollection = collection;
            }
          }
        }
      }
    }
    
    if (!layoutCollection) {
      console.warn('A1 📐 Layout collection not found');
      return false;
    }
    
    // Find the "manual" mode (case-insensitive)
    const mode = layoutCollection.modes.find(m => 
      m.name.toLowerCase() === 'manual'
    );
    
    if (!mode) {
      console.warn(`Mode "manual" not found in A1 📐 Layout collection. Available modes: ${layoutCollection.modes.map(m => m.name).join(', ')}`);
      return false;
    }
    
    // Set the mode on the frame
    frame.setExplicitVariableModeForCollection(layoutCollection, mode.modeId);
    return true;
  } catch (error) {
    console.error('Error setting A1 📐 Layout collection to manual mode:', error);
    return false;
  }
}

// Helper function to set the spacing variable mode on A3 ↔️ Spacing collection
async function setSpacingVariableMode(frame: FrameNode, modeName: string): Promise<boolean> {
  try {
    // Find A3 ↔️ Spacing collection (user mentioned A2, but codebase uses A3)
    const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
    let spacingCollection = findCollectionWithFallback(localCollections, 'A3 ↔️ Spacing');
    
    if (!spacingCollection) {
      // Try from library if not found locally
      const availableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      const libCollection = findLibraryCollectionWithFallback(availableCollections, 'A3 ↔️ Spacing', true);
      
      if (libCollection) {
        const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libCollection.key);
        if (libraryVars && libraryVars.length > 0) {
          const firstVar = await figma.variables.importVariableByKeyAsync(libraryVars[0].key);
          if (firstVar) {
            const collection = await figma.variables.getVariableCollectionByIdAsync(firstVar.variableCollectionId);
            if (collection) {
              spacingCollection = collection;
            }
          }
        }
      }
    }
    
    if (!spacingCollection) {
      console.warn('A3 ↔️ Spacing collection not found');
      return false;
    }
    
    // Find the mode by name (case-insensitive)
    const mode = spacingCollection.modes.find(m => 
      m.name.toLowerCase() === modeName.toLowerCase()
    );
    
    if (!mode) {
      console.warn(`Mode "${modeName}" not found in A3 ↔️ Spacing collection. Available modes: ${spacingCollection.modes.map(m => m.name).join(', ')}`);
      return false;
    }
    
    // Set the mode on the frame
    frame.setExplicitVariableModeForCollection(spacingCollection, mode.modeId);
    return true;
  } catch (error) {
    console.error('Error setting spacing variable mode:', error);
    return false;
  }
}

// Helper function to find a collection by name (with library fallback)
async function findCollectionWithLibraryFallback(collectionName: string): Promise<VariableCollection | null> {
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  let collection = findCollectionWithFallback(localCollections, collectionName);
  
  if (!collection) {
    // Try from library if not found locally
    const availableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    const libCollection = findLibraryCollectionWithFallback(availableCollections, collectionName, true);
    
    if (libCollection) {
      const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libCollection.key);
      if (libraryVars && libraryVars.length > 0) {
        const firstVar = await figma.variables.importVariableByKeyAsync(libraryVars[0].key);
        if (firstVar) {
          const foundCollection = await figma.variables.getVariableCollectionByIdAsync(firstVar.variableCollectionId);
          if (foundCollection) {
            collection = foundCollection;
          }
        }
      }
    }
  }
  
  return collection;
}

// Helper function to get variable mode name for a collection on a frame
async function getVariableModeForCollection(
  frame: FrameNode,
  collectionName: 'A1 📐 Layout' | 'A2 📦 Padding' | 'A3 ↔️ Spacing' | 'A4 ╭ Corner Radius'
): Promise<string | null> {
  try {
    const collection = await findCollectionWithLibraryFallback(collectionName);
    if (!collection) {
      return null;
    }
    
    // Get the explicit mode ID from the frame
    const explicitModeId = frame.explicitVariableModes[collection.id];
    if (!explicitModeId) {
      return null; // No explicit mode set
    }
    
    // Find the mode name for this mode ID
    const mode = collection.modes.find(m => m.modeId === explicitModeId);
    return mode ? mode.name : null;
  } catch (error) {
    console.error(`Error getting variable mode for ${collectionName}:`, error);
    return null;
  }
}

// Helper function to get all layout variable modes for a frame
async function getAllLayoutVariableModes(frame: FrameNode): Promise<{
  layout: string | null;
  padding: string | null;
  spacing: string | null;
  cornerRadius: string | null;
}> {
  const [layout, padding, spacing, cornerRadius] = await Promise.all([
    getVariableModeForCollection(frame, 'A1 📐 Layout'),
    getVariableModeForCollection(frame, 'A2 📦 Padding'),
    getVariableModeForCollection(frame, 'A3 ↔️ Spacing'),
    getVariableModeForCollection(frame, 'A4 ╭ Corner Radius')
  ]);
  
  return { layout, padding, spacing, cornerRadius };
}

// Helper function to get available variable modes for a collection
async function getAvailableVariableModesForCollection(
  collectionName: 'A1 📐 Layout' | 'A2 📦 Padding' | 'A3 ↔️ Spacing' | 'A4 ╭ Corner Radius'
): Promise<string[]> {
  try {
    const collection = await findCollectionWithLibraryFallback(collectionName);
    if (!collection) {
      console.warn(`${collectionName} collection not found`);
      return [];
    }
    
    // Return all available mode names
    return collection.modes.map(mode => mode.name);
  } catch (error) {
    console.error(`Error getting available variable modes for ${collectionName}:`, error);
    return [];
  }
}

// Helper function to set variable mode for a collection
async function setVariableModeForCollection(
  frame: FrameNode,
  collectionName: 'A1 📐 Layout' | 'A2 📦 Padding' | 'A3 ↔️ Spacing' | 'A4 ╭ Corner Radius',
  modeName: string
): Promise<boolean> {
  try {
    const collection = await findCollectionWithLibraryFallback(collectionName);
    if (!collection) {
      console.warn(`${collectionName} collection not found`);
      return false;
    }
    
    // Find the mode by name (case-insensitive)
    const mode = collection.modes.find(m => 
      m.name.toLowerCase() === modeName.toLowerCase()
    );
    
    if (!mode) {
      console.warn(`Mode "${modeName}" not found in ${collectionName} collection. Available modes: ${collection.modes.map(m => m.name).join(', ')}`);
      return false;
    }
    
    // Set the mode on the frame
    frame.setExplicitVariableModeForCollection(collection, mode.modeId);
    return true;
  } catch (error) {
    console.error(`Error setting variable mode for ${collectionName}:`, error);
    return false;
  }
}

// Helper function to clear variables from a frame based on masks
async function clearVariablesFromFrame(
  frame: FrameNode,
  cornerMask?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  },
  paddingMask?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  },
  applyToSpacing: boolean = false
): Promise<boolean> {
  try {
    // Clear spacing variable only if applyToSpacing is true (spacing buttons control this)
    if (applyToSpacing && 'itemSpacing' in frame) {
      frame.setBoundVariable('itemSpacing', null);
    }

    // Clear padding variables based on mask
    if (!paddingMask) {
      // No mask provided - clear all padding (default behavior)
      const hasPadding = 
        frame.boundVariables?.paddingLeft || 
        frame.boundVariables?.paddingRight || 
        frame.boundVariables?.paddingTop || 
        frame.boundVariables?.paddingBottom;
      
      if (hasPadding) {
        frame.setBoundVariable('paddingLeft', null);
        frame.setBoundVariable('paddingRight', null);
        frame.setBoundVariable('paddingTop', null);
        frame.setBoundVariable('paddingBottom', null);
      }
    } else {
      // Mask provided - only clear selected padding sides
      if (paddingMask.left && frame.boundVariables?.paddingLeft) {
        frame.setBoundVariable('paddingLeft', null);
      }
      if (paddingMask.right && frame.boundVariables?.paddingRight) {
        frame.setBoundVariable('paddingRight', null);
      }
      if (paddingMask.top && frame.boundVariables?.paddingTop) {
        frame.setBoundVariable('paddingTop', null);
      }
      if (paddingMask.bottom && frame.boundVariables?.paddingBottom) {
        frame.setBoundVariable('paddingBottom', null);
      }
    }

    // Clear corner radius variables based on mask
    if (!cornerMask) {
      // No mask provided - clear all corners (default behavior)
      frame.setBoundVariable('topLeftRadius', null);
      frame.setBoundVariable('topRightRadius', null);
      frame.setBoundVariable('bottomLeftRadius', null);
      frame.setBoundVariable('bottomRightRadius', null);
    } else {
      // Mask provided - only clear selected corners
      if (cornerMask.topLeft && frame.boundVariables?.topLeftRadius) {
        frame.setBoundVariable('topLeftRadius', null);
      }
      if (cornerMask.topRight && frame.boundVariables?.topRightRadius) {
        frame.setBoundVariable('topRightRadius', null);
      }
      if (cornerMask.bottomLeft && frame.boundVariables?.bottomLeftRadius) {
        frame.setBoundVariable('bottomLeftRadius', null);
      }
      if (cornerMask.bottomRight && frame.boundVariables?.bottomRightRadius) {
        frame.setBoundVariable('bottomRightRadius', null);
      }
    }

    return true;
  } catch (error) {
    console.error(`Failed to clear variables from frame ${frame.name}:`, error);
    return false;
  }
}

// Helper function to check if we're currently in the design system file
async function isDesignSystemFile(): Promise<boolean> {
  // Get current file name
  const fileName = figma.root.name.toLowerCase();
  
  
  // Check if file name contains indicators of being the design system file
  const isDesignSystem = 
    fileName.includes("design system") || 
    fileName.includes("cirrus") ||
    fileName.includes("native design system");
  
  if (isDesignSystem) {
    console.log("⚠️ Detected we are in the design system file itself");
  }
  
  // Also check if we have local collections that match design system collections
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const hasA6Layout = findCollectionWithFallback(localCollections, 'A1 📐 Layout') !== null;
  const designSystemCollectionCount = localCollections.filter(c => 
    c.name.startsWith('A') && 
    c.name.includes('-')
  ).length;
  
  if (designSystemCollectionCount >= 3 && hasA6Layout) {
    return true;
  }
  
  return isDesignSystem;
}

// Helper function to detect if a frame has visual styling
function hasVisualStyling(frame: FrameNode): boolean {
  // Check for stroke
  if (typeof frame.strokeWeight === 'number' && frame.strokeWeight > 0) {
    return true;
  }

  // Check for non-white fill
  if ('fills' in frame && Array.isArray(frame.fills)) {
    for (const fill of frame.fills) {
      // Check if the fill is visible
      if (fill.visible === false) {
        continue;
      }

      if (fill.type === 'SOLID') {
        // Check if the fill color is not white
        // White is r=1, g=1, b=1, a=1
        const isWhite = 
          fill.color.r === 1 && 
          fill.color.g === 1 && 
          fill.color.b === 1 && 
          (fill.opacity === undefined || fill.opacity === 1);
        
        if (!isWhite) {
          return true;
        }
      } else if (fill.type !== 'SOLID') {
        // Any non-solid fill (gradient, image, etc.) is considered visual styling
        return true;
      }
    }
  }

  // Check for effects (drop shadow, blur, etc.)
  if ('effects' in frame && Array.isArray(frame.effects)) {
    for (const effect of frame.effects) {
      if (effect.visible !== false) {
        return true;
      }
    }
  }

  // No visual styling found
  return false;
}

// Helper function to get layout direction from a frame
function getLayoutDirection(frame: FrameNode): 'row' | 'column' {
  if ('layoutMode' in frame) {
    if (frame.layoutMode === 'HORIZONTAL') {
      return 'row';
    }
    if (frame.layoutMode === 'VERTICAL') {
      return 'column';
    }
  }
  // Default to row if layoutMode is NONE (shouldn't happen for auto-layout frames)
  return 'row';
}

// Helper function to detect if a frame is a directional layout container
// Setup mode: Check if padding = 0 AND corner-radius = 0
// Adjust mode: Check if frame ONLY has spacing variables bound (no padding/radius variables)
function isDirectionalLayoutContainer(frame: FrameNode, mode: 'setup' | 'adjust'): boolean {
  if (mode === 'setup') {
    // Setup mode: Check if padding = 0 AND corner-radius = 0
    const paddingIsZero = 
      frame.paddingTop === 0 && 
      frame.paddingBottom === 0 && 
      frame.paddingLeft === 0 && 
      frame.paddingRight === 0;
    
    const cornerRadiusIsZero = 
      typeof frame.cornerRadius !== 'undefined' && 
      frame.cornerRadius !== figma.mixed && 
      frame.cornerRadius === 0;
    
    return paddingIsZero && cornerRadiusIsZero;
  } else {
    // Adjust mode: Check if frame ONLY has spacing variables bound (no padding/radius variables)
    const boundVars = frame.boundVariables;
    
    // Must have spacing variable
    const hasSpacing = !!boundVars?.itemSpacing;
    
    // Must NOT have any padding variables
    const hasNoPadding = 
      !boundVars?.paddingTop && 
      !boundVars?.paddingBottom && 
      !boundVars?.paddingLeft && 
      !boundVars?.paddingRight;
    
    // Must NOT have any corner radius variables
    const hasNoCornerRadius = 
      !boundVars?.topLeftRadius && 
      !boundVars?.topRightRadius && 
      !boundVars?.bottomLeftRadius && 
      !boundVars?.bottomRightRadius;
    
    return hasSpacing && hasNoPadding && hasNoCornerRadius;
  }
}

// Helper function to apply variables to a frame
async function applyVariablesToFrame(
  frame: FrameNode,
  spacingVar: Variable | null,
  paddingVar: Variable | null,
  cornerRadiusVar: Variable | null,
  isDesignSystemFile: boolean,
  cornerMask?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  },
  paddingMask?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  },
  applyToSpacing: boolean = true
): Promise<boolean> {
  try {
    // Check if frame has row/column prefix extension - if so, only apply spacing
    const directionalExt = getDirectionalExtension(frame.name);
    if (directionalExt) {
      if (spacingVar && 'itemSpacing' in frame && applyToSpacing) {
        frame.setBoundVariable('itemSpacing', spacingVar);
      }
      return true;
    }
    
    // Determine if we're applying padding or corner radius
    const shouldApplyPadding = hasVisualStyling(frame);
    const hasActivePaddingSides = paddingMask && (paddingMask.top || paddingMask.bottom || paddingMask.left || paddingMask.right);
    const hasActiveCorners = cornerMask && (cornerMask.topLeft || cornerMask.topRight || cornerMask.bottomLeft || cornerMask.bottomRight);
    
    // Check if padding will be applied
    const willApplyPadding = paddingVar && shouldApplyPadding && (!paddingMask || hasActivePaddingSides);
    
    // Check if corner radius will be applied
    const willApplyCornerRadius = cornerRadiusVar && (!cornerMask || hasActiveCorners);
    
    // Spacing should be applied independently based solely on applyToSpacing flag
    // This matches how padding is controlled by paddingMask and corners by cornerMask
    // If applyToSpacing is true, apply spacing variable regardless of padding/corner state
    const shouldApplySpacing = applyToSpacing;
    
    // Apply spacing variable to itemSpacing (only if applyToSpacing is true)
    if (spacingVar && 'itemSpacing' in frame && shouldApplySpacing) {
      frame.setBoundVariable('itemSpacing', spacingVar);
    }
    
    // Apply padding variable based on mask (if provided) or to all sides
    if (paddingVar && shouldApplyPadding) {
      if (!paddingMask) {
        frame.setBoundVariable('paddingLeft', paddingVar);
        frame.setBoundVariable('paddingRight', paddingVar);
        frame.setBoundVariable('paddingTop', paddingVar);
        frame.setBoundVariable('paddingBottom', paddingVar);
      } else if (hasActivePaddingSides) {
        if (paddingMask.left) frame.setBoundVariable('paddingLeft', paddingVar);
        if (paddingMask.right) frame.setBoundVariable('paddingRight', paddingVar);
        if (paddingMask.top) frame.setBoundVariable('paddingTop', paddingVar);
        if (paddingMask.bottom) frame.setBoundVariable('paddingBottom', paddingVar);
      }
    }

    // Apply corner radius variable with special handling based on design system context
    if (cornerRadiusVar) {
      // Check if mask exists and has at least one active corner
      const hasActiveCorners = cornerMask && (cornerMask.topLeft || cornerMask.topRight || cornerMask.bottomLeft || cornerMask.bottomRight);
      
      // If mask exists but all corners are false, skip corner radius application
      if (!cornerMask || hasActiveCorners) {
        try {
          // Determine which corners to apply based on mask
          const applyAllCorners = !cornerMask;
          const cornersToApply: { corner: 'topLeftRadius' | 'topRightRadius' | 'bottomLeftRadius' | 'bottomRightRadius', enabled: boolean }[] = [
            { corner: 'topLeftRadius', enabled: applyAllCorners || (cornerMask?.topLeft ?? false) },
            { corner: 'topRightRadius', enabled: applyAllCorners || (cornerMask?.topRight ?? false) },
            { corner: 'bottomLeftRadius', enabled: applyAllCorners || (cornerMask?.bottomLeft ?? false) },
            { corner: 'bottomRightRadius', enabled: applyAllCorners || (cornerMask?.bottomRight ?? false) }
          ];
        
        // Special handling for design system file
        if (isDesignSystemFile) {
          // Reset cornerRadius property first if it's set directly
          if (typeof frame.cornerRadius !== 'undefined' && frame.cornerRadius !== figma.mixed) {
            frame.cornerRadius = 0;
          }
          
          // Clear existing corner radius variables
          frame.setBoundVariable('topLeftRadius', null);
          frame.setBoundVariable('topRightRadius', null);
          frame.setBoundVariable('bottomLeftRadius', null);
          frame.setBoundVariable('bottomRightRadius', null);
          
          // Apply corner radius variable to selected corners
          cornersToApply.forEach(({ corner, enabled }) => {
            if (enabled) {
              frame.setBoundVariable(corner, cornerRadiusVar);
            }
          });
          
          // Force update to ensure variable takes effect (workaround for design system file)
          setTimeout(() => {
            try {
              cornersToApply.forEach(({ corner, enabled }) => {
                if (enabled) {
                  frame.setBoundVariable(corner, cornerRadiusVar);
                }
              });
            } catch (error) {
              console.error(`Failed delayed corner radius on ${frame.name}:`, error);
            }
          }, 10);
        } else {
          // Standard approach for external files
          frame.setBoundVariable('topLeftRadius', null);
          frame.setBoundVariable('topRightRadius', null);
          frame.setBoundVariable('bottomLeftRadius', null);
          frame.setBoundVariable('bottomRightRadius', null);
          
          cornersToApply.forEach(({ corner, enabled }) => {
            if (enabled) {
              frame.setBoundVariable(corner, cornerRadiusVar);
            }
          });
          
          // Reset cornerRadius property if it's set directly
          if (typeof frame.cornerRadius !== 'undefined' && frame.cornerRadius !== figma.mixed) {
            frame.cornerRadius = 0;
          }
        }
        
        // Verify application
        const applied = frame.boundVariables?.topLeftRadius || 
                       frame.boundVariables?.topRightRadius || 
                       frame.boundVariables?.bottomLeftRadius || 
                       frame.boundVariables?.bottomRightRadius;
        
        if (!applied) {
          // Second attempt with direct property modification
          frame.cornerRadius = 0;
          cornersToApply.forEach(({ corner, enabled }) => {
            if (enabled) {
              frame.setBoundVariable(corner, cornerRadiusVar);
            }
          });
          
          const secondAttempt = frame.boundVariables?.topLeftRadius || 
                               frame.boundVariables?.topRightRadius || 
                               frame.boundVariables?.bottomLeftRadius || 
                               frame.boundVariables?.bottomRightRadius;
          if (!secondAttempt) {
            console.warn(`Corner radius failed on ${frame.name}`);
          }
        }
        } catch (error) {
          console.error(`Failed corner radius on ${frame.name}:`, error);
        }
      }
    } else {
    }

    return true;
  } catch (error) {
    console.error(`Failed to apply variables to frame ${frame.name}:`, error);
    return false;
  }
}

// Function to get appropriate variables based on document context
async function getContextAwareVariables(): Promise<{
  spacingVar: Variable | null;
  paddingVar: Variable | null;
  cornerRadiusVar: Variable | null;
  isDesignSystemFile: boolean;
  layoutCollection: VariableCollection | null;
}> {
  // First, determine if we're in the design system file
  const fileName = figma.root.name.toLowerCase();
  const isDesignSystemFile = 
    fileName.includes("design system") || 
    fileName.includes("cirrus") ||
    fileName.includes("native design system");
  
  // Get all local variable collections
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  
  // Find the A6 Layout collection based on current context
  let layoutCollection: VariableCollection | null = null;
  let spacingVar: Variable | null = null;
  let paddingVar: Variable | null = null;
  let cornerRadiusVar: Variable | null = null;
  
  if (isDesignSystemFile) {
    // Find Layout collection locally (will try A1 📐 Layout first, then fallback to 📐 Layout and A6 - Layout)
    layoutCollection = findCollectionWithFallback(localCollections, 'A1 📐 Layout');
    
    if (layoutCollection) {
      // Get all A6 Layout variables directly
      const localVariables = await figma.variables.getLocalVariablesAsync();
      const a6Variables = localVariables.filter(v => v.variableCollectionId === layoutCollection!.id);
      
      // Try exact name matches first
      const exactMatches = {
        spacing: a6Variables.find(v => 
          ["spacing", "Spacing"].includes(v.name)
        ),
        padding: a6Variables.find(v => 
          ["padding", "Padding"].includes(v.name)
        ),
        cornerRadius: a6Variables.find(v => 
          ["corner-radius", "Corner Radius", "cornerRadius", "corner radius"].includes(v.name)
        )
      };
      
      // Use exact matches or fall back to fuzzy matching
      spacingVar = exactMatches.spacing || 
                  a6Variables.find(v => v.name.toLowerCase().includes("spacing")) || 
                  null;
                  
      paddingVar = exactMatches.padding || 
                  a6Variables.find(v => v.name.toLowerCase().includes("padding")) || 
                  null;
                  
      cornerRadiusVar = exactMatches.cornerRadius || 
                       a6Variables.find(v => 
                         v.name.toLowerCase().includes("corner") || 
                         v.name.toLowerCase().includes("radius")
                       ) || 
                       null;
    }
  } else {
    // Check if Layout collection exists locally first (might have been imported)
    // Will try A1 📐 Layout first, then fallback to 📐 Layout and A6 - Layout
    layoutCollection = findCollectionWithFallback(localCollections, 'A1 📐 Layout');
    
    if (layoutCollection) {
      const localVariables = await figma.variables.getLocalVariablesAsync();
      
      // Get variables in this collection
      const collectionVars = localVariables.filter(v => v.variableCollectionId === layoutCollection!.id);
      
      // Find variables in the collection
      spacingVar = collectionVars.find(v => 
        v.name.toLowerCase().includes("spacing")
      ) || null;
      
      paddingVar = collectionVars.find(v => 
        v.name.toLowerCase().includes("padding")
      ) || null;
      
      cornerRadiusVar = collectionVars.find(v => 
        v.name.toLowerCase().includes("corner") || v.name.toLowerCase().includes("radius")
      ) || null;
    } 
    
    // If any variable is still missing, get from library
    if (!layoutCollection || !spacingVar || !paddingVar || !cornerRadiusVar) {
      
      // Get available library collections
      const availableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
      
      if (availableCollections.length === 0) {
        console.warn("No library collections found. Enable design system library in Assets → Libraries");
      }
      
      // Find Layout collection in library (will try A1 📐 Layout first, then fallback to 📐 Layout and A6 - Layout)
      let libraryA6Collection = findLibraryCollectionWithFallback(availableCollections, 'A1 📐 Layout', true);
      
      // If not found, try any Layout collection (without library filter)
      if (!libraryA6Collection) {
        libraryA6Collection = findLibraryCollectionWithFallback(availableCollections, 'A1 📐 Layout', false);
      }
      
      if (libraryA6Collection) {
        // Get variables from library collection
        const libraryVariables = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libraryA6Collection.key);
        
        // Import the required variables if not already found
        if (!spacingVar) {
          const spacingInfo = libraryVariables.find(v => v.name.toLowerCase().includes("spacing"));
          if (spacingInfo) {
            spacingVar = await figma.variables.importVariableByKeyAsync(spacingInfo.key);
          }
        }
        
        if (!paddingVar) {
          const paddingInfo = libraryVariables.find(v => v.name.toLowerCase().includes("padding"));
          if (paddingInfo) {
            paddingVar = await figma.variables.importVariableByKeyAsync(paddingInfo.key);
          }
        }
        
        if (!cornerRadiusVar) {
          const radiusInfo = libraryVariables.find(v => 
            v.name.toLowerCase().includes("corner") || 
            v.name.toLowerCase().includes("radius")
          );
          if (radiusInfo) {
            cornerRadiusVar = await figma.variables.importVariableByKeyAsync(radiusInfo.key);
          }
        }
        
        // If layout collection wasn't found locally but we imported variables, use the first variable to find it
        if (!layoutCollection && (spacingVar || paddingVar || cornerRadiusVar)) {
          const firstVar = spacingVar || paddingVar || cornerRadiusVar;
          if (firstVar) {
            layoutCollection = await figma.variables.getVariableCollectionByIdAsync(firstVar.variableCollectionId);
            if (layoutCollection) {
              console.log(`Found layout collection from imported variable: ${layoutCollection.name}`);
            }
          }
        }
      } else {
        console.error("❌ Could not find '📐 Layout' collection in any enabled library");
      }
    }
  }
  
  // Final summary of what we found
  console.log("\n=== Variable Lookup Results ===");
  if (spacingVar) console.log(`✅ Found spacing variable: ${spacingVar.name} (${spacingVar.id})`);
  else console.log("❌ Could not find spacing variable");
  
  if (paddingVar) console.log(`✅ Found padding variable: ${paddingVar.name} (${paddingVar.id})`);
  else console.log("❌ Could not find padding variable");
  
  if (cornerRadiusVar) console.log(`✅ Found corner radius variable: ${cornerRadiusVar.name} (${cornerRadiusVar.id})`);
  else console.log("❌ Could not find corner radius variable");
  
  return {
    spacingVar,
    paddingVar,
    cornerRadiusVar,
    isDesignSystemFile,
    layoutCollection
  };
}

// Function to clear variables from selection
async function clearVariablesFromSelection(
  cornerMask?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  },
  paddingMask?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  },
  applyToNested: boolean = false,
  applyToSpacing: boolean = false
) {
  // Get the current selection
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    throw new Error('Please select at least one frame');
  }

  // Find all frames with auto-layout and allowed name prefixes
  // Only include nested frames if applyToNested is true
  const allAutoLayoutFrames = await findAllAutoLayoutFrames(selection, applyToNested);

  if (allAutoLayoutFrames.length === 0) {
    throw new Error('No frames with auto-layout and allowed name prefixes (parent.*, child.*, subChild.*, hero.*) found in the selection or its children');
  }
  
  // Check if all layout control buttons are selected
  const allCornersSelected = cornerMask && 
    cornerMask.topLeft && 
    cornerMask.topRight && 
    cornerMask.bottomLeft && 
    cornerMask.bottomRight;
  
  const allPaddingSelected = paddingMask && 
    paddingMask.top && 
    paddingMask.bottom && 
    paddingMask.left && 
    paddingMask.right;
  
  const allButtonsSelected = allCornersSelected && allPaddingSelected;
  
  console.log(`All buttons selected: ${allButtonsSelected}`);
  if (cornerMask) {
    console.log(`Corner mask: ${JSON.stringify(cornerMask)}`);
  }
  if (paddingMask) {
    console.log(`Padding mask: ${JSON.stringify(paddingMask)}`);
  }
  
  let clearedCount = 0;
  let failedCount = 0;
  let prefixRemovedCount = 0;

  for (const frame of allAutoLayoutFrames) {
    const variablesCleared = await clearVariablesFromFrame(frame, cornerMask, paddingMask, applyToSpacing);
    
    if (variablesCleared) {
      clearedCount++;
      
      // If all buttons are selected, remove the prefix from the layer name
      if (allButtonsSelected) {
        const existingPrefix = getExistingPrefix(frame.name);
        if (existingPrefix) {
          const baseName = getBaseName(frame.name);
          frame.name = baseName;
          prefixRemovedCount++;
          console.log(`Removed prefix "${existingPrefix}" from: ${frame.name} -> ${baseName}`);
        }
      }
    } else {
      failedCount++;
    }
  }

  if (prefixRemovedCount > 0) {
    console.log(`Removed prefix from ${prefixRemovedCount} frame(s)`);
  }
  
  // Report results
  if (clearedCount > 0) {
    let message = `Cleared variables from ${clearedCount} frame(s)`;
    if (prefixRemovedCount > 0) {
      message += `, removed prefix from ${prefixRemovedCount} frame(s)`;
    }
    if (failedCount > 0) {
      message += `, ${failedCount} failed`;
    }
    
    figma.ui.postMessage({
      type: 'success',
      message: message
    } as SuccessMessage);
    
    // Notify Figma that changes were made
    figma.notify(message);
  } else {
    throw new Error('Failed to clear variables from any frames');
  }
}

async function applyVariablesToSelection(
  clearFirst: boolean = true,
  cornerMask?: {
    topLeft?: boolean;
    topRight?: boolean;
    bottomLeft?: boolean;
    bottomRight?: boolean;
  },
  paddingMask?: {
    top?: boolean;
    bottom?: boolean;
    left?: boolean;
    right?: boolean;
  },
  applyToNested: boolean = false,
  applyToSpacing: boolean = true
) {
  try {
    // Get the current selection
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      throw new Error('Please select at least one frame');
    }

    // Ensure we're only working with SceneNode types (not PageNode)
    const sceneNodes = selection as SceneNode[];
    
    // Find frames with auto-layout and allowed name prefixes
    // If applyToNested is false, only find direct frames (no recursion)
    // If applyToNested is true, find all frames including nested ones
    const allAutoLayoutFrames = await findAllAutoLayoutFrames(sceneNodes, applyToNested);

    if (allAutoLayoutFrames.length === 0) {
      const errorMsg = applyToNested 
        ? 'No frames with auto-layout and allowed name prefixes (parent.*, child.*, subChild.*, hero.*) found in the selection or its children'
        : 'No frames with auto-layout and allowed name prefixes (parent.*, child.*, subChild.*, hero.*) found in the selection';
      throw new Error(errorMsg);
    }
  
  // Get variables using the context-aware function
  const {
    spacingVar, 
    paddingVar, 
    cornerRadiusVar, 
    isDesignSystemFile,
    layoutCollection
  } = await getContextAwareVariables();
  
  if (!spacingVar && !paddingVar && !cornerRadiusVar) {
    // Provide a helpful error message based on context
    let errorMessage = 'Could not find any of the required variables (spacing, padding, corner-radius) in the 📐 Layout collection.\n\n';
    
    if (!isDesignSystemFile) {
      errorMessage += '📚 The Cirrus Design System library needs to be enabled in this file.\n\n';
      errorMessage += 'To fix this:\n';
      errorMessage += '1. Open the Assets panel (⌥ + 2 or Alt + 2)\n';
      errorMessage += '2. Click on the Libraries icon (book icon)\n';
      errorMessage += '3. Find "cirrus - native design system" or similar\n';
      errorMessage += '4. Toggle it ON to enable the library\n';
      errorMessage += '5. Try applying variables again\n\n';
      errorMessage += 'The library must contain a "📐 Layout" variable collection with spacing, padding, and corner-radius variables.';
    } else {
      errorMessage += 'Please ensure the 📐 Layout collection exists locally and contains the required variables.';
    }
    
    throw new Error(errorMessage);
  }
  
  // Add detailed logging for variables
  logVariableDetails("Spacing", spacingVar, allAutoLayoutFrames.length);
  logVariableDetails("Padding", paddingVar, allAutoLayoutFrames.filter(frame => hasVisualStyling(frame)).length);
  logVariableDetails("Corner Radius", cornerRadiusVar, allAutoLayoutFrames.length);
  
  // Find mode collections (A1, A4, A5) - these need to be found first
  const localCollections = await figma.variables.getLocalVariableCollectionsAsync();
  const modeCollections: VariableCollection[] = [];
  
  for (const collectionName of MODE_COLLECTION_NAMES) {
    const collection = findCollectionWithFallback(localCollections, collectionName);
    if (collection) {
      modeCollections.push(collection);
    }
  }

  // If mode collections not found locally, try from library
  if (modeCollections.length < MODE_COLLECTION_NAMES.length) {
    const availableCollections = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync();
    
    for (const collectionName of MODE_COLLECTION_NAMES) {
      if (!hasCollectionWithName(modeCollections, collectionName)) {
        const libCollection = findLibraryCollectionWithFallback(availableCollections, collectionName, true);
        
        if (libCollection) {
          // Import the collection variables first to make the collection available
          try {
            // Get all variables from this collection
            const libraryVars = await figma.teamLibrary.getVariablesInLibraryCollectionAsync(libCollection.key);
            
            if (libraryVars && libraryVars.length > 0) {
              
              // Import at least one variable to ensure the collection is available
              const firstVar = await figma.variables.importVariableByKeyAsync(libraryVars[0].key);
              
              if (firstVar) {
                // Now we should be able to get the collection
                const collection = await figma.variables.getVariableCollectionByIdAsync(firstVar.variableCollectionId);
                
                if (collection) {
                  modeCollections.push(collection);
                  console.log(`Successfully loaded collection: ${collectionName} (id: ${collection.id})`);
                } else {
                  console.warn(`Could not get collection ${collectionName} after importing variable`);
                }
              }
            } else {
              console.warn(`No variables found in collection ${collectionName}`);
            }
          } catch (error) {
            console.error(`Error importing collection ${collectionName}:`, error);
          }
        } else {
          console.warn(`Could not find collection ${collectionName} in library`);
        }
      }
    }
  }
  
  console.log(`Total mode collections found: ${modeCollections.length} of ${MODE_COLLECTION_NAMES.length} expected`);

  // Optional clearing phase
  let clearedCount = 0;
  let clearFailedCount = 0;
  
  if (clearFirst) {
    
    for (const frame of allAutoLayoutFrames) {
      const variablesCleared = await clearVariablesFromFrame(frame);
      
      if (variablesCleared) {
        clearedCount++;
      } else {
        clearFailedCount++;
      }
    }

    console.log(`Cleared variables from ${clearedCount} frame(s), ${clearFailedCount} failed`);
  }

  // Apply A6 variables to ALL frames
  let appliedCount = 0;
  let failedCount = 0;
  let visualFrameCount = 0;
  let structuralFrameCount = 0;
  let cornerRadiusSuccessCount = 0;
  let cornerRadiusFailCount = 0;
  let cornerRadiusFrameIds: string[] = []; // Track frames with corner radius issues

  // framesToProcess is already set correctly based on applyToNested parameter
  // When applyToNested is false, allAutoLayoutFrames contains only direct frames
  // When applyToNested is true, allAutoLayoutFrames contains all frames including nested ones
  const framesToProcess = allAutoLayoutFrames;

  for (const frame of framesToProcess) {
    // Check if this is a visual frame before applying variables
    const isVisualFrame = hasVisualStyling(frame);
    if (isVisualFrame) {
      visualFrameCount++;
    } else {
      structuralFrameCount++;
    }
    
    // Apply variables with context-aware approach and filters
    const variablesApplied = await applyVariablesToFrame(
      frame, 
      spacingVar, 
      paddingVar, 
      cornerRadiusVar,
      isDesignSystemFile,
      cornerMask,
      paddingMask,
      applyToSpacing
    );
    
    if (variablesApplied) {
      appliedCount++;
      
      // Verify corner radius specifically
      const cornerRadiusApplied = frame.boundVariables?.topLeftRadius || 
                                 frame.boundVariables?.topRightRadius || 
                                 frame.boundVariables?.bottomLeftRadius || 
                                 frame.boundVariables?.bottomRightRadius;
      
      if (cornerRadiusApplied && cornerRadiusVar) {
        cornerRadiusSuccessCount++;
      } else if (cornerRadiusVar) {
        cornerRadiusFailCount++;
        cornerRadiusFrameIds.push(frame.id);
        console.warn(`⚠️ Failed to apply corner radius to frame: ${frame.name} (ID: ${frame.id})`);
      }
      
      // In setup mode: if only spacing variables are applied, automatically add extension prefix
      // Check if only spacing variable is bound (no padding, no corner radius)
      const hasSpacing = !!frame.boundVariables?.itemSpacing;
      const hasPadding = !!(frame.boundVariables?.paddingTop || 
                           frame.boundVariables?.paddingBottom || 
                           frame.boundVariables?.paddingLeft || 
                           frame.boundVariables?.paddingRight);
      const hasCornerRadius = !!(frame.boundVariables?.topLeftRadius || 
                                 frame.boundVariables?.topRightRadius || 
                                 frame.boundVariables?.bottomLeftRadius || 
                                 frame.boundVariables?.bottomRightRadius);
      
      // Check if frame already has a directional extension
      const existingDirectionalExt = getDirectionalExtension(frame.name);
      
      // If only spacing is applied and no directional extension exists, add it based on layout direction
      if (hasSpacing && !hasPadding && !hasCornerRadius && !existingDirectionalExt && 'layoutMode' in frame && frame.layoutMode !== 'NONE') {
        const layoutDirection = getLayoutDirection(frame);
        const prefix = getExistingPrefix(frame.name);
        const baseName = getBaseName(frame.name);
        
        // Build new name with directional extension
        const newName = prefix ? `${prefix}${layoutDirection}.${baseName}` : `${layoutDirection}.${baseName}`;
        frame.name = newName;
      }
    } else {
      failedCount++;
    }
  }
  
  // Log corner radius failures if any
  if (cornerRadiusVar && cornerRadiusFailCount > 0) {
    console.warn(`Corner radius failed on ${cornerRadiusFailCount} frame(s)`);
  }

  // PHASE 3: Set variable modes by hierarchy level
  let modeSetCount = 0;

  if (modeCollections.length > 0) {
    // Group frames by their prefix/hierarchy (use framesToProcess to include nested if applicable)
    const groupedFrames = groupFramesByPrefix(framesToProcess);
    
    // Process each hierarchy level separately
    // Define the order to ensure parent modes are set before children
    const hierarchyOrder = ['parent.', 'hero.', 'child.', 'subChild.'];
    
    for (const prefix of hierarchyOrder) {
      const frames = groupedFrames.get(prefix);
      if (frames && frames.length > 0) {
        const successCount = await setVariableModesForHierarchy(frames, prefix, modeCollections);
        modeSetCount += successCount;
      }
    }
  } else {
    console.warn('No mode collections found - skipping mode setting phase');
  }

  // PHASE 4: Set variable modes for master collections (A1 📐 Layout, A2 📦 Padding, A3 ↔️ Spacing, A4 ╭ Corner Radius)
  let masterModeSetCount = 0;
  
  try {
    masterModeSetCount = await setMasterCollectionModes(framesToProcess);
  } catch (error) {
    console.error('Error setting master collection modes:', error);
    // Don't fail the entire operation if master collection mode setting fails
  }

  // Report results
  if (appliedCount > 0) {
    let message = `Applied variables to ${appliedCount} frame(s)`;
    
    // Include visual vs. structural breakdown
    message += ` (${visualFrameCount} visual, ${structuralFrameCount} structural)`;
    
    if (clearFirst && clearedCount > 0) {
      message = `Cleared ${clearedCount} frame(s), ${message}`;
    }
    
    if (modeSetCount > 0) {
      message += `, set modes for ${modeSetCount} frame(s)`;
    }
    
    if (masterModeSetCount > 0) {
      message += `, set master collection modes for ${masterModeSetCount} frame(s)`;
    }
    
    // Include corner radius success/failure info if corner radius was attempted
    if (cornerRadiusVar) {
      if (cornerRadiusFailCount > 0) {
        message += `, corner radius: ${cornerRadiusSuccessCount} ok, ${cornerRadiusFailCount} failed`;
      } else if (cornerRadiusSuccessCount > 0) {
        message += `, corner radius applied: ${cornerRadiusSuccessCount}`;
      }
    }
    
    if (failedCount > 0) {
      message += `, ${failedCount} frame(s) failed`;
    }
    
    // Add debug info in the UI message for understanding what variables were used
    let debugInfo = `\n\nContext: ${isDesignSystemFile ? 'Design System File' : 'External File'}\n`;
    
    if (spacingVar) {
      debugInfo += `\nSpacing: ${spacingVar.name} (${spacingVar.id})`;
    } else {
      debugInfo += `\nSpacing: Not found`;
    }
    
    if (paddingVar) {
      debugInfo += `\nPadding: ${paddingVar.name} (${paddingVar.id})`;
    } else {
      debugInfo += `\nPadding: Not found`;
    }
    
    if (cornerRadiusVar) {
      debugInfo += `\nCorner Radius: ${cornerRadiusVar.name} (${cornerRadiusVar.id})`;
    } else {
      debugInfo += `\nCorner Radius: Not found`;
    }
    
    // Send to UI with debug info
    figma.ui.postMessage({
      type: 'success',
      message: message + debugInfo
    } as SuccessMessage);
    
    // For Figma notification, use shorter message if it's too long
    if (message.length > 100) {
      const shortMessage = `Applied variables to ${appliedCount} frame(s), ${cornerRadiusSuccessCount} with corner radius`;
      figma.notify(shortMessage);
    } else {
      figma.notify(message);
    }
  } else {
    throw new Error('Failed to apply variables to any frames with allowed name prefixes');
  }
  } catch (error) {
    console.error('Error in applyVariablesToSelection:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    figma.ui.postMessage({
      type: 'error',
      message: `Failed to apply variables: ${errorMessage}`
    } as ErrorMessage);
    figma.notify(`Failed to apply variables: ${errorMessage}`);
    throw error; // Re-throw to let caller handle if needed
  }
}

async function findAndImportVariable(
  libraryVariables: LibraryVariable[],
  variableName: string
): Promise<Variable | null> {
  // Log available variables for debugging
  console.log(`Searching for '${variableName}' in library variables. Available:`, 
    libraryVariables.map(v => v.name));
  
  // Enhanced matching for corner radius
  const variableNameLower = variableName.toLowerCase();
  const searchTerms = [variableNameLower];
  
  // Add extra search terms for corner radius specifically
  if (variableNameLower === 'corner-radius') {
    searchTerms.push('cornerradius', 'corner', 'radius', 'corner radius', 'cornerRadius');
  }
  
  // Try exact match first
  let variableInfo = libraryVariables.find(v => 
    v.name.toLowerCase() === variableNameLower
  );
  
  // If no exact match, try includes with extended terms
  if (!variableInfo) {
    for (const term of searchTerms) {
      variableInfo = libraryVariables.find(v => 
        v.name.toLowerCase().includes(term)
      );
      
      if (variableInfo) {
        console.log(`Found library variable '${variableInfo.name}' using search term '${term}'`);
        break;
      }
    }
  }
  
  if (!variableInfo) {
    console.warn(`⚠️ Could not find any library variable matching '${variableName}'`);
    return null;
  }
  
  console.log(`Found library variable: ${variableInfo.name} (Key: ${variableInfo.key})`);

  try {
    // Import the variable using its key
    const variable = await figma.variables.importVariableByKeyAsync(variableInfo.key);
    console.log(`✅ Successfully imported variable: ${variable.name} (ID: ${variable.id})`);
    return variable;
  } catch (error) {
    console.error(`❌ Failed to import variable ${variableName}:`, error);
    return null;
  }
}

async function findLocalVariable(
  collection: VariableCollection,
  variableName: string
): Promise<Variable | null> {
  // Get all variables in the collection
  const variablePromises = collection.variableIds.map(id => 
    figma.variables.getVariableByIdAsync(id)
  );
  
  const variables = await Promise.all(variablePromises);
  
  // Log variables for debugging
  console.log(`Searching for '${variableName}' in collection '${collection.name}'. Available variables:`, 
    variables.map(v => v ? v.name : 'null').filter(Boolean));
  
  // Find the variable by name with enhanced matching
  // For corner radius, add additional common naming patterns
  const variableNameLower = variableName.toLowerCase();
  const searchTerms = [variableNameLower];
  
  // Add extra search terms for corner radius specifically
  if (variableNameLower === 'corner-radius') {
    searchTerms.push('cornerradius', 'corner', 'radius', 'corner radius', 'cornerRadius');
  }
  
  // Try exact match first
  let variable = variables.find(v => 
    v && v.name.toLowerCase() === variableNameLower
  );
  
  // If no exact match, try includes with extended terms
  if (!variable) {
    for (const term of searchTerms) {
      variable = variables.find(v => 
        v && v.name.toLowerCase().includes(term)
      );
      if (variable) {
        console.log(`Found variable '${variable.name}' using search term '${term}'`);
        break;
      }
    }
  }
  
  if (variable) {
    console.log(`✅ Found variable: ${variable.name} (ID: ${variable.id})`);
  } else {
    console.warn(`⚠️ Could not find any variable matching '${variableName}' in collection '${collection.name}'`);
  }
  
  return variable || null;
}

// Helper function to log variable application details
function logVariableDetails(variableName: string, variable: Variable | null, frameCount: number): void {
  if (variable) {
    console.log(`${variableName}: ${variable.name} → ${frameCount} frame(s)`);
  } else {
    console.warn(`${variableName}: not found`);
  }
}

// Close plugin when user cancels
figma.on("close", () => {
  figma.closePlugin();
});