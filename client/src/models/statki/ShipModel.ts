import CellModel from "./CellModel";
import cross from '../../images/cross.png'
//import shipImg from "../../images/ch_light.png";

class ShipModel {
    imageSrc: string;
    destroyed: boolean;
    cell: CellModel;

    constructor(cell: CellModel, destroyed?: boolean){
        this.cell = cell;
        this.cell.ship = this;
        destroyed ? this.destroyed = true : this.destroyed = false;
        //this.cell.empty = false;
        this.imageSrc = cross;
    }
}

export { ShipModel };