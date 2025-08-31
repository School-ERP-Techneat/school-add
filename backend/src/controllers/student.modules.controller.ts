import { Request, Response } from "express";
import prisma from "../config/prisma";

// Get Class Teacher
export async function getClassTeacher(req: Request, res: Response) {
  try {
    const user = req.user!;
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: {
        section: {
          select: {
            classTeacher: {
              select: { id: true, fullName: true, email: true, phone: true },
            },
          },
        },
      },
    });

    if (!student) return res.status(404).json({ message: "Student not found" });
    return res.json(student.section.classTeacher ?? {});
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

// Get Attendance
export async function getAttendance(req: Request, res: Response) {
  try {
    const user = req.user!;
    const attendance = await prisma.attendance.findMany({
      where: { studentId: user.id },
      orderBy: { date: "desc" },
    });

    return res.json(attendance);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

// Get Exams & Syllabus
export async function getExamSyllabus(req: Request, res: Response) {
  try {
    const user = req.user!;
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true, sectionId: true },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const exams = await prisma.exam.findMany({
      where: { classId: student.classId, sectionId: student.sectionId },
      include: { syllabus: true },
    });

    return res.json(exams);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

// Get Class Schedules
export async function getClassSchedules(req: Request, res: Response) {
  try {
    const user = req.user!;
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true, sectionId: true },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const schedules = await prisma.classSchedule.findMany({
      where: { classId: student.classId, sectionId: student.sectionId },
      orderBy: [{ day: "asc" }, { period: "asc" }],
    });

    return res.json(schedules);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

// Get Assignments
export async function getAssignments(req: Request, res: Response) {
  try {
    const user = req.user!;
    const student = await prisma.student.findUnique({
      where: { id: user.id },
      select: { classId: true, sectionId: true },
    });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const assignments = await prisma.assignment.findMany({
      where: { classId: student.classId, sectionId: student.sectionId },
      orderBy: { dueDate: "asc" },
    });

    return res.json(assignments);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

// Get Results
export async function getResults(req: Request, res: Response) {
  try {
    const user = req.user!;
    const results = await prisma.result.findMany({
      where: { studentId: user.id },
      include: { exam: true },
    });

    return res.json(results);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

// Get Fees Details
export async function getFees(req: Request, res: Response) {
  try {
    const user = req.user!;
    const fees = await prisma.fee.findMany({
      where: { studentId: user.id },
      orderBy: { dueDate: "asc" },
    });

    return res.json(fees);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
