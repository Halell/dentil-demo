import '../../styles/components/common/ContextMenu.css';

const ContextMenu = ({ isVisible, position, onAddTooth, onClose }) => {
  if (!isVisible) return null;

  const handleAddToothClick = () => {
    if (onAddTooth) {
      onAddTooth();
    }
  };

  return (
    <div
      className="context-menu"
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="context-menu-item" onClick={handleAddToothClick}>
        Add New Tooth
      </div>
    </div>
  );
};

export default ContextMenu;
