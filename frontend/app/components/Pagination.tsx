"use client";

import { motion } from "framer-motion";

const Pagination = () => {
  const pages = [1, 2, 3, "...", 10];
  const currentPage = 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 flex items-center justify-between text-gray-500 dark:text-gray-400"
    >
      {/* Prev Button */}
      <motion.button
        disabled
        whileTap={{ scale: 0.95 }}
        className="py-2 px-4 rounded-md bg-slate-200 dark:bg-gray-800 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        Prev
      </motion.button>

      {/* Page Numbers */}
      <div className="flex items-center gap-2 text-sm">
        {pages.map((page, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-3 py-[6px] rounded-md transition font-medium ${
              page === currentPage
                ? "bg-gradient-to-r from-[#70D6FF] to-[#C3EBFA] text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300"
            }`}
          >
            {page}
          </motion.button>
        ))}
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="py-2 px-4 rounded-md bg-slate-200 dark:bg-gray-800 text-xs font-semibold transition"
      >
        Next
      </motion.button>
    </motion.div>
  );
};

export default Pagination;
