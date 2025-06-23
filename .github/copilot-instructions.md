# Copilot Instructions for Panoramic X-ray Tooth Detection

<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

## Project Overview
This is a React application for interactive panoramic X-ray tooth detection and analysis. The application features:

- **View Mode**: Display X-ray with interactive tooth areas, hover highlights, and click tooltips
- **Edit Mode**: Define new tooth areas using polygon drawing tools and manage tooth metadata
- **SVG Overlay System**: Use SVG polygons over the X-ray image for precise tooth area definition
- **Responsive Design**: Optimized for laptop screen sizes
- **Data Persistence**: Save and load tooth definitions in JSON format

## Technical Requirements
- Use React with functional components and hooks
- Implement SVG overlay for interactive tooth areas
- Create polygon drawing functionality for Edit mode
- Manage application state for mode switching (View/Edit)
- Use modern CSS for styling with medical/clinical appearance
- Ensure precise coordinate mapping between image and SVG overlay

## Code Style Guidelines
- Use descriptive component and function names related to dental terminology
- Implement clean separation between View and Edit mode components
- Use consistent state management patterns
- Include proper error handling for image loading and data persistence
- Comment complex coordinate calculations and polygon operations
