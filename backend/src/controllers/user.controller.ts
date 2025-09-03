import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/bcrypt";
import { cookieOptions } from "./admin.controller";
import { createAccessToken } from "../utils/jwtUtil";
import { getSuperuserRole } from "../utils/findRole";

/* ---------------- Helpers ---------------- */
const generateSchoolCode = async (locationCode: string) => {
  const lastUser = await prisma.user.findFirst({
    where: {
      schoolCode: { startsWith: `SCHOOL-${locationCode}-` },
    },
    orderBy: { schoolCode: "desc" },
  });

  let nextNumber = "0000";
  if (lastUser) {
    const lastCode = lastUser.schoolCode.split("-")[2];
    const next = parseInt(lastCode, 10) + 1;
    nextNumber = String(next).padStart(4, "0");
  }

  return `SCHOOL-${locationCode}-${nextNumber}`;
};

/* ---------------- Controllers ---------------- */
export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { locationCode = "DEFAULT", password, email } = req.body;

      // Check if email already exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "Email already exists",
        });
      }

      // Generate unique school code
      const generatedCode = await generateSchoolCode(locationCode);

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await prisma.user.create({
        data: { email, password: hashedPassword, schoolCode: generatedCode },
      });

      return res.status(201).json({
        success: true,
        message: "Signup successful",
        data: {
          id: user.id,
          email: user.email,
          schoolCode: user.schoolCode,
        },
      });
    } catch (error) {
      console.error("Error during signup:", error);
      next(error);
    }
  }
);

export const loginUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      // Get superuser role
      const superUserRole = await getSuperuserRole();
      if (!superUserRole) {
        return res.status(500).json({
          success: false,
          message: "Superuser role not found",
        });
      }

      // Generate JWT
      const accessToken = await createAccessToken({
        id: user.id,
        username: user.email,
        schoolCode: user.schoolCode,
        roleId: superUserRole.id,
      });

      // Set cookie + return response
      return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .json({
          success: true,
          message: "Login successful",
          data: {
            user: {
              id: user.id,
              email: user.email,
              schoolCode: user.schoolCode,
            },
            accessToken,
          },
        });
    } catch (error) {
      console.error("Error during login:", error);
      next(error);
    }
  }
);
