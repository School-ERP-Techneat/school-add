import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import { Board, Medium, SchoolType } from "@prisma/client";
import { seedPermission } from "../utils/seedPermissions";
import { getSuperuserRole } from "../utils/findRole";

/* ----------------- Helpers ----------------- */
const mapAddressData = (address: any) => ({
  street: address.street,
  city: address.city,
  state: address.state,
  country: address.country,
  zipCode: address.zipCode,
});

const seedSuperUserPermissions = async (schoolCode: string) => {
  const superUserRole = await getSuperuserRole();
  if (!superUserRole) return;

  const modules = ["admin", "school", "student"];
  await Promise.all(
    modules.map((module) =>
      seedPermission({
        schoolCode,
        module,
        roleId: superUserRole.id,
        can_create: true,
        can_delete: true,
        can_update: true,
        can_read: true,
      })
    )
  );
};

/* ----------------- Controllers ----------------- */
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
        contactEmail,
        website,
        logoUrl,
        address,
      } = req.body;

      const school = await prisma.school.create({
        data: {
          name,
          code,
          affiliationNumber,
          board: board as Board,
          medium: medium as Medium,
          establishmentYear,
          schoolType: schoolType as SchoolType,
          contactPhone,
          contactEmail,
          website,
          logoUrl,
          address: { create: mapAddressData(address) },
        },
      });

      await seedSuperUserPermissions(code);

      return res.status(201).json({
        success: true,
        message: "School created successfully",
        data: school,
      });
    } catch (error) {
      console.error("Error while creating school:", error);
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
        message: "School fetched successfully",
        data: school,
      });
    } catch (error) {
      console.error("Error fetching school by code:", error);
      next(error);
    }
  }
);

export const getAllSchools = asyncHandler(
  async (_: Request, res: Response, next: NextFunction) => {
    try {
      const schools = await prisma.school.findMany({ include: { address: true } });

      return res.status(200).json({
        success: true,
        message: "Schools fetched successfully",
        data: schools,
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
            upsert: {
              create: mapAddressData(address),
              update: mapAddressData(address),
            },
          },
        },
        include: { address: true },
      });

      return res.status(200).json({
        success: true,
        message: "School updated successfully",
        data: school,
      });
    } catch (error) {
      console.error("Error updating school:", error);
      next(error);
    }
  }
);
