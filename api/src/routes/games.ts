import express from "express";
import handleAsync from "../helpers/handleAsync";
import gameController from "../controllers/game/gameController";

const router = express.Router();

// GET / {}
router.get("/", handleAsync(gameController.getGames));

// GET /gameNameHere {}
router.get("/:name", handleAsync(gameController.getGame));

// POST / {name, numberOfPlayers?, difficulty?}
router.post("/", handleAsync(gameController.addGame));

// DELETE /gameNameHere {}
router.delete("/:name", handleAsync(gameController.deleteGame));

export default router;