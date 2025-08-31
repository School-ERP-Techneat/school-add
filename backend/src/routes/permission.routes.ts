import { Router } from "express";
import { createPermission } from "../controllers/permission.controller";
import { validate } from "../middlewares/validator";
import { createPermissionSchema } from "../types/zodTypes";
import { verifyAuth } from "../middlewares/authMiddleware";

const router = Router({ mergeParams: true });

router.use(verifyAuth, (req, res, next) => {
  req.body.schoolCode = req.params.schoolCode;
  next();
});

router.post("/", validate(createPermissionSchema), createPermission);

export default router;
