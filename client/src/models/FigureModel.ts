import CellModel from "./CellModel";
import { Labels } from "./Labels";
import lightPiece from "../images/light.png";
import darkPiece from "../images/brown.png";
import lightQueen from "../images/light-queen.png";
import darkQuenn from "../images/brown-queen.png";
import { FigureNames } from "./FigureNames";

class FigureModel {
    label: Labels;
    imageSrc: string;
    isDame: boolean;
    cell: CellModel;
    name: FigureNames;

    constructor(label: Labels, cell: CellModel, isDame?: boolean){
        this.label = label;
        this.cell = cell;
        this.cell.figure = this;
        if(isDame) {
            this.isDame = isDame;
            this.name = FigureNames.Dame;
        }else {
            this.isDame = false;
            this.name = FigureNames.Piece;
        }
        //this.isDame = true;
        //this.name = FigureNames.Piece;
        this.imageSrc = label === Labels.Light ? 
            (this.isDame === true ? lightQueen : lightPiece) : 
            (this.isDame === true ? darkQuenn : darkPiece)
    }

    canMove(targetCell: CellModel): boolean {
        return !targetCell.figure;
    }
}

export { FigureModel };