# Panoramic X-ray Tooth Detection

An interactive React application for panoramic X-ray tooth detection and analysis with both View and Edit modes.

## Features

### View Mode
- 🦷 Interactive X-ray display with tooth area highlighting
- 🎯 Hover effects to highlight individual teeth
- 💬 Click tooltips showing tooth information
- 📱 Responsive design for laptop screens

### Edit Mode
- ✏️ Polygon drawing tool for defining new tooth areas
- 🏷️ Tooth numbering and metadata management
- 🗑️ Delete existing tooth areas
- 💾 Automatic data persistence to localStorage
- ⌨️ Keyboard shortcuts (Escape to cancel)

## Technology Stack

- **Frontend**: React 18 with Vite
- **Styling**: Modern CSS with medical/clinical design
- **Graphics**: SVG overlay system for precise tooth area definition
- **Data**: JSON-based tooth definitions with localStorage persistence

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5174`

### Usage

1. **View Mode** (Default):
   - Hover over defined tooth areas to see highlights
   - Click on teeth to see information tooltips
   - Switch to Edit mode using the toggle button

2. **Edit Mode**:
   - Click "Start Drawing New Tooth Area" to begin
   - Click points around a tooth to create a polygon
   - Enter the tooth number/name
   - Click "Save Tooth Area" to finish
   - Click existing areas to select and delete them
   - Press Escape to cancel current action

## File Structure

```
src/
├── components/
│   ├── XrayViewer.jsx      # Main viewer component with mode switching
│   ├── ViewMode.jsx        # Read-only mode with tooth interaction
│   ├── EditMode.jsx        # Edit mode with polygon drawing
│   └── *.css              # Component-specific styling
├── App.jsx                # Main application component
└── main.jsx              # Application entry point

public/
└── images/
    └── x-ray-panoramic.jpg # X-ray image file
```

## Data Format

Tooth areas are stored as JSON objects with the following structure:

```javascript
{
  "id": "unique-timestamp",
  "toothNumber": "11", // User-defined tooth identifier
  "points": [          // Polygon coordinates
    {"x": 100, "y": 150},
    {"x": 120, "y": 140},
    // ... more points
  ],
  "createdAt": "2025-06-11T..."
}
```

## Customization

- Replace `public/images/x-ray-panoramic.jpg` with your own X-ray image
- Modify tooth area styling in the CSS files
- Extend tooth metadata structure in the components
- Add export/import functionality for sharing tooth definitions

## Development Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details+ Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
