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
  room_no: string;
  name: string;
  classTeacherId: string;
  classId: string;
};

export default function ClassFormPage() {
  const { id } = useParams(); // 👈 classId from URL
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
  console.log("ClassId from URL:", accessToken);
  const fetchSections = async () => {
    try {
      const res = await fetch("https://developed-ballet-projectors-shall.trycloudflare.com/api/section/l", {
        headers: {
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch sections");
      setSections(data.sections || data || []); // adapt depending on API response
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    setAccessToken(getAccessToken());
    setSchoolCode(getSchoolCode());
    fetchTeachers();
    fetchSections();
  }, []);

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!roomNo || !className || !classTeacherId) {
      toast.error("Please fill all fields");
      return;
    }

    const payload = {
      room_no: roomNo,
      name: className,
      classTeacherId,
      classId: String(id), // 👈 from URL
    };

    try {
      setLoading(true);
      const res = await fetch(
        "https://developed-ballet-projectors-shall.trycloudflare.com/api/section/SCHOOL-1234-0000/",
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

      // refresh list after creation
      fetchSections();
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
            <label className="block text-sm font-medium mb-1">Class Teacher</label>
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
            <label className="block text-sm font-medium mb-1">Class ID (from URL)</label>
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
        {sections.length === 0 ? (
          <p className="text-gray-500">No sections found.</p>
        ) : (
          <ul className="space-y-2">
            {sections.map((s) => (
              <li
                key={s.id}
                className="p-3 border rounded-lg flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{s.name}</p>
                  <p className="text-sm text-gray-500">
                    Room: {s.room_no} | Teacher: {s.classTeacherId}
                  </p>
                </div>
                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded">
                  Class {s.classId}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
