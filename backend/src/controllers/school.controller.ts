import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import { Board, Medium, SchoolType } from "@prisma/client";
import { seedPermission } from "../utils/seedPermissions";
import { getSuperuserRole } from "../utils/findRole";

const seedSuperUserPermissions = async (schoolCode: string) => {
  const superUserRole = await getSuperuserRole();
  await seedPermission({
    schoolCode,
    module: "admin",
    roleId: superUserRole!.id,
    can_create: true,
    can_delete: true,
    can_update: true,
    can_read: true,
  });
  await seedPermission({
    schoolCode,
    module: "school",
    roleId: superUserRole!.id,
    can_create: true,
    can_delete: true,
    can_update: true,
    can_read: true,
  });
  await seedPermission({
    schoolCode,
    module: "student",
    roleId: superUserRole!.id,
    can_create: true,
    can_delete: true,
    can_update: true,
    can_read: true,
  });
};
export const createSchool = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        code,
        affiliationNumber,
        board,
        medium,
        establishmentYear,
        schoolType,
        contactPhone,
        website,
        logoUrl,
        address,
      } = req.body;
      const school = await prisma.school.create({
        data: {
          board: board as Board,
          schoolType: schoolType as SchoolType,
          name,
          code,
          affiliationNumber,
          medium: medium as Medium,
          establishmentYear,
          contactPhone,
          website,
          logoUrl,
          address: {
            create: {
              street: address.street,
              city: address.city,
              state: address.state,
              country: address.country,
              zipCode: address.zipCode,
            },
          },
        },
      });
      await seedSuperUserPermissions(code);

      return res.status(200).json({
        data: school,
        success: true,
        message: "School created successfully",
      });
    } catch (error) {
      console.log("Error while creating a school", error);
      next(error);
    }
  }
);

export const getSchoolByCode = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { schoolCode } = req.params;

      const school = await prisma.school.findUnique({
        where: { code: schoolCode },
        include: { address: true },
      });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: `No school found with code ${schoolCode}`,
        });
      }

      return res.status(200).json({
        success: true,
        data: school,
        message: "School fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching school by code:", error);
      next(error);
    }
  }
);

export const getAllSchools = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const schools = await prisma.school.findMany();

      return res.status(200).json({
        success: true,
        data: schools,
        message: "Schools fetched successfully",
      });
    } catch (error) {
      console.error("Error fetching all schools:", error);
      next(error);
    }
  }
);

export const updateSchool = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { schoolCode } = req.params;
      const {
        name,
        affiliationNumber,
        board,
        medium,
        establishmentYear,
        schoolType,
        contactPhone,
        contactEmail,
        website,
        logoUrl,
        address,
      } = req.body;

      const school = await prisma.school.update({
        where: { code: schoolCode },
        data: {
          name,
          affiliationNumber,
          board: board as Board,
          medium: medium as Medium,
          establishmentYear,
          schoolType: schoolType as SchoolType,
          contactPhone,
          contactEmail,
          website,
          logoUrl,
          address: {
            update: {
              street: address.street,
              city: address.city,
              state: address.state,
              country: address.country,
              zipCode: address.zipCode,
            },
          },
        },
      });

      return res.status(200).json({
        data: school,
        success: true,
        message: "School updated successfully",
      });
    } catch (error) {
      console.error("Error updating school:", error);
      next(error);
    }
  }
);
