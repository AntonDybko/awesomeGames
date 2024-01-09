import BoardModel from "models/BoardModel";
import internal from "stream";
import { Labels } from "models/Labels";
import CellModel from '../models/CellModel'
import { PlayerModel } from "models/PlayerModel";
//import PlayerModel from "models/PlayerModel";

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
const random = () => {
    return Array.from(Array(8), () => Math.floor(Math.random() * 36).toString(36)).join('');
};
const splitKey =(key: string): number[] => {
    const splittedKey = key.split('');
    const x = parseInt(splittedKey[0]);
    const y = parseInt(splittedKey[1]);
    return [x, y];
}
const changeKills = (currentPlayer: PlayerModel, light: PlayerModel, dark: PlayerModel) => {
    const lightKills = currentPlayer.label === Labels.Light ? light.amountOfDefeatedPiecies + 1 : light.amountOfDefeatedPiecies;
    const darkKills = currentPlayer.label === Labels.Dark ? dark.amountOfDefeatedPiecies + 1 : dark.amountOfDefeatedPiecies;
    return {lightKills, darkKills}
}
const getKills = (currentPlayer: PlayerModel, light: PlayerModel, dark: PlayerModel) => {
    return changeKills(currentPlayer, light, dark);
}
export {
    mergeClasses,
    CreateCell,
    checkDame,
    random,
    splitKey,
    getKills,
}