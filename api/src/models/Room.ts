import { Player } from "./Player";

export class Room {
    step: number
    players: { [playerName: string]: Player } = {};

    constructor(s: number){
        this.step = s
    }
}