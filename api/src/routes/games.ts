import express from "express";
import handleAsync from "../helpers/handleAsync";
import gameController from "../controllers/game/gameController";

const router = express.Router();

router.get("/", handleAsync(gameController.getGames));

router.get("/:name", handleAsync(gameController.getGame));

router.post("/", handleAsync(gameController.addGame));

export default router;