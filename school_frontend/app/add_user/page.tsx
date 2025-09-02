'use client';
import { useEffect, useState } from 'react';
import { FaEnvelope, FaLock, FaUserTie } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '../components/Footer';

export default function RegisterAdmin() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    designation: '',
    schoolCode: '',
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Get schoolCode from cookie
  useEffect(() => {
    const match = document.cookie.match(/userId=([^;]+)/);
    if (match) {
      setFormData(prev => ({ ...prev, schoolCode: match[1] }));
    } else {
      toast.error('School ID not found. Please log in again.');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch(
        'https://school-backend-2-don7.onrender.com/api/admin/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }
      );
      console.log(formData);
      const data = await res.json();
      setResponse(data);

      if (res.ok && data.success) {
        toast.success('🎉 Admin registered successfully!');
        setFormData(prev => ({
          username: '',
          password: '',
          designation: '',
          schoolCode: prev.schoolCode,
        }));
      } else {
        toast.error(data.message || 'Registration failed');
      }
    } catch (err: any) {
      toast.error('Network error. Please try again.');
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
        <Header darkMode={darkMode} setDarkMode={setDarkMode} />
      {/* Cool animated gradient background with floating shapes */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-12 bg-gradient-to-br from-purple-600 via-indigo-700 to-blue-900">
        {/* Floating Shapes */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-400/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-bounce" />
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative z-10 bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/40 hover:border-indigo-300 transition-all duration-300"
        >
          <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-lg">
            ✨ Register Admin
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              icon={<FaEnvelope />}
              type="email"
              name="username"
              placeholder="Email address"
              value={formData.username}
              onChange={handleChange}
              disabled={loading}
            />
            <InputField
              icon={<FaLock />}
              type="password"
              name="password"
              placeholder="Secure password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            <InputField
              icon={<FaUserTie />}
              type="text"
              name="designation"
              placeholder="Designation (e.g. Principal)"
              value={formData.designation}
              onChange={handleChange}
              disabled={loading}
            />

            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-lg transition-all duration-300 ${
                loading
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
              }`}
            >
              {loading ? 'Registering...' : '🚀 Register Now'}
            </motion.button>
          </form>

          {/* Collapsible server response */}
          {response && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="mt-6 bg-white/30 p-4 rounded-lg border border-white/40 text-black overflow-auto max-h-60"
            >
              <h4 className="font-semibold mb-2">📡 Server Response:</h4>
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(response, null, 2)}
              </pre>
            </motion.div>
          )}
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
}

// ✅ Reusable input field with focus animation
const InputField = ({
  icon,
  ...props
}: {
  icon: React.ReactNode;
  type: string;
  name: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="relative"
  >
    <div className="absolute top-3 left-3 text-gray-700">{icon}</div>
    <input
      {...props}
      className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/40 text-black placeholder-gray-700 border border-transparent focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 focus:outline-none transition-all shadow-sm"
    />
  </motion.div>
);
