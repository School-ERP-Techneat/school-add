import { Router } from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolByCode,
  updateSchool,
} from "../controllers/school.controller";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { createSchoolSchema } from "../types/zodTypes.js";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyAccess } from "../middlewares/verifyAccess";

const router = Router();

router.get("/:schoolCode", getSchoolByCode);
router.get("/all", getAllSchools);
router.use(verifyAuth);
router.post("/", validateSchema(createSchoolSchema), createSchool);
router.put(
  "/:schoolCode",
  verifyAccess(["schoolOwner", "admin"]),
  validateSchema(createSchoolSchema),
  updateSchool
);

export default router;
