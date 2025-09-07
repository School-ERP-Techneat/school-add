"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

// ✅ Local storage util
const getLS = (key: string) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

// ✅ Types
type FormData = {
  name: string;
  dob: string;
  gender: string;
  email: string;
  password: string;
  phone: string;
  photo: string;
  admissionNo: string;
  aadhar: string;
  category: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
  };
};

// ✅ Initial state constant
const INITIAL_FORM: FormData = {
  name: "",
  dob: "",
  gender: "Male",
  email: "",
  password: "",
  phone: "",
  photo: "",
  admissionNo: "",
  aadhar: "",
  category: "General",
  address: { street: "", city: "", state: "", country: "", zipCode: "" },
};

// ✅ Reusable Input component
const InputField = ({
  label,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="flex flex-col space-y-1">
    {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
    <input
      {...props}
      className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 rounded-xl transition"
    />
  </div>
);

export default function AddStudentPage() {
  const params = useSearchParams();
  const accessToken = getLS("accessToken");

  // ✅ Params
  const sectionId = params.get("section_id") ?? "";
  const classId = params.get("class_id") ?? "";
  const batchId = params.get("batch_id") ?? "";
  const schoolCode = params.get("school_code") ?? "";
  const sectionName = params.get("name") ?? "";
  const roomNo = params.get("room_no") ?? "";

  // ✅ State
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);

  // ✅ Handle input change
  const handleChange = useCallback(
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
      nested: boolean = false
    ) => {
      const { name, value } = e.target;
      setFormData((prev) =>
        nested
          ? { ...prev, address: { ...prev.address, [name]: value } }
          : { ...prev, [name]: value }
      );
    },
    []
  );

  // ✅ Submit student form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, dob, email, password } = formData;
    if (!name || !dob || !email || !password) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = { ...formData, classId, sectionId, batchId };

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:4000/api/student/${schoolCode}/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to register student");

      toast.success("✅ Student registered successfully!");
      setFormData(INITIAL_FORM);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-6">
      <Toaster position="top-right" />

      {/* Section Info */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-2xl mb-6 border border-indigo-100"
      >
        <h1 className="text-2xl font-bold text-indigo-700 mb-4 flex items-center gap-2">
          📘 Section Details
        </h1>
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          {[
            ["Section", sectionName],
            ["Room No", roomNo],
            ["Section ID", sectionId],
            ["Class ID", classId],
            ["Batch ID", batchId],
            ["School Code", schoolCode],
          ].map(([label, value]) => (
            <motion.p
              key={label}
              whileHover={{ scale: 1.05 }}
              className="bg-indigo-50 p-2 rounded-lg"
            >
              <span className="font-semibold">{label}:</span> {value}
            </motion.p>
          ))}
        </div>
      </motion.div>

      {/* Add Student Form */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-2xl border border-indigo-100"
      >
        <h2 className="text-xl font-semibold text-indigo-700 mb-6">
          📝 Add Student
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField name="name" label="Full Name" value={formData.name} onChange={handleChange} required />
          <InputField type="date" name="dob" label="Date of Birth" value={formData.dob} onChange={handleChange} required />
          <div>
            <span className="text-sm font-medium text-gray-700">Gender</span>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 rounded-xl transition"
            >
              {["Male", "Female", "Other"].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
          <InputField type="email" name="email" label="Email" value={formData.email} onChange={handleChange} required />
          <InputField type="password" name="password" label="Password" value={formData.password} onChange={handleChange} required />
          <InputField type="tel" name="phone" label="Phone" value={formData.phone} onChange={handleChange} />
          <InputField name="photo" label="Photo URL" value={formData.photo} onChange={handleChange} />
          <InputField name="admissionNo" label="Admission No" value={formData.admissionNo} onChange={handleChange} />
          <InputField name="aadhar" label="Aadhar No" value={formData.aadhar} onChange={handleChange} />
          <div>
            <span className="text-sm font-medium text-gray-700">Category</span>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 rounded-xl transition"
            >
              {["General", "OBC", "SC", "ST"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {["street", "city", "state", "country", "zipCode"].map((field) => (
              <InputField
                key={field}
                name={field}
                label={field[0].toUpperCase() + field.slice(1)}
                value={(formData.address as any)[field]}
                onChange={(e) => handleChange(e, true)}
              />
            ))}
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.02 }}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl shadow-md hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Register Student"}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
