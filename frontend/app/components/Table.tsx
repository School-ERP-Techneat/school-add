"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Column = {
  header: string;
  accessor: string;
  className?: string;
};

type TableProps<T> = {
  columns: Column[];
  renderRow: (item: T) => ReactNode;
  data: T[];
  emptyMessage?: string;
  keyExtractor?: (item: T, index: number) => string | number;
};

function Table<T>({
  columns,
  renderRow,
  data,
  emptyMessage = "No data available.",
  keyExtractor,
}: TableProps<T>) {
  return (
    <div
      className="w-full overflow-x-auto rounded-xl shadow-md bg-white dark:bg-gray-900 mt-4"
      role="table"
      aria-label="Data table"
    >
      <table className="min-w-full">
        <thead className="sticky top-0 bg-white dark:bg-gray-900 backdrop-blur-md z-10 shadow-sm">
          <tr className="text-left text-gray-500 dark:text-gray-400 text-sm">
            {columns.map((col) => (
              <th
                key={col.accessor}
                className={`py-3 px-4 font-medium ${col.className || ""}`}
                scope="col"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((item, index) => (
              <motion.tr
                key={keyExtractor ? keyExtractor(item, index) : index}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="border-b border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                role="row"
              >
                {renderRow(item)}
              </motion.tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-400 dark:text-gray-500"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
