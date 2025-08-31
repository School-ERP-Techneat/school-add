import { Request, Response, NextFunction } from "express";

export function isStudentSelf(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.user || req.user.roleId !== "student") {
      return res.status(403).json({ message: "Forbidden: not a student" });
    }

    if (req.body.id && req.body.id !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Forbidden: cannot edit other student" });
    }

    next();
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server error" });
  }
}
