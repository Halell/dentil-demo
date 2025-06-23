
/**
 * Calculate the distance between two points
 */
const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

/**
 * Calculate the angle between three points (in radians)
 */
const getAngle = (p1, p2, p3) => {
  const dx1 = p1.x - p2.x;
  const dy1 = p1.y - p2.y;
  const dx2 = p3.x - p2.x;
  const dy2 = p3.y - p2.y;

  const angle1 = Math.atan2(dy1, dx1);
  const angle2 = Math.atan2(dy2, dx2);

  let diff = angle2 - angle1;
  if (diff > Math.PI) diff -= 2 * Math.PI;
  if (diff < -Math.PI) diff += 2 * Math.PI;

  return Math.abs(diff);
};

/**
 * Check if a corner is sharp based on angle threshold
 */
const isSharpCorner = (p1, p2, p3, threshold = Math.PI * 0.7) => {
  const angle = getAngle(p1, p2, p3);
  return angle < threshold; // Sharp if angle is less than ~126 degrees
};

/**
 * Get a point between two points at a given ratio
 */
const getIntermediatePoint = (p1, p2, ratio) => {
  return {
    x: p1.x + (p2.x - p1.x) * ratio,
    y: p1.y + (p2.y - p1.y) * ratio
  };
};

/**
 * Smooth sharp corners of a polygon by creating rounded corners
 */
export const smoothPolygonCorners = (points, cornerRadius = 0.15) => {
  if (!points || points.length < 3) return points;

  const smoothedPoints = [];
  const length = points.length;

  for (let i = 0; i < length; i++) {
    const prevPoint = points[(i - 1 + length) % length];
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % length];

    // Check if this corner is sharp
    if (isSharpCorner(prevPoint, currentPoint, nextPoint)) {
      // Calculate distances to neighboring points
      const distToPrev = getDistance(currentPoint, prevPoint);
      const distToNext = getDistance(currentPoint, nextPoint);

      // Use a percentage of the shorter distance for rounding
      const maxRadius = Math.min(distToPrev, distToNext) * cornerRadius;

      // Create rounded corner using two intermediate points
      const prevRatio = Math.min(maxRadius / distToPrev, 0.3);
      const nextRatio = Math.min(maxRadius / distToNext, 0.3);

      const roundStart = getIntermediatePoint(currentPoint, prevPoint, prevRatio);
      const roundEnd = getIntermediatePoint(currentPoint, nextPoint, nextRatio);

      // Add the rounded corner points
      smoothedPoints.push(roundStart);
      smoothedPoints.push(roundEnd);
    } else {
      // Keep the original point for gentle corners
      smoothedPoints.push(currentPoint);
    }
  }

  return smoothedPoints;
};

/**
 * Create SVG path string with smooth curves for rounded corners
 */
export const createSmoothPath = (points, cornerRadius = 0.15) => {
  if (!points || points.length < 3) return '';

  const smoothed = smoothPolygonCorners(points, cornerRadius);
  if (smoothed.length < 3) return '';

  let path = `M ${smoothed[0].x},${smoothed[0].y}`;

  for (let i = 1; i < smoothed.length; i++) {
    const point = smoothed[i];
    path += ` L ${point.x},${point.y}`;
  }

  path += ' Z';
  return path;
};

/**
 * Alternative approach: Create Bezier curves for smoother polygons
 */
export const createBezierSmoothPath = (points, smoothness = 0.2) => {
  if (!points || points.length < 3) return '';

  const length = points.length;
  let path = `M ${points[0].x},${points[0].y}`;

  for (let i = 0; i < length; i++) {
    const current = points[i];
    const next = points[(i + 1) % length];
    const nextNext = points[(i + 2) % length];

    // Calculate control points for smoother curves
    const cp1x = current.x + (next.x - current.x) * smoothness;
    const cp1y = current.y + (next.y - current.y) * smoothness;

    const cp2x = next.x - (nextNext.x - current.x) * smoothness;
    const cp2y = next.y - (nextNext.y - current.y) * smoothness;

    path += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${next.x},${next.y}`;
  }

  return path;
};
