import { Request, Response, NextFunction } from "express";
import prisma from "../config/prisma";

export const hasPermission = (
  module: string,
  action: "can_create" | "can_read" | "can_update" | "can_delete"
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.user;
      console.log(user);
      const schoolCode = req.body?.schoolCode || req.params.schoolCode;
      if (!user?.roleId) {
        return res.status(403).json({ message: "Role not attached to user" });
      }
      const permission = await prisma.permission.findUnique({
        where: {
          roleId_module_schoolCode: {
            roleId: user.roleId,
            module: module,
            schoolCode,
          },
        },
      });
      console.log("Permission: ", permission);
      console.log(schoolCode, user?.schoolCode);
      if (
        !permission ||
        !permission[action] ||
        schoolCode != user?.schoolCode
      ) {
        return res
          .status(403)
          .json({ message: `Access denied: Missing ${action} on ${module}.` });
      }
      next();
    } catch (error: any) {
      return res.status(500).json({ message: error.message || "Server error" });
    }
  };
};
