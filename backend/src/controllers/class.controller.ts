import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import prisma from "../config/prisma";

export const createClass = asyncHandler(async (req: Request, res: Response) => {
  const { name, standard, schoolCode, batchId } = req.body;

  const existingClass = await prisma.class.findFirst({
    where: {
      standard,
      schoolCode,
      batchId,
    },
  });

  if (existingClass)
    return res.status(400).json({
      success: false,
      message: "Class already Exists",
    });

  const createdClass = await prisma.class.create({
    data: {
      name,
      standard,
      school: {
        connect: {
          code: schoolCode,
        },
      },
      batch: {
        connect: {
          id: batchId,
        },
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Class Created successfully",
    data: createdClass,
  });
});
