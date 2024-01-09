import React, { Fragment, ReactElement, useEffect, useState, useRef } from 'react';
import './Board.scss';
import { Cell } from '../cell/Cell';
import BoardModel from '../../../models/BoardModel';
import CellModel from 'models/CellModel';
import { PlayerModel } from 'models/PlayerModel';
import { Socket } from 'socket.io-client';
import { getKills, splitKey } from 'utils/utils';
import { Labels } from 'models/Labels';
//import PlayerModel from 'models/PlayerModel';
const CircularJSON = require('circular-json');

type BoardProps = {
    board: BoardModel;
    onSetBoard: (board: BoardModel) => void;
    currentPlayer: PlayerModel;
    onChangePlayer: () => void;
    onChangeKillCount: () => void;
    hasOpponent: boolean;
    room: string | null;
    socket: Socket;
    playerSide: Labels | undefined;
    lightPlayer: PlayerModel;
    darkPlayer: PlayerModel;
    onChangeLightPlayerCount: (x: number) => void;
    onChangeDarkPlayerCount: (x: number) => void;
};

export const Board = ({ board, onSetBoard, currentPlayer, onChangePlayer, onChangeKillCount, hasOpponent, room, socket, playerSide, lightPlayer, darkPlayer, onChangeLightPlayerCount, onChangeDarkPlayerCount}: BoardProps): ReactElement => {
    const [selected, setSelected] = useState<CellModel>();
    
    const handleCellClick = (cell: CellModel) => {
        if(playerSide === currentPlayer.label){
            if(hasOpponent){
                if(selected && selected !== cell && selected.figure?.canMove(cell, currentPlayer)){
                    if(cell.figure !== null) {
                        const kills = getKills(currentPlayer, lightPlayer, darkPlayer)
                        socket.emit('reqWarcabyTurn', JSON.stringify(
                            { cellKey: selected.key, targetCellKey: cell.key, lk: kills.lightKills, dk: kills.darkKills, room}
                        ));
                    }else{
                        socket.emit('reqWarcabyTurn', JSON.stringify(
                            { cellKey: selected.key, targetCellKey: cell.key, lk: lightPlayer.amountOfDefeatedPiecies, dk: darkPlayer.amountOfDefeatedPiecies, room}
                        ));
                    }
                }else{
                    if (cell.figure?.label === currentPlayer.label) {
                        setSelected(cell);
                    }
                }
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
        const OnPlayerTurn = (json: string): void => {
            //const figures = board.cells.map((row => row.map(cell => cell.figure?.label)));
            const req = JSON.parse(json);
            const [x1, y1] = splitKey(req.cellKey);
            const [x2, y2] = splitKey(req.targetCellKey);
    
            const cell1 = board.getCell(x1, y1);
            const targetCell = board.getCell(x2, y2);
            
            if(targetCell.figure !== null) {
                onChangeKillCount();
            }

            cell1?.moveFigure(targetCell, currentPlayer);
            console.log(req.lk, req.dk)
            onChangeLightPlayerCount(req.lk)
            onChangeDarkPlayerCount(req.dk)
            setSelected(undefined);
            onChangePlayer();
            updateBoard();
        }

        socket.on('playerTurn', OnPlayerTurn)

        return () => {
            socket.off('playerTurn', OnPlayerTurn);
        };

    }, [board])

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