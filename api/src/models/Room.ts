import { Player } from "./Player";

export class Room {
    step: number = 0;
    players: { [playerName: string]: Player } = {};
    rating: number;
    game: string;

    constructor(g: string, r: number = NaN) {
        // this.step = s;
        this.game = g;
        this.rating = r;
    }
}
