import { Router } from "express";
import { createUser, loginUser } from "../controllers/schoolOwner.controllers";
import { validateSchema } from "../middlewares/schemaValidator.js";
import {
  createSchoolOwnerSchema,
  loginSchoolOwnerSchema,
} from "../types/zodTypes.js";

const router = Router();
router.post("/signup", validateSchema(createSchoolOwnerSchema), createUser);
router.post("/login", validateSchema(loginSchoolOwnerSchema), loginUser);

export default router;
