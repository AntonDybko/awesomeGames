import React, { Fragment, ReactElement } from 'react';
import './Board.scss';
import { Cell } from '../cell/Cell';
import BoardModel from '../../../models/BoardModel';
import { Color } from '../../../models/Color';

type BoardProps = {
    board: BoardModel;
    onSetBoard: (board: BoardModel) => void;
    playerColor: Color;
    oponentColor: Color;
};

export const Board = ({ board, onSetBoard, playerColor, oponentColor }: BoardProps): ReactElement => {
    return (
        <div className="board">
            {board.cells.map((row, index) => (
                <Fragment key={index}>
                    {row.map((cell, index) => (
                        <Cell label={cell.label} key={cell.key} player={cell.player}/>
                    ))}
                </Fragment>
            ))}
        </div>
    );
};