import { Fragment, ReactElement, useEffect } from 'react';
import './Board.scss';
import { Cell } from '../cell/Cell';
import BoardModel from 'models/statki/BoardModel';
import CellModel from 'models/statki/CellModel';
import { PlayerModel } from 'models/statki/PlayerModel';
import { Socket } from 'socket.io-client';
import { getBreaktThrough, mergeClasses, splitKey } from 'utils/utils';
import { Labels } from 'models/statki/Labels';
import { BoardId } from 'models/statki/BoardId';

type BoardProps = {
    id: string;
    board: BoardModel;
    onSetBoard: (board: BoardModel) => void;
    currentPlayer: PlayerModel;
    onChangePlayer: () => void;
    onChangeBreakThrough: () => void;
    hasOpponent: boolean;
    room: string | null;
    socket: Socket;
    playerSide: Labels | undefined;
    lightPlayer: PlayerModel;
    darkPlayer: PlayerModel;
    onChangeLightPlayerBreakThrough: (x: number) => void;
    onChangeDarkPlayerBreakThrough: (x: number) => void;
};

export const Board = ({id, board, onSetBoard, currentPlayer, onChangePlayer, onChangeBreakThrough, hasOpponent, room, socket, playerSide, lightPlayer, darkPlayer, onChangeLightPlayerBreakThrough, onChangeDarkPlayerBreakThrough}: BoardProps): ReactElement => {
    
    const handleCellClick = (cell: CellModel) => {
        if(playerSide === currentPlayer.label && hasOpponent && cell.hidden === true){
            cell.attack();
                
            const event = 'reqStatkiTurn'

            if(cell.ship !== null) {
                const bt = getBreaktThrough(currentPlayer, lightPlayer, darkPlayer)
                socket.emit(event, JSON.stringify(
                    { cellKey: cell.key, lk: bt.light, dk: bt.dark, room}
                ));
            }else{
                socket.emit(event, JSON.stringify(
                    { cellKey: cell.key, lk: lightPlayer.breakthrough, dk: darkPlayer.breakthrough, room}
                ));
            }
        }
    };

    const updateBoard = () => {
        const updatedBoard = board.updateBoard();
        onSetBoard(updatedBoard);
    }


    useEffect(() => {
        const OnGetOponentBoard = (json: string): void => {
            const req = JSON.parse(json);
            if(board.cells.length !== 0 && hasOpponent){
                console.log('oponentboard: ', req.board)
                const oponentBoardAsArray = req.board;
                board.addShipsFromArray(oponentBoardAsArray)
                updateBoard()
            }

        }

        if(playerSide === Labels.Light) socket.on('getDarkBoard', OnGetOponentBoard);
        else socket.on('getLightBoard', OnGetOponentBoard);

        return () => {
            if(playerSide === Labels.Light) socket.off('getDarkBoard', OnGetOponentBoard);
            else socket.off('getLightBoard', OnGetOponentBoard);
        }
    }, [])

    useEffect(() => {
        const OnPlayerTurn = (json: string): void => {
            if(id === BoardId.player && currentPlayer.label !== playerSide) {
                console.log('---------------------')
                console.log(id, (currentPlayer.label !== playerSide))
                console.log(currentPlayer.label, playerSide)

                const req = JSON.parse(json);
                const [x, y] = splitKey(req.cellKey);
        
                const cell = board.getCell(x, y);
                
                if(cell.ship !== null) {
                    onChangeBreakThrough();
                }

                cell.attack();
                console.log(req.lk, req.dk)
                onChangeLightPlayerBreakThrough(req.lk)
                onChangeDarkPlayerBreakThrough(req.dk)
                onChangePlayer();
                updateBoard();
            }else if(id === BoardId.player && currentPlayer.label === playerSide) {
                const req = JSON.parse(json);
                onChangeLightPlayerBreakThrough(req.lk)
                onChangeDarkPlayerBreakThrough(req.dk)
                onChangePlayer();
                updateBoard();
            }
        }

        socket.on('playerTurn', OnPlayerTurn)

        return () => {
            socket.off('playerTurn', OnPlayerTurn);
        };

    }, [board])

    return (
        <div className={mergeClasses("board", id)}>

            {board.cells.map((row, rowIndex) => (
                <Fragment key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                        <Cell 
                            cell={cell} 
                            key={cell.key}
                            onCellClick={handleCellClick}
                        />
                    ))}
                </Fragment>
            ))}
        </div>
    );
};