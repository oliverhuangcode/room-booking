// components/CustomEvent.tsx
"use client";
import React from 'react';
import moment from 'moment';

interface CustomEventProps {
  event: {
    title: string;
    start: Date;
    end: Date;
  };
}

const CustomEvent: React.FC<CustomEventProps> = ({ event }) => {
  return (
    <div style={{ padding: '4px' }}>
      {/* Title on top */}
      <div style={{ fontWeight: 'bold' }}>{event.title}</div>
      {/* Time below */}
      <div style={{ fontSize: '0.8em' }}>
        {moment(event.start).format("h:mm A")} - {moment(event.end).format("h:mm A")}
      </div>
    </div>
  );
};

export default CustomEvent;
