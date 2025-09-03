import { Router } from "express";
import { createUser, loginUser } from "../controllers/schoolOwner.controllers";
import { validateSchema } from "../middlewares/schemaValidator.js";
import { userLoginSchema, userSignupSchema } from "../types/zodTypes.js";

const router = Router();
router.post("/signup", validateSchema(userSignupSchema), createUser);
router.post("/login", validateSchema(userLoginSchema), loginUser);

export default router;
