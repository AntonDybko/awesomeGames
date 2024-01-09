import CellModel from './CellModel';
import { Labels } from './Labels';
import { FigureModel } from './FigureModel';
import { CreateCell } from '../utils/utils';
import { PlayerModel } from './PlayerModel';
import { Label } from '@mui/icons-material';
//import PlayerModel from './PlayerModel';

export default class BoardModel {
    cells: CellModel[][] = [];
    cellsInRow = 8;

    createCells() {
        for (let i = 0; i < this.cellsInRow; i += 1) {
            const row: CellModel[] = [];

            for (let j = 0; j < this.cellsInRow; j += 1) {
                row.push(CreateCell(i, j, this))
            }
            this.cells.push(row);
        }
        //console.log(this.cells.length, '; ', this.cells[0].length)
    }

    addFigures() {
        this.cells.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (rowIndex <= 2 && cell.label === Labels.Dark) {
                    new FigureModel(Labels.Dark, this.getCell(rowIndex, cellIndex), false);
                } else if (rowIndex >= this.cells.length - 3 && cell.label === Labels.Dark) {
                    new FigureModel(Labels.Light, this.getCell(rowIndex, cellIndex), false);
                }
            });
        });
    }

    highlightCells(selectedCell: CellModel | undefined, currentyPlayer: PlayerModel){
        this.cells.forEach(row => {
            row.forEach(cell => {
                cell.available = !!selectedCell?.figure?.canMove(cell, currentyPlayer);
                //cell.available = selectedCell?.figure?.canMove(cell) ? true : false
            })
        })
    }

    updateBoard(): BoardModel {
        const newBoard = new BoardModel;
        newBoard.cells = this.cells;
        return newBoard;
    }

    getCell(x: number, y: number): CellModel {
        return this.cells[x][y];
    }

    addFigure(label: Labels, x: number, y: number, isDame: boolean) {
        new FigureModel(label, this.getCell(x, y), isDame)
    }
}