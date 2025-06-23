import { useState, useEffect } from 'react';

export const useImageToothData = (currentImage) => {
  const [toothAreas, setToothAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tooth data from the current image's regions
  useEffect(() => {
    const loadToothDataFromImage = async () => {
      setIsLoading(true);

      try {
        if (currentImage?.id) {
          // Load patient data to get the regions for this image
          const response = await fetch('/data/patientData.json');
          if (!response.ok) {
            throw new Error('Failed to load patient data');
          }

          const patientData = await response.json();
          const imageData = patientData.patient.images[currentImage.id];
          
          if (imageData && imageData.regions) {
            // Convert regions to tooth areas format
            const convertedToothAreas = Object.entries(imageData.regions).map(([toothName, regionData]) => ({
              id: `tooth-${toothName}-${Date.now()}`,
              points: regionData.coords.map(([x, y]) => ({ x, y })),
              note: toothName,
              createdAt: new Date().toISOString(),
              coordinateSystem: 'percentage',
              linkedTeeth: regionData.linkedTeeth || [toothName]
            }));

            console.log(`Loaded ${convertedToothAreas.length} tooth areas from image regions for ${currentImage.id}`);
            setToothAreas(convertedToothAreas);
          } else {
            console.log('No regions found for current image:', currentImage.id);
            setToothAreas([]);
          }
        } else {
          console.log('No current image provided');
          setToothAreas([]);
        }
      } catch (error) {
        console.error('Error loading tooth data from image regions:', error);
        setToothAreas([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadToothDataFromImage();
  }, [currentImage]);

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
