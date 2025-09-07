import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import { AttendanceStatus } from "@prisma/client";

export const createAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const sectionId = req.params.sectionId;
    const teacherId = req.user?.id;

    const attendanceDate = new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const students = await prisma.student.findMany({
      where: {
        sectionId,
        status: "ACTIVE",
      },
    });

    if (students.length == 0) {
      return res.status(404).json({
        success: false,
        message: "No Student Found for this Section",
      });
    }

    const attendanceRecord = students.map((student) => ({
      studentId: student.id,
      sectionId,
      date: attendanceDate,
      status: AttendanceStatus.ABSENT, // enum value
      teacherId,
    }));

    const createdAttendance = await prisma.attendance.createManyAndReturn({
      data: attendanceRecord,
      skipDuplicates: true,
    });

    return res.status(201).json({
      data: createdAttendance,
      success: true,
      message: "Attendance created successfully",
    });
  }
);

export const markAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    const teacherId = req.user!.id;
    const { attendanceData } = req.body;

    const attendanceDate = new Date();
    attendanceDate.setHours(0, 0, 0, 0);

    const presentStudentIds = attendanceData.reduce((acc: any[], item: any) => {
      if (item.status === AttendanceStatus.PRESENT) {
        acc.push(item.studentId);
      }
      return acc;
    }, []);

    const absentStudentIds = attendanceData.reduce((acc: any[], item: any) => {
      if (item.status === AttendanceStatus.ABSENT) {
        acc.push(item.studentId);
      }
      return acc;
    }, []);

    const presents = await prisma.attendance.updateMany({
      where: {
        sectionId,
        date: attendanceDate,
        teacherId,
        studentId: {
          in: presentStudentIds,
        },
      },
      data: {
        status: AttendanceStatus.PRESENT,
      },
    });
    const absents = await prisma.attendance.updateMany({
      where: {
        sectionId,
        date: attendanceDate,
        teacherId,
        studentId: {
          in: absentStudentIds,
        },
      },
      data: {
        status: AttendanceStatus.ABSENT,
      },
    });

    return res.status(200).json({
      data: {
        presents,
        absents,
      },
      success: true,
      message: "Attendance marked successfully",
    });
  }
);

export const markAttendanceById = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId, date, sectionId, teacherId, status } = req.body;

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const attendanceRecord = await prisma.attendance.updateMany({
      where: {
        studentId,
        date: attendanceDate,
        sectionId,
        teacherId,
      },
      data: {
        status: status as AttendanceStatus,
      },
    });

    return res.status(200).json({
      data: attendanceRecord,
      success: true,
      message: "Attendance marked successfully",
    });
  }
);

export const getAttendanceBySection = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    const { date } = req.query;

    let attendanceDate;

    if (date) attendanceDate = new Date(date as string);
    else attendanceDate = new Date();

    attendanceDate.setHours(0, 0, 0, 0);

    const records = await prisma.attendance.findMany({
      where: { sectionId: sectionId as string, date: attendanceDate },

      select: {
        id: true,
        date: true,
        status: true,
        studentId: true,
        sectionId: true,
        section: {
          select: {
            class: {
              select: {
                standard: true,
                batch: {
                  select: {
                    year: true,
                    startDate: true,
                    endDate: true,
                  },
                },
              },
            },
            name: true,
          },
        },
        student: {
          select: {
            name: true,
            gender: true,
            email: true,
          },
        },
      },
    });

    const attendanceData = records.map((record) => ({
      id: record.id,
      date: record.date,
      status: record.status,
      sectionId: record.sectionId,
      section: record.section.name,
      batch: record.section.class.batch,
      student: {
        id: record.studentId,
        ...record.student,
      },
    }));
    return res.status(200).json({
      success: true,
      data: attendanceData,
      message: "Attendance records retrieved successfully",
    });
  }
);

export const getStudentAttendance = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId, sectionId } = req.query;

    const records = await prisma.attendance.findMany({
      where: {
        studentId: studentId as string,
        sectionId: sectionId as string,
      },
    });

    return res.status(200).json({
      success: true,
      total: records.length,
      data: {
        present: records.filter((r) => r.status === "PRESENT").length,
        absent: records.filter((r) => r.status === "ABSENT").length,
        leave: records.filter((r) => r.status === "LEAVE").length,
      },
      message: "Student attendance retrieved successfully",
    });
  }
);

export const getSectionReport = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.query;

    const records = await prisma.attendance.findMany({
      where: {
        sectionId: sectionId as string,
      },
    });

    const grouped = records.reduce((acc, record) => {
      if (!acc[record.studentId]) acc[record.studentId] = [];
      acc[record.studentId].push(record);
      return acc;
    }, {} as Record<string, typeof records>);

    const report = Object.entries(grouped).map(([studentId, recs]) => ({
      studentId,
      total: recs.length,
      present: recs.filter((r) => r.status === "PRESENT").length,
      absent: recs.filter((r) => r.status === "ABSENT").length,
    }));

    return res.status(200).json({
      success: true,
      report,
    });
  }
);
