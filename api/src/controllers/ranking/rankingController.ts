import { Response, Request } from "express";
import { User } from "../../models/User";
import { Game } from "../../models/Game";
import { Score } from "../../models/Score";
import dotenv from "dotenv"
dotenv.config();

const rankingController = {
    getRanking: async (req: Request, res: Response) => {
        try {
            const game = await Game.find({ name: req.params.gamename }).exec();

            if (game.length > 0) {
                const scores = await Score.aggregate([
                    {
                        $match: { game: game[0]._id },
                    },
                    {
                        $group: {
                            _id: '$user',
                            averageScore: { $avg: '$score' },
                        },
                    },
                    {
                        $sort: { averageScore: -1 },
                    },
                    {
                        $limit: 100,
                    },
                    {
                        $lookup: {
                            from: 'users', // Name of the User collection
                            localField: '_id',
                            foreignField: '_id',
                            as: 'userDetails',
                        },
                    },
                    {
                        $unwind: '$userDetails', // Unwind the array created by $lookup
                    },
                    {
                        $project: {
                            _id: 1,
                            username: '$userDetails.username',
                            averageScore: 1,
                        },
                    },
                ]).exec();

                return res.status(200).json(scores);
            }

            return res.status(404).json({ message: "No game with specified name!" });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ message: 'Error processing request' });
        }
    },
    getMastermindRank: async (req: Request, res: Response) => {
        try {
            const game = await Game.find({ name: 'mastermind' }).exec();
            const user = await User.find({ username: req.params.username }).exec();

            if (game.length > 0 && user.length > 0) {
                const scores = await Score.aggregate([
                    {
                        $match: { game: game[0]._id, user: user[0]._id },
                    },
                    {
                        $group: {
                            _id: '$user',
                            scoreCount: { $sum: 1 }, // Count the number of scores
                            totalScore: { $sum: '$score' }, // Calculate the total score
                        },
                    },
                    {
                        $project: {
                            _id: 0, // Exclude _id field
                            user: '$_id',
                            averageScore: {
                                $cond: {
                                    if: { $gte: ['$scoreCount', 1] }, // Check if there are at least 10 scores - changed to 1 for now
                                    then: { $divide: ['$totalScore', '$scoreCount'] }, // Calculate average
                                    else: 0, // Return 0 if there are fewer than 10 scores
                                },
                            },
                        },
                    },
                ]).exec();

                return res.status(200).json(scores);
            }

            console.log(req.params.gamename, req.params.username);
            console.log(user, game);
            return res.status(404).json({ message: "No game with specified name!" });
        } catch (error) {
            console.error('Error:', error);
            return res.status(400).json({ message: 'Error processing request' });
        }
    },
};

export default rankingController;