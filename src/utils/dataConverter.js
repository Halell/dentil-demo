// One-time conversion script to convert existing tooth data to percentage coordinates
import { convertToothDataToPercentage } from './utils/coordinateConverter.js';

// This script should be run once to convert your existing tooth-areas.json
// from pixel coordinates to percentage coordinates

async function convertExistingData() {
    try {
        // Load existing tooth data
        const response = await fetch('/data/tooth-areas.json');
        const existingData = await response.json();

        console.log('📄 Original data structure:', existingData);
        console.log('📊 Converting', existingData.toothAreas?.length || 0, 'teeth from pixel to percentage coordinates');

        // Convert to percentage coordinates
        const convertedData = convertToothDataToPercentage(existingData);

        // Add metadata about the conversion
        const outputData = {
            ...convertedData,
            coordinateSystem: "percentage", // Mark as percentage-based
            originalReference: {
                width: 1280,
                height: 1011.56,
                description: "Original reference dimensions when polygons were created"
            },
            conversionDate: new Date().toISOString(),
            description: "Panoramic X-ray tooth area definitions with percentage-based coordinates for responsive design"
        };

        console.log('✅ Converted data structure:', outputData);

        // Log some sample conversions for verification
        if (outputData.toothAreas && outputData.toothAreas.length > 0) {
            const firstTooth = outputData.toothAreas[0];
            console.log('📋 Sample conversion for first tooth:');
            console.log('First point percentage:', firstTooth.points[0]);
            console.log('(Should be between 0-100 for both x and y)');
        }

        // Create downloadable file
        const dataStr = JSON.stringify(outputData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);

        const link = document.createElement('a');
        link.href = url;
        link.download = 'tooth-areas-percentage.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        console.log('💾 Downloaded converted file: tooth-areas-percentage.json');
        console.log('📝 Replace your existing /public/data/tooth-areas.json with this file');

        return outputData;

    } catch (error) {
        console.error('❌ Error converting tooth data:', error);
    }
}

// Export for use
export { convertExistingData };
