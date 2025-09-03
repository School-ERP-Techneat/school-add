"use client";

import Image from "next/image";
import useUserRole from "@/hooks/useUserRole";
import { motion } from "framer-motion";

const Navbar = () => {
  const role = useUserRole();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900 backdrop-blur-md shadow-md rounded-xl"
    >
      {/* SEARCH BAR */}
      <motion.div
        whileFocus={{ scale: 1.02 }}
        className="hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 dark:ring-gray-700 px-3 py-2 transition bg-white dark:bg-gray-800"
      >
        <Image src="/search.png" alt="Search" width={14} height={14} />
        <input
          type="text"
          placeholder="Search..."
          className="w-[200px] bg-transparent outline-none text-gray-700 dark:text-gray-200"
        />
      </motion.div>

      {/* ICONS + USER */}
      <div className="flex items-center gap-6 justify-end w-full">
        {/* Message Icon */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-sm"
        >
          <Image src="/message.png" alt="Messages" width={20} height={20} />
        </motion.div>

        {/* Announcement Icon with Badge */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          className="bg-white dark:bg-gray-800 rounded-full w-8 h-8 flex items-center justify-center cursor-pointer relative shadow-sm"
        >
          <Image src="/announcement.png" alt="Announcements" width={20} height={20} />
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center bg-purple-500 text-white rounded-full text-xs shadow-md"
          >
            1
          </motion.div>
        </motion.div>

        {/* User Info */}
        <div className="flex flex-col text-right">
          <span className="text-xs leading-3 font-medium text-gray-800 dark:text-gray-100">
            John Doe
          </span>
          <span className="text-[10px] text-gray-500 dark:text-gray-400">{role}</span>
        </div>

        {/* Avatar with Hover Reveal */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="relative w-9 h-9 rounded-full overflow-hidden cursor-pointer shadow-md"
        >
          <Image src="/avatar.png" alt="User Avatar" width={36} height={36} />
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileHover={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 text-xs text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md shadow-lg"
          >
            Profile
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Navbar;
