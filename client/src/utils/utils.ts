import BoardModel from "models/BoardModel";
import internal from "stream";
import { Labels } from "models/Labels";
import CellModel from '../models/CellModel'
//import { PlayerModel } from "models/PlayerModel";
import PlayerModel from "models/PlayerModel";

const mergeClasses = (...rest: string[]): string => {
    return rest.join(' ');
};
const CreateCell = (i: number, j: number, board: BoardModel): CellModel => {
    if ((i + j) % 2 !== 0) {
        return new CellModel(i, j, Labels.Dark, board); // dark
    } else {
        return new CellModel(i, j, Labels.Light, board); // light
    }
}
const checkDame = (targetCell: CellModel, currentyPlayer: PlayerModel): boolean => {
    return (currentyPlayer.label === Labels.Light && targetCell.x === 0) || (currentyPlayer.label === Labels.Dark && targetCell.x === 7)
}
export {
    mergeClasses,
    CreateCell,
    checkDame
}