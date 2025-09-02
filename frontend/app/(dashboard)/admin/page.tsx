"use client";

import { motion } from "framer-motion";
import Announcements from "@/app/components/Announcements";
import AttendanceChart from "@/app/components/AttendanceChart";
import CountChart from "@/app/components/CountChart";
import EventCalendar from "@/app/components/EventCalendar";
import FinanceChart from "@/app/components/FinanceChart";
import UserCard from "@/app/components/UserCard";
import SmartMetricCard from "@/app/components/SmaetMetricCard";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <motion.div {...fadeInUp} className="flex flex-col gap-4">
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100">
      {title}
    </h3>
    {children}
  </motion.div>
);

const AdminPage = () => {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      className="p-4 flex flex-col gap-8 lg:flex-row"
    >
      {/* LEFT COLUMN */}
      <div className="w-full lg:w-2/3 flex flex-col gap-8">
        {/* USER OVERVIEW */}
        <Section title="User Overview">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <UserCard type="student" />
            <UserCard type="teacher" />
            <UserCard type="parent" />
            <UserCard type="staff" />
          </div>
        </Section>

        {/* COUNT + ATTENDANCE */}
        <Section title="Summary & Attendance">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="w-full lg:w-1/3 h-[450px]">
              <CountChart />
            </div>
            <div className="w-full lg:w-2/3 h-[450px]">
              <AttendanceChart />
            </div>
          </div>
        </Section>

        {/* FINANCE */}
        <Section title="Finance Breakdown">
          <div className="h-[500px]">
            <FinanceChart />
          </div>
        </Section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-1/3 flex flex-col gap-8">
        <Section title="Upcoming Events">
          <EventCalendar />
        </Section>
        <Section title="Announcements">
          <Announcements />
        </Section>
        <Section title="Smart Metrics">
          <SmartMetricCard />
        </Section>
      </div>
    </motion.div>
  );
};

export default AdminPage;
