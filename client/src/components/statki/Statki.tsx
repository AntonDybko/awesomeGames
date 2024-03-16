import { useEffect, useState } from 'react';
import './Statki.scss';
import { Board } from './board/Board';
import BoardModel from '../../models/statki/BoardModel';
import { Labels } from 'models/statki/Labels';
import { PlayerModel } from 'models/statki/PlayerModel';
import { useLocation } from 'react-router'
import { boardToArray, random, initBoard } from 'utils/utils';
import { socket } from 'socket';
import { BoardId } from 'models/statki/BoardId';
import { Status } from 'models/statki/Status';
import useAuth from 'hooks/useAuth';

function Statki() {
    const { auth } = useAuth();
    //const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(PlayerStatus.Player);
    //const [playerStatus, setPlayerStatus] = useState<PlayerStatus>(PlayerStatus.Observer);
    //const [sendingBoardStatus, setSendingBoardStatus] =  useState<boolean>(false);
    const [board, setBoard] = useState<BoardModel>(new BoardModel(false));
    const [oponentBoard, setOponentBoard] = useState<BoardModel>(new BoardModel(true));
    const [winner, setWiner] = useState<PlayerModel>();
    const [lightPlayer, setLightPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Light, 0));
    const [darkPlayer, setDarkPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Dark, 0));
    const [currentPlayer, setCurrentPlayer] = useState<PlayerModel>(lightPlayer);
    const [playerSide, setPlayerSide] = useState<Labels>();
    const [hasOpponent, setHasOpponent] = useState<boolean>(false);
    const [share, setShare] = useState<boolean>(false);
    const [status, setStatus] = useState<Status>(Status.Default)
    //const [sentBoardStatus, setSentBoardStatus] = useState<boolean>(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramsRoom = params.get('room');
    const [room, setRoom] = useState(paramsRoom)

    //------------
    const restart = () => {
        setBoard(initBoard(false, true));
        setOponentBoard(initBoard(true, false));
        setCurrentPlayer(lightPlayer);
    };//dopracowac

    const changePlayer = () => {
        setCurrentPlayer(currentPlayer.label === Labels.Light ? darkPlayer : lightPlayer);
    }

    const changeLightPlayerBreakThrough = (x: number) => {
        setLightPlayer(new PlayerModel(Labels.Light, x));
    }

    const changeDarkPlayerBreakThrough = (x: number) => {
        setDarkPlayer(new PlayerModel(Labels.Dark, x));
    }

    useEffect(() => {
        board.updateBoard()
        console.log('updating board')
    }, [board])

    useEffect(() => {
        oponentBoard.updateBoard()
        console.log('updating board')
    }, [oponentBoard])


    useEffect(() => {
        console.log('have oponent?', hasOpponent)
        if(hasOpponent){
            setBoard(initBoard(false, true));
            setOponentBoard(initBoard(true, false));
        }
    }, [hasOpponent])


    useEffect(() => {
        if(lightPlayer.breakthrough === 15) setWiner(lightPlayer);
        if(darkPlayer.breakthrough === 15) setWiner(darkPlayer);
    }, [lightPlayer, darkPlayer])

    useEffect(() => {
        if (paramsRoom != null) {
            setPlayerSide(Labels.Dark);
            setCurrentPlayer(lightPlayer);
            //socket.emit('join', paramsRoom);
            socket.emit('join', JSON.stringify({room: paramsRoom, playerName: auth.username}));
            setRoom(paramsRoom);
        } else {
            setPlayerSide(Labels.Light);
            setCurrentPlayer(darkPlayer);
            const newRoomName = random();
            console.log("new room ", newRoomName)
            console.log(socket.id, ":", auth.username)
            socket.emit('create', JSON.stringify({room: newRoomName, socketId: socket.id, playerName: auth.username}));
            setRoom(newRoomName);
        }
    }, [paramsRoom]);

    useEffect(() => {

        const onOponentJoined = () => {
            console.log("oponent joined")
            setHasOpponent(true);
            setShare(false);
        }

        const onObserverJoined = () => {
            console.log('observer here')
            setPlayerSide(Labels.Neutral);
            setShare(false);
            setBoard(initBoard(false, false));
            setOponentBoard(initBoard(false, false));
        }

        const onWrongRoom = () => {
            setStatus(Status.WrongRoom)
        }

        const onOponentLost = (data: string) => {
            const { room, lostPlayerSide } = JSON.parse(data);
            console.log('oponent lost ', lostPlayerSide)
            if (lostPlayerSide === Labels.Dark) setWiner(lightPlayer)
            else setWiner(darkPlayer)
        }

        socket.on('restart', restart);

        socket.on('opponentJoined', onOponentJoined);

        socket.on('observerJoined', onObserverJoined);

        socket.on('wrongRoom', onWrongRoom);

        socket.on('oponentLost', onOponentLost);

        setCurrentPlayer(lightPlayer);
        //restart();

        return () => {
            socket.off('opponentJoined', onOponentJoined);
            socket.off('observerJoined', onObserverJoined);
            socket.off('wrongRoom', onWrongRoom);
            socket.off('oponentLost', onOponentLost);
            socket.off('restart', restart);
        };
    }, []);

    useEffect(() => {
        if(room !== null && playerSide !== undefined){
            console.log(room)

            return () => {
                console.log("my room: ", room)
                socket.emit('playerLost', JSON.stringify({room, lostPlayerSide: playerSide}));
            };
        }
    }, [room, playerSide])

    const giveUp = () => {
        socket.emit('playerLost', JSON.stringify({room, lostPlayerSide: playerSide}));
    }

    return (
        <div className="statki">
            <div>Room: {room}</div>
            { status === Status.WrongRoom ? (
                <h1>This room does not exist</h1>
            ) : playerSide === Labels.Neutral ?(
                <h1>This game does not provide viewer mod.</h1>
            ) : (
                winner ? (
                    <h1>{winner.label} player wins!</h1>
                ) : (
                    <div>
                        { hasOpponent ? 
                            (playerSide !== undefined && room !== undefined) ?
                                <div>
                                    <button className="btn" onClick={() => giveUp()}>Give Up</button>
                                </div>
                                : ''
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
                        <h2 className='leftside'>Player</h2>
                        <h2 className='rightside'>Oponent</h2>
                        <br />
                        <div className='player'>Current player: {currentPlayer.label}</div>
                        <Board 
                            id={BoardId.player}
                            board={board} 
                            onSetBoard={setBoard}
                            currentPlayer={currentPlayer}
                            onChangePlayer={changePlayer}
                            //onChangeBreakThrough={changeBreakThrough}
                            hasOpponent={false}
                            playerSide={playerSide}
                            room={room}
                            socket={socket}
                            lightPlayer={lightPlayer}
                            darkPlayer={darkPlayer}
                            onChangeLightPlayerBreakThrough={changeLightPlayerBreakThrough}
                            onChangeDarkPlayerBreakThrough={changeDarkPlayerBreakThrough}
                        />
                        <Board
                                id={BoardId.oponent}
                                board={oponentBoard} 
                                onSetBoard={setOponentBoard}
                                currentPlayer={currentPlayer}
                                onChangePlayer={changePlayer}
                                //onChangeBreakThrough={changeBreakThrough}
                                hasOpponent={hasOpponent}
                                playerSide={playerSide}
                                room={room}
                                socket={socket}
                                lightPlayer={lightPlayer}
                                darkPlayer={darkPlayer}
                                onChangeLightPlayerBreakThrough={changeLightPlayerBreakThrough}
                                onChangeDarkPlayerBreakThrough={changeDarkPlayerBreakThrough}
                        />
                        
                    </div>
                )
            )}
        </div>
    );

}

export default Statki;