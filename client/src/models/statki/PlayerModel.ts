import { Labels } from "./Labels";

class PlayerModel {
    label: Labels;
    breakthrough: number;

    constructor(label: Labels, breakthrough: number) {
        this.label = label;
        this.breakthrough = breakthrough;
    }
}

export { PlayerModel };