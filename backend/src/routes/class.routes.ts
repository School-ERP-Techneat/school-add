import { Router } from "express";
import { verifyAuth } from "../middlewares/authMiddleware";
import { validateSchema } from "../middlewares/schemaValidator";
import { createClassSchema } from "../types/zodTypes";
import { createClass ,getAllClasses } from "../controllers/class.controller";
import { verifyAccess } from "../middlewares/verifyAccess";

const router = Router({ mergeParams: true });

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  next();
});

router.use(verifyAuth);

router.post(
  "/",
  verifyAccess(["admin"]),
  validateSchema(createClassSchema),
  createClass
);

router.get("/", getAllClasses);

export default router;
