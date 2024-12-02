import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
    getAllUsers,
    updateUserRole,
    getRoleSpecificData
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { hasRole } from "../middlewares/rbac.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.route("/register").post(
    upload.single("avatar"),
    registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/all").get(verifyJWT, hasRole(["admin"]), getAllUsers);
router.route("/:userId/role").patch(verifyJWT, hasRole(["admin"]), updateUserRole);
router.route("/role-data").get(verifyJWT, getRoleSpecificData);

export default router;