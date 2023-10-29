import express from "express";
import verifyJWT from "../middleware/verifyJWT";
import authController from "../controllers/user/authController";
import userController from "../controllers/user/userController";
import handleAsync from "../helpers/handleAsync";

const router = express.Router();

router.get("/", verifyJWT, handleAsync(userController.getUsers));

router.delete("/logout", verifyJWT, handleAsync(authController.handleLogout));

router.get("/refresh-token", handleAsync(authController.handleRefreshToken),
);

router.post("/login", handleAsync(authController.handleLogin));

router.post("/register", handleAsync(authController.handleRegister));

router.get("/profile/:username", handleAsync(userController.getUser));

router.put("/profile", verifyJWT, handleAsync(userController.editUser));

export default router;