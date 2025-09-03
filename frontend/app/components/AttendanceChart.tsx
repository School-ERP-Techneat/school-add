"use client";

import Image from "next/image";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";

const data = [
  { name: "Mon", present: 60, absent: 40 },
  { name: "Tue", present: 70, absent: 60 },
  { name: "Wed", present: 90, absent: 75 },
  { name: "Thu", present: 90, absent: 75 },
  { name: "Fri", present: 65, absent: 55 },
];

const AttendanceChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-gray-900 rounded-xl p-4 h-full shadow-md flex flex-col"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          📅 Weekly Attendance
        </h1>
        <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
          <Image src="/moreDark.png" alt="More" width={20} height={20} />
        </motion.div>
      </div>

      {/* Chart */}
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis
              dataKey="name"
              axisLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              axisLine={false}
              tick={{ fill: "#9ca3af", fontSize: 12 }}
              tickLine={false}
              tickMargin={20}
            />
            <Tooltip
              contentStyle={{
                borderRadius: "10px",
                borderColor: "#e5e7eb",
                backgroundColor: "#fff",
                fontSize: "13px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              labelStyle={{ fontWeight: "bold", color: "#374151" }}
              formatter={(value: number, name: string) => [
                `${value}%`,
                name === "present" ? "✅ Present" : "❌ Absent",
              ]}
              labelFormatter={(label) => `📅 ${label}`}
            />
            <Legend
              align="left"
              verticalAlign="top"
              wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px", fontSize: "13px" }}
            />
            <Bar dataKey="present" radius={[10, 10, 0, 0]} legendType="circle">
              {data.map((entry, index) => (
                <Cell
                  key={`present-${index}`}
                  fill={entry.present > 80 ? "#34D399" : entry.present > 60 ? "#FBBF24" : "#F87171"}
                />
              ))}
            </Bar>
            <Bar dataKey="absent" radius={[10, 10, 0, 0]} legendType="circle">
              {data.map((entry, index) => (
                <Cell
                  key={`absent-${index}`}
                  fill={entry.absent > 70 ? "#F87171" : entry.absent > 50 ? "#FBBF24" : "#60A5FA"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default AttendanceChart;
