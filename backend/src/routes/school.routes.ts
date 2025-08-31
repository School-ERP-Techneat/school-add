import { Router } from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolByCode,
  updateSchool,
} from "../controllers/school.controller";
import { validate } from "../middlewares/validator.js";

import { createSchoolSchema } from "../types/zodTypes.js";
import { verifyAuth } from "../middlewares/authMiddleware";
const router = Router();
router.get("/:schoolCode", getSchoolByCode);

router.use(verifyAuth);
router.get("/all", getAllSchools);
router.post("/", validate(createSchoolSchema), createSchool);
router.put("/:schoolCode", validate(createSchoolSchema), updateSchool);

export default router;
