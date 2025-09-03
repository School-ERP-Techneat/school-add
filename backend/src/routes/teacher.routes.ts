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
import { verifyAccess } from "../middlewares/verifyAccess";
import { validateSchema } from "../middlewares/schemaValidator";
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
router.post("/login", validateSchema(loginTeacherSchema), loginTeacher);

router.use(verifyAuth);

router.post(
  "/register",
  verifyAccess(["admin"]),
  validateSchema(createTeacherSchema),
  registerTeacher
);

router.put("/me", validateSchema(updateTeacherSchema), updateTeacher);

router.put(
  "/teacherId/:teacherId",
  verifyAccess(["admin"]),
  validateSchema(updateTeacherSchema),
  updateTeacher
);
router.get("/me", getTeacherProfile);
router.get("/teacherId/:teacherId", verifyAccess(["admin"]), getTeacherById);
router.get("/all", verifyAccess(["admin"]), getAllTeachers);
router.delete("/teacherId/:teacherId", verifyAccess(["admin"]), deleteTeacher);
export default router;
