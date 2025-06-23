import { forwardRef } from 'react';
import { APP_CONFIG } from '../../constants/app';
import '../../styles/components/viewer/XrayImage.css';

const XrayImage = forwardRef(({
  onLoad,
  onRightClick,
  onClick,
  className = ''
}, ref) => {
  return (
    <img
      ref={ref}
      src={APP_CONFIG.IMAGE_PATH}
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
