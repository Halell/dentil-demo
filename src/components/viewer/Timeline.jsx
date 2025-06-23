import React, { useState, useEffect } from 'react';
import '../../styles/components/viewer/Timeline.css';

const Timeline = ({ 
  timelineData, 
  currentTimelineId, 
  onTimelineChange,
  className = ''
}) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!timelineData || !timelineData.timeline) {
    return null;
  }

  const { timeline } = timelineData;
  const currentIndex = timeline.findIndex(item => item.id === currentTimelineId);

  const handleTimelineClick = async (item) => {
    if (item.id === currentTimelineId) return;
    
    setIsLoading(true);
    try {
      await onTimelineChange(item);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getDataTypeIcons = (dataTypes) => {
    const iconMap = {
      'xray': '🦷',
      '3d-model': '🏗️',
      'notes': '📝',
      'treatment-plan': '📋',
      'healing-progress': '🔄'
    };
    
    return dataTypes.map(type => iconMap[type] || '📄').join(' ');
  };

  const getTreatmentColor = (treatmentType) => {
    const colorMap = {
      'consultation': '#4A90E2',
      'routine-checkup': '#50C878',
      'pre-surgical': '#FF6B6B',
      'post-surgical': '#FFB347',
      'annual-review': '#9B59B6'
    };
    
    return colorMap[treatmentType] || '#6C757D';
  };

  return (
    <div className={`timeline-container ${className}`}>
      <div className="timeline-header">
        <h3>Patient Timeline</h3>
        {timelineData.patientInfo && (
          <div className="patient-info">
            <span>{timelineData.patientInfo.name}</span>
            <span className="patient-id">ID: {timelineData.patientInfo.id}</span>
          </div>
        )}
      </div>
      
      <div className="timeline-wrapper">
        <div className="timeline-line" />
        
        <div className="timeline-items">
          {timeline.map((item, index) => (
            <div
              key={item.id}
              className={`timeline-item ${item.id === currentTimelineId ? 'current' : ''} ${isLoading ? 'loading' : ''}`}
              style={{ '--timeline-color': getTreatmentColor(item.treatmentType) }}
              onMouseEnter={() => setHoveredItem(item)}
              onMouseLeave={() => setHoveredItem(null)}
              onClick={() => handleTimelineClick(item)}
            >
              <div className="timeline-marker">
                <div className="timeline-dot" />
                <div className="timeline-connector" />
              </div>
              
              <div className="timeline-content">
                <div className="timeline-date">
                  {formatDate(item.date)}
                </div>
                <div className="timeline-title">
                  {item.title}
                </div>
                <div className="timeline-data-types">
                  {getDataTypeIcons(item.dataTypes)}
                </div>
              </div>
              
              {hoveredItem?.id === item.id && (
                <div className="timeline-tooltip">
                  <div className="tooltip-header">
                    <strong>{item.title}</strong>
                    <span className="tooltip-date">{formatDate(item.date)}</span>
                  </div>
                  <div className="tooltip-description">
                    {item.description}
                  </div>
                  <div className="tooltip-details">
                    <div className="tooltip-dentist">
                      <strong>Dentist:</strong> {item.dentist}
                    </div>
                    <div className="tooltip-data-types">
                      <strong>Available Data:</strong> {item.dataTypes.join(', ')}
                    </div>
                    {item.notes && (
                      <div className="tooltip-notes">
                        <strong>Notes:</strong> {item.notes}
                      </div>
                    )}
                  </div>
                  <div className="tooltip-arrow" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {currentIndex >= 0 && (
          <div 
            className="timeline-progress"
            style={{ 
              width: `${((currentIndex + 1) / timeline.length) * 100}%` 
            }}
          />
        )}
      </div>
      
      <div className="timeline-legend">
        <div className="legend-item">
          <span className="legend-dot consultation" />
          <span>Consultation</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot routine-checkup" />
          <span>Routine</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot pre-surgical" />
          <span>Pre-surgical</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot post-surgical" />
          <span>Post-surgical</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot annual-review" />
          <span>Annual Review</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
