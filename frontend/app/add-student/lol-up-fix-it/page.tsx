"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";

// ✅ Local storage util
const getLS = (key: string) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

// ✅ Types
type FormData = {
  // Personal Info
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
  // Parent Info
  fatherName: string;
  motherName: string;
  guardianPhone: string;
  guardianEmail: string;
  // Academic Info
  previousSchool: string;
  dateOfAdmission: string;
  bloodGroup: string;
  medium: string;
  // Emergency Info
  emergencyName: string;
  emergencyPhone: string;
  relation: string;
  // Additional
  nationality: string;
  religion: string;
  disability: string;
  transport: string;
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
  fatherName: "",
  motherName: "",
  guardianPhone: "",
  guardianEmail: "",
  previousSchool: "",
  dateOfAdmission: "",
  bloodGroup: "",
  medium: "English",
  emergencyName: "",
  emergencyPhone: "",
  relation: "",
  nationality: "",
  religion: "",
  disability: "",
  transport: "No",
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
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  // ✅ Steps
  const steps = [
    "Personal Info",
    "Parent Info",
    "Academic Info",
    "Emergency Info",
    "Additional Details",
  ];

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
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/student/${schoolCode}/register`,
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
      setSubmitted(true);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Step navigation
  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex flex-col items-center p-6">
      <Toaster position="top-right" />

      {/* Section Info */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-3xl mb-6 border border-indigo-100"
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

      {/* Form Wizard */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl border border-indigo-100"
      >
        {submitted ? (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center text-center space-y-4"
          >
            <CheckCircle className="text-green-500 w-16 h-16" />
            <h2 className="text-2xl font-semibold text-indigo-700">
              Student Registered Successfully!
            </h2>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Stepper */}
            <div className="flex justify-between mb-6">
              {steps.map((s, i) => (
                <div key={s} className="flex-1 text-center">
                  <div
                    className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold transition ${
                      i === step
                        ? "bg-indigo-600 text-white"
                        : i < step
                        ? "bg-green-500 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {i + 1}
                  </div>
                  <p
                    className={`mt-2 text-xs ${
                      i === step ? "text-indigo-600" : "text-gray-500"
                    }`}
                  >
                    {s}
                  </p>
                </div>
              ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="space-y-4"
                >
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
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
                  <InputField name="fatherName" label="Father's Name" value={formData.fatherName} onChange={handleChange} />
                  <InputField name="motherName" label="Mother's Name" value={formData.motherName} onChange={handleChange} />
                  <InputField name="guardianPhone" label="Guardian Phone" value={formData.guardianPhone} onChange={handleChange} />
                  <InputField type="email" name="guardianEmail" label="Guardian Email" value={formData.guardianEmail} onChange={handleChange} />
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
                  <InputField name="previousSchool" label="Previous School" value={formData.previousSchool} onChange={handleChange} />
                  <InputField type="date" name="dateOfAdmission" label="Date of Admission" value={formData.dateOfAdmission} onChange={handleChange} />
                  <InputField name="bloodGroup" label="Blood Group" value={formData.bloodGroup} onChange={handleChange} />
                  <InputField name="medium" label="Medium of Study" value={formData.medium} onChange={handleChange} />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
                  <InputField name="emergencyName" label="Emergency Contact Name" value={formData.emergencyName} onChange={handleChange} />
                  <InputField name="emergencyPhone" label="Emergency Contact Phone" value={formData.emergencyPhone} onChange={handleChange} />
                  <InputField name="relation" label="Relation" value={formData.relation} onChange={handleChange} />
                </motion.div>
              )}

              {step === 4 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} className="space-y-4">
                  <InputField name="nationality" label="Nationality" value={formData.nationality} onChange={handleChange} />
                  <InputField name="religion" label="Religion" value={formData.religion} onChange={handleChange} />
                  <InputField name="disability" label="Disabilities (if any)" value={formData.disability} onChange={handleChange} />
                  <div>
                    <span className="text-sm font-medium text-gray-700">Transport Required</span>
                    <select
                      name="transport"
                      value={formData.transport}
                      onChange={handleChange}
                      className="w-full border border-gray-300 focus:border-indigo-500 focus:ring focus:ring-indigo-200 p-2 rounded-xl transition"
                    >
                      {["Yes", "No"].map((t) => (
                        <option key={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 0 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300"
                >
                  Back
                </button>
              )}
              {step < steps.length - 1 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                >
                  Next
                </button>
              ) : (
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileTap={{ scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  className="ml-auto px-6 py-2 bg-green-600 text-white rounded-xl shadow-md hover:bg-green-700 disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Submit"}
                </motion.button>
              )}
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
}
