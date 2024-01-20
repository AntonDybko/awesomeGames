import { useEffect, useState } from 'react';
import './Statki.scss';
import { Board } from './board/Board';
import BoardModel from '../../models/statki/BoardModel';
import { Labels } from 'models/statki/Labels';
import { PlayerModel } from 'models/statki/PlayerModel';
import { useLocation } from 'react-router'
import { boardToArray, random } from 'utils/utils';
import { socket } from 'socket';
import { BoardId } from 'models/statki/BoardId';

function Statki() {
    const [board, setBoard] = useState<BoardModel>(new BoardModel(false));
    const [oponentBoard, setOponentBoard] = useState<BoardModel>(new BoardModel(true));
    const [winner, setWiner] = useState<PlayerModel>();
    const [lightPlayer, setLightPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Light, 0));
    const [darkPlayer, setDarkPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Dark, 0));
    const [currentPlayer, setCurrentPlayer] = useState<PlayerModel>(lightPlayer);
    const [playerSide, setPlayerSide] = useState<Labels>();
    const [hasOpponent, setHasOpponent] = useState<boolean>(false);
    const [share, setShare] = useState<boolean>(false);
    const [sentBoardStatus, setSentBoardStatus] = useState<boolean>(false);

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const paramsRoom = params.get('room');
    const [room, setRoom] = useState(paramsRoom)

    //------------
    const restart = () => {
        const newBoard = new BoardModel(false);
        newBoard.createCells();
        newBoard.addShips();
        setBoard(newBoard);
        setCurrentPlayer(lightPlayer);

        const newBoard2 = new BoardModel(true);
        newBoard2.createCells();
        setOponentBoard(newBoard2);
    };

    const changePlayer = () => {
        setCurrentPlayer(currentPlayer.label === Labels.Light ? darkPlayer : lightPlayer);
    }

    const changeLightPlayerBreakThrough = (x: number) => {
        setLightPlayer(new PlayerModel(Labels.Light, x));
    }

    const changeDarkPlayerBreakThrough = (x: number) => {
        setDarkPlayer(new PlayerModel(Labels.Dark, x));
    }

    const changeBreakThrough = () => {
        currentPlayer.label === Labels.Light ? 
            setLightPlayer(new PlayerModel(Labels.Light, lightPlayer.breakthrough+1)) : 
            setDarkPlayer(new PlayerModel(Labels.Dark, darkPlayer.breakthrough+1));
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
        if(!sentBoardStatus && board.cells.length !== 0){//
            if(playerSide === Labels.Dark) {
                console.log('sending board', playerSide)
                socket.emit('initDarkBoard', JSON.stringify(
                    { board: boardToArray(board), room: room}
                ));
            }else{
                socket.emit('initLightBoard', JSON.stringify(
                    { board: boardToArray(board), room: room}
                ));
            }
            setSentBoardStatus(true)
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
        <div className="statki">
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
                        onChangeBreakThrough={changeBreakThrough}
                        hasOpponent={false}
                        playerSide={playerSide}
                        room={room}
                        socket={socket}
                        lightPlayer={lightPlayer}
                        darkPlayer={darkPlayer}
                        onChangeLightPlayerBreakThrough={changeLightPlayerBreakThrough}
                        onChangeDarkPlayerBreakThrough={changeDarkPlayerBreakThrough}
                    />
                    { hasOpponent ? (
                        <Board
                            id={BoardId.oponent}
                            board={oponentBoard} 
                            onSetBoard={setOponentBoard}
                            currentPlayer={currentPlayer}
                            onChangePlayer={changePlayer}
                            onChangeBreakThrough={changeBreakThrough}
                            hasOpponent={hasOpponent}
                            playerSide={playerSide}
                            room={room}
                            socket={socket}
                            lightPlayer={lightPlayer}
                            darkPlayer={darkPlayer}
                            onChangeLightPlayerBreakThrough={changeLightPlayerBreakThrough}
                            onChangeDarkPlayerBreakThrough={changeDarkPlayerBreakThrough}
                        />
                    ) : null}
                    
                </div>
            )}
        </div>
    );

}

export default Statki;