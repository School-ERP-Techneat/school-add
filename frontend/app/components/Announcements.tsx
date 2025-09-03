"use client";

import { motion } from "framer-motion";

const announcements = [
  {
    title: "Lorem ipsum dolor sit",
    date: "2025-01-01",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
    bg: "bg-lamaSkyLight",
  },
  {
    title: "Lorem ipsum dolor sit",
    date: "2025-01-01",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
    bg: "bg-lamaPurpleLight",
  },
  {
    title: "Lorem ipsum dolor sit",
    date: "2025-01-01",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatum, expedita. Rerum, quidem facilis?",
    bg: "bg-lamaYellowLight",
  },
];

const Announcements = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-900 p-4 rounded-md shadow-sm"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">📢 Announcements</h1>
        <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition">
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {announcements.map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className={`${item.bg} rounded-md p-4`}
          >
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-800 dark:text-gray-100">{item.title}</h2>
              <span className="text-xs text-gray-500 bg-white dark:bg-gray-800 rounded-md px-2 py-1">
                {item.date}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Announcements;
