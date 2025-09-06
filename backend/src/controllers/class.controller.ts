import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";
import { getBatchForSchool } from "../middlewares/createBatch";

// ✅ Create a class
export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { standard, schoolCode } = req.body;

  // Check if class already exists

  const batch = await getBatchForSchool(schoolCode);

  const existingClass = await prisma.class.findFirst({
    where: {
      standard,
      schoolCode,
      batchId: batch.id,
    },
  });

  if (existingClass) {
    return res.status(400).json({
      success: false,
      message: "Class already exists",
    });
  }

  // Create new class
  const createdClass = await prisma.class.create({
    data: {
      standard,
      school: {
        connect: { code: schoolCode },
      },
      batch: {
        connect: { id: batch.id },
      },
    },
  });

  return res.status(201).json({
    success: true,
    message: "Class created successfully",
    data: createdClass,
  });
});

// ✅ Get all classes
export const getAllClasses = asyncHandler(
  async (req: Request, res: Response) => {
    const { schoolCode } = req.params;

    const classes = await prisma.class.findMany({
      where: {
        schoolCode,
      },
      include: {
        school: true, // related school
        batch: true, // related batch
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return res.status(200).json({
      success: true,
      message: "Classes fetched successfully",
      data: classes,
    });
  }
);
