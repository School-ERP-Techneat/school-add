import { NextFunction, Request, Response } from "express";
import prisma from "../config/prisma";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { createAccessToken } from "../utils/jwtUtil";
import { asyncHandler } from "../utils/asyncHandler";
import { cookieOptions } from "./admin.controller";

export const registerTeacher = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email, phone, password, designation, schoolCode } =
        req.body;

      const existingTeacher = await prisma.teacher.findUnique({
        where: { email },
      });
      if (existingTeacher) {
        return res
          .status(400)
          .json({ message: "Teacher with this email already exists" });
      }

      let teacherRole = await prisma.role.findUnique({
        where: {
          name: "teacher",
          schoolCode,
        },
      });

      if (!teacherRole) {
        teacherRole = await prisma.role.create({
          data: {
            name: "teacher",
            schoolCode,
          },
        });
      }

      const hashedPassword = await hashPassword(password);

      const teacher = await prisma.teacher.create({
        data: {
          fullName,
          email,
          phone,
          password: hashedPassword,
          designation,
          school: {
            connect: {
              code: schoolCode,
            },
          },
          role: {
            connect: {
              id: teacherRole!.id,
            },
          },
          status: "ACTIVE",
        },
      });

      res.status(201).json({
        message: "Teacher registered successfully",
        teacher,
      });
    } catch (error) {
      console.log("Error Registering Teacher: ", error);
      next(error);
    }
  }
);

export const loginTeacher = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password, schoolCode } = req.body;

      const teacher = await prisma.teacher.findUnique({
        where: { email, schoolCode },
      });
      if (!teacher) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      if (teacher.status !== "ACTIVE") {
        return res
          .status(403)
          .json({ message: "Account not approved by admin yet." });
      }

      const isMatch = await verifyPassword(password, teacher.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = createAccessToken({
        id: teacher.id,
        roleId: teacher.roleId!,
        schoolCode: teacher.schoolCode!,
        username: email,
      });

      res
        .status(200)
        .cookie("accessToken", token, cookieOptions)
        .json({ message: "Login successful", token });
    } catch (error) {
      console.log("Error Logging in Teacher: ", error);
      next(error);
    }
  }
);

export const updateTeacher = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { teacherId } = req.params || req.user!.id;
      const { fullName, phone, designation, email, password } = req.body;

      const teacher = await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          fullName,
          phone,
          designation,
          email,
          password: password ? await hashPassword(password) : undefined,
        },
        select: {
          id: true,
          fullName: true,
          phone: true,
          designation: true,
          email: true,
        },
      });

      res.json({ message: "Teacher updated successfully", teacher });
    } catch (error) {
      next(error);
    }
  }
);

export const getTeacherProfile = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.user!.id;

      const teacher = await prisma.teacher.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return res.status(404).json({ message: "Teacher not found" });
      }

      res.json({ message: "Teacher retrieved successfully", teacher });
    } catch (error) {
      console.log("Error Getting Teacher Profile: ", error);
      next(error);
    }
  }
);

export const getTeacherById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const teacherId = req.params.teacherId;
      const teacher = await prisma.teacher.findUnique({
        where: {
          id: teacherId,
        },
      });

      if (!teacher)
        return res.status(404).json({
          success: false,
          message: "Teacher not found",
        });
      return res.status(200).json({
        success: true,
        message: "Teacher retrieved successfully",
        teacher,
      });
    } catch (error) {
      console.log("Error Getting Teacher by ID: ", error);
      next(error);
    }
  }
);

export const getAllTeachers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schoolCode = req.params.schoolCode;

      const teachers = await prisma.teacher.findMany({
        where: { schoolCode, status: "ACTIVE" },
      });

      return res.status(200).json({
        success: true,
        message: "Teachers retrieved successfully",
        teachers,
      });
    } catch (error) {
      console.log("Error Getting All Teachers: ", error);
      next(error);
    }
  }
);

export const deleteTeacher = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { teacherId } = req.params;

      await prisma.teacher.update({
        where: { id: teacherId },
        data: {
          status: "INACTIVE",
        },
      });

      return res.status(200).json({
        success: true,
        message: "Teacher deleted successfully",
      });
    } catch (error) {
      console.log("Error Deleting Teacher: ", error);
      next(error);
    }
  }
);
