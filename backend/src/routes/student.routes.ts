import { Router } from "express";
import {
  createStudent,
  getAllActiveClassStudents,
  getAllInactiveClassStudents,
  getStudentDetails,
  loginStudent,
  registerStudent,
  updateStudentActiveStatus,
  updateStudentDetails,
} from "../controllers/student.controller";
import { validateSchema } from "../middlewares/schemaValidator";
import { createStudentSchema } from "../types/zodTypes";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyAccess } from "../middlewares/verifyAccess";
// import {
//   getClassTeacher,
//   getAttendance,
//   getExamSyllabus,
//   getClassSchedules,
//   getAssignments,
//   getResults,
//   getFees,
// } from "../controllers/student.modules.controller";

const router = Router({ mergeParams: true });

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  next();
});

// Auth Routes
router.post("/register", validateSchema(createStudentSchema), registerStudent);
router.post("/login", loginStudent);

router.use(verifyAuth);

router.post(
  "/add",
  verifyAccess(["admin"]),
  validateSchema(createStudentSchema),
  createStudent
);
// // Data Routes
// router.get(
//   "/class-teacher",
//   verifyAccess(["student", "teacher", "admin"]),
//   getClassTeacher
// );
// router.get(
//   "/attendance",
//   verifyAccess(["student", "teacher", "admin"]),
//   getAttendance
// );
// router.get(
//   "/exams/syllabus",
//   verifyAccess(["admin", "student", "teacher"]),
//   getExamSyllabus
// );
// router.get(
//   "/class-schedules",
//   verifyAccess(["admin", "student", "teacher"]),
//   getClassSchedules
// );
// router.get(
//   "/assignments",
//   verifyAccess(["teacher", "student", "admin"]),
//   getAssignments
// );
// router.get(
//   "/results",
//   verifyAccess(["admin", "teacher", "student"]),
//   getResults
// );
// router.get("/fees", verifyAccess(["admin", "student", "teacher"]), getFees);
router.get("/me", getStudentDetails);
router.get(
  "/all/inactive/class-section/:sectionId",
  verifyAccess(["admin", "teacher"]),
  getAllInactiveClassStudents
);
router.get(
  "/all/active/class-section/:sectionId",
  verifyAccess(["admin", "schoolOwner"]),
  getAllActiveClassStudents
);

router.put(
  "/update-status/:studentId",
  verifyAccess(["admin", "teacher"]),
  updateStudentActiveStatus
);
export default router;
