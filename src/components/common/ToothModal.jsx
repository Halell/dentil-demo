import { useState, useEffect } from 'react';
import '../../styles/components/common/ToothModal.css';

const ToothModal = ({ isVisible, onSave, onCancel }) => {
  const [toothNote, setToothNote] = useState('');

  // Handle Enter key to save
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter' && isVisible) {
        event.preventDefault();
        handleSave();
      } else if (event.key === 'Escape' && isVisible) {
        event.preventDefault();
        handleCancel();
      }
    };

    if (isVisible) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, toothNote]);

  const handleSave = () => {
    onSave(toothNote);
    setToothNote('');
  };

  const handleCancel = () => {
    onCancel();
    setToothNote('');
  };

  if (!isVisible) return null;

  return (
    <div className="modal-overlay">
      <div className="tooth-note-modal">
        <h3>Add Tooth Note</h3>
        <input
          type="text"
          value={toothNote}
          onChange={(e) => setToothNote(e.target.value)}
          placeholder="Enter tooth name or description..."
          autoFocus
        />
        <div className="modal-buttons">
          <button onClick={handleSave}>OK</button>
          <button onClick={handleCancel}>Cancel</button>
        </div>
        <div className="modal-help">
          <small>Press Enter to save, Escape to cancel</small>
        </div>
      </div>
    </div>
  );
};

export default ToothModal;
