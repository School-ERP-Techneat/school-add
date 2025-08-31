"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { BiLogOut } from "react-icons/bi";
import { useSchoolStore } from "@/store/StoreProvider";
import { useFetchSchool } from "@/query/queries";

interface HeaderProps {
  variant?: "landing" | "auth" | "dashboard";
  showNavigation?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  variant = "landing",
  showNavigation = true,
}) => {
  const session = useSession();
  const schoolCode = session.data?.user.schoolCode || "";
  const accessToken = session.data?.accessToken || "";

  const [menuOpen, setMenuOpen] = useState(false);
  const [greeting, setGreeting] = useState("");
  const pathname = usePathname();

  const { setSchoolCode, setSchoolData } = useSchoolStore((state) => state);

  const { data: schoolData } = useFetchSchool({
    accessToken,
    schoolCode,
  });

  useEffect(() => {
    if (schoolData) {
      setSchoolData(schoolData);
    }
  }, [schoolData]);

  useEffect(() => {
    const hour = new Date().getHours();
    const greetings = [
      { text: "Rise and shine", from: 5, to: 11 },
      { text: "Good afternoon", from: 12, to: 17 },
      { text: "Evening vibes", from: 18, to: 21 },
      { text: "Time to unwind", from: 22, to: 4 },
    ];
    const current = greetings.find(
      ({ from, to }) =>
        (from <= hour && hour <= to) ||
        (from > to && (hour >= from || hour <= to))
    );
    setGreeting(current?.text || "Hello");
  }, []);

  useEffect(() => {
    if (session && session.data) setSchoolCode(session.data?.user.schoolCode);
  }, [session]);

  const logoText =
    variant === "dashboard"
      ? "Academics Hub"
      : variant === "auth"
      ? "ConnectHub"
      : "SchoolConnect";

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/resources", label: "Resources" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo + Greeting */}
        <Link
          href="/"
          className="flex items-center space-x-2 group"
          aria-label="Homepage"
        >
          <img
            src="https://codia-f2c.s3.us-west-1.amazonaws.com/image/2025-08-02/DoQv9bAwKy.svg"
            alt={`${logoText} Logo`}
            className="h-8 w-8 group-hover:animate-pulse"
          />
          <div>
            <span className="text-lg font-bold text-teal-700 group-hover:text-teal-800 transition">
              {logoText}
            </span>
            <div className="text-xs text-gray-500">{greeting}, learner!</div>
          </div>
        </Link>

        {/* Hamburger */}
        <button
          className="sm:hidden text-teal-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
            />
          </svg>
        </button>

        {/* Navigation */}
        {showNavigation && (
          <nav
            className={`flex-col sm:flex-row sm:flex items-center space-y-2 sm:space-y-0 sm:space-x-6 ${
              menuOpen ? "flex" : "hidden"
            } sm:flex`}
            aria-label="Main navigation"
          >
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`transition duration-200 ${
                  pathname === href
                    ? "text-teal-600 font-semibold underline underline-offset-4"
                    : "text-gray-700 hover:text-teal-600"
                } `}
              >
                {label}
              </Link>
            ))}
            {!session.data && (
              <Link
                href="/login"
                className={`transition duration-200 ${
                  pathname === "/login"
                    ? "text-teal-600 font-semibold underline underline-offset-4"
                    : "text-gray-700 hover:text-teal-600"
                } `}
              >
                Login
              </Link>
            )}
            {session.data && (
              <button
                className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-blue-300 text-white flex items-center gap-2  rounded-2xl transition duration-500 cursor-pointer hover:from-emerald-600 hover:to-blue-400 "
                onClick={() =>
                  signOut({
                    redirect: true,
                    redirectTo: "/login",
                  })
                }
              >
                Logout
                <BiLogOut size={20} />
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
