import { useState, useEffect } from 'react';
import { calculatePolygonCenter, findInsertionPoint } from '../../utils/toothUtils';
import { createRoundedPolygonPath } from '../../utils/curvedPolygon';
import '../../styles/components/viewer/ToothPolygon.css';

const ToothPolygon = ({
  tooth,
  dimensions,
  onHover,
  onLeave,
  onClick,
  isEditMode = false,
  onAddPoint,
  onDeletePoint,
  hoveredPointIndex,
  onPointHover
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Handle keyboard events for deleting points
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Delete' && hoveredPointIndex !== null && isEditMode) {
        onDeletePoint && onDeletePoint(tooth.id, hoveredPointIndex);
      }
    };

    if (isEditMode) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [hoveredPointIndex, isEditMode, onDeletePoint, tooth.id]);

  // Convert percentage coordinates to pixel coordinates
  const getPixelPoints = (points) => {
    if (!points || points.length === 0) return { points: '', pixelArray: [], curvedPath: '' };

    const arePercentageCoords = points.every(point =>
      point.x <= 100 && point.y <= 100 &&
      point.x >= 0 && point.y >= 0
    );

    let pixelPoints;
    if (arePercentageCoords) {
      pixelPoints = points.map(point => ({
        x: (point.x / 100) * dimensions.width,
        y: (point.y / 100) * dimensions.height
      }));
    } else {
      pixelPoints = points;
    }

    // Create curved path with rounded corners
    const curvedPath = createRoundedPolygonPath(pixelPoints, 8); // 8px corner radius

    // Debug: Log path creation
    console.log('Curved path created for tooth', tooth.id, ':', curvedPath ? 'SUCCESS' : 'FAILED');    // Create points strings for original (for editing)
    const pointsString = pixelPoints.map(point => `${point.x.toFixed(1)},${point.y.toFixed(1)}`).join(' ');

    // Debug: Log tooth rendering
    console.log('Tooth', tooth.id, 'rendering with', pixelPoints.length, 'points:', pointsString.substring(0, 50) + '...');

    return {
      points: pointsString,
      pixelArray: pixelPoints,
      curvedPath: curvedPath
    };
  };

  const { points: pointsString, pixelArray, curvedPath } = getPixelPoints(tooth.points);
  const center = calculatePolygonCenter(tooth.points, dimensions);

  const handleMouseEnter = (event) => {
    setIsHovered(true);
    if (onHover) {
      onHover(tooth, center);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onLeave) {
      onLeave();
    }
  };

  const handlePolygonClick = (event) => {
    if (isEditMode && onAddPoint) {
      event.stopPropagation();
      const rect = event.currentTarget.closest('svg').getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const clickY = event.clientY - rect.top;

      const insertIndex = findInsertionPoint(clickX, clickY, pixelArray);
      if (insertIndex !== -1) {
        // Convert pixel coordinates back to percentage
        const newPoint = {
          x: (clickX / dimensions.width) * 100,
          y: (clickY / dimensions.height) * 100
        };
        onAddPoint(tooth.id, insertIndex, newPoint);
      }
    } else if (onClick) {
      onClick(tooth, event);
    }
  };

  const handlePointHover = (index) => {
    if (onPointHover) {
      onPointHover(index);
    }
  };

  const handlePointLeave = () => {
    if (onPointHover) {
      onPointHover(null);
    }
  }; return (
    <g>
      {/* Main tooth shape with rounded corners */}
      {curvedPath ? (
        <path
          d={curvedPath}
          className={`tooth-polygon ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handlePolygonClick}
        />
      ) : (
        // Fallback to polygon if curved path fails
        <polygon
          points={pointsString}
          className={`tooth-polygon ${isHovered ? 'hovered' : ''}`}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handlePolygonClick}
        />
      )}

      {/* Edit mode: Show individual points (original points for editing) */}
      {isEditMode && pixelArray.map((point, index) => (
        <circle
          key={index}
          cx={point.x}
          cy={point.y}
          r="4"
          className={`edit-point ${hoveredPointIndex === index ? 'hovered' : ''}`}
          onMouseEnter={() => handlePointHover(index)}
          onMouseLeave={handlePointLeave}
        />
      ))}
    </g>
  );
};

export default ToothPolygon;
