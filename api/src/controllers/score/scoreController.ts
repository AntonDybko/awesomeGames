import { Response, Request } from "express";
import { Score } from "../../models/Score";
import dotenv from "dotenv"
import { User } from "../../models/User";
import { Game } from "../../models/Game";
dotenv.config();

const scoreController = {
    // request must contain all of the required fields
    addScore: async (req: Request, res: Response) => {
        const { score, gamename } = req.body;

        try {
            const user = await User.find({ username: req.params.username });
            const game = await Game.find({ name: gamename });

            if (user && game) {
                const newScore = await Score.create({
                    score,
                    game: game[0]._id,
                    user: user[0]._id
                })
                return res.status(201).json(newScore);
            }
            return res.status(404).json({message: "Cannot find Object references!"});
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    // request must contain the username in the request params
    getScores:async (req: Request, res: Response) => {
        try {
            const user = await User.find({ username: req.params.username });
            const scores = await Score.find({ user: user[0]._id });
            return res.status(200).json(scores);
        } catch (error) {
            return res.status(400).json(error);
        }
    },

    // must contain score id in the request params
    getScore: async (req: Request, res: Response) => {
        try {
            const score = await Score.find({ _id: req.params.id });
            return res.status(200).json(score);
        } catch (error) {
            return res.status(404).json(error);
        }
    },

    deleteScore: async (req: Request, res: Response) => {
        try {
            await Score.deleteOne({ _id: req.params.id });
            return res.status(200).json({ message: "Deleted" });
        } catch (error) {
            return res.status(404).json(error);
        }
    }
}

export default scoreController;