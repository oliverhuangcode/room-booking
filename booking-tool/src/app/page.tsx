"use client";

import { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import CustomEvent from "./components/CustomEvent";
import Spinner from "./components/Spinner";

interface BookingEvent {
  name: string;
  title: string;
  start: Date;
  end: Date;
}

interface BookingRow {
  Name: string;
  Room: string;
  "Start Time": string;
  "End Time": string;
  Date: string; // Formatted as "MM/dd/yy", e.g. "04/14/25"
}

const localizer = momentLocalizer(moment);

export default function BookingCalendar() {
  const [events, setEvents] = useState<BookingEvent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_URL =
    "https://script.google.com/macros/s/AKfycbxu4TBxTvr5hxof8vQ54yXc6sq7eqdaDw61JWjEsUPNTZoA5hqRL0_wldkokUa1pURntQ/exec";


  useEffect(() => {
    setIsLoading(true);
    fetch(API_URL)
      .then((res) => res.json())
      .then((data: BookingRow[]) => {
        // console.log("Fetched data: ", data)
        const eventsData: BookingEvent[] = data.map((row: BookingRow) => {
          // Parse the booking date from the "Date" column.
          const bookingDate = moment(row["Date"]);
          // Parse the start and end times. (Assuming they are formatted like "6:00:00 PM")
          const startString = moment(row["Start Time"]).format("h:mm A");
          const endString = moment(row["End Time"]).format("h:mm A");
          const startTime = moment(startString, "hh:mm A");
          const endTime = moment(endString, "hh:mm A");

          // Combine the booking date with the start time.
          const startDate = bookingDate
            .clone()
            .set({
              hour: startTime.hour(),
              minute: startTime.minute(),
              second: startTime.second(),
            })
            .toDate();

          // Combine the booking date with the end time.
          const endDate = bookingDate
            .clone()
            .set({
              hour: endTime.hour(),
              minute: endTime.minute(),
              second: endTime.second(),
            })
            .toDate();
          // console.log(startDate, endDate)

          return {
            name: row["Name"],
            title: row["Room"],
            start: startDate,
            end: endDate,
          };
        });
        setEvents(eventsData);
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const eventStyleGetter = (
  ): { style: React.CSSProperties } => {
    return {
      style: {
        backgroundColor: "#5292df",
        borderRadius: "5px",
        color: "white",
        border: "0px",
      },
    };
  };

  // const formats = {
  //   timeGutterFormat: (date: Date, culture: any, localizer: any) => {
  //     return moment(date).format("h A");
  //   },
  // };

  if (isLoading) return <Spinner />;

  return (
    <div style={{ height: "100vh", padding: "40px" }}>
      <h1>Booking Calendar</h1>
      <div className="height500">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView={"week"}
          views={["week", "day"]}
          step={30}
          style={{ height: "80vh" }}
          eventPropGetter={eventStyleGetter}
          min={new Date(1970, 0, 1, 6, 0, 0)}
          max={new Date(1970, 0, 1, 22, 0, 0)}
          components={{ event: CustomEvent }}
        />
      </div>
    </div>
  );
}
