"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import useUserRole from "@/hooks/useUserRole";
import { useSchool } from "@/context/SchoolContext";

const baseMenuItems = [
  {
    title: "MENU",
    items: [
      { icon: "/home.png", label: "Home", href: "/dashboard", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/teacher.png", label: "Teachers", href: "/list/teachers", visible: ["admin", "teacher"] },
      { icon: "/student.png", label: "Students", href: "/list/students", visible: ["admin", "teacher"] },
      { icon: "/parent.png", label: "Parents", href: "/list/parents", visible: ["admin", "teacher"] },
      { icon: "/subject.png", label: "Subjects", href: "/list/subjects", visible: ["admin"] },
      { icon: "/class.png", label: "batch", href: "/list/batch", visible: ["admin"] },
      { icon: "/class.png", label: "Classes", href: "/list/classes", visible: ["admin", "teacher"] },
      { icon: "/lesson.png", label: "Lessons", href: "/list/lessons", visible: ["admin", "teacher"] },
      { icon: "/exam.png", label: "Exams", href: "/list/exams", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/assignment.png", label: "Assignments", href: "/list/assignments", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/result.png", label: "Results", href: "/list/results", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/attendance.png", label: "Attendance", href: "/list/attendance", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/calendar.png", label: "Events", href: "/list/events", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/message.png", label: "Messages", href: "/list/messages", visible: ["admin", "teacher", "student", "parent"], badge: 3 },
      { icon: "/announcement.png", label: "Announcements", href: "/list/announcements", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
  {
    title: "OTHER",
    items: [
      { icon: "/profile.png", label: "Profile", href: "/profile", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/setting.png", label: "Settings", href: "/settings", visible: ["admin", "teacher", "student", "parent"] },
      { icon: "/logout.png", label: "Logout", href: "/logout", visible: ["admin", "teacher", "student", "parent"] },
    ],
  },
];

const Menu = () => {
  const role = useUserRole();
  const { school, loading } = useSchool();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  if (loading) return <p className="text-gray-500">Loading school info...</p>;
  if (!school) return <p className="text-red-500">No school data available.</p>;

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      <motion.button
        onClick={() => setIsOpen(true)}
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-blue-600 text-white p-3 rounded-full shadow-xl"
        aria-label="Open menu"
      >
        ☰
      </motion.button>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-full max-w-[16rem] min-w-[4rem] p-4 sticky top-0 h-screen overflow-y-auto bg-white dark:bg-gray-900 shadow-md">
        <SidebarContent role={role} pathname={pathname} onNavigate={() => {}} />
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.aside
              className="fixed inset-0 bg-white dark:bg-gray-900 z-50 shadow-xl p-4 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 text-gray-600 dark:text-gray-300 text-xl"
                aria-label="Close menu"
              >
                ✕
              </button>
              <SidebarContent role={role} pathname={pathname} onNavigate={() => setIsOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

const SidebarContent = ({
  role,
  pathname,
  onNavigate,
}: {
  role: string;
  pathname: string;
  onNavigate: () => void;
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  return (
    <div className="text-sm space-y-6">
      {/* Profile Section */}
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/avatar.png"
          alt="User Avatar"
          width={40}
          height={40}
          priority
          className="rounded-full transition-transform duration-200 hover:scale-105"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">John Doe</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{role}</p>
        </div>
      </div>

      {/* Menu Sections */}
      {baseMenuItems.map((section, index) => {
        const isExpanded = expandedSections[section.title] ?? true;
        return (
          <div key={section.title}>
            <button
              onClick={() => toggleSection(section.title)}
              className="w-full text-xs uppercase text-gray-400 dark:text-gray-500 font-semibold mb-2 tracking-wide flex justify-between items-center"
            >
              {section.title}
              <span>{isExpanded ? "−" : "+"}</span>
            </button>

            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-1 overflow-hidden"
                >
                  {section.items.map((item) =>
                    item.visible.includes(role) ? (
                      <motion.div
                        key={item.label}
                        whileHover={{ scale: 1.02 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <Link
                          href={item.href}
                          onClick={onNavigate}
                          className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${
                            pathname === item.href
                              ? "border-l-4 border-blue-500 bg-blue-100 text-blue-600 font-semibold dark:bg-blue-900 dark:text-blue-300"
                              : "text-gray-600 hover:bg-blue-50 hover:text-blue-500 dark:text-gray-300 dark:hover:bg-gray-800"
                          }`}
                        >
                          <Image
                            src={item.icon}
                            alt={item.label}
                            width={20}
                            height={20}
                            className="object-contain"
                          />
                          <span>{item.label}</span>
                          {item.badge && (
                            <motion.span
                              initial={{ scale: 1 }}
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5 }}
                              className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full"
                            >
                              {item.badge}
                            </motion.span>
                          )}
                        </Link>
                      </motion.div>
                    ) : null
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider between sections */}
            {index === 0 && (
              <hr className="my-4 border-gray-200 dark:border-gray-700" />
            )}
          </div>
        );
      })}

      {/* Footer */}
      <div className="mt-8 text-xs text-gray-400 dark:text-gray-500 text-center">
        School ERP v2.5 © 2025
      </div>
    </div>
  );
};

export default Menu;
