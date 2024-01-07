import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import './Board.scss';
import { Cell } from '../cell/Cell';
import BoardModel from '../../../models/BoardModel';
import CellModel from 'models/CellModel';

type BoardProps = {
    board: BoardModel;
    onSetBoard: (board: BoardModel) => void;
};

export const Board = ({ board, onSetBoard}: BoardProps): ReactElement => {
    const [selected, setSelected] = useState<CellModel>();
    
    const handleCellClick = (cell: CellModel) => {
        //console.log(selected)
        if(selected && selected !== cell && selected.figure?.canMove(cell)){
            selected.moveFigure(cell);
            setSelected(undefined);
            updateBoard();
        }else{
            setSelected(cell);
        }
    };

    const updateBoard = () => {
        const updatedBoard = board.updateBoard();
        onSetBoard(updatedBoard);
    }

    const highlightCells = () => {
        board.highlightCells(selected);
        updateBoard();
    }

    useEffect(() => {
        highlightCells();
    }, [selected])

    return (
        <div className="board">
            {board.cells.map((row, rowIndex) => (
                <Fragment key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <Cell 
                            cell={cell} 
                            key={cell.key}
                            selected={selected?.x === cell.x && selected.y === cell.y}
                            onCellClick={handleCellClick}
                        />
                    ))}
                </Fragment>
            ))}
        </div>
    );
};