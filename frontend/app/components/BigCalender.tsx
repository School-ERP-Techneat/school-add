"use client";

import { useState } from "react";
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";
import { calendarEvents } from "@/lib/data";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { motion } from "framer-motion";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  const [view, setView] = useState<View>(Views.WORK_WEEK);

  const handleOnChangeView = (selectedView: View) => {
    setView(selectedView);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl shadow-lg p-4"
    >
      {/* Custom Toolbar */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          🗓️ Weekly Schedule
        </h1>
        <div className="flex gap-2 text-sm">
          <button
            onClick={() => setView(Views.WORK_WEEK)}
            className={`px-3 py-1 rounded-md ${
              view === Views.WORK_WEEK
                ? "bg-lamaSkyLight text-gray-800 font-semibold"
                : "bg-white dark:bg-gray-800 text-gray-500"
            } hover:scale-[1.03] transition`}
          >
            Work Week
          </button>
          <button
            onClick={() => setView(Views.DAY)}
            className={`px-3 py-1 rounded-md ${
              view === Views.DAY
                ? "bg-lamaPurpleLight text-gray-800 font-semibold"
                : "bg-white dark:bg-gray-800 text-gray-500"
            } hover:scale-[1.03] transition`}
          >
            Day View
          </button>
        </div>
      </div>

      {/* Calendar */}
      <Calendar
        localizer={localizer}
        events={calendarEvents}
        startAccessor="start"
        endAccessor="end"
        views={["work_week", "day"]}
        view={view}
        onView={handleOnChangeView}
        style={{ height: "90%" }}
        min={new Date(2025, 1, 0, 8, 0, 0)}
        max={new Date(2025, 1, 0, 17, 0, 0)}
        eventPropGetter={() => ({
          style: {
            backgroundColor: "#FAE27C",
            borderRadius: "6px",
            color: "#1F2937",
            border: "none",
            padding: "4px 8px",
            fontSize: "13px",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          },
        })}
        tooltipAccessor={(event) => `📌 ${event.title}`}
      />
    </motion.div>
  );
};

export default BigCalendar;
