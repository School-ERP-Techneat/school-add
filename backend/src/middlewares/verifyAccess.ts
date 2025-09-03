import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";
import { RoleName } from "@prisma/client";

export const verifyAccess = (access: RoleName[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      const schoolCode = req.params.schoolCode || req.body.schoolCode;
      const role = await prisma.role.findFirst({
        where: {
          id: user?.roleId,
        },
      });

      console.log(role, schoolCode);
      if (!role || !access.includes(role.name) || role.schoolCode != schoolCode)
        return res.status(401).json({
          success: false,
          message: "Access Denied",
        });

      next();
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Server error" });
    }
  };
};
