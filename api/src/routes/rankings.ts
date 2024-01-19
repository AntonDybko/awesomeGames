import express from "express";
import handleAsync from "../helpers/handleAsync";
import rankingController from "../controllers/ranking/rankingController";

const router = express.Router();

// GET ranking for game
router.get("/:gamename", handleAsync(rankingController.getRanking));

export default router;