import React, { Fragment, ReactElement, useEffect, useState } from 'react';
import './Board.scss';
import { Cell } from '../cell/Cell';
import BoardModel from '../../../models/BoardModel';
import CellModel from 'models/CellModel';
//import { PlayerModel } from 'models/PlayerModel';
import PlayerModel from 'models/PlayerModel';

type BoardProps = {
    board: BoardModel;
    onSetBoard: (board: BoardModel) => void;
    currentPlayer: PlayerModel;
    onChangePlayer: () => void;
    onChangeKillCount: () => void;
};

export const Board = ({ board, onSetBoard, currentPlayer, onChangePlayer, onChangeKillCount}: BoardProps): ReactElement => {
    const [selected, setSelected] = useState<CellModel>();
    //const [winner, setWiner] = useState<PlayerModel>();
    
    const handleCellClick = (cell: CellModel) => {
        //console.log(selected)
        if(selected && selected !== cell && selected.figure?.canMove(cell, currentPlayer)){
            //console.log(currentPlayer.amountOfDefeatedPiecies)
            if(cell.figure !== null) {onChangeKillCount();}
            //console.log(currentPlayer.amountOfDefeatedPiecies)
            selected.moveFigure(cell, currentPlayer);
            setSelected(undefined);
            onChangePlayer();
            updateBoard();
        }else{
            if (cell.figure?.label === currentPlayer.label) {
                setSelected(cell);
            }
        }
    };

    const updateBoard = () => {
        const updatedBoard = board.updateBoard();
        onSetBoard(updatedBoard);
    }

    const highlightCells = () => {
        board.highlightCells(selected, currentPlayer);
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