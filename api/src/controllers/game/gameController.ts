import { Response, Request } from "express";
import { Game } from "../../models/Game";
import dotenv from "dotenv"
dotenv.config();

const gameController = {
    // request must contain at least a name in the request body
    addGame: async (req: Request, res: Response) => {
        try {
            const { name, numberOfPlayers, difficulty } = req.body;

            if (!numberOfPlayers && !difficulty) {
                const game = await Game.create({
                    name
                });
                const { __v, ...gameToReturn } = JSON.parse(JSON.stringify(game));
                return res.status(201).json(gameToReturn);
            }

            if (!numberOfPlayers && difficulty) {
                const game = await Game.create({
                    name,
                    difficulty
                });
                const { __v, ...gameToReturn } = JSON.parse(JSON.stringify(game));
                return res.status(201).json(gameToReturn);
            }

            if (numberOfPlayers && !difficulty) {
                const game = await Game.create({
                    name,
                    numberOfPlayers
                });
                const { __v, ...gameToReturn } = JSON.parse(JSON.stringify(game));
                return res.status(201).json(gameToReturn);
            }

            const game = await Game.create({
                name,
                numberOfPlayers,
                difficulty
            });
            const { __v, ...gameToReturn } = JSON.parse(JSON.stringify(game));
            return res.status(201).json(gameToReturn);
        } catch (error) {
            return res.status(400).json(error)
        }
    },

    // request must contain game name in the url params
    getGame: async (req: Request, res: Response) => {
        try {
            const game = await Game.find({ name: req.params.name });
            return res.status(200).json(game);
        } catch (error) {
            return res.status(404).json(error);
        }
    },

    getGames: async (_req: Request, res: Response) => {
        try {
            const games = await Game.find({});
            return res.status(200).json(games);
        } catch (error) {
            return res.status(404).json(error);
        }
    },

    // contains game name in the url params - just like getGame
    deleteGame: async (req: Request, res: Response) => {
        try {
            await Game.deleteOne({ name: req.params.name });
            return res.status(200).json({message: "Deleted"});
        } catch (error) {
            return res.status(404).json(error)
        }
    }
}

export default gameController;