"use client";

import { motion } from "framer-motion";
import Announcements from "@/app/components/Announcements";
import BigCalendar from "@/app/components/BigCalender";
import Performance from "@/app/components/Performance";
import Image from "next/image";
import Link from "next/link";

const SingleStudentPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] as const }} // ✅ Type-safe easing
      className="flex-1 p-4 flex flex-col gap-4 xl:flex-row"
    >
      {/* LEFT */}
      <div className="w-full xl:w-2/3">
        {/* TOP */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* USER INFO CARD */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            className="bg-lamaSky py-6 px-4 rounded-md flex-1 flex gap-4 shadow-md"
          >
            <div className="w-1/3">
              <Image
                src="https://images.pexels.com/photos/5414817/pexels-photo-5414817.jpeg?auto=compress&cs=tinysrgb&w=1200"
                alt="Student"
                width={144}
                height={144}
                className="w-36 h-36 rounded-full object-cover"
              />
            </div>
            <div className="w-2/3 flex flex-col justify-between gap-4">
              <h1 className="text-xl font-semibold">Cameron Moran</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
              </p>
              <div className="flex items-center justify-between gap-2 flex-wrap text-xs font-medium">
                {[
                  { icon: "/blood.png", label: "A+" },
                  { icon: "/date.png", label: "January 2025" },
                  { icon: "/mail.png", label: "user@gmail.com" },
                  { icon: "/phone.png", label: "+1 234 567" },
                ].map((info, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 w-full md:w-1/2 lg:w-full xl:w-1/2"
                  >
                    <Image src={info.icon} alt="icon" width={14} height={14} />
                    <span>{info.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* SMALL CARDS */}
          <div className="flex-1 flex gap-4 justify-between flex-wrap">
            {[
              { icon: "/singleAttendance.png", label: "Attendance", value: "90%" },
              { icon: "/singleBranch.png", label: "Grade", value: "6th" },
              { icon: "/singleLesson.png", label: "Lessons", value: "18" },
              { icon: "/singleClass.png", label: "Class", value: "6A" },
            ].map((card, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.2 }}
                className="bg-white p-4 rounded-md flex gap-4 w-full md:w-[48%] xl:w-[45%] 2xl:w-[48%] shadow-sm"
              >
                <Image src={card.icon} alt={card.label} width={24} height={24} className="w-6 h-6" />
                <div>
                  <h1 className="text-xl font-semibold">{card.value}</h1>
                  <span className="text-sm text-gray-400">{card.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BOTTOM */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.33, 1, 0.68, 1] as const }}
          className="mt-4 bg-white rounded-md p-4 h-[800px] shadow-md"
        >
          <h1 className="text-lg font-semibold mb-2">📅 Student&apos;s Schedule</h1>
          <BigCalendar />
        </motion.div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-4">
        {/* SHORTCUTS */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] as const }}
          className="bg-white p-4 rounded-md shadow-sm"
        >
          <h1 className="text-xl font-semibold">🔗 Shortcuts</h1>
          <div className="mt-4 flex gap-4 flex-wrap text-xs text-gray-500">
            {[
              { label: "Student's Lessons", bg: "bg-lamaSkyLight" },
              { label: "Student's Teachers", bg: "bg-lamaPurpleLight" },
              { label: "Student's Exams", bg: "bg-pink-50" },
              { label: "Student's Assignments", bg: "bg-lamaSkyLight" },
              { label: "Student's Results", bg: "bg-lamaYellowLight" },
            ].map((link, i) => (
              <Link
                key={i}
                href="/"
                className={`p-3 rounded-md ${link.bg} hover:scale-[1.02] transition-transform shadow-sm`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>

        {/* PERFORMANCE & ANNOUNCEMENTS */}
        {[Performance, Announcements].map((Component, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] as const }}
            className="shadow-sm"
          >
            <Component />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default SingleStudentPage;
