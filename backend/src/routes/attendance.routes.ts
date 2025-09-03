import { Router } from "express";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyAccess } from "../middlewares/verifyAccess";
import {
  createAttendance,
  getAttendanceBySection,
  markAttendance,
} from "../controllers/attendance.controller";
import { validateSchema } from "../middlewares/schemaValidator";
import { attendanceSchema } from "../types/zodTypes";

const router = Router({ mergeParams: true });

router.use(verifyAuth);
router.post(
  "/create-attendance/:sectionId",
  verifyAccess(["teacher"]),
  createAttendance
);

router.put(
  "/mark-attendance/:sectionId",
  verifyAccess(["teacher"]),
  validateSchema(attendanceSchema),
  markAttendance
);
router.get(
  "/section/:sectionId",
  verifyAccess(["teacher", "admin"]),
  getAttendanceBySection
);

export default router;
