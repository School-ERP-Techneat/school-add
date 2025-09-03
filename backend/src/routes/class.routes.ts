import { Router } from "express";
import { verifyAuth } from "../middlewares/authMiddleware";
<<<<<<< HEAD
import { validate } from "../middlewares/validator";
import { createClassSchema } from "../types/zodTypes";
import { createClass } from "../controllers/class.controller";
import { hasPermission } from "../middlewares/hasPermission";

const router = Router();
=======
import { validateSchema } from "../middlewares/schemaValidator";
import { createClassSchema } from "../types/zodTypes";
import { createClass } from "../controllers/class.controller";
import { verifyAccess } from "../middlewares/verifyAccess";

const router = Router({ mergeParams: true });
>>>>>>> 9794adc50ac193da68c778dba622d41b2d66f42f

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  next();
});

router.use(verifyAuth);

router.post(
  "/",
<<<<<<< HEAD
  hasPermission("class", "can_create"),
  validate(createClassSchema),
  createClass
);


=======
  verifyAccess(["admin"]),
  validateSchema(createClassSchema),
  createClass
);

export default router;
>>>>>>> 9794adc50ac193da68c778dba622d41b2d66f42f
