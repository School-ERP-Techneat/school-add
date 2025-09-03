import { Router } from "express";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyAccess } from "../middlewares/verifyAccess";
import { validateSchema } from "../middlewares/schemaValidator";
import { createBatchSchema } from "../types/zodTypes";
import { createBatch } from "../controllers/batch.controller";

const router = Router({ mergeParams: true });

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  console.log(req.params);
  next();
});

router.use(verifyAuth);

router.post(
  "/",
  verifyAccess(["admin"]),
  validateSchema(createBatchSchema),
  createBatch
);

export default router;
