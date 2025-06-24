import React from 'react';
import '../../styles/components/viewer/TimelineSimple.css';

const Timeline = ({
    timelineData,
    currentTimelineId,
    onTimelineChange
}) => {
    if (!timelineData || !timelineData.timeline) {
        return null;
    }

    const { timeline } = timelineData;

    // Sort timeline by date to ensure proper order
    const sortedTimeline = [...timeline].sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate positions based on actual dates
    const firstDate = new Date(sortedTimeline[0].date);
    const lastDate = new Date(sortedTimeline[sortedTimeline.length - 1].date);
    const totalTimespan = lastDate - firstDate;

    // Format date for display
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="timeline">
            <div className="timeline-container">
                <div className="timeline-line">
                    {sortedTimeline.map((item, index) => {
                        // Calculate position as percentage of total timeline
                        const itemDate = new Date(item.date);
                        const position = totalTimespan > 0
                            ? ((itemDate - firstDate) / totalTimespan) * 100
                            : (index / (sortedTimeline.length - 1)) * 100;

                        return (
                            <div
                                key={item.id}
                                className="timeline-item"
                                style={{ left: `${position}%` }}
                            >
                                <div className="timeline-date-label">
                                    {formatDate(item.date)}
                                </div>                                <div
                                    className={`timeline-point ${item.id === currentTimelineId ? 'active' : ''}`}
                                    onClick={() => {
                                        onTimelineChange(item);
                                    }}
                                    title={item.title}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Timeline;
