"use client";

import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Image from "next/image";

const SmartMetricCard = () => {
  const [value, setValue] = useState(0);
  const controls = useAnimation();

  useEffect(() => {
    const target = 1248;
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 50);
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setValue(current);
    }, 50);
  }, []);

  useEffect(() => {
    controls.start({
      scale: [1, 1.05, 1],
      transition: { repeat: Infinity, duration: 2 },
    });
  }, [controls]);

  const percent = Math.min(100, Math.round((value / 1500) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 backdrop-blur-md p-6 rounded-xl shadow-xl w-full max-w-md"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          👥 Active Users
        </h2>
        <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
          <Image src="/moreDark.png" alt="More" width={20} height={20} />
        </motion.div>
      </div>

      {/* Count + Icon */}
      <div className="flex items-center justify-between">
        <motion.div animate={controls}>
          <p className="text-4xl font-extrabold text-blue-500 dark:text-blue-300">
            {value.toLocaleString()}
          </p>
        </motion.div>
        <motion.div
          whileHover={{ rotate: 10, scale: 1.1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center shadow-md"
        >
          <Image src="/userIcon.png" alt="User" width={24} height={24} />
        </motion.div>
      </div>

      {/* Radial Progress Ring */}
      <div className="relative w-24 h-24 mx-auto mt-6">
        <svg className="w-full h-full">
          <circle
            cx="50%"
            cy="50%"
            r="40"
            stroke="#e5e7eb"
            strokeWidth="8"
            fill="none"
          />
          <motion.circle
            cx="50%"
            cy="50%"
            r="40"
            stroke="#70D6FF"
            strokeWidth="8"
            strokeDasharray="251"
            strokeDashoffset={251 - (251 * percent) / 100}
            strokeLinecap="round"
            fill="none"
            initial={{ strokeDashoffset: 251 }}
            animate={{ strokeDashoffset: 251 - (251 * percent) / 100 }}
            transition={{ duration: 1 }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {percent}%
          </span>
        </div>
      </div>

      {/* Footer */}
      <p className="mt-4 text-xs text-center text-gray-500 dark:text-gray-400">
        Based on current server activity
      </p>
    </motion.div>
  );
};

export default SmartMetricCard;
