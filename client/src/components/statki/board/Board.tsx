import { Fragment, ReactElement, useEffect } from 'react';
import './Board.scss';
import { Cell } from '../cell/Cell';
import BoardModel from 'models/statki/BoardModel';
import CellModel from 'models/statki/CellModel';
import { PlayerModel } from 'models/statki/PlayerModel';
import { Socket } from 'socket.io-client';
import { increasedBreaktThrough, mergeClasses, splitKey } from 'utils/utils';
import { Labels } from 'models/statki/Labels';
import { BoardId } from 'models/statki/BoardId';
import AuthProps from 'interfaces/Auth';

type BoardProps = {
    id: string;
    board: BoardModel;
    onSetBoard: (board: BoardModel) => void;
    currentPlayer: PlayerModel;
    onChangePlayer: () => void;
    //onChangeBreakThrough: () => void;
    hasOpponent: boolean;
    room: string | null;
    socket: Socket;
    playerSide: Labels | undefined;
    lightPlayer: PlayerModel;
    darkPlayer: PlayerModel;
    onChangeLightPlayerBreakThrough: (x: number) => void;
    onChangeDarkPlayerBreakThrough: (x: number) => void;
    auth: AuthProps;
};

export const Board = ({id, board, onSetBoard, currentPlayer, onChangePlayer, hasOpponent, room, socket, playerSide, lightPlayer, darkPlayer, onChangeLightPlayerBreakThrough, onChangeDarkPlayerBreakThrough, auth}: BoardProps): ReactElement => {
    
    const handleCellClick = (cell: CellModel) => {
        if(playerSide === currentPlayer.label && hasOpponent && cell.hidden === true){
            onChangePlayer();

            if(playerSide === Labels.Light) {
                socket.emit('attackDark', JSON.stringify(
                    { attackedCellKey: cell.key, room: room, playerName: auth.username}
                ));
            }else if (playerSide === Labels.Dark){
                socket.emit('attackLight', JSON.stringify(
                    { attackedCellKey: cell.key, room: room, playerName: auth.username }
                ));
            }
        }
    };

    const updateBoard = () => {
        const updatedBoard = board.updateBoard();
        onSetBoard(updatedBoard);
    }

    useEffect(() => {
        const OnReceiveAttack = (json: string) => {
            if(id === BoardId.player) {
                let event  = ''
                if(playerSide === Labels.Light) event = 'responseToAttackLight'
                else if (playerSide === Labels.Dark) event = 'responseToAttackDark'

                const { attackedCellKey, room } = JSON.parse(json);
                const [x, y] = splitKey(attackedCellKey)
                const attackedCell = board.getCell(x, y)
                //
                if(attackedCell.ship !== null && attackedCell.ship.destroyed === false) {
                    attackedCell.attack()
                    socket.emit(event, JSON.stringify({ ship: true, attackedCellKey, room}))
                    const bt = increasedBreaktThrough(currentPlayer, lightPlayer, darkPlayer)
                    socket.emit('reqTurn', JSON.stringify(
                        { lk: bt.light, dk: bt.dark, room}
                    ));
                }else if (attackedCell.ship === null){
                    attackedCell.attack()
                    socket.emit(event, JSON.stringify({ ship: false, attackedCellKey, room}))
                    socket.emit('reqTurn', JSON.stringify(
                        { lk: lightPlayer.breakthrough, dk: darkPlayer.breakthrough, room}
                    ));
                }
            }
        }
        const OnReceiveReponseToAttack= (json: string) => {
            if(id === BoardId.oponent) {
                const { ship, attackedCellKey, room } = JSON.parse(json);
                const [x, y] = splitKey(attackedCellKey)
                const attackedCell = board.getCell(x, y)
                attackedCell.attack(ship)
                console.log("OnReceiveReponseToAttack: ", `${ship}, ${attackedCellKey}`)
            }
        }

        if(playerSide === Labels.Light) {
            socket.on('receiveAttackLight', OnReceiveAttack);
            socket.on('receiveResponseToAttackDark', OnReceiveReponseToAttack);
        }else if (playerSide === Labels.Dark) {
            socket.on('receiveAttackDark', OnReceiveAttack);
            socket.on('receiveResponseToAttackLight', OnReceiveReponseToAttack);
        }

        return () => {
            if(playerSide === Labels.Light) {
                socket.off('receiveAttackLight', OnReceiveAttack);
                socket.off('receiveReponseToAttackDark', OnReceiveReponseToAttack);
            }else if (playerSide === Labels.Dark) {
                socket.off('receiveAttackDark', OnReceiveAttack);
                socket.off('receiveReponseToAttackLight', OnReceiveReponseToAttack);
            }
        }
    }, [board])

    useEffect(() => {
        const OnPlayerTurn = (json: string): void => {
            //console.log("timer => room: ", room, ", user: ", auth.username)
            const req = JSON.parse(json);
            onChangeLightPlayerBreakThrough(req.lk)
            onChangeDarkPlayerBreakThrough(req.dk)

            console.log(req.lk, req.dk)

            if(id === BoardId.player && currentPlayer.label !== playerSide) {
                socket.emit('startTimer', JSON.stringify({ room, playerName: auth.username }));
                onChangePlayer();
                updateBoard();
            }else if(id === BoardId.player && currentPlayer.label === playerSide) {
                updateBoard();
            }
        }

        /*const OnTimerOut =() => {
            console.log("lost: ", room, playerSide)
            socket.emit('playerLost', JSON.stringify({room, lostPlayerSide: playerSide}));
        }*/

        socket.on('playerTurn', OnPlayerTurn)
        //socket.on('timerOut', OnTimerOut)

        return () => {
            socket.off('playerTurn', OnPlayerTurn);
            //socket.off('timerOut', OnTimerOut)
        };

    }, [room, board])

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