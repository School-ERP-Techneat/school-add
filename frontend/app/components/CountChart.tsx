"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Cell,
} from "recharts";

// 🎨 Data with expressive colors
const rawData = [
  { name: "Girls", count: 53, fill: "#FF9AA2" }, // Coral
  { name: "Boys", count: 53, fill: "#70D6FF" }, // Aqua
];

const total = rawData.reduce((sum, d) => sum + d.count, 0);

const chartData = [
  { name: "Total", count: total, fill: "#E5E7EB" }, // Soft gray
  ...rawData,
];

const CountChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="bg-gradient-to-br from-[#fdfbfb] via-[#ebedee] to-[#dfe4ea] dark:from-[#1e1e2f] dark:via-[#2a2a3d] dark:to-[#3a3a4f] rounded-xl w-full h-full p-4 shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          🧮 Student Count
        </h1>
        <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
          <Image src="/moreDark.png" alt="More" width={20} height={20} />
        </motion.div>
      </div>

      {/* Chart */}
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            innerRadius="40%"
            outerRadius="100%"
            barSize={32}
            data={chartData}
          >
            <RadialBar
              background
              dataKey="count"
              cornerRadius={10}
              isAnimationActive={true}
            >
              {chartData.map((entry, index) => (
                <motion.div
                  key={`cell-${index}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.2 }}
                >
                  <Cell fill={entry.fill} />
                </motion.div>
              ))}
            </RadialBar>
          </RadialBarChart>
        </ResponsiveContainer>

        {/* Center Icon with glow ring */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-[#FF9AA2] dark:border-[#70D6FF] rounded-full p-1"
        >
          <Image src="/maleFemale.png" alt="Icon" width={50} height={50} />
        </motion.div>
      </div>

      {/* Legend */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="flex justify-center gap-16 mt-4"
      >
        {rawData.map((group, i) => {
          const percent = Math.round((group.count / total) * 100);
          const badgeColor = group.name === "Boys" ? "#70D6FF" : "#FF9AA2";
          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="w-5 h-5 rounded-full"
                style={{ backgroundColor: badgeColor }}
              />
              <h1 className="font-bold text-gray-800 dark:text-gray-100">
                {group.count}
              </h1>
              <h2 className="text-xs text-gray-500 dark:text-gray-400">
                {group.name} ({percent}%)
              </h2>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default CountChart;
