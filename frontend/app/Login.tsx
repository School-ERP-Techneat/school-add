'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSchool } from '../context/SchoolContext';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

const Login: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { school } = useSchool();

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<'admin' | 'student' | 'teacher'>('admin');
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [schoolCode, setSchoolCode] = useState<string | null>(null);

  // ✅ Get schoolCode from query param
  useEffect(() => {
    const code = searchParams.get('school');
    if (code) {
      setSchoolCode(code);
      localStorage.setItem('schoolCode', code); // only storing safe info
    } else {
      toast.error('School code is missing in URL.');
    }
  }, [searchParams]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Role-based login URLs
  const getLoginUrl = (role: string, schoolCode: string) => {
    switch (role) {
      case 'admin':
        return ` https://developed-ballet-projectors-shall.trycloudflare.com /api/admin/${schoolCode}/login`;
      case 'student':
        return ` https://developed-ballet-projectors-shall.trycloudflare.com /api/student/${schoolCode}/login`;
      case 'teacher':
        return ` https://developed-ballet-projectors-shall.trycloudflare.com /api/teacher/${schoolCode}/login`;
      default:
        return '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!schoolCode) {
      toast.error('School code missing.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(getLoginUrl(role, schoolCode), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', // ✅ critical for cookie-based auth
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log('Login response:', data);

      if (!response.ok || data.success) {
        throw new Error(data.message || 'Login failed');
      }

      // ✅ Do NOT save accessToken in localStorage (secure cookie only)
      localStorage.setItem('role', role);
      localStorage.setItem('schoolCode', schoolCode);

      toast.success('Login successful 🎉');
      router.push(`/${role}`);
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100">
      <Toaster position="top-right" />

      {/* Navbar */}
      <header className="border-b border-gray-200 px-6 py-3 bg-white/70 backdrop-blur-md shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Image
            src={
              school?.logoUrl &&
              (school.logoUrl.startsWith('/') || school.logoUrl.startsWith('http'))
                ? school.logoUrl
                : '/logo.png'
            }
            alt="School Logo"
            width={36}
            height={36}
            className="rounded-full shadow"
          />
          <h1 className="text-lg font-bold text-gray-900">
            {school?.name || 'School Name'}
          </h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium text-gray-800 hover:text-indigo-600">Home</a>
          <a href="#" className="text-sm font-medium text-gray-800 hover:text-indigo-600">About</a>
          <a href="#" className="text-sm font-medium text-gray-800 hover:text-indigo-600">Contact</a>
        </nav>
      </header>

      {/* Login Section */}
      <main className="flex-1 flex justify-center items-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-8 border border-gray-100"
        >
          <header className="text-center mb-8">
            <h1 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
              Login
            </h1>
            <p className="text-gray-600">Welcome back! Enter your credentials below.</p>
          </header>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-900 mb-2">Select Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'student' | 'teacher')}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-gray-900"
            >
              <option value="admin">Admin</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Username */}
            <div className="relative">
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 text-gray-900 placeholder-transparent focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Username"
              />
              <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                Username
              </label>
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="peer w-full px-4 pt-5 pb-2 rounded-xl border border-gray-300 text-gray-900 placeholder-transparent focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400"
                placeholder="Password"
              />
              <label className="absolute left-4 top-2 text-sm text-gray-500 transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm peer-focus:text-indigo-500">
                Password
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full font-bold py-3 px-4 rounded-xl shadow-md transition duration-300 ${
                loading
                  ? 'bg-indigo-200 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:opacity-90 text-white'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center text-sm text-gray-600">
            <a href="#" className="hover:text-indigo-600 font-medium">Forgot password?</a>
            <span className="mx-2">•</span>
            <a href="#" className="hover:text-indigo-600 font-medium">Need help?</a>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Login;