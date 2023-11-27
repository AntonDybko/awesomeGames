import express from "express";
import verifyJWT from "../middleware/verifyJwt";
import authController from "../controllers/user/authController";
import userController from "../controllers/user/userController";
import handleAsync from "../helpers/handleAsync";

const router = express.Router();

router.get("/", verifyJWT, handleAsync(userController.getUsers));

router.delete("/logout", verifyJWT, handleAsync(authController.handleLogout));

router.get("/refresh-token", handleAsync(authController.handleRefreshToken),
);

/*POST {
    //token?: string; chyba nie trzeba tokenu na razie
    emailOrUsername?: string
    email?: string;
}*/
router.post("/login", handleAsync(authController.handleLogin));

/*POST {
  username: string; <min_length=2>
  email: string;
  password: string; <min_length=8>
}*/
router.post("/register", handleAsync(authController.handleRegister));

//zwykły get
router.get("/profile/:username", handleAsync(userController.getUser));

/*PUT {
    email: string;
    username: string;
    refreshToken: string;
    password: string;
    picture_url?: string;
    birthday?: Date;
}*/ 
//zwykły model usera
router.put("/profile", verifyJWT, handleAsync(userController.editUser));
//ogólnie można jescze wymyślić jakiś patch (np picture_url zmieniać okremo), 
//wtedy poprzednia metoda też będzie raczej patchem.

export default router;