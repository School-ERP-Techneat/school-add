"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sun, Moon } from "lucide-react";

interface NewsItem {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
}

const newsItems: NewsItem[] = [
  {
    id: "1",
    date: "2023-10-26",
    title: "Upcoming School Fair",
    description:
      "Celebrate learning and community at our annual School Fair. Expect student showcases, games, and delicious food.",
    image:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/QBHKS0erxk.png",
  },
  {
    id: "2",
    date: "2023-10-20",
    title: "Parent-Teacher Conferences",
    description:
      "Connect with educators on November 1st & 2nd. Schedule your appointments online to discuss your child’s progress.",
    image:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/qjFjmLADk5.png",
  },
  {
    id: "3",
    date: "2023-10-15",
    title: "New Science Lab Opening",
    description:
      "Our cutting-edge science lab is now open, offering students hands-on experiences in biology, chemistry, and physics.",
    image:
      "https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/ZLqSut4AuX.png",
  },
];

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

const NewsSection: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <section
      className={`relative py-20 px-6 transition-colors duration-700 ${
        darkMode
          && "bg-gradient-to-br from-gray-900 via-gray-800 to-black text-gray-100"
          
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-16 text-center relative"
        >
          {/* Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="absolute right-0 top-0 p-3 rounded-full shadow-md transition-colors duration-500
              bg-white/80 backdrop-blur-md hover:scale-110
              dark:bg-gray-800"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-800" />
            )}
          </button>

          <h2
            className={`text-5xl font-extrabold drop-shadow-sm ${
              darkMode
                ? "bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-400"
                : "bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-cyan-500"
            }`}
          >
            📰 Latest News & Announcements
          </h2>
          <p
            className={`mt-3 text-lg ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Stay updated with the latest happenings at{" "}
            <span
              className={`font-semibold ${
                darkMode ? "text-teal-300" : "text-teal-600"
              }`}
            >
              SchoolConnect
            </span>
          </p>
        </motion.header>

        {/* News Grid */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={{
            hidden: {},
            show: {
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
          className="grid gap-12 md:grid-cols-2 lg:grid-cols-3"
        >
          {newsItems.map(({ id, date, title, description, image }) => (
            <motion.div
              key={id}
              variants={{
                hidden: { opacity: 0, y: 50 },
                show: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group relative rounded-2xl shadow-md hover:shadow-2xl border overflow-hidden transition-all duration-300 ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-100"
              }`}
            >
              {/* Image */}
              <div className="relative overflow-hidden">
                <motion.img
                  src={image}
                  alt={title}
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-56 object-cover"
                />
                {/* Gradient Overlay */}
                <div
                  className={`absolute inset-0 transition duration-500 ${
                    darkMode
                      ? "bg-gradient-to-t from-black/60 via-transparent opacity-0 group-hover:opacity-100"
                      : "bg-gradient-to-t from-black/30 via-transparent opacity-0 group-hover:opacity-100"
                  }`}
                ></div>
              </div>

              {/* Content */}
              <div className="p-6">
                <time
                  className={`block text-sm ${
                    darkMode ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  {formatDate(date)}
                </time>
                <h3
                  className={`mt-2 text-2xl font-bold transition ${
                    darkMode
                      ? "text-gray-100 group-hover:text-teal-300"
                      : "text-gray-900 group-hover:text-teal-600"
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`mt-2 leading-relaxed text-sm ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Link
            href="#"
            className={`inline-block font-semibold py-4 px-10 rounded-full shadow-lg hover:shadow-xl transition-transform transform hover:scale-105 ${
              darkMode
                ? "bg-gradient-to-r from-teal-400 to-cyan-400 text-black"
                : "bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white animate-pulse"
            }`}
          >
            Explore More News
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;
