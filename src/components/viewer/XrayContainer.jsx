import { useState, useRef, useEffect } from 'react';
import { useImageToothData } from '../../hooks/useImageToothData';
import { useTimelineData } from '../../hooks/useTimelineData';
import { exportToothData, createToothArea, isUpperTooth } from '../../utils/toothUtils';
import { APP_CONFIG } from '../../constants/app';

import Timeline from './TimelineSimple';
import LayeredXrayImage from './LayeredXrayImage';
import SvgOverlay from './SvgOverlay';
import ToothTooltip from './ToothTooltip';
import ContextMenu from '../common/ContextMenu';
import ToothModal from '../common/ToothModal';
import ToothInfoModal from '../common/ToothInfoModal';
import EditControls from '../editor/EditControls';

import '../../styles/components/viewer/XrayContainer.css';

const XrayContainer = () => {  // Timeline management
  const {
    timelineData,
    currentTimelineId,
    currentTimelineItem,
    isLoading: isTimelineLoading,
    navigateToTimelineItem
  } = useTimelineData();

  // Data management - load tooth areas from timeline data
  const { toothAreas, isLoading: isToothLoading, addToothArea, updateToothArea } = useImageToothData(currentTimelineId);

  // UI state
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isEditingTooth, setIsEditingTooth] = useState(false);
  const [editingToothId, setEditingToothId] = useState(null);
  const [currentToothPoints, setCurrentToothPoints] = useState([]);
  const [hoveredPointIndex, setHoveredPointIndex] = useState(null);

  // Context menu state
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });  // Modal state
  const [showToothModal, setShowToothModal] = useState(false);
  const [showToothInfoModal, setShowToothInfoModal] = useState(false);
  const [selectedTooth, setSelectedTooth] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  // Tooltip state
  const [tooltip, setTooltip] = useState({
    show: false,
    x: 0,
    y: 0,
    content: '',
    isUpperTooth: false
  });

  // SVG dimensions
  const [svgDimensions, setSvgDimensions] = useState({ width: 0, height: 0 });

  // Refs
  const imageRef = useRef(null);
  const svgRef = useRef(null);

  // Update SVG dimensions when image loads or window resizes
  useEffect(() => {
    const updateSvgDimensions = () => {
      if (imageRef.current) {
        const newDimensions = {
          width: imageRef.current.offsetWidth,
          height: imageRef.current.offsetHeight
        };
        setSvgDimensions(newDimensions);
      }
    };

    updateSvgDimensions();
    window.addEventListener('resize', updateSvgDimensions);
    return () => window.removeEventListener('resize', updateSvgDimensions);
  }, [imageLoaded]);

  // Handle Escape key to cancel editing
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && isEditingTooth) {
        resetEditingState();
        console.log('Editing cancelled with Escape key');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isEditingTooth]);

  // Event handlers
  const handleImageLoad = () => {
    setImageLoaded(true);
  }; const handleImageRightClick = (event) => {
    event.preventDefault();

    // Don't show context menu if already editing a tooth
    if (isEditingTooth && editingToothId) {
      return;
    }

    const pos = { x: event.clientX, y: event.clientY };
    setContextMenuPos(pos);
    setShowContextMenu(true);
  };
  const handleClickOutside = (event) => {
    // Don't close if clicking on context menu
    if (event.target.closest('.context-menu')) {
      return;
    }
    setShowContextMenu(false);
    setTooltip({ show: false, x: 0, y: 0, content: '' });
  };
  const handleImageClick = (event) => {
    // Only handle clicks when creating a new tooth (not editing existing)
    if (!isEditingTooth || editingToothId !== null) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setCurrentToothPoints(prev => [...prev, { x, y }]);
  }; const startToothEditing = () => {
    // This starts creating a new tooth (not editing existing)
    setIsEditingTooth(true);
    setEditingToothId(null); // null means creating new
    setCurrentToothPoints([]);
    setShowContextMenu(false);
  };
  const finishToothEditing = () => {
    // Only allow finishing when creating new tooth
    if (editingToothId !== null) {
      // Finish editing existing tooth
      resetEditingState();
      return;
    }

    // Finish creating new tooth
    if (currentToothPoints.length < APP_CONFIG.MIN_TOOTH_POINTS) {
      alert('Please click at least 3 points to define a tooth area');
      return;
    }
    setShowToothModal(true);
  };

  const saveToothWithNote = (note) => {
    const newTooth = createToothArea(currentToothPoints, note);
    addToothArea(newTooth);
    resetEditingState();
  };

  const cancelToothEditing = () => {
    resetEditingState();
  }; const resetEditingState = () => {
    setIsEditingTooth(false);
    setEditingToothId(null);
    setCurrentToothPoints([]);
    setHoveredPointIndex(null);
    setShowToothModal(false);
  };
  const closeToothInfoModal = () => {
    setShowToothInfoModal(false);
    setSelectedTooth(null);
    setModalPosition({ x: 0, y: 0 });
  };

  const handleExportData = () => {
    exportToothData(toothAreas);
  };
  const handleToothHover = (tooth, center) => {
    const toothIsUpper = isUpperTooth(center, svgDimensions.height);

    setTooltip({
      show: true,
      x: center.x,
      y: center.y,
      content: tooth.note || `Tooth ${tooth.id}`,
      isUpperTooth: toothIsUpper
    });
  };

  const handleToothLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: '' });
  }; const handleToothClick = (tooth, event) => {
    if (!isEditingTooth) {
      // Capture click position for modal positioning
      const clickPos = { x: event.clientX, y: event.clientY };
      setModalPosition(clickPos);

      // Show tooth information modal
      setSelectedTooth(tooth);
      setShowToothInfoModal(true);
    } else {
      // Start editing this tooth
      setEditingToothId(tooth.id);
      setIsEditingTooth(true);
      console.log('Started editing tooth:', tooth.note || tooth.id);
    }
  };

  // Handle adding new point to existing tooth
  const handleAddPoint = (toothId, insertIndex, newPoint) => {
    const tooth = toothAreas.find(t => t.id === toothId);
    if (!tooth) return;

    const updatedPoints = [...tooth.points];
    updatedPoints.splice(insertIndex, 0, newPoint);

    updateToothArea(toothId, { points: updatedPoints });
    console.log('Added point to tooth:', toothId, 'at index:', insertIndex);
  };

  // Handle deleting point from existing tooth
  const handleDeletePoint = (toothId, pointIndex) => {
    const tooth = toothAreas.find(t => t.id === toothId);
    if (!tooth || tooth.points.length <= 3) {
      alert('Cannot delete point. Minimum 3 points required.');
      return;
    }

    const updatedPoints = tooth.points.filter((_, index) => index !== pointIndex);
    updateToothArea(toothId, { points: updatedPoints });
    setHoveredPointIndex(null);
    console.log('Deleted point from tooth:', toothId, 'at index:', pointIndex);
  };
  // Handle point hover for deletion
  const handlePointHover = (index) => {
    setHoveredPointIndex(index);
  };  // Handle timeline navigation
  const handleTimelineChange = (timelineItem) => {
    navigateToTimelineItem(timelineItem);
  };

  // Show content immediately without loading states
  return (
    <div
      className="xray-container"
      onClick={handleClickOutside}
      onContextMenu={handleImageRightClick}
    >      {/* Timeline Component */}
      <Timeline
        timelineData={timelineData}
        currentTimelineId={currentTimelineId}
        onTimelineChange={handleTimelineChange}
      />      <div className="xray-image-container">        <LayeredXrayImage
          ref={imageRef}
          timelineData={timelineData}
          currentTimelineId={currentTimelineId}
          onLoad={handleImageLoad}
          onRightClick={handleImageRightClick}
          onClick={handleImageClick}
        />
        {imageLoaded && (
          <SvgOverlay
            ref={svgRef}
            dimensions={svgDimensions}
            toothAreas={toothAreas}
            isEditingTooth={isEditingTooth}
            editingToothId={editingToothId}
            currentToothPoints={currentToothPoints}
            hoveredPointIndex={hoveredPointIndex}
            onToothHover={handleToothHover}
            onToothLeave={handleToothLeave}
            onToothClick={handleToothClick}
            onAddPoint={handleAddPoint}
            onDeletePoint={handleDeletePoint}
            onPointHover={handlePointHover}
          />
        )}

        <ToothTooltip
          isVisible={tooltip.show}
          position={{ x: tooltip.x, y: tooltip.y }}
          content={tooltip.content}
          isUpperTooth={tooltip.isUpperTooth}
        />

        <ContextMenu
          isVisible={showContextMenu}
          position={contextMenuPos}
          onAddTooth={startToothEditing}
          onClose={() => setShowContextMenu(false)}
        />

        {isEditingTooth && (
          <EditControls
            onFinish={finishToothEditing}
            onExport={handleExportData}
            onCancel={cancelToothEditing}
          />
        )}
      </div>      <ToothModal
        isVisible={showToothModal}
        onSave={saveToothWithNote}
        onCancel={cancelToothEditing}
      />      <ToothInfoModal
        isVisible={showToothInfoModal}
        tooth={selectedTooth}
        position={modalPosition}
        onClose={closeToothInfoModal}
      />
    </div>
  );
};

export default XrayContainer;
