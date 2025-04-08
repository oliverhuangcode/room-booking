"use client";

import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import moment from 'moment';

interface BookingEvent {
  name: string;
  title: string;
  start: Date;
  end: Date;
}

interface BookingRow {
  "Name": string;
  "Room": string;
  "Start Time": string;
  "End Time": string;
  "Date": string; // Example "04/14/25"
}

export default function BookingCalendar() {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const API_URL =
    'https://script.google.com/macros/s/AKfycbxu4TBxTvr5hxof8vQ54yXc6sq7eqdaDw61JWjEsUPNTZoA5hqRL0_wldkokUa1pURntQ/exec';

  useEffect(() => {
    fetch(API_URL)
      .then(res => res.json())
      .then((data: BookingRow[]) => {
        // Transform each row into a FullCalendar event.
        const eventsData: BookingEvent[] = data.map((row) => {
          // Use moment to parse the booking date and combine it with the times.
          const bookingDate = moment(row["Date"], "MM/DD/YY", true);
          // We assume that the time fields are already display strings like "10:00 AM"
          const startTime = moment(row["Start Time"].trim(), "h:mm A", true);
          const endTime = moment(row["End Time"].trim(), "h:mm A", true);

          // Combine the booking date with the times.
          const startDate = bookingDate.clone().set({
            hour: startTime.hour(),
            minute: startTime.minute(),
            second: startTime.second()
          }).toDate();
          const endDate = bookingDate.clone().set({
            hour: endTime.hour(),
            minute: endTime.minute(),
            second: endTime.second()
          }).toDate();

          return {
            name: row["Name"],
            title: row["Room"],
            start: startDate,
            end: endDate
          };
        });
        setEvents(eventsData);
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Booking Calendar</h1>
      <FullCalendar
        plugins={[ dayGridPlugin, timeGridPlugin, interactionPlugin ]}
        initialView="timeGridWeek"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events.map(event => ({
          title: event.title,
          start: event.start,
          end: event.end
        }))}
        // Optional: restrict visible time on mobile if needed:
        slotMinTime="06:00:00"
        slotMaxTime="22:00:00"
        height="80vh"
        // You can add responsive options using custom CSS or FullCalendar's options.
      />
    </div>
  );
}
