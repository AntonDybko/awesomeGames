import { Labels } from "./Labels";

export default class PlayerModel {
    label: Labels;
    amountOfDefeatedPiecies: number

    constructor(label: Labels, killCount: number) {
        this.label = label;
        this.amountOfDefeatedPiecies = killCount;
    }

    increaseKillCount(){
        this.amountOfDefeatedPiecies += 1;
    }
}

//export { PlayerModel };