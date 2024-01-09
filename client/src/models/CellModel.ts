import { Labels } from './Labels';
import BoardModel from './BoardModel';
import { FigureModel } from './FigureModel';
import { PlayerModel } from './PlayerModel';
//import PlayerModel from './PlayerModel';
import { checkDame } from 'utils/utils';

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

    moveFigure(targetCell: CellModel, currentPlayer: PlayerModel) {
        if(this.figure && this.figure.canMove(targetCell, currentPlayer)){
            targetCell.figure = this.figure;
            targetCell.figure.cell = targetCell;
            if(checkDame(targetCell, currentPlayer)){
                targetCell.figure.makeDame();
            }
            this.figure = null;
        }
    }

    isForwardCell(targetCell: CellModel, selectedFigure: FigureModel): boolean {
        const { cell, label } = selectedFigure;
        if(selectedFigure.isDame === false){
            const dx = cell.x - targetCell.x;
            const dy = Math.abs(cell.y - targetCell.y);

            const result = label === Labels.Light ? 
            (dx === 1 && dy === 1) : 
            (dx === -1 && dy === 1);
            return result;
        }else{
            const dx = Math.abs(cell.x - targetCell.x)
            const dy = Math.abs(cell.y - targetCell.y)

            if(dx !== dy) return false;

            const directionX = (targetCell.x - cell.x) / dx;
            const directionY = (targetCell.y - cell.y) / dy;

            for (let i = 1; i < dx; i++){
                const ix = cell.x + i * directionX;
                const iy = cell.y + i * directionY;

                if (this.board.getCell(ix, iy).figure !== null) {
                    return false;
                }
            }
            return true;
        }
        /**
         * 0 [0, 1, 2, 3, 4, 5, 6, 7]
         * 1 [0, 1, 2, 3, 4, 5, 6, 7]
         * 2 [0, 1, 2, 3, 4, 5, 6, 7]
         * 3 [0, 1, 2, 3, 4, 5, 6, 7]
         * 4 [0, 1, 2, 3, 4, 5, 6, 7]
         * 5 [0, 1, 2, 3, 4, 5, 6, 7]
         * 6 [0, 1, 2, 3, 4, 5, 6, 7]
         * 7 [0, 1, 2, 3, 4, 5, 6, 7]
         */
    }
}