"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const UserCard = ({ type }: { type: string }) => {
  const [count, setCount] = useState(0);
  const target = 1234;

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 50);
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      setCount(current);
    }, 30);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="rounded-2xl p-4 flex-1 min-w-[130px] bg-gradient-to-br from-[#FAE27C] via-white to-[#C3EBFA] dark:from-[#3a3a4f] dark:via-[#2a2a3d] dark:to-[#1e1e2f] shadow-md transition"
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-[10px] bg-white dark:bg-gray-800 px-2 py-1 rounded-full text-green-600 dark:text-green-400 font-semibold shadow-sm">
          2024/25
        </span>
        <motion.div whileHover={{ scale: 1.2 }} className="cursor-pointer">
          <Image src="/more.png" alt="More" width={20} height={20} />
        </motion.div>
      </div>
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-2xl font-bold text-gray-800 dark:text-white my-4"
      >
        {count.toLocaleString()}
      </motion.h1>
      <h2 className="capitalize text-sm font-medium text-gray-500 dark:text-gray-400">
        {type}s
      </h2>
    </motion.div>
  );
};

export default UserCard;
