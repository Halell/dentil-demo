import { forwardRef } from 'react';
import { APP_CONFIG } from '../../constants/app';
import '../../styles/components/viewer/XrayImage.css';

const XrayImage = forwardRef(({
  imagePath, // Now accepts dynamic image path
  onLoad,
  onRightClick,
  onClick,
  className = ''
}, ref) => {
  // Use provided image path or fallback to default
  const imageUrl = imagePath || APP_CONFIG.DEFAULT_IMAGE_PATH;
  
  return (
    <img
      ref={ref}
      src={imageUrl}
      alt="Panoramic X-ray"
      className={`xray-image ${className}`}
      onLoad={onLoad}
      onContextMenu={onRightClick}
      onClick={onClick}
    />
  );
});

XrayImage.displayName = 'XrayImage';

export default XrayImage;
