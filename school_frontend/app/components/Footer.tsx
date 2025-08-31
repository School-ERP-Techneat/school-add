"use client";
import React from "react";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-10 grid gap-6 md:flex md:items-center md:justify-between">
        
        {/* Navigation Links */}
        <nav className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-gray-600">
          <Link href="#" className="hover:text-teal-600 transition">Privacy Policy</Link>
          <Link href="#" className="hover:text-teal-600 transition">Terms of Service</Link>
          <Link href="#" className="hover:text-teal-600 transition">Contact Us</Link>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-gray-500 text-center md:text-right">
          © {new Date().getFullYear()} <span className="font-semibold text-teal-700">SchoolConnect</span>. All rights reserved.
        </p>
      </div>

      {/* Optional Social Icons */}
      <div className="mt-6 text-center">
        <div className="inline-flex space-x-4 text-gray-500">
          <Link href="#" aria-label="Facebook" className="hover:text-teal-600 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0022 12z" />
            </svg>
          </Link>
          <Link href="#" aria-label="Twitter" className="hover:text-teal-600 transition">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.46 6c-.77.35-1.6.58-2.46.69a4.3 4.3 0 001.88-2.37 8.59 8.59 0 01-2.72 1.04 4.28 4.28 0 00-7.3 3.9A12.14 12.14 0 013 5.1a4.28 4.28 0 001.32 5.7 4.2 4.2 0 01-1.94-.54v.05a4.28 4.28 0 003.43 4.2 4.3 4.3 0 01-1.93.07 4.28 4.28 0 004 2.97A8.6 8.6 0 012 19.54a12.1 12.1 0 006.56 1.92c7.88 0 12.2-6.53 12.2-12.2 0-.19 0-.39-.01-.58A8.7 8.7 0 0022.46 6z" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
