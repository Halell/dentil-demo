import '../../styles/components/common/InfoPanel.css';

const InfoPanel = ({ toothCount, isEditingTooth, editingToothId, hoveredPointIndex }) => {
  const getStatusMessage = () => {
    if (isEditingTooth && editingToothId) {
      // Editing existing tooth
      if (hoveredPointIndex !== null) {
        return `Editing tooth ${editingToothId} - Hover over point ${hoveredPointIndex + 1}. Press DELETE to remove point.`;
      }
      return `Editing tooth ${editingToothId} - Click on edges to add points, hover over points and press DELETE to remove them. Press ESC to finish.`;
    } else if (isEditingTooth && editingToothId === null) {
      // Creating new tooth
      return "Creating new tooth - Click to add points. Need at least 3 points. Press ESC to cancel.";
    }
    // Normal viewing mode
    return "Click on teeth to view information. Right-click on empty areas to add new teeth.";
  };

  return (
    <div className={`info-panel ${isEditingTooth ? 'editing-mode' : ''}`}>
      <p>{getStatusMessage()}</p>
      <p>Defined teeth: {toothCount}</p>
    </div>
  );
};

export default InfoPanel;
