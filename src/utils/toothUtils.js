import { APP_CONFIG } from '../constants/app';

export const exportToothData = (toothAreas) => {
  const exportData = {
    version: "1.0",
    exportDate: new Date().toISOString(),
    description: "Panoramic X-ray tooth area definitions",
    toothAreas: toothAreas
  };

  const dataStr = JSON.stringify(exportData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `tooth-areas-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const createToothArea = (points, note) => {
  return {
    id: `tooth-${Date.now()}`,
    points: points,
    note: note,
    createdAt: new Date().toISOString()
  };
};

// Calculate the center (centroid) of a polygon
export const calculatePolygonCenter = (points, dimensions) => {
  if (!points || points.length === 0) return { x: 0, y: 0 };

  // Convert percentage to pixels if needed
  const pixelPoints = points.map(point => {
    const arePercentageCoords = point.x <= 100 && point.y <= 100 && point.x >= 0 && point.y >= 0;
    if (arePercentageCoords && dimensions) {
      return {
        x: (point.x / 100) * dimensions.width,
        y: (point.y / 100) * dimensions.height
      };
    }
    return point;
  });

  let totalX = 0;
  let totalY = 0;

  for (const point of pixelPoints) {
    totalX += point.x;
    totalY += point.y;
  }

  return {
    x: totalX / pixelPoints.length,
    y: totalY / pixelPoints.length
  };
};

// Find the closest point on a polygon edge to insert a new point
export const findInsertionPoint = (clickX, clickY, points) => {
  if (!points || points.length < 2) return -1;

  let minDistance = Infinity;
  let insertIndex = -1;

  for (let i = 0; i < points.length; i++) {
    const current = points[i];
    const next = points[(i + 1) % points.length];

    // Calculate distance from click point to line segment
    const distance = distanceToLineSegment(clickX, clickY, current, next);

    if (distance < minDistance && distance < 10) { // 10px threshold
      minDistance = distance;
      insertIndex = i + 1;
    }
  }

  return insertIndex;
};

// Calculate distance from point to line segment
const distanceToLineSegment = (px, py, lineStart, lineEnd) => {
  const A = px - lineStart.x;
  const B = py - lineStart.y;
  const C = lineEnd.x - lineStart.x;
  const D = lineEnd.y - lineStart.y;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  if (lenSq === 0) return Math.sqrt(A * A + B * B);

  let param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = lineStart.x;
    yy = lineStart.y;
  } else if (param > 1) {
    xx = lineEnd.x;
    yy = lineEnd.y;
  } else {
    xx = lineStart.x + param * C;
    yy = lineStart.y + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;
  return Math.sqrt(dx * dx + dy * dy);
};

// Determine if a tooth is upper or lower based on its center position
export const isUpperTooth = (center, imageHeight) => {
  return center.y < imageHeight / 2;
};
