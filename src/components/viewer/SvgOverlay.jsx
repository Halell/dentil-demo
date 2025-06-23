import { forwardRef } from 'react';
import ToothPolygon from './ToothPolygon';
import '../../styles/components/viewer/SvgOverlay.css';

const SvgOverlay = forwardRef(({
  dimensions,
  toothAreas,
  isEditingTooth,
  editingToothId,
  currentToothPoints,
  hoveredPointIndex,
  onToothHover,
  onToothLeave,
  onToothClick,
  onAddPoint,
  onDeletePoint,
  onPointHover
}, ref) => {
  if (!dimensions.width || !dimensions.height) {
    return null;
  } return (
    <svg
      ref={ref}
      className="svg-overlay"
      width={dimensions.width}
      height={dimensions.height}
      viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
    >
      {/* Render existing tooth areas */}
      {toothAreas.map(tooth => (
        <ToothPolygon
          key={tooth.id}
          tooth={tooth}
          dimensions={dimensions}
          isEditMode={isEditingTooth && editingToothId === tooth.id}
          hoveredPointIndex={editingToothId === tooth.id ? hoveredPointIndex : null}
          onHover={onToothHover}
          onLeave={onToothLeave}
          onClick={onToothClick}
          onAddPoint={onAddPoint}
          onDeletePoint={onDeletePoint}
          onPointHover={onPointHover}
        />
      ))}      {/* Render current editing points - only when creating new tooth */}
      {isEditingTooth && editingToothId === null && currentToothPoints.length > 0 && (
        <>
          {/* Current polygon being drawn */}
          {currentToothPoints.length > 2 && (
            <polygon
              points={currentToothPoints.map(p => `${p.x},${p.y}`).join(' ')}
              className="editing-polygon"
            />
          )}

          {/* Current editing points */}
          {currentToothPoints.map((point, index) => (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="3"
              className="editing-point"
            />
          ))}

          {/* Lines between points */}
          {currentToothPoints.length > 1 && (
            <polyline
              points={currentToothPoints.map(p => `${p.x},${p.y}`).join(' ')}
              className="editing-line"
            />
          )}
        </>
      )}
    </svg>
  );
});

SvgOverlay.displayName = 'SvgOverlay';

export default SvgOverlay;
