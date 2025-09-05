import { Router } from "express";
import { verifyAuth } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/schemaValidator";
import { verifyAccess } from "../middlewares/verifyAccess";
import { createSectionSchema } from "../types/zodTypes";
import { createSection ,getAllSections } from "../controllers/section.controller";

const router = Router({ mergeParams: true });

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  next();
});

router.use(verifyAuth);

router.post(
  "/",
  verifyAccess(["admin"]),
  validateSchema(createSectionSchema),
  createSection
);
router.get("/", getAllSections);
export default router;
