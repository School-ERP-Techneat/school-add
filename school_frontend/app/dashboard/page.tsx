"use client";

import React from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";

// ✅ export the type separately, not inline
export type DataTableProps = {
  headers: string[];
  rows: { id: string; row: string[] }[];
  schoolCode?: string;
  refreshData?: () => void;
  onDelete?: (adminId: string) => Promise<void>;
};

const DataTable = ({
  headers,
  rows,
  onDelete,
}: DataTableProps) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
        <thead className="bg-gradient-to-r from-teal-500 to-indigo-500 text-white">
          <tr>
            {headers.map((header, idx) => (
              <th
                key={idx}
                scope="col"
                className="px-6 py-3 text-left font-semibold tracking-wide"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800 bg-white dark:bg-gray-900">
          {rows.map((row) => (
            <motion.tr
              key={row.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              {row.row.map((cell, i) => (
                <td
                  key={i}
                  className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300"
                >
                  {cell}
                </td>
              ))}

              {onDelete && (
                <td className="px-6 py-4">
                  <button
                    onClick={() => onDelete(row.id)}
                    className="flex items-center gap-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 transition"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete
                  </button>
                </td>
              )}
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ✅ only export the component as default
export default DataTable;
