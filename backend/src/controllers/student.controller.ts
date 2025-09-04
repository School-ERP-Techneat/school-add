import { Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { createAccessToken } from "../utils/jwtUtil";
import { asyncHandler } from "../utils/asyncHandler";
import { StudentStatus } from "@prisma/client";
import { connect } from "http2";

export const registerStudent = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const {
        name,
        email,
        password,
        schoolCode,
        admissionNo,
        sectionId,
        batchId,
      } = req.body;

      const existingStudent = await prisma.student.findUnique({
        where: { email },
      });

      if (existingStudent) {
        return res
          .status(400)
          .json({ message: "Student with this email already exists" });
      }

      const hashedPassword = await hashPassword(password);

      let studentRole = await prisma.role.findUnique({
        where: {
          name_schoolCode: {
            name: "student",
            schoolCode,
          },
        },
      });

      if (!studentRole) {
        studentRole = await prisma.role.create({
          data: {
            name: "student",
            schoolCode,
          },
        });
      }
      const student = await prisma.student.create({
        data: {
          name,
          email,
          admissionNo,
          password: hashedPassword,
          section: {
            connect: {
              id: sectionId,
            },
          },
          role: {
            connect: {
              id: studentRole?.id,
            },
          },
          status: StudentStatus.INACTIVE,
          Batch: {
            connect: {
              id: batchId,
            },
          },
          School: {
            connect: {
              code: schoolCode,
            },
          },
        },
      });

      res.status(201).json({
        message:
          "Student registered successfully. Waiting for teacher approval.",
        student,
      });
    } catch (error) {
      res.status(500).json({ message: "Error registering student", error });
    }
  }
);

export const loginStudent = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const student = await prisma.student.findUnique({ where: { email } });
    if (!student) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (student.status !== "ACTIVE") {
      return res
        .status(403)
        .json({ message: "Account not approved by teacher yet." });
    }

    const isMatch = await verifyPassword(password, student.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = createAccessToken({
      id: student.id,
      roleId: "student",
      schoolCode: student.schoolCode,
      username: email,
    });

    res.json({ message: "Login successful", accessToken: token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in student", error });
  }
};

// Get All Details of Student
export async function getStudentDetails(req: Request, res: Response) {
  try {
    const user = req.user!;

    const currentUser = await prisma.student.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        dob: true,
        gender: true,
        address: true,
        email: true,
        phone: true,
        photo: true,
        admissionNo: true,
        aadhar: true,
        category: true,
        sectionId: true,
        status: true,
        schoolCode: true,
        attendance: true,
        School: true,
        section: true,
        fees: true,
        submissions: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!currentUser) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.json(currentUser);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

// Updating Student Details
export async function updateStudentDetails(req: Request, res: Response) {
  try {
    const user = req.user!;
    const { address, phone, photo } = req.body;

    const updated = await prisma.student.update({
      where: { id: user.id },
      data: {
        ...(address ? { address } : {}),
        ...(phone ? { phone } : {}),
        ...(photo !== undefined ? { photo } : {}),
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        photo: true,
        updatedAt: true,
      },
    });

    return res.json({ message: "Updated successfully", student: updated });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}

export const getAllActiveClassStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;
    const students = await prisma.student.findMany({
      where: {
        sectionId: sectionId,
        status: "ACTIVE",
      },
    });

    return res.status(200).json({
      data: students,
      success: true,
      message: "Students Fetched successfully",
    });
  }
);

export const getAllInactiveClassStudents = asyncHandler(
  async (req: Request, res: Response) => {
    const { sectionId } = req.params;

    const students = await prisma.student.findMany({
      where: {
        sectionId: sectionId,
        status: "INACTIVE",
      },
    });

    return res.status(200).json({
      data: students,
      success: true,
      message: "Inactive Students Fetched successfully",
    });
  }
);

export const updateStudentActiveStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { studentId } = req.params;
    const { status } = req.body;

    const student = await prisma.student.update({
      where: { id: studentId },
      data: { status: status as StudentStatus },
    });

    return res.status(200).json({
      data: student,
      success: true,
      message: "Student status updated successfully",
    });
  }
);

export const createStudent = asyncHandler(
  async (req: Request, res: Response) => {
    const {
      name,
      email,
      admissionNo,
      sectionId,
      batchId,
      schoolCode,
      password,
    } = req.body;

    let studentRole = await prisma.role.findUnique({
      where: {
        name_schoolCode: {
          name: "student",
          schoolCode,
        },
      },
    });

    if (!studentRole) {
      studentRole = await prisma.role.create({
        data: {
          name: "student",
          schoolCode,
        },
      });
    }

    const hashedPassword = await hashPassword(password);
    const newStudent = await prisma.student.create({
      data: {
        name,
        email,
        admissionNo,
        password: hashedPassword,
        section: {
          connect: {
            id: sectionId,
          },
        },
        role: {
          connect: {
            id: studentRole?.id,
          },
        },
        status: StudentStatus.ACTIVE,
        Batch: {
          connect: {
            id: batchId,
          },
        },
        School: {
          connect: {
            code: schoolCode,
          },
        },
      },
    });

    return res.status(201).json({
      data: newStudent,
      success: true,
      message: "Student created successfully",
    });
  }
);
