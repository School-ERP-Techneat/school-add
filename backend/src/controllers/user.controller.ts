import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/bcrypt";
import { cookieOptions } from "./admin.controller";
import { token } from "morgan";
import { createAccessToken } from "../utils/jwtUtil";
import { getSuperuserRole } from "../utils/findRole";

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract locationCode from req.body or set a default value
    try {
      const { locationCode, password, email } = req.body;

      const lastUser = await prisma.user.findFirst({
        where: {
          schoolCode: {
            startsWith: `SCHOOL-${locationCode || "DEFAULT"}-`,
          },
        },
        orderBy: {
          schoolCode: "desc",
        },
      });

      let nextNumber = "0000";
      if (lastUser) {
        const lastCode = lastUser.schoolCode.split("-")[2];
        const next = parseInt(lastCode, 10) + 1;
        nextNumber = String(next).padStart(4, "0");
      }

      const generatedCode = `SCHOOL-${locationCode}-${nextNumber}`;
      const existing = await prisma.user.findFirst({ where: { email } });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const admin = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          schoolCode: generatedCode,
        },
      });

      res.status(201).json({
        success: true,
        message: "Signup successful",
        data: {
          id: admin.id,
          email: admin.email,
          schoolCode: admin.schoolCode,
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

      const admin = await prisma.user.findUnique({ where: { email } });
      if (!admin) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const superUserRole = await getSuperuserRole();

      const token = await createAccessToken({
        id: admin.id,
        username: admin.email,
        schoolCode: admin.schoolCode,
        roleId: superUserRole!.id,
      });
      res
        .status(200)
        .cookie("accessToken", token, cookieOptions)
        .json({
          success: true,
          message: "Login successful",
          data: {
            user: {
              id: admin.id,
              email: admin.email,
              schoolCode: admin.schoolCode,
            },
            accessToken: token,
          },
        });
    } catch (error) {
      console.log("Error during login:", error);
      next(error);
    }
  }
);
