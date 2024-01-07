import { Labels } from './Labels';
import BoardModel from './BoardModel';
import { FigureModel } from './FigureModel';

export default class CellModel {
    readonly x: number;
    readonly y: number;
    readonly label: Labels;
    board: BoardModel;
    figure: FigureModel | null;
    available: boolean;
    key: string;
    //key: Array;

    constructor(x: number, y: number, label: Labels, board: BoardModel) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.board = board;
        this.key = `${String(x)}${String(y)}`;
        this.available = false;
        this.figure = null;
    }

    moveFigure(targetCell: CellModel) {
        if(this.figure && this.figure.canMove(targetCell)){
            targetCell.figure = this.figure;
            this.figure = null;
        }
    }
}