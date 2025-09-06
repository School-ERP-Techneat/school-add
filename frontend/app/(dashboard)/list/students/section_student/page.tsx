"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  Loader2,
  Users,
  AlertCircle,
  Search,
  GraduationCap,
  Building2,
  Layers,
  Filter,
} from "lucide-react";

const getLS = (key: string) =>
  typeof window !== "undefined" ? localStorage.getItem(key) : null;

type Student = {
  id: string;
  name: string;
  admissionNo?: string;
  email?: string;
  status: string;
};

export default function SectionStudentPage() {
  const searchParams = useSearchParams();
  const sectionId = searchParams.get("section_id");
  const classId = searchParams.get("class_id");
  const batchId = searchParams.get("batch_id");
  const schoolCode = searchParams.get("school_code");
  const name = searchParams.get("name");
  const roomNo = searchParams.get("room_no");

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");

  const accessToken = getLS("accessToken");

  useEffect(() => {
    if (!schoolCode || !sectionId) return;

    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `https://developed-ballet-projectors-shall.trycloudflare.com/api/student/${schoolCode}/all/inactive/class-section/${sectionId}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const data = await res.json();
        setStudents(data?.data || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [schoolCode, sectionId]);

  // ✅ Filter students by search + status
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.admissionNo?.toLowerCase().includes(search.toLowerCase()) ||
        s.email?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" ? true : s.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="p-6 border rounded-2xl shadow bg-gradient-to-r from-indigo-50 to-white">
        <h1 className="text-3xl font-bold text-gray-800">
          Section Student Dashboard
        </h1>
        <p className="text-gray-600 mt-1">
          Overview of students in this section
        </p>
      </div>

      {/* Section Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
          <div>
            <p className="text-sm text-gray-500">Class ID</p>
            <p className="font-semibold">{classId}</p>
          </div>
        </div>
        <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3">
          <Layers className="w-8 h-8 text-green-600" />
          <div>
            <p className="text-sm text-gray-500">Section ID</p>
            <p className="font-semibold">{sectionId}</p>
          </div>
        </div>
        <div className="p-4 border rounded-xl shadow-sm bg-white flex items-center gap-3">
          <Building2 className="w-8 h-8 text-orange-600" />
          <div>
            <p className="text-sm text-gray-500">School Code</p>
            <p className="font-semibold">{schoolCode}</p>
          </div>
        </div>
      </div>

      {/* Summary Stats (Live with filters) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-4 bg-indigo-100 border rounded-xl text-center">
          <p className="text-sm text-gray-600">Total Students</p>
          <p className="text-2xl font-bold">{filteredStudents.length}</p>
        </div>
        <div className="p-4 bg-red-100 border rounded-xl text-center">
          <p className="text-sm text-gray-600">Inactive</p>
          <p className="text-2xl font-bold">
            {filteredStudents.filter((s) => s.status === "inactive").length}
          </p>
        </div>
        <div className="p-4 bg-green-100 border rounded-xl text-center">
          <p className="text-sm text-gray-600">Active</p>
          <p className="text-2xl font-bold">
            {filteredStudents.filter((s) => s.status === "active").length}
          </p>
        </div>
      </div>

      {/* Search + Filter + Students Table */}
      <div className="p-6 border rounded-2xl shadow bg-white">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            Students
          </h2>

          {/* Search + Filter Controls */}
          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, admission no, or email..."
                className="pl-8 pr-3 py-2 border rounded-lg text-sm w-full"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 border rounded-lg px-3 py-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                className="bg-transparent text-sm outline-none"
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value as "all" | "active" | "inactive")
                }
              >
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin w-6 h-6 text-gray-500" />
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <AlertCircle className="w-10 h-10 mb-2" />
            <p>No students match your filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-200 text-sm">
              <thead>
                <tr className="bg-gray-100 text-gray-700 text-left">
                  <th className="border p-2">ID</th>
                  <th className="border p-2">Name</th>
                  <th className="border p-2">Admission No</th>
                  <th className="border p-2">Email</th>
                  <th className="border p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`transition-colors ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50`}
                  >
                    <td className="border p-2">{student.id}</td>
                    <td className="border p-2 font-medium">{student.name}</td>
                    <td className="border p-2">
                      {student.admissionNo || "—"}
                    </td>
                    <td className="border p-2">{student.email || "—"}</td>
                    <td className="border p-2">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          student.status === "inactive"
                            ? "bg-red-100 text-red-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
