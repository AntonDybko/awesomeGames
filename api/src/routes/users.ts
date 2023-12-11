import express from "express";
import verifyJWT from "../middleware/verifyJwt";
import authController from "../controllers/user/authController";
import userController from "../controllers/user/userController";
import scoreController from "../controllers/score/scoreController";
import handleAsync from "../helpers/handleAsync";

const router = express.Router();

// walidacja, czy admin
router.get("/", verifyJWT, handleAsync(userController.getUsers));

// Token w Headerze
router.delete("/logout", verifyJWT, handleAsync(authController.handleLogout));

router.get("/refresh-token", handleAsync(authController.handleRefreshToken),
);

/*POST {
    emailOrUsername?: string
    password
}
>> jwt
*/
router.post("/login", handleAsync(authController.handleLogin));

/*POST {
  username: string;
  email: string;
  password: string;
}
>> jwt
*/
router.post("/register", handleAsync(authController.handleRegister));

//zwykły get - bez hasła Czy to powinno zostać tak otwarte?
router.get("/profile/:username", handleAsync(userController.getUser));

// GET /profile/username/scores/id {}
router.get("/profile/:username/scores/:id", handleAsync(scoreController.getScore));

// POST /profile/username/scores {}
router.post("/profile/:username/scores", verifyJWT, handleAsync(scoreController.addScore));

// DELETE /profile/username/scores/id {}
router.delete("/profile/:username/scores/:id", verifyJWT, handleAsync(scoreController.deleteScore));

/*PUT 
Header - autoryzacyjny
{
    email: string;
    username: string;
    refreshToken: string;
    password: string;
    picture_url?: string;
    birthday?: Date;
}
>> jak get */ 
//zwykły model usera
router.put("/profile", verifyJWT, handleAsync(userController.editUser));
//ogólnie można jescze wymyślić jakiś patch (np picture_url zmieniać okremo), 
//wtedy poprzednia metoda też będzie raczej patchem.

export default router;