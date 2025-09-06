"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Loader2, Trash2, BookOpen, Users } from "lucide-react";
import Link from "next/link";

// ------------------ Types ------------------
type School = {
  code: string;
  name: string;
  board: string;
  medium: string;
  schoolType: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
};

type Batch = {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
};

type ClassItem = {
  id: string;
  name: string;
  standard: number;
  createdAt: string;
  updatedAt: string;
  school: School;
  batch: Batch;
};

// ------------------ Helpers ------------------
const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://developed-ballet-projectors-shall.trycloudflare.com";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const getSchoolCode = () =>
  typeof window !== "undefined" ? localStorage.getItem("schoolCode") : null;

// ------------------ Component ------------------
export default function ClassListPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);

  const schoolCode = getSchoolCode();

  // ✅ Fetch Classes
  const fetchClasses = useCallback(async () => {
    if (!schoolCode) return;
    setLoading(true);
    try {
      const accessToken = getAccessToken() ?? "";
      const res = await fetch(`${API_BASE}/api/class/${schoolCode}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch classes");

      setClasses(data.data || []);
    } catch (err: any) {
      toast.error(err.message || "Error loading classes");
    } finally {
      setLoading(false);
    }
  }, [schoolCode]);

  // ✅ Fetch Batches
  const fetchBatches = useCallback(async () => {
    if (!schoolCode) return;
    try {
      const accessToken = getAccessToken() ?? "";
      const res = await fetch(`${API_BASE}/api/batch/${schoolCode}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch batches");

      setBatches(data.data || []);
    } catch (err: any) {
      toast.error(err.message || "Error loading batches");
    }
  }, [schoolCode]);

  useEffect(() => {
    if (schoolCode) {
      fetchClasses();
      fetchBatches();
    }
  }, [schoolCode, fetchClasses, fetchBatches]);

  // ✅ Delete Class
  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this class?")) return;

    try {
      const accessToken = getAccessToken() ?? "";
      const res = await fetch(
        `${API_BASE}/api/class/${schoolCode}/classId/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete class");

      toast.success("🗑️ Class deleted successfully!");
      fetchClasses();
    } catch (err: any) {
      toast.error(err.message || "Error deleting class");
    }
  }

  // ------------------ UI ------------------
  if (!schoolCode) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        School code not found in localStorage
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 p-6">
      <Toaster position="top-right" />
      <h1 className="text-3xl font-bold text-center sm:text-left mb-8 text-gray-800">
        📚 Class List ({classes.length})
      </h1>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-indigo-100 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-700">Total Classes</p>
          <p className="text-2xl font-bold">{classes.length}</p>
        </div>
        <div className="bg-green-100 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-700">Latest Batch</p>
          <p className="text-lg font-medium">
            {batches[batches.length - 1]?.year ?? "—"}
          </p>
        </div>
        <div className="bg-yellow-100 p-4 rounded-xl text-center">
          <p className="text-sm text-gray-700">Standards Covered</p>
          <p className="text-lg font-medium">
            {[...new Set(classes.map((c) => c.standard))].join(", ") || "—"}
          </p>
        </div>
      </div>

      {/* Class List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
        </div>
      ) : classes.length === 0 ? (
        <p className="text-gray-600 text-center">No classes found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => {
            const batchActive =
              new Date(cls.batch.endDate) > new Date() ? "Active" : "Expired";
            return (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="rounded-2xl shadow-md hover:shadow-xl transition bg-white overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{cls.name}</h2>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        batchActive === "Active"
                          ? "bg-green-400"
                          : "bg-red-400"
                      }`}
                    >
                      {batchActive}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-700">
                        Std {cls.standard}
                      </span>
                      <button
                        onClick={() => handleDelete(cls.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>

                    <div className="text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Batch:</span>{" "}
                        {cls.batch?.year} (
                        {new Date(cls.batch.startDate).toLocaleDateString()} -{" "}
                        {new Date(cls.batch.endDate).toLocaleDateString()})
                      </p>
                      <p>
                        <span className="font-medium">Board:</span>{" "}
                        {cls.school?.board}
                      </p>
                      <p>
                        <span className="font-medium">Medium:</span>{" "}
                        {cls.school?.medium}
                      </p>
                      <p>
                        <span className="font-medium">School:</span>{" "}
                        {cls.school?.name}
                      </p>
                      {cls.school?.contactEmail && (
                        <p>
                          <span className="font-medium">Email:</span>{" "}
                          {cls.school.contactEmail}
                        </p>
                      )}
                      {cls.school?.contactPhone && (
                        <p>
                          <span className="font-medium">Phone:</span>{" "}
                          {cls.school.contactPhone}
                        </p>
                      )}
                    </div>

                    {cls.school?.logoUrl && (
                      <img
                        src={cls.school.logoUrl}
                        alt={cls.school.name}
                        className="mt-3 h-12 object-contain"
                      />
                    )}

                    <p className="text-xs text-gray-400">
                      Created: {new Date(cls.createdAt).toLocaleDateString()}
                    </p>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4">
                      <Link href={`/list/students/${cls.id}`}>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-indigo-50 text-indigo-600 transition">
                          <Users size={16} /> Sections
                        </button>
                      </Link>
                      <Link href={`/list/students/${cls.id}`}>
                        <button className="flex items-center gap-1 px-3 py-1.5 text-sm border rounded-lg hover:bg-green-50 text-green-600 transition">
                          <BookOpen size={16} /> Students
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
