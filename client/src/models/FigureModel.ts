import CellModel from "./CellModel";
import { Labels } from "./Labels";
import lightPiece from "../images/ch_light.png";
import darkPiece from "../images/ch_dark.png";
import lightQueen from "../images/ch_q_light.png";
import darkQuenn from "../images/ch_q_dark.png";
import { FigureNames } from "./FigureNames";
import { PlayerModel } from "./PlayerModel";
//import PlayerModel from "./PlayerModel";

class FigureModel {
    label: Labels;
    imageSrc: string;
    isDame: boolean;
    cell: CellModel;
    name: FigureNames;

    constructor(label: Labels, cell: CellModel, isDame: boolean){
        this.label = label;
        this.cell = cell;
        this.cell.figure = this;
        //this.isDame = false;
        this.isDame = isDame;
        this.name = FigureNames.Piece;
        
        //this.imageSrc = label === Labels.Light ? lightPiece : darkPiece;
        this.imageSrc = label === Labels.Light ? 
            (isDame === false ? lightPiece : lightQueen) :
            (isDame === false ? darkPiece : darkQuenn);
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