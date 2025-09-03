"use client";

import { motion, easeOut } from "framer-motion";
import Image from "next/image";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import TableSearch from "@/app/components/TableSearch";
import { resultsData, role } from "@/lib/data";

type Result = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  student: string;
  type: "exam" | "assignment";
  date: string;
  score: number;
};

const columns = [
  { header: "Subject Name", accessor: "subject" },
  { header: "Student", accessor: "student" },
  { header: "Score", accessor: "score", className: "hidden md:table-cell" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Class", accessor: "class", className: "hidden md:table-cell" },
  { header: "Date", accessor: "date", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

// ✅ Type Guard
const isValidType = (type: string): type is "exam" | "assignment" =>
  type === "exam" || type === "assignment";

// ✅ Sanitized Data
const safeResults: Result[] = resultsData
  .filter((r) => isValidType(r.type))
  .map((r) => ({ ...r, type: r.type as "exam" | "assignment" }));

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOut, staggerChildren: 0.1 },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const ScoreBadge = ({ score }: { score: number }) => {
  const base = "px-2 py-1 text-xs rounded-full font-semibold shadow-sm";
  const color =
    score >= 90 ? "bg-green-600" :
    score >= 75 ? "bg-blue-500" :
    score >= 50 ? "bg-yellow-500" : "bg-red-500";
  const label =
    score >= 90 ? "Excellent" :
    score >= 75 ? "Good" :
    score >= 50 ? "Average" : "Low";
  return <span className={`${base} ${color} text-white`}>{label}</span>;
};

const TypeTag = ({ type }: { type: "exam" | "assignment" }) => (
  <span className="px-2 py-1 text-xs rounded-full bg-purple-600 text-white font-semibold shadow-sm">
    {type}
  </span>
);

const ResultListPage = () => {
  const renderRow = (item: Result) => (
    <motion.tr
      key={item.id}
      variants={rowVariants}
      whileHover={{ scale: 1.015 }}
      className="group border-b border-gray-200 dark:border-gray-700 hover:bg-purple-50 dark:hover:bg-gray-800 transition"
    >
      <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
        {item.subject}
        <TypeTag type={item.type} />
      </td>
      <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{item.student}</td>
      <td className="p-4 text-sm hidden md:table-cell text-gray-700 dark:text-gray-300 flex items-center gap-2">
        {item.score}
        <ScoreBadge score={item.score} />
      </td>
      <td className="p-4 text-sm hidden md:table-cell text-gray-700 dark:text-gray-300">{item.teacher}</td>
      <td className="p-4 text-sm hidden md:table-cell text-gray-700 dark:text-gray-300">{item.class}</td>
      <td className="p-4 text-sm hidden md:table-cell text-gray-700 dark:text-gray-300">{item.date}</td>
      <td className="p-4 text-sm">
        <div className="flex items-center gap-2">
          {(role === "admin" || role === "teacher") && (
            <>
              <FormModal table="result" type="update" data={item} />
              <FormModal table="result" type="delete" id={item.id} />
            </>
          )}
        </div>
      </td>
    </motion.tr>
  );

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="bg-white dark:bg-gray-900 p-6 rounded-xl shadow-xl m-4 mt-0"
    >
      {/* Toolbar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="sticky top-0 z-30 backdrop-blur-md shadow-md rounded-t-xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4 bg-white dark:bg-gray-900"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">📊 Student Results</h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3">
            {["filter", "sort"].map((icon) => (
              <motion.button
                key={icon}
                whileTap={{ scale: 0.9 }}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-300 hover:bg-yellow-400 transition shadow"
              >
                <Image src={`/${icon}.png`} alt={icon} width={16} height={16} />
              </motion.button>
            ))}
            {(role === "admin" || role === "teacher") && <FormModal table="result" type="create" />}
          </div>
        </div>
      </motion.div>

      {/* Table or Empty State */}
      {safeResults.length > 0 ? (
        <div className="overflow-x-auto rounded-xl shadow-sm mt-4">
          <table className="table-fixed w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wide">
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor} className={`p-4 text-left font-semibold ${col.className || ""}`}>
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {safeResults.map(renderRow)}
            </tbody>
          </table>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <Image src="/empty-state.svg" alt="No data" width={120} height={120} className="mx-auto mb-4" />
          <p className="text-lg font-medium">No results found.</p>
          <p className="text-sm">Try adjusting your filters or add a new one.</p>
        </motion.div>
      )}

      {/* Pagination */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <Pagination />
      </motion.div>
    </motion.div>
  );
};

export default ResultListPage;
