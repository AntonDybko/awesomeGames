import { Game } from "../../models/Game";

export default async function initGames() {
    try {
        await Game.create({name: 'mastermind', numberOfPlayers: 1, difficulty: 'hard'});
        await Game.create({name: 'tictactoe', numberOfPlayers: 2, difficulty: 'easy'});
        await Game.create({name: 'battleships', numberOfPlayers: 2, difficulty: 'easy'});
    } catch (error) {
        console.error(error);
    }
}