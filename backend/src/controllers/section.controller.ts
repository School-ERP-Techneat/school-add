import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";

// ------------------- CREATE SECTION -------------------
export const createSection = asyncHandler(
  async (req: Request, res: Response) => {
    const { room_no, name, classId, classTeacherId } = req.body;

    const existingSection = await prisma.section.findFirst({
      where: {
        roomNo: room_no,
        classId,
        OR: [
          { classTeacherId },
          { name },
        ],
      },
    });

    if (existingSection) {
      return res.status(400).json({
        message: "Section with this name or classTeacher already exists",
        success: false,
      });
    }

    const createdSection = await prisma.section.create({
      data: {
        roomNo: room_no,
        name,
        classId,
        classTeacherId,
      },
    });

    return res.status(200).json({
      message: "Section created successfully",
      data: createdSection,
      success: true,
    });
  }
);

// ------------------- GET ALL SECTIONS -------------------
export const getAllSections = asyncHandler(
  async (req: Request, res: Response) => {
    const sections = await prisma.section.findMany({
      include: {
        class: true, // will fetch related class
        classTeacher: true, // will fetch related teacher
      },
      orderBy: {
        createdAt: "desc", // latest first (optional)
      },
    });

    return res.status(200).json({
      message: "All sections fetched successfully",
      data: sections,
      success: true,
    });
  }
);
