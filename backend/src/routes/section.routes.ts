import { Router } from "express";
import { verifyAuth } from "../middlewares/authMiddleware";
import { validate } from "../middlewares/validator";
import { hasPermission } from "../middlewares/hasPermission";
import { createSectionSchema } from "../types/zodTypes";
import { createSection } from "../controllers/section.controller";

const router = Router();

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  next();
});

router.use(verifyAuth);

router.post(
  "/",
  hasPermission("class", "can_create"),
  validate(createSectionSchema),
  createSection
);


