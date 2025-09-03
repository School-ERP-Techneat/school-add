import { Router } from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolByCode,
  updateSchool,
} from "../controllers/school.controller";
import { validate } from "../middlewares/validator";
import { verifyAuth } from "../middlewares/authMiddleware";
import {
  createSchoolSchema
} from "../types/zodTypes"; // <-- add separate schema for update

const router = Router();

// 🔓 Public route
router.get("/:schoolCode", getSchoolByCode);

// 🔐 Protected routes
router.use(verifyAuth);

router.route("/")
  .get(getAllSchools) // GET /schools
  .post(validate(createSchoolSchema), createSchool); // POST /schools

router.route("/:schoolCode")
  .put(validate(createSchoolSchema), updateSchool); // PUT /schools/:schoolCode

export default router;
