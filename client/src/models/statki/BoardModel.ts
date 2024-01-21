import { CreateCell, createBoard } from "utils/utils";
import CellModel from "./CellModel";
import { Labels } from "./Labels";
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
        console.log(this.cells.length, ':', this.cells[0].length)
        //console.log(this.cells.length, '; ', this.cells[0].length)
    }

    /*addFigures() {
        this.cells.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                if (rowIndex <= 2 && cell.label === Labels.Dark) {
                    new FigureModel(Labels.Dark, this.getCell(rowIndex, cellIndex), false);
                } else if (rowIndex >= this.cells.length - 3 && cell.label === Labels.Dark) {
                    new FigureModel(Labels.Light, this.getCell(rowIndex, cellIndex), false);
                }
            });
        });
    }*/
    addShips() {
        const board = createBoard()
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                //console.log('indexes', rowIndex, ':', cellIndex)
                if(cell === 1) {
                    this.addShip(rowIndex, cellIndex)
                }
            })
        })
    }

    addShipsFromArray(board: number[][]) {
        //console.log(board)
        board.forEach((row, rowIndex) => {
            row.forEach((cell, cellIndex) => {
                //console.log('indexes', rowIndex, ':', cellIndex)
                if(cell === 1) {
                    this.addShip(rowIndex, cellIndex)
                }
            })
        })
        //console.log('oponentCelss')
        //console.log(this.cells)
    }

    updateBoard(): BoardModel {
        const newBoard = new BoardModel(this.hidden);
        newBoard.cells = this.cells;
        return newBoard;
    }

    getCell(x: number, y: number): CellModel {
        return this.cells[y][x];
    }

    addShip(x: number, y: number) {
        new ShipModel(this.getCell(x, y))
    }
}