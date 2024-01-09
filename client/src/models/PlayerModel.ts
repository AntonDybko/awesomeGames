import { Labels } from "./Labels";

class PlayerModel {
    label: Labels;
    amountOfDefeatedPiecies: number

    constructor(label: Labels, killCount: number) {
        this.label = label;
        this.amountOfDefeatedPiecies = killCount;
    }
}

export { PlayerModel };