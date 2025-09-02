"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const Footer: React.FC = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 border-t border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Floating glow background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-20 left-10 w-72 h-72 bg-teal-400/20 blur-[100px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-0 right-20 w-96 h-96 bg-indigo-400/20 blur-[120px] rounded-full animate-pulse delay-700"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
        {/* Column 1 - Brand */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-teal-700 dark:text-teal-400">
            SchoolConnect
          </h3>
          <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
            Empowering students, educators, and families to connect, grow, and
            succeed together.
          </p>
        </motion.div>

        {/* Column 2 - Quick Links */}
        <motion.nav
          className="flex flex-col gap-2 text-sm text-gray-600 dark:text-gray-300"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-2">
            Quick Links
          </h4>
          <Link href="/about" className="hover:text-teal-600 transition">
            About Us
          </Link>
          <Link href="/careers" className="hover:text-teal-600 transition">
            Careers
          </Link>
          <Link href="/help" className="hover:text-teal-600 transition">
            Help Center
          </Link>
          <Link href="/privacy" className="hover:text-teal-600 transition">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-teal-600 transition">
            Terms of Service
          </Link>
        </motion.nav>

        {/* Column 3 - Socials */}
        <motion.div
          className="flex flex-col items-start md:items-end"
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h4 className="text-base font-semibold text-gray-800 dark:text-white mb-3">
            Follow Us
          </h4>
          <div className="flex space-x-4">
            {[
              {
                href: "#",
                label: "Facebook",
                path: "M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z",
              },
              {
                href: "#",
                label: "Twitter",
                path: "M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 5.1a4.28 4.28 0 001.32 5.7 4.2 4.2 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97A8.6 8.6 0 012 19.54a12.1 12.1 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.7 8.7 0 0022.46 6z",
              },
              {
                href: "#",
                label: "LinkedIn",
                path: "M19 0h-14a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5v-14a5 5 0 00-5-5zm-11 19h-3v-10h3v10zm-1.5-11.4a1.7 1.7 0 110-3.4 1.7 1.7 0 010 3.4zm13.5 11.4h-3v-5.6c0-1.3-.5-2.2-1.7-2.2-1 0-1.5.7-1.7 1.3-.1.2-.1.6-.1.9v5.6h-3v-10h3v1.5c.4-.6 1.1-1.5 2.7-1.5 2 0 3.5 1.3 3.5 4.1v6.9z",
              },
            ].map(({ href, label, path }, idx) => (
              <Link
                key={idx}
                href={href}
                aria-label={label}
                className="p-2 rounded-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition transform hover:scale-110 hover:text-teal-600"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d={path} />
                </svg>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom copyright */}
      <motion.div
        className="border-t border-gray-200 dark:border-gray-700 py-6 text-center text-sm text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.6 }}
        viewport={{ once: true }}
      >
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-teal-700 dark:text-teal-400">
          SchoolConnect
        </span>
        . All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
