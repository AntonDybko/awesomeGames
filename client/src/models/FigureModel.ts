import CellModel from "./CellModel";
import { Labels } from "./Labels";
import lightPiece from "../images/light.png";
import darkPiece from "../images/brown.png";
import lightQueen from "../images/light-queen.png";
import darkQuenn from "../images/brown-queen.png";
import { FigureNames } from "./FigureNames";
//import { PlayerModel } from "./PlayerModel";
import PlayerModel from "./PlayerModel";

class FigureModel {
    label: Labels;
    imageSrc: string;
    isDame: boolean;
    cell: CellModel;
    name: FigureNames;

    constructor(label: Labels, cell: CellModel){
        this.label = label;
        this.cell = cell;
        this.cell.figure = this;
        this.isDame = false;
        this.name = FigureNames.Piece;
        this.imageSrc = label === Labels.Light ? lightPiece : darkPiece;
    }

    canMove(targetCell: CellModel, currentyPlayer: PlayerModel): boolean {
        return this.cell.isForwardCell(targetCell, this) && targetCell.figure?.label != currentyPlayer.label/*(targetCell.figure === null || */
    }

    makeDame(){
        this.imageSrc = this.label === Labels.Light ? lightQueen : darkQuenn;
        this.isDame = true;
    }
}

export { FigureModel };