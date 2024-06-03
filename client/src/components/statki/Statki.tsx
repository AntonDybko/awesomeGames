import { useEffect, useRef, useState } from "react";
import "./Statki.scss";
import { Board } from "./board/Board";
import BoardModel from "../../models/statki/BoardModel";
import { Labels } from "models/statki/Labels";
import { PlayerModel } from "models/statki/PlayerModel";
import { useLocation } from "react-router";
import { boardToArray, random, initBoard } from "utils/utils";
import { socket } from "socket";
import { BoardId } from "models/statki/BoardId";
import { Status } from "models/statki/Status";
import useAuth from "hooks/useAuth";
import Chat from "components/chat/Chat";
import ShortUniqueId from "short-unique-id";

interface LocationState {
    isRanked?: boolean;
}

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
    const [status, setStatus] = useState<Status>(Status.Default);
    const [timer, setTimer] = useState<number>(60);
    const [step, setStep] = useState<number>(0);
    const [opponent, setOpponent] = useState<String>("");

    const location = useLocation();
    const state = location.state as LocationState;
    const isRanked = state?.isRanked || false;
    const params = new URLSearchParams(location.search);
    const paramsRoom = params.get("room") || "";
    const [room, setRoom] = useState(paramsRoom);

    const uid = new ShortUniqueId({ length: 10 });

    //refs
    const hasOpponentRef = useRef(false);
    const userNameRef = useRef<string | undefined>(undefined);
    const winnerRef = useRef<PlayerModel>();

    useEffect(() => {
        userNameRef.current = auth.username;
    }, [auth.username]);

    useEffect(() => {
        hasOpponentRef.current = hasOpponent;
    }, [hasOpponent]);

    useEffect(() => {
        winnerRef.current = winner;
    }, [winner]);
    //end of refs
    //------------
    const restart = () => {
        setBoard(initBoard(false, true));
        setOponentBoard(initBoard(true, false));
        setCurrentPlayer(lightPlayer);
    }; //dopracowac

    const incrementStep = () => {
        setStep(step + 1);
    };

    const changePlayer = () => {
        setCurrentPlayer(currentPlayer.label === Labels.Light ? darkPlayer : lightPlayer);
    };

    const changeLightPlayerBreakThrough = (x: number) => {
        setLightPlayer(new PlayerModel(Labels.Light, x));
    };

    const changeDarkPlayerBreakThrough = (x: number) => {
        setDarkPlayer(new PlayerModel(Labels.Dark, x));
    };

    useEffect(() => {
        board.updateBoard();
        console.log("updating board");
    }, [board]);

    useEffect(() => {
        oponentBoard.updateBoard();
        console.log("updating board");
    }, [oponentBoard]);

    useEffect(() => {
        console.log("have oponent?", hasOpponent);
        if (hasOpponent) {
            setBoard(initBoard(false, true));
            setOponentBoard(initBoard(true, false));
        }
    }, [hasOpponent]);

    useEffect(() => {
        if (lightPlayer.breakthrough === 15) {
            setWiner(lightPlayer);
            if (playerSide === Labels.Light && isRanked) {
                socket.emit("winner", room, auth.username, "battleships");
            }
        }
        if (darkPlayer.breakthrough === 15) {
            setWiner(darkPlayer);
            if (playerSide === Labels.Dark && isRanked) {
                socket.emit("winner", room, auth.username, "battleships");
            }
        }
    }, [lightPlayer, darkPlayer]);

    useEffect(() => {
        if (isRanked) {
            console.log("ranked");
            socket.emit("matchmaking", {
                playerName: auth.username,
                game: "battleships",
            });
        } else {
            if (paramsRoom) {
                setPlayerSide(Labels.Dark);
                setCurrentPlayer(lightPlayer);
                //socket.emit('join', paramsRoom);
                socket.emit("join", JSON.stringify({ room: paramsRoom, playerName: auth.username }));
                setRoom(paramsRoom);
            } else {
                setPlayerSide(Labels.Light);
                setCurrentPlayer(darkPlayer);
                const newRoomName = uid.rnd();
                console.log("new room ", newRoomName);
                console.log(socket.id, ":", auth.username);
                socket.emit(
                    "create",
                    JSON.stringify({ room: newRoomName, playerName: auth.username, game: "battleships" })
                );
                setRoom(newRoomName);
            }
        }
    }, [paramsRoom]);

    useEffect(() => {
        console.log(room);

        const onObserverJoined = () => {
            console.log("observer here");
            setPlayerSide(Labels.Neutral);
            setShare(false);
            setBoard(initBoard(false, false));
            setOponentBoard(initBoard(false, false));
        };

        const onWrongRoom = () => {
            setStatus(Status.WrongRoom);
        };

        const onOponentLost = (data: string) => {
            const { room, lostPlayerSide } = JSON.parse(data);
            console.log("oponent lost ", lostPlayerSide);
            if (lostPlayerSide === Labels.Dark) setWiner(lightPlayer);
            else setWiner(darkPlayer);
        };

        socket.on("restart", restart);

        //socket.on('opponentJoined', onOponentJoined);

        socket.on("observerJoined", onObserverJoined);

        socket.on("wrongRoom", onWrongRoom);

        socket.on("oponentLost", onOponentLost);

        socket.on("matchFound", (data) => {
            setRoom(data.room);

            if (data.firstPlayer === socket.id) {
                setPlayerSide(Labels.Light);
                socket.emit("startTimer", JSON.stringify({ room, playerName: auth.username, step }));
            } else {
                setPlayerSide(Labels.Dark);
            }
            console.log("matchfound");
            setCurrentPlayer(lightPlayer);
            setHasOpponent(true);
        });

        socket.on("queueStart", (data) => {
            setRoom(data.room);
        });

        setCurrentPlayer(lightPlayer);
        //restart();

        return () => {
            //socket.off('opponentJoined', onOponentJoined);
            //console.log()

            socket.off("observerJoined", onObserverJoined);
            socket.off("wrongRoom", onWrongRoom);
            socket.off("oponentLost", onOponentLost);
            socket.off("restart", restart);
        };
    }, []);

    useEffect(() => {
        return () => {
            console.log(
                "return checking: ",
                room !== undefined,
                hasOpponentRef.current,
                winnerRef.current === undefined,
                userNameRef.current !== undefined
            );
            if (
                room !== undefined &&
                hasOpponentRef.current &&
                winnerRef.current === undefined &&
                userNameRef.current !== undefined
            ) {
                console.log("what is going on here??");
                console.log(room, userNameRef.current, winnerRef.current);
                console.log("emitting lose");
                socket.emit("playerLost", JSON.stringify({ room, lostPlayerSide: userNameRef.current, isRanked }));
            } else {
                socket.emit("leave", { room: room });
            }
        };
    }, [room]);

    useEffect(() => {
        const OnTimerOut = () => {
            console.log("lost: ", room, playerSide);
            socket.emit("playerLost", JSON.stringify({ room, lostPlayerSide: auth.username, isRanked }));
        };
        if (room !== null && playerSide !== undefined && !winner) {
            socket.on("timerOut", OnTimerOut);

            return () => {
                socket.off("timerOut", OnTimerOut);
            };
        }
    }, [room, playerSide, winner]);

    useEffect(() => {
        const onOponentJoined = () => {
            console.log("oponent joined");
            setHasOpponent(true);
            setShare(false);
            console.log(room, auth.username, step);
            socket.emit("getOponentUserName", JSON.stringify({ room, playerName: auth.username }));
            if (playerSide === Labels.Light)
                socket.emit("startTimer", JSON.stringify({ room, playerName: auth.username, step }));
        };

        const onOpponentUserName = (data: string) => {
            const { opponent } = JSON.parse(data);
            console.log("oponent name: ", opponent);
            setOpponent(opponent);
        };

        socket.on("opponentJoined", onOponentJoined);
        socket.on("opponentUserName", onOpponentUserName);

        return () => {
            socket.off("opponentJoined", onOponentJoined);
            socket.off("opponentUserName", onOpponentUserName);
        };
    }, [room]);

    useEffect(() => {
        if (hasOpponent) {
            const timeout = setTimeout(() => {
                console.log("timer"); //test
                setTimer(timer - 1);
            }, 1000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [timer, hasOpponent]);

    const giveUp = () => {
        // socket.emit("playerLost", JSON.stringify({ room, lostPlayerSide: playerSide, isRanked })); // wywala błąd na backendzie, nie zmienia rankingu
        socket.emit("playerLost", JSON.stringify({ room, lostPlayerSide: userNameRef.current, isRanked })); // give up sprawia ze zawsze dark player wygrywa, zmienia ranking
    };

    return (
        <div className="statki">
            <div>Room: {room}</div>
            <div>Player: {playerSide}</div>
            <div>Opponent: {opponent}</div>
            {status === Status.WrongRoom ? (
                <h1>This room does not exist</h1>
            ) : playerSide === Labels.Neutral ? (
                <h1>This game does not provide viewer mod.</h1>
            ) : winner ? (
                <h1>{winner.label} player wins!</h1>
            ) : (
                <div>
                    {hasOpponent ? (
                        playerSide !== undefined && room !== undefined ? (
                            <div>
                                <button className="btn" onClick={() => giveUp()}>
                                    Give Up
                                </button>
                            </div>
                        ) : (
                            ""
                        )
                    ) : (
                        <div>
                            <div>'Waiting for opponent...'</div>
                            <div>
                                <button className="btn" onClick={() => setShare(!share)}>
                                    Share
                                </button>
                            </div>
                        </div>
                    )}
                    {share ? (
                        <div>
                            <br />
                            <br />
                            Share link: <input type="text" value={`${window.location.href}?room=${room}`} readOnly />
                        </div>
                    ) : null}
                    <br />
                    <h2 className="leftside">Player</h2>
                    <h2 className="rightside">Oponent</h2>
                    <br />
                    <div className="box">
                        <div className="player">
                            Current player: {currentPlayer.label === playerSide ? "Player" : "Oponent"}
                        </div>
                        {hasOpponent ? <div className="timer">{timer}</div> : ""}
                    </div>
                    <br></br>
                    <br></br>
                    <div>
                        <Board
                            id={BoardId.player}
                            board={board}
                            onSetBoard={setBoard}
                            currentPlayer={currentPlayer}
                            onChangePlayer={changePlayer}
                            hasOpponent={false}
                            playerSide={playerSide}
                            room={room}
                            socket={socket}
                            lightPlayer={lightPlayer}
                            darkPlayer={darkPlayer}
                            onChangeLightPlayerBreakThrough={changeLightPlayerBreakThrough}
                            onChangeDarkPlayerBreakThrough={changeDarkPlayerBreakThrough}
                            auth={auth}
                            onSetTimer={setTimer}
                            onIncrementStep={incrementStep}
                            step={step}
                        />
                        <Board
                            id={BoardId.oponent}
                            board={oponentBoard}
                            onSetBoard={setOponentBoard}
                            currentPlayer={currentPlayer}
                            onChangePlayer={changePlayer}
                            hasOpponent={hasOpponent}
                            playerSide={playerSide}
                            room={room}
                            socket={socket}
                            lightPlayer={lightPlayer}
                            darkPlayer={darkPlayer}
                            onChangeLightPlayerBreakThrough={changeLightPlayerBreakThrough}
                            onChangeDarkPlayerBreakThrough={changeDarkPlayerBreakThrough}
                            auth={auth}
                            onSetTimer={setTimer}
                            onIncrementStep={incrementStep}
                            step={step}
                        />
                    </div>
                    <div className="chat">
                        <Chat room={room}></Chat>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Statki;
