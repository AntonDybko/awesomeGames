"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyJwt_1 = __importDefault(require("../middleware/verifyJwt"));
const authController_1 = __importDefault(require("../controllers/user/authController"));
const userController_1 = __importDefault(require("../controllers/user/userController"));
const handleAsync_1 = __importDefault(require("../helpers/handleAsync"));
const router = express_1.default.Router();
router.get("/", verifyJwt_1.default, (0, handleAsync_1.default)(userController_1.default.getUsers));
router.delete("/logout", verifyJwt_1.default, (0, handleAsync_1.default)(authController_1.default.handleLogout));
router.get("/refresh-token", (0, handleAsync_1.default)(authController_1.default.handleRefreshToken));
router.post("/login", (0, handleAsync_1.default)(authController_1.default.handleLogin));
router.post("/register", (0, handleAsync_1.default)(authController_1.default.handleRegister));
router.get("/profile/:username", (0, handleAsync_1.default)(userController_1.default.getUser));
router.put("/profile", verifyJwt_1.default, (0, handleAsync_1.default)(userController_1.default.editUser));
exports.default = router;
