import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for managing timeline data and navigation
 */
export const useTimelineData = () => {
    const [timelineData, setTimelineData] = useState(null);
    const [currentTimelineId, setCurrentTimelineId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Load timeline data from JSON file
    const loadTimelineData = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/data/timeline-data.json');
            if (!response.ok) {
                throw new Error(`Failed to load timeline data: ${response.status}`);
            }

            const data = await response.json();
            setTimelineData(data);

            // Set initial timeline ID if not already set
            if (!currentTimelineId && data.timeline && data.timeline.length > 0) {
                setCurrentTimelineId(data.currentTimelineId || data.timeline[0].id);
            }
        } catch (err) {
            console.error('Error loading timeline data:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [currentTimelineId]);

    // Load timeline data on component mount
    useEffect(() => {
        loadTimelineData();
    }, [loadTimelineData]);

    // Get current timeline item
    const getCurrentTimelineItem = useCallback(() => {
        if (!timelineData || !currentTimelineId) return null;
        return timelineData.timeline.find(item => item.id === currentTimelineId);
    }, [timelineData, currentTimelineId]);    // Navigate to a specific timeline item
    const navigateToTimelineItem = useCallback((timelineItem) => {
        if (!timelineItem) {
            console.warn('⚠️ No timeline item provided');
            return;
        }
        
        // Use functional update to ensure we get the latest state
        setCurrentTimelineId(prevId => {
            return timelineItem.id;
        });

        return {
            success: true,
            item: timelineItem
        };
    }, []); // Remove dependency to prevent stale closures

    // Get next timeline item
    const getNextTimelineItem = useCallback(() => {
        if (!timelineData || !currentTimelineId) return null;

        const currentIndex = timelineData.timeline.findIndex(item => item.id === currentTimelineId);
        if (currentIndex === -1 || currentIndex === timelineData.timeline.length - 1) return null;

        return timelineData.timeline[currentIndex + 1];
    }, [timelineData, currentTimelineId]);

    // Get previous timeline item
    const getPreviousTimelineItem = useCallback(() => {
        if (!timelineData || !currentTimelineId) return null;

        const currentIndex = timelineData.timeline.findIndex(item => item.id === currentTimelineId);
        if (currentIndex <= 0) return null;

        return timelineData.timeline[currentIndex - 1];
    }, [timelineData, currentTimelineId]);

    // Navigate to next timeline item
    const navigateToNext = useCallback(async () => {
        const nextItem = getNextTimelineItem();
        if (nextItem) {
            return await navigateToTimelineItem(nextItem);
        }
        return { success: false, error: 'No next item available' };
    }, [getNextTimelineItem, navigateToTimelineItem]);

    // Navigate to previous timeline item
    const navigateToPrevious = useCallback(async () => {
        const prevItem = getPreviousTimelineItem();
        if (prevItem) {
            return await navigateToTimelineItem(prevItem);
        }
        return { success: false, error: 'No previous item available' };
    }, [getPreviousTimelineItem, navigateToTimelineItem]);

    // Get timeline statistics
    const getTimelineStats = useCallback(() => {
        if (!timelineData) return null;

        const { timeline } = timelineData;
        const currentIndex = timeline.findIndex(item => item.id === currentTimelineId);

        return {
            total: timeline.length,
            current: currentIndex + 1,
            hasNext: currentIndex < timeline.length - 1,
            hasPrevious: currentIndex > 0,
            progress: ((currentIndex + 1) / timeline.length) * 100
        };
    }, [timelineData, currentTimelineId]);

    // Get available data types across all timeline items
    const getAvailableDataTypes = useCallback(() => {
        if (!timelineData) return [];

        const allTypes = new Set();
        timelineData.timeline.forEach(item => {
            item.dataTypes.forEach(type => allTypes.add(type));
        });

        return Array.from(allTypes);
    }, [timelineData]);

    return {
        // Data
        timelineData,
        currentTimelineId,
        currentTimelineItem: getCurrentTimelineItem(),

        // State
        isLoading,
        error,

        // Navigation functions
        navigateToTimelineItem,
        navigateToNext,
        navigateToPrevious,

        // Helper functions
        getNextTimelineItem,
        getPreviousTimelineItem,
        getTimelineStats,
        getAvailableDataTypes,

        // Reload function
        reloadTimelineData: loadTimelineData
    };
};
