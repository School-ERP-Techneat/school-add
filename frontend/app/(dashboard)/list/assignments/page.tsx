"use client";
import { motion, easeOut } from "framer-motion";
import Image from "next/image";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import TableSearch from "@/app/components/TableSearch";
import { assignmentsData, role } from "@/lib/data";

type Assignment = {
  id: number;
  subject: string;
  class: string;
  teacher: string;
  dueDate: string;
};

const columns = [
  { header: "Subject Name", accessor: "subject" },
  { header: "Class", accessor: "class" },
  { header: "Teacher", accessor: "teacher", className: "hidden md:table-cell" },
  { header: "Due Date", accessor: "dueDate", className: "hidden md:table-cell" },
  { header: "Actions", accessor: "action" },
];

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: easeOut,
      staggerChildren: 0.1,
    },
  },
};

const rowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const getStatusBadge = (dueDate: string) => {
  const today = new Date();
  const due = new Date(dueDate);
  const diff = (due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);

  const base =
    "px-2 py-1 text-xs rounded-full font-semibold shadow-sm scale-100 hover:scale-105 transition-transform";

  if (diff < 0) return <span className={`${base} bg-red-600 text-white`}>Overdue</span>;
  if (diff < 3) return <span className={`${base} bg-yellow-500 text-white`}>Due Soon</span>;
  return <span className={`${base} bg-green-500 text-white`}>On Track</span>;
};

const renderRow = (item: Assignment) => (
  <motion.tr
    key={item.id}
    variants={rowVariants}
    whileHover={{
      scale: 1.015,
      backgroundColor: "rgba(249, 250, 251, 0.6)",
    }}
    className="group border-b border-gray-200 dark:border-gray-700 transition duration-300 ease-in-out"
  >
    <td className="p-4 text-sm font-semibold text-gray-800 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
      {item.subject}
    </td>
    <td className="p-4 text-sm text-gray-700 dark:text-gray-300">{item.class}</td>
    <td className="p-4 text-sm hidden md:table-cell text-gray-600 dark:text-gray-400">
      {item.teacher}
    </td>
    <td className="p-4 text-sm hidden md:table-cell text-gray-600 dark:text-gray-400">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <span>{item.dueDate}</span>
        {getStatusBadge(item.dueDate)}
      </div>
    </td>
    <td className="p-4 text-sm">
      <div className="flex items-center gap-2">
        {(role === "admin" || role === "teacher") && (
          <>
            <FormModal table="assignment" type="update" data={item} />
            <FormModal table="assignment" type="delete" id={item.id} />
          </>
        )}
      </div>
    </td>
  </motion.tr>
);

const AssignmentListPage = () => {
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
        className="sticky top-0 z-30 bg-white dark:bg-gray-900 backdrop-blur-md shadow-md rounded-t-xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          📚 Assignment Dashboard
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 hover:bg-yellow-400 transition text-sm shadow"
            >
              <Image src="/filter.png" alt="Filter" width={16} height={16} />
              <span className="hidden sm:inline">Filter</span>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-300 hover:bg-yellow-400 transition text-sm shadow"
            >
              <Image src="/sort.png" alt="Sort" width={16} height={16} />
              <span className="hidden sm:inline">Sort</span>
            </motion.button>
            {(role === "admin" || role === "teacher") && (
              <FormModal table="assignment" type="create" />
            )}
          </div>
        </div>
      </motion.div>

      {/* Table or Empty State */}
      {assignmentsData.length > 0 ? (
        <div className="overflow-x-auto rounded-xl shadow-sm mt-4">
          <table className="table-fixed w-full border-collapse">
            <thead className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm uppercase tracking-wide">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.accessor}
                    className={`p-4 text-left font-semibold ${col.className || ""}`}
                  >
                    {col.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {assignmentsData.map(renderRow)}
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
          <p className="text-lg font-medium">No assignments found.</p>
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

export default AssignmentListPage;
