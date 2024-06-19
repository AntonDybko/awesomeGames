import BoardModel from "models/battleship/BoardModel";
import { Labels } from "models/battleship/Labels";
import CellModel from '../models/battleship/CellModel'
import { PlayerModel } from "models/battleship/PlayerModel";

const mergeClasses = (...rest: string[]): string => {
    return rest.join(' ');
};
const CreateCell = (i: number, j: number, board: BoardModel, hidden: boolean): CellModel => {
    return new CellModel(i, j, board, hidden); 
}
const initBoard = (hiddenFields: boolean, ships: boolean) => {
    const newBoard = new BoardModel(hiddenFields);
    newBoard.createCells();
    if(ships) newBoard.addShips();
    return newBoard
}

const random = () => {
    return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};
const splitKey =(key: string): number[] => {
    const splittedKey = key.split('');
    const y = parseInt(splittedKey[0]);
    const x = parseInt(splittedKey[1]);
    return [x, y];
}

const increasedBreaktThrough = (currentPlayer: PlayerModel, l: PlayerModel, d: PlayerModel) => {
    const light = currentPlayer.label === Labels.Light ? l.breakthrough + 1 : l.breakthrough;
    const dark = currentPlayer.label === Labels.Dark ? d.breakthrough + 1 : d.breakthrough;
    return {light, dark}
}
const createBoard = (): number[][] => {

    const rows = 10;
    const cols = 10;

    const board: number[][] = [];
    for (let i = 0; i < rows; i++) {
        board[i] = new Array(cols).fill(0);
    }

    function placeRandomShips() {
        const shipLengths = [1, 2, 3, 4, 5];

        const maxAttempts = 50;

        for (const shipLength of shipLengths) {
            let attempts = 0;

            while (attempts < maxAttempts) {
                const orientation = Math.random() < 0.5 ? 'horizontal' : 'vertical';
                const startRow = Math.floor(Math.random() * rows);
                const startCol = Math.floor(Math.random() * cols);

                if (canPlaceShip(startRow, startCol, shipLength, orientation)) {
                    placeShip(startRow, startCol, shipLength, orientation);
                    break;
                }

                attempts++;
            }
        }
    }

    // Funkcja sprawdzająca, czy można umieścić statek w danym miejscu
    function canPlaceShip(startRow: number, startCol: number, length: number, orientation: string) {
        if (orientation === 'horizontal') {
            for (let i = 0; i < length; i++) {
            if (startCol + i >= cols || board[startRow][startCol + i] !== 0) {
                return false;
            }
            }
        } else { 
            for (let i = 0; i < length; i++) {
            if (startRow + i >= rows || board[startRow + i][startCol] !== 0) {
                return false;
            }
            }
        }

        return true;
    }

    function placeShip(startRow: number, startCol: number, length: number, orientation: string)  {
        if (orientation === 'horizontal') {
            for (let i = 0; i < length; i++) {
                board[startRow][startCol + i] = 1;
            }
        } else { 
            for (let i = 0; i < length; i++) {
                board[startRow + i][startCol] = 1;
            }
        }
    }

    const draw = () =>{
        let str = ''
        board.forEach(row =>{
            str = '';
            row.forEach(x => {
                if (x === 0){
                    str += "-"
                }else{
                    str += "O"
                }
            })
        })
    }

    placeRandomShips();

    draw();
    return board;
}
const boardToArray = (board: BoardModel): number[][] =>{
    const rows = 10;
    const cols = 10;

    const boardAsArray: number[][] = [];
    for (let i = 0; i < rows; i++) {
        boardAsArray[i] = new Array(cols).fill(0);
    }

    for(let x = 0; x < rows; x++){
        for(let y = 0; y < cols; y++){
            if(board.getCell(x, y).ship !== null) {
                boardAsArray[x][y] = 1;
            }
        }
    }
    
    return boardAsArray;
}

export {
    mergeClasses,
    CreateCell,
    random,
    splitKey,
    increasedBreaktThrough,
    createBoard,
    boardToArray,
    initBoard
}