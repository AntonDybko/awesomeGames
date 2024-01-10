import React, { useEffect, useState } from 'react';
import './Warcaby.scss';
import { Board } from './board/Board';
import BoardModel from '../../models/BoardModel';
import { Labels } from 'models/Labels';
import { PlayerModel } from 'models/PlayerModel';
import {io, Socket} from 'socket.io-client';
import { useLocation } from 'react-router'
import { random } from 'utils/utils';
import { socket } from 'socket';
//import PlayerModel from 'models/PlayerModel';


function Warcaby() {
    const [board, setBoard] = useState<BoardModel>(new BoardModel());
    const [winner, setWiner] = useState<PlayerModel>();
    const [lightPlayer, setLightPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Light, 0));
    const [darkPlayer, setDarkPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Dark, 0));
    const [currentPlayer, setCurrentPlayer] = useState<PlayerModel>(lightPlayer);
    const [playerSide, setPlayerSide] = useState<Labels>();
    const [hasOpponent, setHasOpponent] = useState<boolean>(false);
    const [share, setShare] = useState<boolean>(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramsRoom = params.get('room');
    const [room, setRoom] = useState(paramsRoom);

    const restart = () => {
        const newBoard = new BoardModel();
        newBoard.createCells();
        newBoard.addFigures();
        setBoard(newBoard);
        setCurrentPlayer(lightPlayer);
    };

    const changePlayer = () => {
        setCurrentPlayer(currentPlayer.label === Labels.Light ? darkPlayer : lightPlayer);
    }

    const changeLightPlayerCount = (x: number) => {
        setLightPlayer(new PlayerModel(Labels.Light, x));
    }

    const changeDarkPlayerCount = (x: number) => {
        setDarkPlayer(new PlayerModel(Labels.Dark, x));
    }

    const changeKillCount = () => {
        currentPlayer.label === Labels.Light ? 
            setLightPlayer(new PlayerModel(Labels.Light, lightPlayer.amountOfDefeatedPiecies+1)) : 
            setDarkPlayer(new PlayerModel(Labels.Dark, darkPlayer.amountOfDefeatedPiecies+1));
    }

    useEffect(() => {
        board.updateBoard()
    }, [board])

    useEffect(() => {
        if(lightPlayer.amountOfDefeatedPiecies === 12) setWiner(lightPlayer);
        if(darkPlayer.amountOfDefeatedPiecies === 12) setWiner(darkPlayer);
    }, [lightPlayer, darkPlayer])

    useEffect(() => {
        if (paramsRoom != null) {
            setPlayerSide(Labels.Dark);
            setCurrentPlayer(lightPlayer);
            socket.emit('join', paramsRoom);
            setRoom(paramsRoom);
        } else {
            setPlayerSide(Labels.Light);
            setCurrentPlayer(darkPlayer);
            //const newRoomName = '6hj8'
            const newRoomName = random();
            socket.emit('create', newRoomName);
            setRoom(newRoomName);
        }
    }, [paramsRoom]);

    useEffect(() => {

        const onOponentJoined = () => {
            setHasOpponent(true);
            setShare(false);
        }

        socket.on('restart', restart);

        socket.on('opponentJoined', onOponentJoined);

        restart();

        return () => {
            socket.off('opponentJoined', onOponentJoined);
            socket.on('restart', restart);
        };
    }, []);

    return (
        <div className="warcaby">
            <div>Room: {room}</div>
            { winner ? (
                <h1>{winner.label} player wins!</h1>
            ) : (
                <div>
                    { hasOpponent ? 
                        ''
                        : 
                        <div>
                            <div>'Waiting for opponent...'</div>
                            <div>
                                <button className="btn" onClick={() => setShare(!share)}>Share</button>
                            </div> 
                        </div>
                    }
                    { share ? (
                        <div>
                            <br />
                            <br />
                            Share link: <input type="text" value={`${window.location.href}?room=${room}`} readOnly />
                        </div>
                    ) : null}
                    <br />
                    <br />
                    <div className='player'>Current player: {currentPlayer.label}</div>
                    <Board 
                        board={board} 
                        onSetBoard={setBoard}
                        currentPlayer={currentPlayer}
                        onChangePlayer={changePlayer}
                        onChangeKillCount={changeKillCount}
                        hasOpponent={hasOpponent}
                        playerSide={playerSide}
                        room={room}
                        socket={socket}
                        lightPlayer={lightPlayer}
                        darkPlayer={darkPlayer}
                        onChangeLightPlayerCount={changeLightPlayerCount}
                        onChangeDarkPlayerCount={changeDarkPlayerCount}
                    />
                </div>
            )}
        </div>
    );
}

export default Warcaby;