import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";

// ✅ Create batch
export const createBatch = asyncHandler(async (req: Request, res: Response) => {
  const { year, startDate, endDate, schoolCode } = req.body;

  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  const end = new Date(endDate);
  end.setHours(0, 0, 0, 0);

  // check if already exists
  const existingBatch = await prisma.batch.findFirst({
    where: {
      year,
      startDate: start,
      endDate: end,
      schoolCode,
    },
  });

  if (existingBatch) {
    return res.status(400).json({
      message: "Batch already exists",
      success: false,
    });
  }

  const createdBatch = await prisma.batch.create({
    data: {
      startDate: start,
      endDate: end,
      year,
      school: {
        connect: {
          code: schoolCode,
        },
      },
    },
  });

  return res.status(200).json({
    message: "Batch created successfully",
    success: true,
    data: createdBatch,
  });
});

// ✅ Get all batches
export const getAllBatches = asyncHandler(
  async (req: Request, res: Response) => {
    const batches = await prisma.batch.findMany({
      include: {
        school: true, // optional, if you want school details too
      },
      orderBy: {
        createdAt: "desc", // newest first
      },
    });

    return res.status(200).json({
      message: "All batches fetched successfully",
      success: true,
      data: batches,
    });
  }
);
