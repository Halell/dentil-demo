import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../constants/app';

export const useCurrentImage = (currentTimelineId) => {
  const [currentImage, setCurrentImage] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadCurrentImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Load patient data
        const response = await fetch('/data/patientData.json');
        if (!response.ok) {
          throw new Error('Failed to load patient data');
        }

        const patientData = await response.json();
        
        // If we have a current timeline, try to find related panoramic image by date
        let targetImageId = APP_CONFIG.DEFAULT_PANORAMIC_ID; // Default to 2015 image
        
        if (currentTimelineId) {
          // Try to find a panoramic image that matches the timeline date
          const timelineDate = currentTimelineId; // Timeline IDs are dates like "2024-01-15"
          
          // Look for panoramic image with matching or close date
          const matchingPanoramicId = Object.keys(patientData.patient.images).find(id => 
            id.startsWith('panoramic-') && id.includes(timelineDate.substring(0, 7)) // Match year-month
          );
          
          if (matchingPanoramicId) {
            targetImageId = matchingPanoramicId;
          }
        }

        // Get the target image data
        const imageData = patientData.patient.images[targetImageId];
        
        if (imageData) {
          setCurrentImage({
            id: imageData.id,
            path: imageData.fileUrl,
            date: imageData.date,
            type: imageData.type
          });
        } else {
          // Fallback to default image
          setCurrentImage({
            id: 'default',
            path: APP_CONFIG.DEFAULT_IMAGE_PATH,
            date: null,
            type: 'panoramic'
          });
        }

      } catch (err) {
        console.error('Error loading current image:', err);
        setError(err.message);
        
        // Fallback to default image
        setCurrentImage({
          id: 'default',
          path: APP_CONFIG.DEFAULT_IMAGE_PATH,
          date: null,
          type: 'panoramic'
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCurrentImage();
  }, [currentTimelineId]);

  return { currentImage, isLoading, error };
};
