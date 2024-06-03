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

            if (req.params.gamename === 'mastermind') {
                const scores = await Score.aggregate([
                    {
                        $match: { game: game[0]._id },
                    },
                    {
                        $group: {
                            _id: '$user',
                            averageScore: { $max: '$score' },
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
                            from: 'users', 
                            localField: '_id',
                            foreignField: '_id',
                            as: 'userDetails',
                        },
                    },
                    {
                        $unwind: '$userDetails',
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
                            highestScore: { $max: '$score' },
                        },
                    },
                    {
                        $addFields: {
                            averageScore: '$highestScore'
                        }
                    },
                    {
                        $project: {
                            _id: 0, 
                            user: '$_id',
                            averageScore: 1,
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