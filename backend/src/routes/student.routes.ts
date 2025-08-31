import { Router } from "express";
import {
  getStudentDetails,
  loginStudent,
  registerStudent,
  updateStudentDetails,
} from "../controllers/student.controller";
import { validate } from "../middlewares/validator";
import { createStudentSchema } from "../types/zodTypes";
import { verifyAuth } from "../middlewares/authMiddleware";
import { hasPermission } from "../middlewares/hasPermission";
import {
  getClassTeacher,
  getAttendance,
  getExamSyllabus,
  getClassSchedules,
  getAssignments,
  getResults,
  getFees,
} from "../controllers/student.modules.controller";
import { isStudentSelf } from "../middlewares/isStudentSelf";

const router = Router({ mergeParams: true });

router.use((req, res, next) => {
  req.body.schoolCode = req.params.schoolCode;
  next();
});

// Auth Routes
router.post("/register", validate(createStudentSchema), registerStudent);
router.post("/login", loginStudent);

router.use(verifyAuth);

// Data Routes
router.get(
  "/class-teacher",
  hasPermission("class_teacher", "can_read"),
  getClassTeacher
);
router.get(
  "/attendance",
  hasPermission("attendance", "can_read"),
  getAttendance
);
router.get(
  "/exams/syllabus",
  hasPermission("exams_syllabus", "can_read"),
  getExamSyllabus
);
router.get(
  "/class-schedules",
  hasPermission("class_schedules", "can_read"),
  getClassSchedules
);
router.get(
  "/assignments",
  hasPermission("assignments", "can_read"),
  getAssignments
);
router.get("/results", hasPermission("results", "can_read"), getResults);
router.get("/fees", hasPermission("fees", "can_read"), getFees);
router.get(
  "/me",
  hasPermission("student_details", "can_read"),
  getStudentDetails
);

router.patch(
  "/me",
  hasPermission("student_details", "can_update"),
  isStudentSelf,
  updateStudentDetails
);

export default router;
