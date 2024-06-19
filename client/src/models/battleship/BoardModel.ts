import { CreateCell, createBoard } from "utils/utils";
import CellModel from "./CellModel";
import { ShipModel } from "./ShipModel";


export default class BoardModel {
    cells: CellModel[][] = [];
    cellsInRow = 10;
    hidden: boolean;

    constructor(hidden: boolean){
        this.hidden = hidden;
    }

    createCells() {
        for (let i = 0; i < this.cellsInRow; i += 1) {
            const row: CellModel[] = [];

            for (let j = 0; j < this.cellsInRow; j += 1) {
                row.push(CreateCell(i, j, this, this.hidden))
            }
            this.cells.push(row);
        }
    }

    addShips() {
        const board = createBoard()
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if(cell === 1) {
                    this.addShip(rowIndex, cellIndex)
                }
            })
        })
    }

    addShipsFromArray(board: number[][]) {
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if(cell === 1) {
                    this.addShip(rowIndex, cellIndex)
                }
            })
        })
    }

    updateBoard(): BoardModel {
        const newBoard = new BoardModel(this.hidden);
        newBoard.cells = this.cells;
        return newBoard;
    }

    getCell(x: number, y: number): CellModel {
        return this.cells[y][x];
    }

    addShip(x: number, y: number, destroyed?: boolean) {
        new ShipModel(this.getCell(x, y), destroyed)
    }
}