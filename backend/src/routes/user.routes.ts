import { Router } from "express";
import { createUser, loginUser } from "../controllers/user.controller";
import { validate } from "../middlewares/validator";
import { userLoginSchema, userSignupSchema } from "../types/zodTypes";

const router = Router();

// 🔑 Auth Routes
router
  .route("/signup")
  .post(validate(userSignupSchema), createUser);

router
  .route("/login")
  .post(validate(userLoginSchema), loginUser);

// 🛑 Optional: add logout for better UX
// router.post("/logout", logoutUser);

export default router;
