import '../../styles/components/editor/EditControls.css';

const EditControls = ({ onFinish, onExport, onCancel }) => {
  return (
    <div className="edit-controls">
      <button
        className="finish-btn"
        onClick={onFinish}
        title="Finish defining tooth"
      >
        ✓
      </button>
      <button
        className="export-btn"
        onClick={onExport}
        title="Export tooth data"
      >
        ↓
      </button>
      <button
        className="cancel-btn"
        onClick={onCancel}
        title="Cancel"
      >
        ✕
      </button>
    </div>
  );
};

export default EditControls;
