"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

import Header from "@/components/Header";
import InfoCard from "@/components/dashboard/InfoCard";
import SectionBlock from "@/components/dashboard/SectionBlock";
import DataTable from "@/components/dashboard/DataTable";
import ActionButton from "@/components/dashboard/ActionButton";
import { useDashboardData } from "@/hooks/useDashboardData";
import Footer from "@/app/components/Footer";

import { Inter, Poppins } from "next/font/google";
import RegisterAdmin from "@/app/add_user/RegisterAdmin"; // ✅ use component, not page.tsx

// Fonts
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const poppins = Poppins({
  subsets: ["latin"],
  weight: "700",
  variable: "--font-poppins",
});

const DashboardPage = () => {
  const router = useRouter();
  const { userId, schoolDetails, adminData, loadingSchool, loadingAdmins } =
    useDashboardData();

  const [authChecked, setAuthChecked] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [addAdminUser, setAddAdminUser] = useState<boolean>(false);

  const getSchoolCode = () =>
    typeof window !== "undefined" ? localStorage.getItem("schoolCode") : null;

  // 🔐 Auth check
  useEffect(() => {
    const match = document.cookie.match(/userId=([^;]+)/);
    if (!match) {
      setTimeout(() => router.push("/login"), 100);
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-600 dark:text-gray-300 animate-pulse">
        🔄 Checking login status...
      </div>
    );
  }

  return (
    <>
      {addAdminUser ? (
        <div className="h-screen w-screen">
          <RegisterAdmin setaddAdminUser={setAddAdminUser} />
        </div>
      ) : (
        <div
          className={`${inter.variable} ${poppins.variable} relative min-h-screen bg-gradient-to-br from-teal-100 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-white font-sans overflow-hidden`}
          style={{ fontFamily: "var(--font-inter)" }}
        >
          {/* Floating Blobs */}
          <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-teal-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-indigo-400/20 rounded-full blur-3xl animate-ping" />
          <div className="absolute top-1/3 left-1/2 w-[250px] h-[250px] bg-pink-300/20 rounded-full blur-xl animate-bounce" />

          <Header darkMode={darkMode} setDarkMode={setDarkMode} />

          {/* School Card */}
          <main className="flex-grow flex items-center justify-center px-4 py-8 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="w-full max-w-lg bg-white/40 dark:bg-gray-800/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/30 dark:border-gray-700/30 p-6 hover:shadow-3xl transform hover:scale-[1.03] transition-all duration-500"
            >
              <header className="text-center mb-6">
                {schoolDetails?.logoUrl && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center mb-4"
                  >
                    <Image
                      src={schoolDetails.logoUrl}
                      alt={`${schoolDetails.name} logo`}
                      width={90}
                      height={90}
                      className="object-contain rounded-lg shadow-md"
                    />
                  </motion.div>
                )}
                <motion.span
                  className="text-3xl font-extrabold bg-gradient-to-r from-teal-500 to-indigo-500 bg-clip-text text-transparent drop-shadow-sm"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  style={{ fontFamily: "var(--font-poppins)" }}
                >
                  {schoolDetails?.name || "—"}
                </motion.span>
                <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                  School ID:{" "}
                  <span className="font-medium text-gray-800 dark:text-white">
                    {userId || "—"}
                  </span>
                </p>
              </header>

              <div className="space-y-4">
                <motion.a
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 20px rgba(0,255,255,0.6)",
                  }}
                  href={`https://erp.tachneat.shop/?school=${userId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-2 px-4 bg-gradient-to-r from-teal-500 to-indigo-500 hover:brightness-110 text-white font-semibold rounded-md shadow-lg transition"
                >
                  🚀 Login ERP
                </motion.a>
              </div>
            </motion.div>
          </main>

          {/* Dashboard Details */}
          <div className="px-4 md:px-8 py-6 relative z-10">
            <div className="max-w-7xl mx-auto space-y-10">
              {/* School Info */}
              <SectionBlock title="📊 Dashboard Overview">
                {loadingSchool ? (
                  <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                    Loading school details...
                  </p>
                ) : schoolDetails ? (
                  <motion.div
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    variants={{
                      hidden: { opacity: 0, y: 40 },
                      show: {
                        opacity: 1,
                        y: 0,
                        transition: { staggerChildren: 0.1 },
                      },
                    }}
                    className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
                  >
                    <InfoCard label="School ID" value={schoolDetails.code || "—"} />
                    <InfoCard label="School Name" value={schoolDetails.name || "—"} />
                    <InfoCard
                      label="Affiliation No."
                      value={schoolDetails.affiliationNumber || "—"}
                    />
                    <InfoCard label="Board" value={schoolDetails.board || "—"} />
                    <InfoCard label="Medium" value={schoolDetails.medium || "—"} />
                    <InfoCard label="Type" value={schoolDetails.schoolType || "—"} />
                    <InfoCard
                      label="Established"
                      value={schoolDetails.establishmentYear?.toString() || "—"}
                    />
                    <InfoCard label="Phone" value={schoolDetails.contactPhone || "—"} />
                    <InfoCard label="Email" value={schoolDetails.contactEmail || "—"} />
                    {schoolDetails.website && (
                      <InfoCard
                        label="Website"
                        value={
                          <a
                            href={schoolDetails.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 dark:text-blue-400 underline"
                          >
                            Visit Website
                          </a>
                        }
                      />
                    )}
                    <InfoCard
                      label="Address"
                      value={
                        schoolDetails.address
                          ? `${schoolDetails.address.street}, ${schoolDetails.address.city}, ${schoolDetails.address.state}, ${schoolDetails.address.country} - ${schoolDetails.address.zipCode}`
                          : "—"
                      }
                    />
                  </motion.div>
                ) : (
                  <p className="text-red-500 dark:text-red-400">
                    School details not found.
                  </p>
                )}
              </SectionBlock>

              {/* Staff Management */}
              <SectionBlock title="👩‍🏫 Staff Management">
                {loadingAdmins ? (
                  <p className="text-gray-500 dark:text-gray-400 animate-pulse">
                    Loading admin users...
                  </p>
                ) : adminData.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <DataTable
                      headers={["Name", "Role", "Department", "Actions"]}
                      rows={adminData}
                      schoolCode={getSchoolCode() || ""}
                      refreshData={() => {}}
                    />
                  </motion.div>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    No admin users found for this school.
                  </p>
                )}

                <button onClick={() => setAddAdminUser(true)}>
                  <ActionButton label="➕ Add Admin User" />
                </button>
              </SectionBlock>
            </div>
          </div>

          {/* Sticky Quick Actions */}
          <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
            <Link href="/profile">
              <motion.button
                whileHover={{
                  scale: 1.15,
                  boxShadow: "0 0 15px rgba(0,255,255,0.5)",
                }}
                className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 shadow-lg text-white transition"
              >
                ⚙️
              </motion.button>
            </Link>

            {/* Chat popup */}
            {isOpen && (
              <div className="fixed inset-0 bg-black/40 flex items-end justify-end z-50">
                <div className="w-80 h-96 bg-white rounded-lg shadow-2xl flex flex-col justify-between m-4">
                  <div className="flex justify-between p-4 overflow-y-auto text-sm text-gray-700">
                    <p>Hello! How can I help you today?</p>
                    <button onClick={() => setIsOpen(false)}>✖</button>
                  </div>
                  <div className="p-3 border-t flex">
                    <input
                      type="text"
                      placeholder="Type your message..."
                      className="flex-1 border rounded px-3 py-1 text-sm focus:outline-none"
                    />
                    <button className="ml-2 bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 text-sm">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}

            <motion.button
              onClick={() => setIsOpen(true)}
              whileHover={{
                scale: 1.15,
                boxShadow: "0 0 15px rgba(255,0,255,0.5)",
              }}
              className="p-3 rounded-full bg-gradient-to-r from-pink-500 to-red-500 shadow-lg text-white transition"
            >
              💬
            </motion.button>
          </div>

          <Footer />
        </div>
      )}
    </>
  );
};

export default DashboardPage;
