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
import { validateSchema } from "../middlewares/schemaValidator";
import {
  createAdminSchema,
  loginAdminSchema,
  passwordChangeSchema,
  updateAdminSchema,
} from "../types/zodTypes";
import { verifyAuth } from "../middlewares/authMiddleware";
import { verifyAccess } from "../middlewares/verifyAccess";
const router = Router({ mergeParams: true });

// ✅ Inject schoolCode into request body
router.use((req, _res, next) => {
  if (req.params.schoolCode && req.body) {
    req.body.schoolCode = req.params.schoolCode;
  }
  next();
});

router.post("/login", validateSchema(loginAdminSchema), loginAdmin);

/**
 * Protected routes (require auth + permissions)
 */
router.use(verifyAuth);

// 🔹 Admin registration
router.post(
  "/register",
  verifyAccess(["schoolOwner"]),
  validateSchema(createAdminSchema),
  createAdmin
);

router.get("/allAdmins", verifyAccess(["schoolOwner"]), getAdminsBySchoolCode);

// 🔹 Update logged-in admin account
router.put(
  "/account",
  verifyAccess(["schoolOwner", "admin"]),
  validateSchema(updateAdminSchema),
  updateAdmin
);

// 🔹 Change password (self)
router.put(
  "/change-password",
  validateSchema(passwordChangeSchema),
  changeAdminPassword
);

router.put(
  "/account/:adminId",
  verifyAccess(["schoolOwner"]),
  validateSchema(updateAdminSchema),
  updateAdminById
);

router.delete(
  "/account/:adminId",
  verifyAccess(["schoolOwner"]),
  deleteAdminById
);

router.get("/account/:adminId", verifyAccess(["schoolOwner"]), getAdminById);

export default router;
