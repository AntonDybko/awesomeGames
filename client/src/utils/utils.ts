import BoardModel from "models/BoardModel";
import { Color } from "models/Color";
import internal from "stream";
import { Labels } from "models/Labels";
import CellModel from '../models/CellModel'

const mergeClasses = (...rest: string[]): string => {
    return rest.join(' ');
};
const CreateCell = (i: number, j: number, board: BoardModel, color: Color): CellModel => {
    if ((i + j) % 2 !== 0) {
        return new CellModel(i, j, Labels.Dark, board, color); // dark
    } else {
        return new CellModel(i, j, Labels.Light, board, color); // light
    }
}
export {
    mergeClasses,
    CreateCell
}