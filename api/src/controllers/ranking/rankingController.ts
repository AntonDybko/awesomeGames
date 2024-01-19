import { Response, Request } from "express";
import { Game } from "../../models/Game";
import { Score } from "../../models/Score";
import dotenv from "dotenv"
dotenv.config();

const rankingController = {
    getRanking: async (req: Request, res: Response) => {
        try {
            const game = await Game.find({ name: req.params.gamename });
            console.log('Game:', game);

            if (game) {
                const scores = await Score.aggregate([{
                    $match: { game: game[0]._id },
                }, {
                    $group: {
                        _id: '$user',
                        avrageScore: { $avg: '$score' }
                    },
                }]).exec();

                return res.status(200).json(scores);
            }
            return res.status(404).json({message: "No game with spacified name!"});
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default rankingController;