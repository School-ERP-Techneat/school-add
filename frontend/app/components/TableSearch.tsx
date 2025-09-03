"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const TableSearch = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full md:w-auto flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 dark:ring-gray-700 px-3 py-2 bg-white dark:bg-gray-900 backdrop-blur-md shadow-sm transition"
    >
      <motion.div whileHover={{ scale: 1.1 }} className="cursor-pointer">
        <Image src="/search.png" alt="Search" width={14} height={14} />
      </motion.div>
      <input
        type="text"
        placeholder="Search..."
        className="w-[200px] bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      />
    </motion.div>
  );
};

export default TableSearch;
