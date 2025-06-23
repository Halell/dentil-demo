import { useEffect } from 'react';
import '../../styles/components/common/ToothInfoModal.css';

const ToothInfoModal = ({ isVisible, tooth, onClose, position }) => {
  // Handle keyboard events
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' || event.key === 'Enter') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, onClose]);

  if (!isVisible || !tooth) return null;

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Unknown';
    }
  };

  // Calculate modal position based on tooth position
  const modalStyle = position ? {
    position: 'fixed',
    left: `${Math.min(position.x + 10, window.innerWidth - 320)}px`,
    top: `${Math.min(position.y - 50, window.innerHeight - 250)}px`,
    transform: 'none'
  } : {};
  return (
    <div className="modal-overlay">
      <div
        className="tooth-info-modal"
        onClick={(e) => e.stopPropagation()}
        style={modalStyle}
      >
        <div className="modal-header">
          <h3>Tooth Information</h3>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="info-item">
            <strong>Tooth ID:</strong>
            <span>{tooth.id}</span>
          </div>

          <div className="info-item">
            <strong>Description:</strong>
            <span>{tooth.note || 'No description available'}</span>
          </div>

          <div className="info-item">
            <strong>Created:</strong>
            <span>{formatDate(tooth.createdAt)}</span>
          </div>

          <div className="info-item">
            <strong>Number of Points:</strong>
            <span>{tooth.points ? tooth.points.length : 0}</span>
          </div>

          {tooth.points && tooth.points.length > 0 && (
            <div className="info-item">
              <strong>Area Coordinates:</strong>
              <div className="coordinates-list">
                {tooth.points.slice(0, 3).map((point, index) => (
                  <div key={index} className="coordinate">
                    Point {index + 1}: ({point.x.toFixed(1)}%, {point.y.toFixed(1)}%)
                  </div>
                ))}
                {tooth.points.length > 3 && (
                  <div className="coordinate">
                    ...and {tooth.points.length - 3} more points
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default ToothInfoModal;
