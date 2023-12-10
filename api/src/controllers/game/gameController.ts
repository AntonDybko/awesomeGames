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
                return res.status(201).json(game);
            }

            if (!numberOfPlayers && difficulty) {
                const game = await Game.create({
                    name,
                    difficulty
                });
                return res.status(201).json(game);
            }

            if (numberOfPlayers && !difficulty) {
                const game = await Game.create({
                    name,
                    numberOfPlayers
                });
                return res.status(201).json(game);
            }

            const game = await Game.create({
                name,
                numberOfPlayers,
                difficulty
            });
            return res.status(201).json(game);
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

    getGames: async (req: Request, res: Response) => {
        try {
            const games = await Game.find({});
            return res.status(200).json(games);
        } catch (error) {
            return res.status(404).json(error);
        }
    }
}

export default gameController;