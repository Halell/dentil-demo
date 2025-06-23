import { useState, useEffect } from 'react';
import { APP_CONFIG } from '../constants/app';

export const useToothData = () => {
  const [toothAreas, setToothAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // Load tooth data from external sources and localStorage
  useEffect(() => {
    const loadToothData = async () => {
      setIsLoading(true);

      try {
        // Try to load from the local tooth-areas.json file first
        const response = await fetch('/data/tooth-areas.json');
        if (response.ok) {
          const data = await response.json();
          if (data.toothAreas && data.toothAreas.length > 0) {
            console.log('Loaded tooth data from tooth-areas.json:', data.toothAreas.length, 'teeth');
            setToothAreas(data.toothAreas);
            setIsLoading(false);
            return;
          }
        }
      } catch (error) {
        console.log('Failed to load from tooth-areas.json:', error);
      }

      try {
        // Try to load from external sources
        const configResponse = await fetch(APP_CONFIG.CONFIG_PATH);
        const config = configResponse.ok ? await configResponse.json() : null;

        if (config?.dataConfig?.sources) {
          for (const source of config.dataConfig.sources) {
            if (!source.enabled) continue;

            try {
              const response = await fetch(source.url, {
                mode: config.dataConfig.corsMode || 'cors',
                cache: 'no-cache'
              });

              if (response.ok) {
                const data = await response.json();
                if (data.toothAreas && data.toothAreas.length > 0) {
                  console.log('Loaded tooth data from external source:', data.toothAreas.length, 'teeth');
                  setToothAreas(data.toothAreas);
                  setIsLoading(false);
                  return;
                }
              }
            } catch (error) {
              console.log(`Failed to load from ${source.name}`);
            }
          }
        }
      } catch (error) {
        console.log('External sources failed, using localStorage fallback');
      }

      // Fallback to localStorage
      const savedAreas = localStorage.getItem(APP_CONFIG.LOCAL_STORAGE_KEY);
      if (savedAreas) {
        try {
          const localData = JSON.parse(savedAreas);
          console.log('Loaded tooth data from localStorage:', localData.length, 'teeth');
          setToothAreas(localData);
        } catch (error) {
          console.error('Error loading from localStorage:', error);
        }
      } else {
        console.log('No tooth data found anywhere');
      }
      setIsLoading(false);
    };

    loadToothData();
  }, []);

  // Save to localStorage whenever tooth areas change
  useEffect(() => {
    if (toothAreas.length > 0) {
      localStorage.setItem(APP_CONFIG.LOCAL_STORAGE_KEY, JSON.stringify(toothAreas));
    }
  }, [toothAreas]);

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
