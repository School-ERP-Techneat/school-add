import { Router } from "express";
import {
  createSchool,
  getAllSchools,
  getSchoolByCode,
  updateSchool,
} from "../controllers/school.controller";
<<<<<<< Updated upstream
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
=======
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
>>>>>>> Stashed changes

export default router;
