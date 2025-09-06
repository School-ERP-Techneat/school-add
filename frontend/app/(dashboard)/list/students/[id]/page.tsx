"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";

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

const SectionCard = ({ section }: { section: Section }) => (
  <li className="p-5 border rounded-xl bg-white shadow-sm hover:shadow-lg transition">
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Section Info */}
      <div className="space-y-1 text-sm">
        <p className="font-semibold text-indigo-700 text-lg">{section.name}</p>
        <p className="text-gray-600">
          <span className="font-medium">Room:</span> {section.roomNo}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Class ID:</span> {section.classId}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">Batch:</span> {section.batchId ?? "—"}
        </p>
        <p className="text-gray-600">
          <span className="font-medium">School Code:</span>{" "}
          {section.schoolCode ?? "—"}
        </p>
      </div>

      {/* Teacher Info */}
      <div className="text-left md:text-right">
        {section.classTeacher ? (
          <div className="inline-flex items-center gap-3 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-200">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-600 text-white font-bold">
              {section.classTeacher.fullName.charAt(0)}
            </div>
            <div className="text-left">
              <p className="font-semibold text-indigo-700">
                {section.classTeacher.fullName}
              </p>
              <p className="text-xs text-gray-600">{section.classTeacher.email}</p>
              <p className="text-xs text-gray-500">{section.classTeacher.phone}</p>
            </div>
          </div>
        ) : (
          <span className="text-sm text-gray-500 italic">
            No teacher assigned
          </span>
        )}
      </div>
    </div>

    {/* Action Buttons */}
    <div className="flex justify-end mt-4 gap-3">
      <Link
        href={`/list/students/section_student/?section_id=${section.id}&class_id=${section.classId}&batch_id=${section.batchId}&school_code=${section.schoolCode}&name=${section.name}&room_no=${section.roomNo}`}
      >
        <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-indigo-100 text-indigo-600 transition">
          👨‍🎓 View Students
        </button>
      </Link>
      <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-100 text-gray-600 transition">
        ✏️ Edit Section
      </button>
      {!section.classTeacher && (
        <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-green-100 text-green-600 transition">
          ➕ Assign Teacher
        </button>
      )}
    </div>
  </li>
);

export default function ClassFormPage() {
  const { id: rawId } = useParams();
  const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "";

  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);

  const accessToken = getLS("accessToken");
  const schoolCode = getLS("schoolCode");

  // ✅ Fetch sections
  const fetchSections = useCallback(async () => {
    if (!accessToken || !schoolCode) return;
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [accessToken, schoolCode]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-6">
      <Toaster position="top-right" />

      <div className="w-full max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          📚 Class Sections
        </h1>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="p-4 bg-indigo-100 rounded-xl text-center">
            <p className="text-sm text-gray-700">Total Sections</p>
            <p className="text-2xl font-bold">{sections.length}</p>
          </div>
          <div className="p-4 bg-green-100 rounded-xl text-center">
            <p className="text-sm text-gray-700">With Teacher</p>
            <p className="text-2xl font-bold">
              {sections.filter((s) => s.classTeacher).length}
            </p>
          </div>
          <div className="p-4 bg-red-100 rounded-xl text-center">
            <p className="text-sm text-gray-700">Without Teacher</p>
            <p className="text-2xl font-bold">
              {sections.filter((s) => !s.classTeacher).length}
            </p>
          </div>
        </div>

        {/* Section List */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-xl font-semibold mb-4 text-indigo-700">
            📋 Sections List
          </h2>
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : sections.length > 0 ? (
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
    </div>
  );
}
