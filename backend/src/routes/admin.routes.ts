import { Router } from "express";
import {
  createAdmin,
  loginAdmin,
  getAdminsBySchoolCode,
  updateAdmin,
  changeAdminPassword,
  updateAdminById,
  deleteAdminById,
  getAdminById,
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

// ✅ Inject schoolCode into request body
router.use((req, _res, next) => {
  if (req.params.schoolCode && req.body) {
    req.body.schoolCode = req.params.schoolCode;
  }
  next();
});

/**
 * Public routes (no auth required)
 */
router.post("/login", validate(loginAdminSchema), loginAdmin);

/**
 * Protected routes (require auth + permissions)
 */
router.use(verifyAuth);

// 🔹 Admin registration
router.post(
  "/register",
  hasPermission("admin", "can_create"),
  validate(createAdminSchema),
  createAdmin
);

// 🔹 Fetch all admins of a school
router.get(
  "/allAdmins",
  hasPermission("admin", "can_read"),
  getAdminsBySchoolCode
);

// 🔹 Update logged-in admin account
router.put(
  "/account",
  hasPermission("admin", "can_update"),
  validate(updateAdminSchema),
  updateAdmin
);

// 🔹 Change password (self)
router.put(
  "/account/change-password",
  hasPermission("admin", "can_update"),
  validate(passwordChangeSchema),
  changeAdminPassword
);

// 🔹 Manage admins by ID (CRUD)
router
  .route("/account/:adminId")
  .get(hasPermission("admin", "can_read"), getAdminById)
  .put(
    hasPermission("admin", "can_update"),
    validate(updateAdminSchema),
    updateAdminById
  )
  .delete(hasPermission("admin", "can_delete"), deleteAdminById);

export default router;
