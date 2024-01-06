import CellModel from './CellModel';
import { Labels } from './Labels';
import { Color } from './Color';
import { CreateCell } from '../utils/utils';

export default class BoardModel {
    cells: CellModel[][] = [];
    cellsInRow = 8;
    playerColor: Color;
    oponentColor: Color;

    constructor(player: Color, oponent: Color) {
        this.playerColor = player;
        this.oponentColor = oponent;
    }

    createCells() {
        const occupiedbyYou = [1, 3, 5, 7, 10, 12, 14, 16, 17, 19, 21, 23];
        const occupiedbyOponent = [40, 42, 44, 46, 47, 49, 51, 53, 56, 58, 60, 62];
        for (let i = 0; i < this.cellsInRow; i += 1) {
            const row: CellModel[] = [];

            for (let j = 0; j < this.cellsInRow; j += 1) {
                if (occupiedbyYou.includes(i * 8 + j)){
                    row.push(CreateCell(i, j, this, this.playerColor))
                }else if (occupiedbyOponent.includes(i * 8 + j)){
                    row.push(CreateCell(i, j, this, this.oponentColor))
                } else {
                    row.push(CreateCell(i, j, this, Color.None))
                }
            }
            this.cells.push(row);
        }
        console.log(this.cells.length, '; ', this.cells[0].length)
    }
}