"use client";

import React, { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import { Plus, Loader2, Trash2 } from "lucide-react";
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
  "http://localhost:4000";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const getSchoolCode = () =>
  typeof window !== "undefined" ? localStorage.getItem("schoolCode") : null;

// ------------------ Component ------------------
export default function ClassListPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);

  // Modal state
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [newName, setNewName] = useState("");
  const [newStandard, setNewStandard] = useState<number | "">("");
  const [newBatchId, setNewBatchId] = useState("");

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

  // ✅ Handle Create Class
  async function handleCreateClass(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newStandard || !newBatchId || !schoolCode) {
      toast.error("Please fill all fields");
      return;
    }

    setCreating(true);
    try {
      const accessToken = getAccessToken() ?? "";
      const res = await fetch(`${API_BASE}/api/class/${schoolCode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
        body: JSON.stringify({
          name: newName,
          standard: Number(newStandard),
          batchId: newBatchId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create class");

      toast.success("✅ Class created successfully!");
      setNewName("");
      setNewStandard("");
      setNewBatchId("");
      setShowForm(false);
      fetchClasses();
    } catch (err: any) {
      toast.error(err.message || "Error creating class");
    } finally {
      setCreating(false);
    }
  }

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

      {/* Floating Add Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg"
      >
        <Plus size={28} />
      </motion.button>

      {/* Modal Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            onClick={() => setShowForm(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg mx-4 sm:mx-0"
            >
              <h2 className="text-2xl font-bold text-indigo-600 mb-4 text-center">
                ➕ Create New Class
              </h2>
              <form onSubmit={handleCreateClass} className="grid gap-4">
                <input
                  type="text"
                  placeholder="Class Name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <input
                  type="number"
                  placeholder="Standard"
                  value={newStandard}
                  onChange={(e) =>
                    setNewStandard(e.target.value ? Number(e.target.value) : "")
                  }
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  required
                />
                <select
                  value={newBatchId}
                  onChange={(e) => setNewBatchId(e.target.value)}
                  className="p-3 border rounded-lg focus:ring-2 focus:ring-indigo-400"
                  required
                >
                  <option value="">Select Batch</option>
                  {batches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.year} (
                      {new Date(batch.startDate).toLocaleDateString()} -{" "}
                      {new Date(batch.endDate).toLocaleDateString()})
                    </option>
                  ))}
                </select>
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
                    disabled={creating}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md w-full sm:w-auto"
                  >
                    {creating ? "Creating..." : "Create"}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Class List */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="animate-spin w-8 h-8 text-gray-600" />
        </div>
      ) : classes.length === 0 ? (
        <p className="text-gray-600 text-center">No classes found.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((cls) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="rounded-2xl shadow-md hover:shadow-xl transition bg-white">
                <div className="p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">{cls.name}</h2>
                    <button
                      onClick={() => handleDelete(cls.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                  <p className="text-gray-600">Standard: {cls.standard}</p>
                  <div className="text-sm text-gray-500">
                    <p>
                      <span className="font-medium">Batch:</span>{" "}
                      {cls.batch?.year}
                    </p>
                    <p>
                      <span className="font-medium">School:</span>{" "}
                      {cls.school?.name}
                    </p>
                    <p>
                      <span className="font-medium">Board:</span>{" "}
                      {cls.school?.board}
                    </p>
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
                  <Link href={`/list/classes/${cls.id}`}>
                    <button className="text-blue-500 hover:text-blue-700 font-medium transition">
                      Edit
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
