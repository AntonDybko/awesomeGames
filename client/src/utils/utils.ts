import BoardModel from "models/BoardModel";
import internal from "stream";
import { Labels } from "models/Labels";
import CellModel from '../models/CellModel'

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
export {
    mergeClasses,
    CreateCell
}