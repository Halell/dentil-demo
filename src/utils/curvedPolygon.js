
/**
 * Create a smooth curved polygon using SVG paths with quadratic curves
 */

function getDistance(p1, p2) {
  return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
}

function getMidpoint(p1, p2) {
  return {
    x: (p1.x + p2.x) / 2,
    y: (p1.y + p2.y) / 2
  };
}

function getControlPoint(prev, current, next, smoothing = 0.2) {
  // Calculate vectors
  const d1 = getDistance(prev, current);
  const d2 = getDistance(current, next);

  // Get direction vectors
  const dirX = (next.x - prev.x) / (d1 + d2);
  const dirY = (next.y - prev.y) / (d1 + d2);

  // Calculate control point with smoothing
  const controlDist = Math.min(d1, d2) * smoothing;

  return {
    x: current.x + dirX * controlDist,
    y: current.y + dirY * controlDist
  };
}

/**
 * Convert polygon points to a smooth SVG path using quadratic curves
 */
export function createCurvedPolygonPath(points, smoothing = 0.3) {
  if (!points || points.length < 3) return '';

  const length = points.length;
  let path = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  for (let i = 0; i < length; i++) {
    const current = points[i];
    const next = points[(i + 1) % length];
    const prev = points[(i - 1 + length) % length];
    const nextNext = points[(i + 2) % length];

    // Calculate midpoint between current and next
    const mid = getMidpoint(current, next);

    // Calculate control point for smooth curve
    const control = getControlPoint(prev, current, next, smoothing);

    // Add quadratic curve to midpoint, then line to next point
    path += ` Q ${control.x.toFixed(2)},${control.y.toFixed(2)} ${mid.x.toFixed(2)},${mid.y.toFixed(2)}`;
    path += ` L ${next.x.toFixed(2)},${next.y.toFixed(2)}`;
  }

  path += ' Z';
  return path;
}

/**
 * Simpler version - just round corners at vertices
 */
export function createRoundedPolygonPath(points, cornerRadius = 5) {
  if (!points || points.length < 3) return '';

  const length = points.length;
  let path = '';

  for (let i = 0; i < length; i++) {
    const prev = points[(i - 1 + length) % length];
    const current = points[i];
    const next = points[(i + 1) % length];

    // Calculate distances to determine actual corner radius
    const d1 = getDistance(prev, current);
    const d2 = getDistance(current, next);
    const actualRadius = Math.min(cornerRadius, d1 * 0.3, d2 * 0.3);

    // Calculate points for rounded corner
    const ratio1 = actualRadius / d1;
    const ratio2 = actualRadius / d2;

    const p1 = {
      x: current.x + (prev.x - current.x) * ratio1,
      y: current.y + (prev.y - current.y) * ratio1
    };

    const p2 = {
      x: current.x + (next.x - current.x) * ratio2,
      y: current.y + (next.y - current.y) * ratio2
    };

    if (i === 0) {
      path += `M ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
    } else {
      path += ` L ${p1.x.toFixed(2)},${p1.y.toFixed(2)}`;
    }

    // Add quadratic curve for rounded corner
    path += ` Q ${current.x.toFixed(2)},${current.y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  path += ' Z';
  return path;
}
