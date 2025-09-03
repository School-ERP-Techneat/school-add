import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { hashPassword } from "../utils/bcrypt";
import { cookieOptions } from "./admin.controller";
import { createAccessToken } from "../utils/jwtUtil";
import { RoleName } from "@prisma/client";

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Extract locationCode from req.body or set a default value
    try {
      const { locationCode, password, email } = req.body;

      const lastUser = await prisma.schoolOwner.findFirst({
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
      const existing = await prisma.schoolOwner.findFirst({ where: { email } });
      if (existing) {
        return res
          .status(400)
          .json({ success: false, message: "Email already exists" });
      }

      const hashedPassword = await hashPassword(password);

      const schoolOwnerRole = await prisma.role.create({
        data: {
          name: RoleName.schoolOwner,
          schoolCode: generatedCode,
        },
      });

      const schoolOwner = await prisma.schoolOwner.create({
        data: {
          email,
          password: hashedPassword,
          schoolCode: generatedCode,
          role: {
            connect: {
              id: schoolOwnerRole.id,
            },
          },
        },
      });

      res.status(201).json({
        success: true,
        message: "Signup successful",
        data: {
          id: schoolOwner.id,
          email: schoolOwner.email,
          schoolCode: schoolOwner.schoolCode,
          roleId: schoolOwner.roleId,
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
      const { email, password, schoolCode } = req.body;

      const schoolOwner = await prisma.schoolOwner.findUnique({
        where: { email },
      });
      if (!schoolOwner) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const isMatch = await bcrypt.compare(password, schoolOwner.password);
      if (!isMatch) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const token = createAccessToken({
        id: schoolOwner.id,
        username: schoolOwner.email,
        schoolCode: schoolOwner.schoolCode,
        roleId: schoolOwner.roleId,
      });

      res
        .status(200)
        .cookie("accessToken", token, cookieOptions)
        .json({
          success: true,
          message: "Login successful",
          data: {
            user: {
              id: schoolOwner.id,
              email: schoolOwner.email,
              schoolCode: schoolOwner.schoolCode,
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
