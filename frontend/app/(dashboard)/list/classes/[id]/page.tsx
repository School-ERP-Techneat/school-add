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

export default function ClassFormPage() {
  const { id } = useParams(); // 👈 classId from URL
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [schoolCode, setSchoolCode] = useState<string | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [roomNo, setRoomNo] = useState("");
  const [className, setClassName] = useState("");
  const [classTeacherId, setClassTeacherId] = useState("");

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

  useEffect(() => {
    setAccessToken(getAccessToken());
    setSchoolCode(getSchoolCode());
    fetchTeachers();
  }, []);

  // ✅ Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
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

    console.log("✅ Submitted Data:", payload);
    toast.success("Form submitted! Check console for payload.");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Toaster position="top-right" />
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg">
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
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
}
