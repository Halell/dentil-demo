
/**
 * Simple corner smoothing that works with polygon points
 * Creates additional points near sharp corners to simulate rounding
 */

const getDistance = (p1, p2) => {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
};

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

const interpolatePoint = (p1, p2, ratio) => {
  return {
    x: p1.x + (p2.x - p1.x) * ratio,
    y: p1.y + (p2.y - p1.y) * ratio
  };
};

/**
 * Smooth polygon corners by adding intermediate points at sharp angles
 */
export const addCornerSmoothing = (points, smoothingFactor = 0.1) => {
  if (!points || points.length < 3) return points;

  const smoothedPoints = [];
  const length = points.length;

  for (let i = 0; i < length; i++) {
    const prevPoint = points[(i - 1 + length) % length];
    const currentPoint = points[i];
    const nextPoint = points[(i + 1) % length];
    // Check if this corner is sharp (less than 140 degrees instead of 120)
    const angle = getAngle(prevPoint, currentPoint, nextPoint);
    const isSharp = angle < (Math.PI * 0.78); // 140 degrees - more aggressive

    if (isSharp) {
      // Calculate distances to neighbors
      const distToPrev = getDistance(currentPoint, prevPoint);
      const distToNext = getDistance(currentPoint, nextPoint);

      // Create smoothing with more liberal requirements
      const minDistance = 5; // Reduced from 10 to 5 pixels
      if (distToPrev > minDistance && distToNext > minDistance) {
        const smoothRatio = Math.min(smoothingFactor, 0.3); // Increased from 0.2 to 0.3

        // Add points before and after the sharp corner
        const beforePoint = interpolatePoint(currentPoint, prevPoint, smoothRatio);
        const afterPoint = interpolatePoint(currentPoint, nextPoint, smoothRatio);

        smoothedPoints.push(beforePoint);
        smoothedPoints.push(afterPoint);
      } else {
        // Keep original point if edges are too short
        smoothedPoints.push(currentPoint);
      }
    } else {
      // Keep original point for gentle corners
      smoothedPoints.push(currentPoint);
    }
  }

  return smoothedPoints;
};
