import { Router } from "express";
import {
  deleteTeacher,
  getAllTeachers,
  getTeacherById,
  getTeacherProfile,
  loginTeacher,
  registerTeacher,
  updateTeacher,
} from "../controllers/teacher.controller";
import { verifyAuth } from "../middlewares/authMiddleware";
import { hasPermission } from "../middlewares/hasPermission";
import { validate } from "../middlewares/validator";
import {
  createTeacherSchema,
  loginTeacherSchema,
  updateTeacherSchema,
} from "../types/zodTypes";

const router = Router({ mergeParams: true });

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  next();
});
router.post("/login", validate(loginTeacherSchema), loginTeacher);

router.use(verifyAuth);

router.post(
  "/register",
  hasPermission("teacher", "can_create"),
  validate(createTeacherSchema),
  registerTeacher
);

router.put("/me", validate(updateTeacherSchema), updateTeacher);

router.put(
  "/teacherId/:teacherId",
  hasPermission("teacher", "can_update"),
  validate(updateTeacherSchema),
  updateTeacher
);
router.get("/me", getTeacherProfile);
router.get(
  "/teacherId/:teacherId",
  hasPermission("teacher", "can_read"),
  getTeacherById
);
router.get("/all", hasPermission("teacher", "can_read"), getAllTeachers);
router.delete(
  "/teacherId/:teacherId",
  hasPermission("teacher", "can_delete"),
  deleteTeacher
);
export default router;
