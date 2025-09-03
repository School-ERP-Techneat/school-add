import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { createAccessToken } from "../utils/jwtUtil";
import prisma from "../config/prisma";

// 🍪 Cookie options
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const createAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, designation, schoolCode } = req.body;
      const hashedPassword = await hashPassword(password);

      let adminRole = await prisma.role.findFirst({
        where: {
          name: "admin",
          schoolCode,
        },
      });

      if (!adminRole) {
        adminRole = await prisma.role.create({
          data: {
            name: "admin",
            schoolCode,
          },
        });
      }

      const school = await prisma.school.findUnique({
        where: {
          code: schoolCode,
        },
      });
      if (!school) throw new Error("school not found");

      const createdAdmin = await prisma.admin.create({
        data: {
          designation,
          password: hashedPassword,
          username,
          school: {
            connect: {
              code: school.code,
            },
          },
          role: {
            connect: {
              id: adminRole!.id,
            },
          },
        },
        select: {
          username: true,
          designation: true,
          schoolCode: true,
          createdAt: true,
          id: true,
        },
      });
      res.status(200).json({
        message: "Admin Created Successfully",
        data: createdAdmin,
        success: true,
      });
    } catch (error) {
      console.log("An error occurred at createAdmin: ", error);
      next(error);
    }
  }
);

export const loginAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, schoolCode } = req.body;

      const admin = await prisma.admin.findUnique({
        where: {
          username_schoolCode: {
            username,
            schoolCode,
          },
        },
      });

      if (!admin)
        return res.status(401).json({ message: "Invalid Credentials" });

      const passwordMatch = await verifyPassword(
        password,
        admin.password as string
      );
      if (!passwordMatch) {
        return res.status(401).json({ message: "Invalid Credentials" });
      }

      const accessToken = createAccessToken({
        id: admin.id as string,
        username: admin.username as string,
        roleId: admin.roleId as string,
        schoolCode: admin.schoolCode as string,
      });

      return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .json({ message: "Sign in successful", accessToken });
    } catch (error) {
      console.log("Error inside the loginAdmin controller", error);
      next(error);
    }
  }
);

export const updateAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, designation } = req.body;
      const adminId = req.user?.id;

      const updatedAdmin = await prisma.admin.update({
        where: {
          id: adminId,
        },
        data: {
          username,
          designation,
        },
      });

      if (!updatedAdmin)
        return res.status(404).json({ message: "Admin not found" });

      return res
        .status(200)
        .json({ message: "Admin updated successfully", data: updatedAdmin });
    } catch (error) {
      console.log("Error inside the updateAdmin controller", error);
      next(error);
    }
  }
);

// ✅ Change Password
export const changeAdminPassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { oldPassword, newPassword } = req.body;
    const adminId = req.user?.id;

    const admin = await prisma.admin.findUnique({ where: { id: adminId } });
    if (!admin || !(await verifyPassword(oldPassword, admin.password)))
      return res
        .status(401)
        .json({ success: false, message: "Invalid old password" });

    await prisma.admin.update({
      where: { id: adminId },
      data: { password: await hashPassword(newPassword) },
    });

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  }
);

export const getAdminById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { adminId, schoolCode } = req.params;
      const admin = await prisma.admin.findUnique({
        where: { id: adminId, schoolCode },
        select: {
          id: true,
          username: true,
          designation: true,
          schoolCode: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!admin) {
        return res
          .status(404)
          .json({ success: false, message: "Admin not found" });
      }

      res.status(200).json({
        success: true,
        message: "Admin fetched successfully",
        data: admin,
      });
    } catch (error) {
      console.log("Error inside the getAdminById controller", error);
      next(error);
    }
  }
);

// ✅ Get Admins by School
export const getAdminsBySchoolCode = asyncHandler(
  async (req: Request, res: Response) => {
    const { schoolCode } = req.params;
    const admins = await prisma.admin.findMany({
      where: { schoolCode },
      select: {
        id: true,
        username: true,
        designation: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Admins for school ${schoolCode} fetched successfully`,
      data: admins,
    });
  }
);

// ✅ Delete Admin
export const deleteAdminById = asyncHandler(
  async (req: Request, res: Response) => {
    await prisma.admin.delete({ where: { id: req.params.adminId } });
    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  }
);

// ✅ Update Admin by ID
export const updateAdminById = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminId } = req.params;
    const { username, designation, password } = req.body;

    const updatedAdmin = await prisma.admin.update({
      where: { id: adminId },
      data: {
        username,
        designation,
        password: password ? await hashPassword(password) : undefined,
      },
    });

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: updatedAdmin,
    });
  }
);
