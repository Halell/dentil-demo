import { useState, useEffect } from 'react';

export const useImageToothData = (currentTimelineId) => {
    const [toothAreas, setToothAreas] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Load tooth data from the current timeline's corresponding image
    useEffect(() => {
        const loadToothDataFromTimeline = async () => {
            setIsLoading(true);

            try {
                if (currentTimelineId) {
                    // Load patient data to get the regions for this timeline's image
                    const response = await fetch('/data/patientData.json');
                    if (!response.ok) {
                        throw new Error('Failed to load patient data');
                    }

                    const patientData = await response.json();
                    
                    // Find image that matches the timeline date/id
                    // Timeline IDs are like "2023-07-03", we need to find matching panoramic image
                    const matchingImageKey = Object.keys(patientData.patient.images).find(imageKey => {
                        const imageData = patientData.patient.images[imageKey];
                        // Check if image type is panoramic and the key or fileUrl contains the timeline date
                        return imageData.type === 'panoramic' && 
                               (imageKey.includes(currentTimelineId) || imageData.fileUrl.includes(currentTimelineId));
                    });

                    if (matchingImageKey) {
                        const imageData = patientData.patient.images[matchingImageKey];
                        
                        if (imageData.regions) {
                            // Convert regions to tooth areas format
                            const convertedToothAreas = Object.entries(imageData.regions).map(([toothName, regionData]) => ({
                                id: `tooth-${toothName}-${Date.now()}`,
                                points: regionData.coords.map(([x, y]) => ({ x, y })),
                                note: toothName,
                                createdAt: new Date().toISOString(),
                                coordinateSystem: 'percentage',
                                linkedTeeth: regionData.linkedTeeth || [toothName]                            }));

                            setToothAreas(convertedToothAreas);
                        } else {
                            setToothAreas([]);
                        }
                    } else {
                        setToothAreas([]);
                    }
                } else {
                    setToothAreas([]);
                }
            } catch (error) {
                console.error('Error loading tooth data from timeline:', error);
                setToothAreas([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadToothDataFromTimeline();
    }, [currentTimelineId]);

    const addToothArea = (toothArea) => {
        setToothAreas(prev => [...prev, toothArea]);
    };

    const removeToothArea = (toothId) => {
        setToothAreas(prev => prev.filter(tooth => tooth.id !== toothId));
    };

    const updateToothArea = (toothId, updates) => {
        setToothAreas(prev =>
            prev.map(tooth =>
                tooth.id === toothId ? { ...tooth, ...updates } : tooth
            )
        );
    };

    return {
        toothAreas,
        isLoading,
        addToothArea,
        removeToothArea,
        updateToothArea
    };
};
