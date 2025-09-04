'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import { Plus, Trash2 } from 'lucide-react';

type Teacher = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
  createdAt: string;
};

const TeacherRegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    designation: '',
  });

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // ✅ Get accessToken from localStorage
  const getAccessToken = () =>
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // ✅ Get schoolCode from localStorage
  const getSchoolCode = () =>
    typeof window !== 'undefined' ? localStorage.getItem('schoolCode') : null;

  // ✅ Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Register teacher
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const accessToken = getAccessToken();
    const schoolCode = getSchoolCode();
    
    if (!accessToken) {
      toast.error('You must be logged in.');
      return;
    }

    if (!schoolCode) {
      toast.error('You must be logged in with a valid school.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/teacher/${schoolCode}/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      toast.success('✅ Teacher registered successfully!');
      setFormData({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        designation: '',
      });
      setShowForm(false); // close form
      fetchTeachers();
    } catch (error: any) {
      toast.error(error.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch teachers
  const fetchTeachers = async () => {
    const accessToken = getAccessToken();
    const schoolCode = getSchoolCode();
    
    if (!accessToken || !schoolCode) return;

    try {
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/teacher/${schoolCode}/all`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) throw new Error(data.message || 'Failed to fetch teachers');
      setTeachers(data.teachers || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ✅ Delete teacher
  const deleteTeacher = async (teacherId: string) => {
    const accessToken = getAccessToken();
    const schoolCode = getSchoolCode();

    if (!accessToken || !schoolCode) return;

    if (!confirm('Are you sure you want to delete this teacher?')) return;

    try {
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/teacher/${schoolCode}/teacherId/${teacherId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include',
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to delete teacher');

      toast.success('🗑️ Teacher deleted successfully!');
      fetchTeachers();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-4 sm:p-6 relative">
      <Toaster position="top-right" />

      {/* Floating + Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg"
      >
        <Plus size={28} />
      </motion.button>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg mx-4 sm:mx-0"
          >
            <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
              👩‍🏫 Register class
            </h2>
            <form onSubmit={handleRegister} className="grid gap-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Full Name"
                required
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                required
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Password"
                required
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                required
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
              />
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleInputChange}
                placeholder="Designation"
                required
                className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400 w-full"
              />
              <div className="flex flex-col sm:flex-row justify-between gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 bg-gray-200 rounded-lg w-full sm:w-auto"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md w-full sm:w-auto"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Teacher List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto mt-10 bg-white shadow-lg rounded-2xl p-4 sm:p-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center sm:text-left">
          📋 Registered class
        </h2>

        {teachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="hidden sm:table w-full border-collapse border rounded-lg">
              <thead>
                <tr className="bg-indigo-100 text-indigo-700 text-left">
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Designation</th>
                  <th className="p-3">Joined On</th>
                  <th className="p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((t) => (
                  <tr key={t.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{t.fullName}</td>
                    <td className="p-3">{t.email}</td>
                    <td className="p-3">{t.phone}</td>
                    <td className="p-3">{t.designation}</td>
                    <td className="p-3">
                      {new Date(t.createdAt).toLocaleDateString('en-IN', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => deleteTeacher(t.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile Card List */}
            <div className="sm:hidden grid gap-4">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  className="border rounded-xl p-4 shadow-sm bg-gray-50 flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t.fullName}
                    </h3>
                    <button
                      onClick={() => deleteTeacher(t.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-600">{t.email}</p>
                  <p className="text-sm text-gray-600">{t.phone}</p>
                  <p className="text-sm text-gray-600">{t.designation}</p>
                  <p className="text-xs text-gray-500">
                    Joined:{" "}
                    {new Date(t.createdAt).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600 text-center">No teachers found.</p>
        )}
      </motion.div>
    </div>
  );
};

export default TeacherRegisterPage;
