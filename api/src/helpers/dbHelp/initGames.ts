import { Game } from "../../models/Game";

export default async function initGames() {
    try {
        await Game.findOneAndUpdate({name: 'mastermind'}, {name: 'mastermind', numberOfPlayers: 1, difficulty: 'hard'}, {upsert: true});
        await Game.findOneAndUpdate({name: 'tictactoe'}, {name: 'tictactoe', numberOfPlayers: 2, difficulty: 'easy'}, {upsert: true});
        await Game.findOneAndUpdate({name: 'battleships'}, {name: 'battleships', numberOfPlayers: 2, difficulty: 'easy'}, {upsert: true});
    } catch (error) {
        console.error(error);
    }
}