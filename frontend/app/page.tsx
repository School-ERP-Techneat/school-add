"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [role, setRole] = useState("admin");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("role", role);

    if (formData.username && formData.password) {
      setLoading(true);
      setTimeout(() => {
        router.push(`/${role}`);
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-100">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 sm:px-8 py-3 bg-white shadow-sm">
        <nav className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">SchoolConnect</h1>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-700">Home</a>
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-700">About</a>
            <a href="#" className="text-sm font-medium text-gray-900 hover:text-gray-700">Contact</a>
            <button className="bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold py-2 px-6 rounded-xl">
              Login
            </button>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex justify-center items-center px-4 sm:px-8 md:px-16 py-12">
        <div className="w-full max-w-sm sm:max-w-md md:max-w-xl bg-white shadow-xl rounded-2xl p-6 sm:p-8">
          <header className="text-center mb-6 sm:mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Login</h1>
            <p className="text-sm sm:text-base text-gray-600">Welcome back! Please enter your credentials.</p>
          </header>

          {/* Role Selector */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-1">Select Role</label>
            <select
              onChange={(e) => setRole(e.target.value)}
              value={role}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-900 bg-white"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter your username"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter your password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-300 text-gray-900"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full font-bold py-3 px-4 rounded-xl transition duration-200 ${
                  loading
                    ? "bg-blue-200 text-gray-600 cursor-not-allowed"
                    : "bg-blue-400 hover:bg-blue-500 text-white"
                }`}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>

            <div className="text-center">
              <a href="#" className="text-sm text-gray-600 hover:text-gray-800">
                Forgot Password?
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Login;
