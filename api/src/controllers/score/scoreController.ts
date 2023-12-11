import { Response, Request } from "express";
import { Score } from "../../models/Score";
import dotenv from "dotenv"
import { User } from "../../models/User";
dotenv.config();

const scoreController = {
    // request must contain all of the required fields
    addScore: async (req: Request, res: Response) => {
        const { score, game } = req.body;
        
        try {
            const user = await User.find({ username: req.params.username });

            const newScore = await Score.create({
                score,
                game,
                user: JSON.parse(JSON.stringify(user))
            })
            return res.status(201).json(newScore);
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
            return res.status(200).json({message: "Deleted"});
        } catch (error) {
            return res.status(404).json(error);
        }
    }
}

export default scoreController;