'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { logoutUser } from '@/utils/auth';

interface User {
  name: string;
  email: string;
  profileImageUrl?: string;
}

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [user, setUser] = useState<User | null>(null);

  const pathname = usePathname();

  // Load theme + user on mount
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
    setTheme(initialTheme);
    document.documentElement.classList.toggle("dark", initialTheme === "dark");

    // ✅ Load user from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Apply theme changes
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/resources', label: 'Resources' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/70 dark:bg-gray-900/70 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/DoQv9bAwKy.svg"
            alt="SchoolConnect Logo"
            width={36}
            height={36}
          />
          <span className="text-lg font-bold text-teal-700 dark:text-white">SchoolConnect</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden sm:flex space-x-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`transition ${
                pathname === href
                  ? 'text-teal-600 font-semibold underline underline-offset-4 dark:text-white'
                  : 'text-gray-700 hover:text-teal-600 dark:text-gray-200'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <motion.button
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full border shadow-md"
          >
            {theme === 'dark' ? '🌙' : '☀️'}
          </motion.button>

          {/* If user logged in → show avatar, else → show login button */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setAvatarOpen(!avatarOpen)}
                className="w-9 h-9 rounded-full overflow-hidden shadow"
              >
                <Image
                  src={user.profileImageUrl || "/default-avatar.png"}
                  alt="User Avatar"
                  width={36}
                  height={36}
                  className="object-cover"
                />
              </button>
              <AnimatePresence>
                {avatarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm"
                  >
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    <Link href="/profile" className="block px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logoutUser();
                        localStorage.removeItem("user");
                        setUser(null);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-red-50 dark:hover:bg-red-800 text-red-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-md bg-gradient-to-r from-teal-500 to-indigo-500 text-white font-semibold shadow hover:opacity-90"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className="sm:hidden text-teal-700 dark:text-white ml-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
