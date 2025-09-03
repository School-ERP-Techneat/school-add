"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"; // ✅ Removed invalid imports

const data = [
  { name: "Jan", income: 4000, expense: 2400 },
  { name: "Feb", income: 3000, expense: 1398 },
  { name: "Mar", income: 2000, expense: 9800 },
  { name: "Apr", income: 2780, expense: 3908 },
  { name: "May", income: 1890, expense: 4800 },
  { name: "Jun", income: 2390, expense: 3800 },
  { name: "Jul", income: 3490, expense: 4300 },
  { name: "Aug", income: 3490, expense: 4300 },
  { name: "Sep", income: 3490, expense: 4300 },
  { name: "Oct", income: 3490, expense: 4300 },
  { name: "Nov", income: 3490, expense: 4300 },
  { name: "Dec", income: 3490, expense: 4300 },
];

const FinanceChart = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 rounded-xl w-full h-full p-4 shadow-lg"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">
          💰 Finance Overview
        </h1>
        <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
          <Image src="/moreDark.png" alt="More" width={20} height={20} />
        </motion.div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height="90%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          {/* ✅ Native SVG gradient definitions */}
          <defs>
            <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#70D6FF" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#C3EBFA" stopOpacity={0.8} />
            </linearGradient>
            <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF9AA2" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#CFCEFF" stopOpacity={0.8} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
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
              `₹${value.toLocaleString()}`,
              name === "income" ? "📈 Income" : "📉 Expense",
            ]}
          />
          <Legend
            align="center"
            verticalAlign="top"
            wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px", fontSize: "13px" }}
          />
          <Line
            type="monotone"
            dataKey="income"
            stroke="url(#incomeGradient)"
            strokeWidth={4}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
          <Line
            type="monotone"
            dataKey="expense"
            stroke="url(#expenseGradient)"
            strokeWidth={4}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
            isAnimationActive={true}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default FinanceChart;
