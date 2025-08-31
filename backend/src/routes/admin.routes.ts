import { Router } from "express";
import {
  createAdmin,
  loginAdmin,
  getAdminsBySchoolCode,
  updateAdmin,
  changeAdminPassword,
  updateAdminById,
  deleteAdminById,
  getAdminById

} from "../controllers/admin.controller";
import { validate } from "../middlewares/validator";
import {
  createAdminSchema,
  loginAdminSchema,
  passwordChangeSchema,
  updateAdminSchema,
} from "../types/zodTypes";
import { verifyAuth } from "../middlewares/authMiddleware";
import { hasPermission } from "../middlewares/hasPermission";
const router = Router({ mergeParams: true });

router.use((req, res, next) => {
  if (req.body) req.body.schoolCode = req.params.schoolCode;
  next();
});

router.post("/login", validate(loginAdminSchema), loginAdmin);

router.use(verifyAuth);

router.post(
  "/register",
  hasPermission("admin", "can_create"),
  validate(createAdminSchema),
  createAdmin
);

router.get(
  "/allAdmins",
  hasPermission("admin", "can_read"),
  getAdminsBySchoolCode
);

router.put(
  "/account",
  hasPermission("admin", "can_update"),
  validate(updateAdminSchema),
  updateAdmin
);
router.put(
  "/change-password",
  hasPermission("admin", "can_update"),
  validate(passwordChangeSchema),
  changeAdminPassword
);

router.put(
  "/account/:adminId",
  hasPermission("admin", "can_update"),
  validate(updateAdminSchema),
  updateAdminById
);

router.delete(
  "/account/:adminId",
  hasPermission("admin", "can_delete"),
  deleteAdminById
);

router.get(
  "/account/:adminId",
  hasPermission("admin", "can_read"),
  getAdminById
);

export default router;
