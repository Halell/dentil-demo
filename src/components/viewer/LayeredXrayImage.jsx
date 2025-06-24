import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import '../../styles/components/viewer/LayeredXrayImage.css';

/**
 * Layered X-ray Image Component
 * Stacks all images behind each other and brings the active one forward
 */
const LayeredXrayImage = forwardRef(({
  timelineData,
  currentTimelineId,
  onLoad,
  onRightClick,
  onClick,
  className = ''
}, ref) => {
  const [loadedImages, setLoadedImages] = useState(new Set());
  
  const containerRef = useRef(null);
  
  // Get all timeline images
  const timelineImages = timelineData?.timeline?.filter(item => item.imageUrl) || [];
  
  // If no currentTimelineId is set, default to the first image
  const effectiveTimelineId = currentTimelineId || (timelineImages.length > 0 ? timelineImages[0].id : null);
  // Expose active image reference to parent
  useImperativeHandle(ref, () => containerRef.current?.querySelector(`[data-timeline-id="${effectiveTimelineId}"]`));
  // Track image loading
  const handleImageLoad = (imageId) => {
    setLoadedImages(prev => new Set([...prev, imageId]));
    
    // Call onLoad when any image loads (for compatibility)
    if (onLoad) {
      onLoad();
    }
  };

  const handleImageError = (imageId) => {
    console.error(`❌ Image failed to load: ${imageId}`);
  };

  useEffect(() => {
    if (timelineImages.length > 0 && onLoad) {
      onLoad();
    }
  }, [timelineImages.length, onLoad]);

  const handleClick = (event) => {
    if (onClick) onClick(event);
  };

  const handleRightClick = (event) => {
    if (onRightClick) onRightClick(event);
  };

  if (timelineImages.length === 0) {
    return (
      <div className={`layered-xray-container ${className}`}>
        <div className="no-images">No images available</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`layered-xray-container ${className}`}
      onClick={handleClick}
      onContextMenu={handleRightClick}
    >      {/* Render ALL images stacked on top of each other */}
      {timelineImages.map((timelineItem, index) => {
        const isActive = timelineItem.id === effectiveTimelineId;
        const isFirst = index === 0;
        
        return (
          <img
            key={timelineItem.id}
            data-timeline-id={timelineItem.id}
            src={timelineItem.imageUrl}
            alt={`X-ray from ${timelineItem.date}`}
            className={`layered-xray-image ${isActive ? 'active' : 'inactive'}`}
            style={{
              opacity: isActive ? 1 : 0,
              zIndex: isActive ? 10 : 1,
              visibility: isActive ? 'visible' : 'hidden',
              position: isFirst ? 'relative' : 'absolute',
            }}
            draggable={false}            onLoad={() => handleImageLoad(timelineItem.id)}
            onError={() => handleImageError(timelineItem.id)}
          />
        );
      })}
    </div>
  );
});

LayeredXrayImage.displayName = 'LayeredXrayImage';

export default LayeredXrayImage;
