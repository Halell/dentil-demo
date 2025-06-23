import '../../styles/components/common/InfoPanel.css';

const InfoPanel = ({ 
  toothCount, 
  isEditingTooth, 
  editingToothId, 
  hoveredPointIndex, 
  currentTimelineItem,
  currentImage 
}) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`info-panel ${isEditingTooth ? 'editing-mode' : ''}`}>
      <p>{getStatusMessage()}</p>
      <p>Defined teeth: {toothCount}</p>
      
      {currentTimelineItem && (
        <div className="timeline-info">
          <p className="timeline-current">
            <strong>Current Examination:</strong> {currentTimelineItem.title}
          </p>
          <p className="timeline-date">
            <strong>Date:</strong> {formatDate(currentTimelineItem.date)}
          </p>
          <p className="timeline-dentist">
            <strong>Dentist:</strong> {currentTimelineItem.dentist}
          </p>
          {currentTimelineItem.notes && (
            <p className="timeline-notes">
              <strong>Notes:</strong> {currentTimelineItem.notes}
            </p>          )}
        </div>
      )}

      {currentImage && (
        <div className="current-image-info">
          <p className="image-current">
            <strong>Current Image:</strong> {currentImage.date ? currentImage.date : 'Default Panoramic'}
          </p>
          <p className="image-id">
            <strong>Image ID:</strong> {currentImage.id}
          </p>
        </div>
      )}
    </div>
  );
};

export default InfoPanel;
