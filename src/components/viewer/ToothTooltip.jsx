import '../../styles/components/viewer/ToothTooltip.css';

const ToothTooltip = ({ isVisible, position, content, isUpperTooth = false }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`tooth-tooltip ${isUpperTooth ? 'upper' : 'lower'}`}
      style={{
        left: position.x,
        top: position.y
      }}
    >
      <div className="tooltip-arrow"></div>
      {content}
    </div>
  );
};

export default ToothTooltip;
