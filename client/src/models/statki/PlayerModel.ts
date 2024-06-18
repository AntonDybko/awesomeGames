import { Labels } from "./Labels";

class PlayerModel {
    username: string;
    label: Labels;
    breakthrough: number;

    constructor(label: Labels, breakthrough: number) {
        this.label = label;
        this.breakthrough = breakthrough;
        this.username = '';
    }
}

export { PlayerModel };