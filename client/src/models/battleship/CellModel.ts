import BoardModel from "./BoardModel";
import { ShipModel } from "./ShipModel";

export default class CellModel {
    readonly x: number;
    readonly y: number;
    board: BoardModel;
    hidden: boolean;
    ship: ShipModel | null;
    key: string;
    miss: boolean

    
    constructor(x: number, y: number, board: BoardModel, hidden: boolean) {
        this.x = x;
        this.y = y;
        this.board = board;
        this.key = `${String(x)}${String(y)}`;
        this.ship = null;
        this.miss = false;
        this.hidden = hidden;
    }

    attack(destroyedShip?: boolean) {
        if(this.hidden) this.hidden = false;
        if(this.ship !== null) this.ship.destroyed = true;
        else if (destroyedShip){
            this.addShip(destroyedShip)
        }
        else {
            if(!this.miss) this.miss = true;
        }
    }

    addShip(destroyed?: boolean) {
        new ShipModel(this, destroyed)
    }
}