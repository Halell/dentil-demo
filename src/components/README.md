# Components Architecture

This document outlines the refactored component architecture for the Panoramic X-ray Tooth Detection application.

## Directory Structure

```
src/components/
├── common/          # Reusable UI components
├── viewer/          # X-ray viewing and display components
├── editor/          # Tooth editing functionality
└── data/           # Data management components (future use)
```

## Component Breakdown

### Common Components (`/common`)
- **ContextMenu** - Right-click context menu for adding teeth
- **ToothModal** - Modal dialog for entering tooth information
- **LoadingSpinner** - Loading indicator with spinner animation
- **InfoPanel** - Information display panel

### Viewer Components (`/viewer`)
- **XrayContainer** - Main container orchestrating all viewer functionality
- **XrayImage** - X-ray image display component
- **SvgOverlay** - SVG overlay system for interactive tooth areas
- **ToothPolygon** - Individual tooth polygon rendering
- **ToothTooltip** - Hover tooltips for tooth information

### Editor Components (`/editor`)
- **EditControls** - Control buttons for editing mode (finish, export, cancel)

## Key Features

### Single Responsibility
Each component has a single, well-defined responsibility:
- **XrayContainer**: State management and event coordination
- **XrayImage**: Image display and basic interactions
- **SvgOverlay**: SVG rendering coordination
- **ToothPolygon**: Individual tooth rendering and interactions
- **ContextMenu**: Right-click menu functionality
- **ToothModal**: Modal dialog management
- **EditControls**: Edit mode button controls

### Clean Separation
- **UI Components**: Pure presentation components with minimal logic
- **Container Components**: Handle state management and business logic
- **Utility Functions**: Extracted to `/utils` and `/hooks`

### Styling
- Each component has its own CSS file
- No inline styles (as per user preference)
- Clean, medical/clinical design aesthetic
- Responsive design principles

## State Management

### Custom Hooks
- **useToothData**: Manages tooth data loading, saving, and CRUD operations

### State Flow
1. `XrayContainer` manages all application state
2. Data flows down through props to child components
3. Events bubble up through callback functions
4. External data management handled by custom hooks

## Benefits of This Architecture

1. **Maintainability**: Small, focused components are easier to debug and modify
2. **Reusability**: Common components can be reused across the application
3. **Testability**: Each component can be tested in isolation
4. **Scalability**: New features can be added without affecting existing code
5. **Developer Experience**: Clear structure makes it easy to find and modify code

## Usage Examples

### Adding a New Feature
1. Determine which category it belongs to (common/viewer/editor)
2. Create the component in the appropriate directory
3. Add necessary CSS file
4. Import and use in the parent container

### Debugging
1. Identify which functional area has the issue
2. Navigate to the appropriate component directory
3. Focus on the specific component rather than searching through large files
