import BoardModel from "models/statki/BoardModel";
import internal from "stream";
import { Labels } from "models/statki/Labels";
import CellModel from '../models/statki/CellModel'
import { PlayerModel } from "models/statki/PlayerModel";
import { number } from "yup";
//import PlayerModel from "models/PlayerModel";

const mergeClasses = (...rest: string[]): string => {
    return rest.join(' ');
};
const CreateCell = (i: number, j: number, board: BoardModel, hidden: boolean): CellModel => {
    return new CellModel(i, j, board, hidden); 
    /*if ((i + j) % 2 !== 0) {
        return new CellModel(i, j, board); // dark
    } else {
        return new CellModel(i, j, board); // light
    }*/
}
/*const checkDame = (targetCell: CellModel, currentyPlayer: PlayerModel): boolean => {
    return (currentyPlayer.label === Labels.Light && targetCell.x === 0) || (currentyPlayer.label === Labels.Dark && targetCell.x === 7)
}*/
const random = () => {
    return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};
const splitKey =(key: string): number[] => {
    const splittedKey = key.split('');
    const y = parseInt(splittedKey[0]);
    const x = parseInt(splittedKey[1]);
    return [x, y];
}
/*const changeKills = (currentPlayer: PlayerModel, light: PlayerModel, dark: PlayerModel) => {
    const lightKills = currentPlayer.label === Labels.Light ? light.amountOfDefeatedPiecies + 1 : light.amountOfDefeatedPiecies;
    const darkKills = currentPlayer.label === Labels.Dark ? dark.amountOfDefeatedPiecies + 1 : dark.amountOfDefeatedPiecies;
    return {lightKills, darkKills}
}
const getKills = (currentPlayer: PlayerModel, light: PlayerModel, dark: PlayerModel) => {
    return changeKills(currentPlayer, light, dark);
}
const isValidMove = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
}
const getJumpOverCell = (startCell: CellModel, targetCell: CellModel): CellModel => {
    const jumpOverRow = (startCell.y + targetCell.y) / 2;
    const jumpOverCol = (startCell.x + targetCell.x) / 2;
    return startCell.board.getCell(jumpOverCol, jumpOverRow);
}*/
const getBreaktThrough = (currentPlayer: PlayerModel, l: PlayerModel, d: PlayerModel) => {
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
            console.log(str)
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
/*const isValidJump = (row: number, col: number, targetRow: number, targetCol: number): boolean => {
    const jumpOverRow = (row + targetRow) / 2;
    const jumpOverCol = (col + targetCol) / 2;
    return isValidMove(jumpOverRow, jumpOverCol);
}*/
export {
    mergeClasses,
    CreateCell,
    //checkDame,
    random,
    splitKey,
    //getKills,
    //isValidMove,
    //getJumpOverCell,
    getBreaktThrough,
    createBoard,
    boardToArray
    //isValidJump
}