// Coordinate conversion utilities for responsive tooth positioning

// Your original reference dimensions when you created the polygons
const REFERENCE_WIDTH = 1280;
const REFERENCE_HEIGHT = 1011.56;

/**
 * Convert absolute pixel coordinates to percentage coordinates
 * @param {Object} point - Point with x, y pixel coordinates
 * @returns {Object} Point with x, y as percentages (0-100)
 */
export const pixelToPercentage = (point) => {
    return {
        x: (point.x / REFERENCE_WIDTH) * 100,
        y: (point.y / REFERENCE_HEIGHT) * 100
    };
};

/**
 * Convert percentage coordinates to absolute pixel coordinates
 * @param {Object} point - Point with x, y as percentages (0-100)
 * @param {number} currentWidth - Current image width in pixels
 * @param {number} currentHeight - Current image height in pixels
 * @returns {Object} Point with x, y in pixels
 */
export const percentageToPixel = (point, currentWidth, currentHeight) => {
    return {
        x: (point.x / 100) * currentWidth,
        y: (point.y / 100) * currentHeight
    };
};

/**
 * Convert an array of pixel points to percentage points
 * @param {Array} points - Array of points with pixel coordinates
 * @returns {Array} Array of points with percentage coordinates
 */
export const convertPointsToPercentage = (points) => {
    return points.map(pixelToPercentage);
};

/**
 * Convert an array of percentage points to pixel points
 * @param {Array} points - Array of points with percentage coordinates
 * @param {number} currentWidth - Current image width in pixels
 * @param {number} currentHeight - Current image height in pixels
 * @returns {Array} Array of points with pixel coordinates
 */
export const convertPointsToPixel = (points, currentWidth, currentHeight) => {
    return points.map(point => percentageToPixel(point, currentWidth, currentHeight));
};

/**
 * Convert existing tooth data from pixel to percentage coordinates
 * @param {Object} toothData - Tooth data with pixel coordinates
 * @returns {Object} Tooth data with percentage coordinates
 */
export const convertToothDataToPercentage = (toothData) => {
    return {
        ...toothData,
        toothAreas: toothData.toothAreas.map(tooth => ({
            ...tooth,
            points: convertPointsToPercentage(tooth.points)
        }))
    };
};

/**
 * Convert tooth data from percentage to pixel coordinates for display
 * @param {Object} toothData - Tooth data with percentage coordinates
 * @param {number} currentWidth - Current image width in pixels
 * @param {number} currentHeight - Current image height in pixels
 * @returns {Object} Tooth data with pixel coordinates
 */
export const convertToothDataToPixel = (toothData, currentWidth, currentHeight) => {
    return {
        ...toothData,
        toothAreas: toothData.toothAreas.map(tooth => ({
            ...tooth,
            points: convertPointsToPixel(tooth.points, currentWidth, currentHeight)
        }))
    };
};
