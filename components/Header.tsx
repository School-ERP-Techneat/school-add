'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '@/utils/auth';

type HeaderProps = {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
};

const Header: React.FC<HeaderProps> = ({ darkMode, setDarkMode }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState('');
  const [avatarOpen, setAvatarOpen] = useState(false);
  const pathname = usePathname();

  // Greeting message
  useEffect(() => {
    const hour = new Date().getHours();
    const greetings = [
      { text: 'Rise and shine ☀️', from: 5, to: 11 },
      { text: 'Good afternoon 🌤️', from: 12, to: 17 },
      { text: 'Evening vibes 🌇', from: 18, to: 21 },
      { text: 'Time to unwind 🌙', from: 22, to: 4 },
    ];
    const current = greetings.find(({ from, to }) =>
      from <= to ? hour >= from && hour <= to : hour >= from || hour <= to
    );
    setGreeting(current?.text || 'Hello 👋');
  }, []);

  // Load theme from localStorage or system
  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored) {
      setDarkMode(stored === 'dark');
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
    }
  }, [setDarkMode]);

  // Apply theme to <html>
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/resources', label: 'Resources' },
    { href: '/contact', label: 'Contact' },
    { href: '/login', label: 'Login', isButton: true },
  ];

  const pageTitle =
    pathname === '/'
      ? 'Home'
      : pathname.replace('/', '').replace('-', ' ').toUpperCase();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-md transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        
        {/* Logo + Greeting */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Image
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/DoQv9bAwKy.svg"
            alt="SchoolConnect Logo"
            width={36}
            height={36}
            className="group-hover:scale-110 transition-transform duration-300"
          />
          <div>
            <span className="text-lg font-bold text-teal-700 group-hover:text-teal-800 transition dark:text-white">
              SchoolConnect
            </span>
            <div className="text-xs text-gray-500 dark:text-gray-400">
              {greeting}
            </div>
          </div>
        </Link>

        {/* Title */}
        <div className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-300">
          {pageTitle}
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9, rotate: 15 }}
            className={`p-2 rounded-full border shadow-md transition ${
              darkMode
                ? 'bg-gray-800 text-white border-gray-700'
                : 'bg-white text-gray-700 border-gray-300'
            }`}
            aria-label="Toggle Theme"
          >
            {darkMode ? '🌙' : '☀️'}
          </motion.button>

          {/* Avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setAvatarOpen(!avatarOpen)}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-teal-500 to-indigo-500 text-white flex items-center justify-center shadow hover:scale-105 transition"
              aria-label="User menu"
            >
              👤
            </button>
            <AnimatePresence>
              {avatarOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm"
                >
                  <Link
                    href="/profile"
                    className="block px-3 py-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={logoutUser}
                    className="w-full text-left px-3 py-2 rounded hover:bg-red-50 dark:hover:bg-red-800 text-red-600 dark:text-red-400"
                  >
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-teal-700 dark:text-white focus:outline-none ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation"
          >
            <motion.svg
              initial={false}
              animate={{ rotate: menuOpen ? 90 : 0 }}
              className="h-7 w-7"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={
                  menuOpen
                    ? 'M6 18L18 6M6 6l12 12'
                    : 'M4 6h16M4 12h16M4 18h16'
                }
              />
            </motion.svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="sm:hidden bg-white/90 dark:bg-gray-900/90 px-6 pb-4 space-y-2"
          >
            {navLinks.map(({ href, label, isButton }) => (
              <Link
                key={href}
                href={href}
                className={`block py-2 text-base ${
                  pathname === href
                    ? 'text-teal-600 font-semibold underline underline-offset-4'
                    : 'text-gray-700 hover:text-teal-600 dark:text-gray-200 dark:hover:text-white'
                } ${
                  isButton
                    ? 'font-bold px-3 py-2 bg-gradient-to-r from-teal-500 to-indigo-500 text-white rounded-md'
                    : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
