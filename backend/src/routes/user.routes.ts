import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controller";
import { validate } from "../middlewares/validator.js";
import { userLoginSchema, userSignupSchema } from "../types/zodTypes.js";
const router = Router();

router.post("/signup", validate(userSignupSchema), createUser);
router.post("/login", validate(userLoginSchema), loginUser);

export default router;