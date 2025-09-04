import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";

// ✅ Create a class
export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { name, standard, schoolCode, batchId } = req.body;

  // Check if class already exists
  const existingClass = await prisma.class.findFirst({
    where: {
      standard,
      schoolCode,
      batchId,
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
      name,
      standard,
      school: {
        connect: { code: schoolCode },
      },
      batch: {
        connect: { id: batchId },
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
export const getAllClasses = asyncHandler(async (req: Request, res: Response) => {
  const classes = await prisma.class.findMany({
    include: {
      school: true, // related school
      batch: true,  // related batch
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
});
