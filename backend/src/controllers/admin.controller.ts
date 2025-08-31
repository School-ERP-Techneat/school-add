import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { hashPassword, verifyPassword } from "../utils/bcrypt";
import { createAccessToken } from "../utils/jwtUtil";
import prisma from "../config/prisma";
import { getAdminRole } from "../utils/findRole";
import { seedPermission } from "../utils/seedPermissions";
import { success } from "zod";

export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 day
};

const seedAdminPermissions = async (schoolCode: string) => {
  const adminRole = await getAdminRole();
  await seedPermission({
    schoolCode,
    module: "admin",
    roleId: adminRole!.id,
    can_create: true,
    can_delete: true,
    can_update: true,
    can_read: true,
  });
  await seedPermission({
    schoolCode,
    module: "teacher",
    roleId: adminRole!.id,
    can_create: true,
    can_delete: true,
    can_update: true,
    can_read: true,
  });
  await seedPermission({
    schoolCode,
    module: "student",
    roleId: adminRole!.id,
    can_create: true,
    can_delete: true,
    can_update: true,
    can_read: true,
  });
};

export const createAdmin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { username, password, designation, schoolCode } = req.body;
      const hashedPassword = await hashPassword(password);
      const adminRole = await getAdminRole();
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
      });
      await seedAdminPermissions(schoolCode);
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
        .json({ message: "Sign in successful" });
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

export const changeAdminPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { oldPassword, newPassword } = req.body;

      const adminId = req.user?.id;

      const admin = await prisma.admin.findUnique({
        where: {
          id: adminId,
        },
        select: {
          id: true,
          password: true,
        },
      });

      if (!admin)
        return res.status(401).json({ message: "UNAUTHORIZED REQUEST" });

      const passwordMatch = await verifyPassword(oldPassword, admin?.password);
      if (!passwordMatch)
        return res.status(401).json({ message: "Invalid old password" });

      const hashedNewPassword = await hashPassword(newPassword);
      await prisma.admin.update({
        where: {
          id: adminId,
        },
        data: {
          password: hashedNewPassword,
        },
      });
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      console.log("Error inside the changeAdminPassword controller", error);
      next(error);
    }
  }
);
// ** Admin approves teacher to Register (NOT IN USE)**
export const approveTeacher = async (req: Request, res: Response) => {
  try {
    const { teacherId } = req.params;

    const teacher = await prisma.teacher.update({
      where: { id: teacherId },
      data: { status: "ACTIVE" },
    });

    res.json({ message: "Teacher approved successfully", teacher });
  } catch (error) {
    res.status(500).json({ message: "Error approving teacher", error });
  }
};

export const getAdminsBySchoolCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { schoolCode } = req.params;

      const admins = await prisma.admin.findMany({
        where: {
          schoolCode: schoolCode,
        },
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
    } catch (error) {
      console.log("Error fetching admins by schoolCode:", error);
      next(error);
    }
  }
);

export const deleteAdminById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { adminId } = req.params;

    await prisma.admin.delete({
      where: {
        id: adminId,
      },
    });

    return res.status(200).json({
      success: true,
      message: "admin deleted successfully",
    });
  }
);

export const updateAdminById = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminId } = req.params;

    const { username, designation, password } = req.body;

    let hashedNewPassword = "";
    if (password) {
      hashedNewPassword = await hashPassword(password);
    }
    await prisma.admin.update({
      where: {
        id: adminId,
      },
      data: {
        username,
        designation,
        password: hashedNewPassword ? hashedNewPassword : undefined,
      },
    });

    return res.status(200).json({
      success: true,
      message: "admin updated successfully",
    });
  }
);

export const getAdminById = asyncHandler(
  async (req: Request, res: Response) => {
    const { adminId, schoolCode } = req.params;

    const admin = await prisma.admin.findUnique({
      where: {
        id: adminId,
        schoolCode: schoolCode,
      },
    });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    return res
      .status(200)
      .json({ success: true, message: "Admin details", data: admin });
  }
);
