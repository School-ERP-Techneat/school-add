"use client";

import { motion, easeOut } from "framer-motion";
import Image from "next/image";
import FormModal from "@/app/components/FormModal";
import Pagination from "@/app/components/Pagination";
import TableSearch from "@/app/components/TableSearch";
import { parentsData } from "@/lib/data";
import useUserRole from "@/hooks/useUserRole";

type Parent = {
  id: number;
  name: string;
  email?: string;
  students: string[];
  phone: string;
  address: string;
};

const columns = [
  { header: "Name", accessor: "name" },
  { header: "Student Names", accessor: "students", className: "hidden md:table-cell" },
  { header: "Phone", accessor: "phone", className: "hidden lg:table-cell" },
  { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
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

const ParentListPage = () => {
  const role = useUserRole();

  const renderRow = (item: Parent) => (
    <motion.tr
      key={item.id}
      variants={rowVariants}
      whileHover={{ scale: 1.015 }}
      className="group border-b border-gray-200 dark:border-gray-700 transition duration-300 ease-in-out hover:bg-purple-50 dark:hover:bg-gray-800"
    >
      <td className="p-4 text-sm font-medium text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400">
        <div className="flex flex-col">
          <span>{item.name}</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {item.email || "No email provided"}
          </span>
        </div>
      </td>
      <td className="p-4 text-sm hidden md:table-cell text-gray-700 dark:text-gray-300">
        {item.students.join(", ")}
      </td>
      <td className="p-4 text-sm hidden lg:table-cell text-gray-700 dark:text-gray-300">
        {item.phone}
      </td>
      <td className="p-4 text-sm hidden lg:table-cell text-gray-700 dark:text-gray-300">
        {item.address}
      </td>
      <td className="p-4 text-sm">
        <div className="flex items-center gap-2">
          {role === "admin" && (
            <>
              <FormModal table="parent" type="update" data={item} />
              <FormModal table="parent" type="delete" id={item.id} />
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
        className="sticky top-0 z-30 bg-white dark:bg-gray-900 backdrop-blur-md shadow-md rounded-t-xl px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4"
      >
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          👨‍👩‍👧 Parent Directory
        </h1>
        <div className="flex flex-col md:flex-row items-center gap-4 w-full md:w-auto">
          <TableSearch />
          <div className="flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-300 hover:bg-yellow-400 transition shadow"
            >
              <Image src="/filter.png" alt="Filter" width={16} height={16} />
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-300 hover:bg-yellow-400 transition shadow"
            >
              <Image src="/sort.png" alt="Sort" width={16} height={16} />
            </motion.button>
            {role === "admin" && <FormModal table="parent" type="create" />}
          </div>
        </div>
      </motion.div>

      {/* Table or Empty State */}
      {parentsData.length > 0 ? (
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
              {parentsData.map(renderRow)}
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
          <p className="text-lg font-medium">No parents found.</p>
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

export default ParentListPage;
