"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "react-calendar/dist/Calendar.css";

// Dynamically import Calendar to disable SSR
const Calendar = dynamic(() => import("react-calendar"), { ssr: false });

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "Team Meeting",
    time: "12:00 PM - 2:00 PM",
    description: "Discuss project milestones and next sprint planning.",
  },
  {
    id: 2,
    title: "Design Review",
    time: "3:00 PM - 4:00 PM",
    description: "Review UI/UX updates and animations for dashboard.",
  },
  {
    id: 3,
    title: "Client Call",
    time: "5:00 PM - 6:00 PM",
    description: "Sync with client on feedback and deployment timeline.",
  },
];

const EventCalendar = () => {
  const [value, setValue] = useState<Value | null>(null);

  useEffect(() => {
    setValue(new Date());
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 rounded-xl shadow-lg flex flex-col gap-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">📅 Events</h1>
        <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
          <Image src="/moreDark.png" alt="More options" width={20} height={20} />
        </motion.div>
      </div>

      {/* Calendar */}
      {value && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="rounded-md overflow-hidden [&_.react-calendar_*]:[text-decoration:none!important] [&_.react-calendar__tile_abbr]:[border-bottom:none!important]"
        >
          <Calendar onChange={setValue} value={value} />
        </motion.div>
      )}

      {/* Divider */}
      <div className="border-t border-gray-200 dark:border-gray-700" />

      {/* Events */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="flex flex-col gap-4"
      >
        {events.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`p-5 rounded-md border-2 border-gray-100 border-t-4 shadow-sm ${
              index % 2 === 0 ? "border-t-[#70D6FF]" : "border-t-[#FF9AA2]"
            } hover:scale-[1.01] transition-transform bg-white dark:bg-gray-800`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-gray-700 dark:text-gray-100">{event.title}</h2>
              <span className="text-gray-400 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">{event.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default EventCalendar;
