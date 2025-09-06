"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

// ✅ LocalStorage helpers
const getLS = (key: string) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

type Teacher = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
};

type Section = {
  id: string;
  roomNo: string;
  name: string;
  classId: string;
  classTeacherId: string;
  batchId?: string;
  schoolCode?: string;
  classTeacher?: Teacher;
};

// ✅ Small reusable form field components
const Input = ({
  label,
  value,
  onChange,
  placeholder,
  readOnly = false,
}: {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  readOnly?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      readOnly={readOnly}
      className={`w-full border p-2 rounded-lg focus:ring focus:ring-indigo-200 ${
        readOnly ? "bg-gray-100" : ""
      }`}
      placeholder={placeholder}
      required
    />
  </div>
);

const Select = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
}) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <select
      value={value}
      onChange={onChange}
      className="w-full border p-2 rounded-lg focus:ring focus:ring-indigo-200"
      required
    >
      <option value="">-- Select --</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const SectionCard = ({ section }: { section: Section }) => (
  <li className="p-4 border rounded-lg bg-gray-50 shadow-sm hover:shadow-md transition">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
      <p>
        <span className="font-semibold">Room No:</span> {section.roomNo}
      </p>
      <p>
        <span className="font-semibold">Name:</span> {section.name}
      </p>
      <p>
        <span className="font-semibold">ID:</span> {section.id}
      </p>
      <p>
        <span className="font-semibold">Class ID:</span> {section.classId}
      </p>
      <p>
        <span className="font-semibold">Teacher ID:</span>{" "}
        {section.classTeacherId}
      </p>
      <p>
        <span className="font-semibold">Batch ID:</span>{" "}
        {section.batchId ?? "N/A"}
      </p>
      <p>
        <span className="font-semibold">School Code:</span>{" "}
        {section.schoolCode ?? "N/A"}
      </p>
    </div>

    {section.classTeacher ? (
      <div className="mt-3 p-3 rounded-lg bg-indigo-50 border border-indigo-200">
        <p className="font-semibold text-indigo-700">👩‍🏫 Teacher Details</p>
        <p>
          <span className="font-semibold">ID:</span> {section.classTeacher.id}
        </p>
        <p>
          <span className="font-semibold">Name:</span>{" "}
          {section.classTeacher.fullName}
        </p>
        <p>
          <span className="font-semibold">Email:</span>{" "}
          {section.classTeacher.email}
        </p>
        <p>
          <span className="font-semibold">Phone:</span>{" "}
          {section.classTeacher.phone}
        </p>
      </div>
    ) : (
      <p className="mt-2 text-gray-500">No teacher assigned</p>
    )}

    <div className="flex justify-end mt-3">
      <Link
        href={`/add-student/?section_id=${section.id}&class_id=${section.classId}&batch_id=${section.batchId}&school_code=${section.schoolCode}&name=${section.name}&room_no=${section.roomNo}`}
      >
        <button className="px-3 py-1.5 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition">
          ✏️ add student
        </button>
      </Link>
    </div>
  </li>
);

export default function ClassFormPage() {
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "";

  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [sections, setSections] = useState<Section[]>([]);
  const [roomNo, setRoomNo] = useState("");
  const [className, setClassName] = useState("");
  const [classTeacherId, setClassTeacherId] = useState("");
  const [loading, setLoading] = useState(false);

  const accessToken = getLS("accessToken");
  const schoolCode = getLS("schoolCode");

  // ✅ Fetch teachers
  const fetchTeachers = useCallback(async () => {
    if (!accessToken || !schoolCode) return;
    try {
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/teacher/${schoolCode}/all`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch teachers");

      setTeachers(
        (data.teachers || []).map((t: any) => ({
          id: t.id,
          fullName: t.full_name ?? t.fullName,
          email: t.email,
          phone: t.phone,
        }))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [accessToken, schoolCode]);

  // ✅ Fetch sections
  const fetchSections = useCallback(async () => {
    if (!accessToken || !schoolCode) return;
    try {
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/section/${schoolCode}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch sections");

      setSections(
        (data.data || []).map((s: any) => ({
          id: s.id,
          roomNo: s.roomNo,
          name: s.name,
          classId: s.classId,
          classTeacherId: s.classTeacher?.id,
          batchId: s.class?.batchId,
          schoolCode: s.class?.schoolCode,
          classTeacher: s.classTeacher && {
            id: s.classTeacher.id,
            fullName: s.classTeacher.fullName,
            email: s.classTeacher.email,
            phone: s.classTeacher.phone,
          },
        }))
      );
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [accessToken, schoolCode]);

  useEffect(() => {
    fetchTeachers();
    fetchSections();
  }, [fetchTeachers, fetchSections]);

  // ✅ Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNo || !className || !classTeacherId) {
      toast.error("Please fill all fields");
      return;
    }
    if (!id) {
      toast.error("Class ID missing in URL");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `https://developed-ballet-projectors-shall.trycloudflare.com/api/section/${schoolCode}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            room_no: roomNo,
            name: className,
            classTeacherId,
            classId: id,
          }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create section");

      toast.success("✅ Section created successfully!");
      setRoomNo("");
      setClassName("");
      setClassTeacherId("");
      fetchSections();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      <Toaster position="top-right" />

      {/* ✅ Create Class Form */}
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-lg mb-8">
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          🏫 Create Class Section
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Room No"
            value={roomNo}
            onChange={(e) => setRoomNo(e.target.value)}
            placeholder="Enter room number"
          />
          <Input
            label="Class Name"
            value={className}
            onChange={(e) => setClassName(e.target.value)}
            placeholder="Enter class name"
          />
          <Select
            label="Class Teacher"
            value={classTeacherId}
            onChange={(e) => setClassTeacherId(e.target.value)}
            options={teachers.map((t) => ({
              value: t.id,
              label: t.fullName,
            }))}
          />
          {id && <Input label="Class ID (from URL)" value={id} readOnly />}

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
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4 text-indigo-700">
          📋 Sections List
        </h2>
        {sections.length > 0 ? (
          <ul className="space-y-4">
            {sections.map((s) => (
              <SectionCard key={s.id} section={s} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No sections found.</p>
        )}
      </div>
    </div>
  );
}
