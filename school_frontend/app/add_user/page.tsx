'use client';
import React, { useEffect, useState } from "react";
import { FaEnvelope, FaLock, FaUserTie, FaUserShield } from "react-icons/fa";

export default function RegisterAdmin() {
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    designation: "",
    schoolCode: "",
  });
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Sync userId from localStorage
  useEffect(() => {
    const storedId = localStorage.getItem("userId");
    if (storedId) {
      setUserId(storedId);
      setFormData(prev => ({ ...prev, schoolCode: storedId }));
    } else {
      console.warn("No userId found in localStorage");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch("https://school-backend-2-don7.onrender.com/api/admin/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      console.log(formData)
      const data = await res.json();
      setResponse(data);

      // Optional: Reset form on success
      if (data.success) {
        setFormData({
          username: "",
          password: "",
          designation: "",
          schoolCode: userId || "",
        });
      }
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-500 to-blue-500 px-4 py-10">
      <div className="bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 w-full max-w-md border border-white/30 animate-fadeInUp">
        <h2 className="text-3xl font-bold text-center mb-6 text-white drop-shadow-md">✨ Register Admin</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div className="relative animate-fadeInUp animation-delay-100">
            <FaEnvelope className="absolute top-3 left-3 text-black" />
            <input
              type="email"
              name="username"
              placeholder="Email address"
              required
              value={formData.username}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/30 text-black placeholder-black/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
            />
          </div>

          {/* Password */}
          <div className="relative animate-fadeInUp animation-delay-200">
            <FaLock className="absolute top-3 left-3 text-black" />
            <input
              type="password"
              name="password"
              placeholder="Secure password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/30 text-black placeholder-black/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
            />
          </div>

          {/* Designation */}
          <div className="relative animate-fadeInUp animation-delay-300">
            <FaUserTie className="absolute top-3 left-3 text-black" />
            <input
              type="text"
              name="designation"
              placeholder="Designation (e.g. Principal)"
              required
              value={formData.designation}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/30 text-black placeholder-black/70 border border-white/40 focus:outline-none focus:ring-2 focus:ring-indigo-300 transition-all"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 px-4 rounded-lg text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-indigo-300 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.02]"
            }`}
          >
            {loading ? "Registering..." : "🚀 Register Now"}
          </button>
        </form>

        {/* Response */}
        {response && (
          <div className="mt-6 bg-white/30 p-4 rounded-lg border border-white/40 text-black animate-fadeInUp">
            <h4 className="font-semibold mb-2">Server Response:</h4>
            <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
