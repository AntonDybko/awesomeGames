import { Labels } from './Labels';
import BoardModel from './BoardModel';
import { Color } from './Color';

export default class CellModel {
    readonly x: number;
    readonly y: number;
    readonly label: Labels;
    board: BoardModel;
    player: Color;
    key: string;

    constructor(x: number, y: number, label: Labels, board: BoardModel, color: Color) {
        this.x = x;
        this.y = y;
        this.label = label;
        this.board = board;
        this.player =  color;
        this.key = `${String(x)}${String(y)}`;
    }
}