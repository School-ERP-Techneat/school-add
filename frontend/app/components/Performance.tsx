"use client";

import Image from "next/image";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Group A", value: 92, fill: "#70D6FF" },
  { name: "Group B", value: 8, fill: "#FF9AA2" },
];

const Performance = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 rounded-xl h-[450px] shadow-lg flex flex-col justify-between"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">📊 Performance</h1>
        <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
          <Image src="/moreDark.png" alt="More" width={16} height={16} />
        </motion.div>
      </div>

      {/* Chart + Score */}
      <div className="flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              dataKey="value"
              startAngle={180}
              endAngle={0}
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={100}
              paddingAngle={2}
              isAnimationActive={true}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        {/* Score Text */}
        <div className="absolute text-center">
          <motion.h1
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-3xl font-bold text-blue-500 dark:text-blue-300"
          >
            9.2
          </motion.h1>
          <p className="text-xs text-gray-400 dark:text-gray-500">of 10 max LTS</p>
        </div>
      </div>

      {/* Footer Label */}
      <h2 className="text-sm font-medium text-center text-gray-700 dark:text-gray-300 mt-2">
        1st Semester → 2nd Semester
      </h2>
    </motion.div>
  );
};

export default Performance;
