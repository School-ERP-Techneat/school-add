"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const getAccessToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

const getSchoolCode = () =>
  typeof window !== "undefined" ? localStorage.getItem("schoolCode") : null;

type Teacher = {
  id: string;
  fullName: string;
};

type Section = {
  id: string;
  roomNo: string;
  name: string;
  classId: string;
  classTeacherId: string;
  classTeacher?: {
    id: string;
    fullName: string;
    email: string;
    phone: string;
  };
};

export default function ClassFormPage() {
  const { id } = useParams(); // classId from URL
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [schoolCode, setSchoolCode] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [roomNo, setRoomNo] = useState("");
  const [className, setClassName] = useState("");
  const [classTeacherId, setClassTeacherId] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch teachers
  const fetchTeachers = async () => {
    const token = getAccessToken();
    const code = getSchoolCode();
    if (!token || !code) return;

    try {
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/teacher/${code}/all`,
        {
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include",
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch teachers");
      setTeachers(data.teachers || []);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // ✅ Fetch sections
  const fetchSections = async () => {
    if (!schoolCode) return;

    try {
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/section/${schoolCode}`,
        {
          headers: {
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          credentials: "include",
        }
      );

      const data = await res.json();
      console.log("📦 Sections API Response:", data);

      if (!res.ok) throw new Error(data.message || "Failed to fetch sections");

      if (Array.isArray(data.data)) {
        setSections(data.data);
      } else {
        setSections([]);
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setAccessToken(getAccessToken());
    setSchoolCode(getSchoolCode());
  }, []);

  useEffect(() => {
    if (accessToken && schoolCode) {
      fetchTeachers();
      fetchSections();
    }
  }, [accessToken, schoolCode]);

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNo || !className || !classTeacherId) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      roomNo,
      name: className,
      classTeacherId,
      classId: String(id),
    };

    try {
      setLoading(true);
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/section/${schoolCode}/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify(payload),
          credentials: "include",
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create section");

      toast.success("✅ Section created successfully!");
      console.log("📦 API Response:", data);

      // reset form
      setRoomNo("");
      setClassName("");
      setClassTeacherId("");

      fetchSections(); // refresh
    } catch (error: any) {
      toast.error(error.message);
      console.error("❌ API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center">🏫 Create Class</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Room No */}
          <div>
            <label className="block text-sm font-medium mb-1">Room No</label>
            <input
              type="text"
              value={roomNo}
              onChange={(e) => setRoomNo(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter room number"
              required
            />
          </div>

          {/* Class Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Class Name</label>
            <input
              type="text"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="w-full border p-2 rounded-lg"
              placeholder="Enter class name"
              required
            />
          </div>

          {/* Class Teacher (Dropdown) */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Class Teacher
            </label>
            <select
              value={classTeacherId}
              onChange={(e) => setClassTeacherId(e.target.value)}
              className="w-full border p-2 rounded-lg"
              required
            >
              <option value="">-- Select Teacher --</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Hidden ClassId */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Class ID (from URL)
            </label>
            <input
              type="text"
              value={id}
              readOnly
              className="w-full border p-2 rounded-lg bg-gray-100"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </form>
      </div>

      {/* ✅ Section List */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">📋 Sections List</h2>
        {Array.isArray(sections) && sections.length > 0 ? (
          <ul className="space-y-2">
            {sections.map((s) => (
              <li
                key={s.id}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-500">
                    Room: {s.roomNo} | Teacher:{" "}
                    {s.classTeacher?.fullName || "Unknown"}
                  </p>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                  Class {s.classId}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No sections found.</p>
        )}
      </div>
    </div>
  );
}
