import { useEffect, useRef, useState } from "react";
import "./Statki.scss";
import { Board } from "./board/Board";
import BoardModel from "../../models/statki/BoardModel";
import { Labels } from "models/statki/Labels";
import { PlayerModel } from "models/statki/PlayerModel";
import { useLocation } from "react-router";
import { initBoard } from "utils/utils";
import { BoardId } from "models/statki/BoardId";
import { Status } from "models/statki/Status";
import useAuth from "hooks/useAuth";
import Chat from "components/chat/Chat";
import ShortUniqueId from "short-unique-id";
import { Socket } from "socket.io-client";

interface LocationState {
    isRanked?: boolean;
}

type StatkiProps = {
    socket: Socket | null;
}

function Statki ({socket}: StatkiProps) {
    const { auth } = useAuth();
    const [board, setBoard] = useState<BoardModel>(new BoardModel(false));
    const [oponentBoard, setOponentBoard] = useState<BoardModel>(new BoardModel(true));
    const [winner, setWinner] = useState<string | undefined>(undefined);
    const [lightPlayer, setLightPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Light, 0));
    const [darkPlayer, setDarkPlayer] = useState<PlayerModel>(new PlayerModel(Labels.Dark, 0));
    const [currentPlayer, setCurrentPlayer] = useState<PlayerModel>(lightPlayer);
    const [playerSide, setPlayerSide] = useState<Labels>();
    const [hasOpponent, setHasOpponent] = useState<boolean>(false);
    const [share, setShare] = useState<boolean>(false);
    const [status, setStatus] = useState<Status>(Status.Default);
    const [timer, setTimer] = useState<number>(60);
    const [step, setStep] = useState<number>(0);
    const [opponent, setOpponent] = useState<string | undefined>(undefined);

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
    const winnerRef = useRef<string | undefined>(undefined);
    const opponentRef = useRef<string | undefined>(undefined);


    useEffect(() => {
        userNameRef.current = auth.username;
    }, [auth.username]);


    useEffect(() => {
        hasOpponentRef.current = hasOpponent;
    }, [hasOpponent]);

    useEffect(() => {
        winnerRef.current = winner;
    }, [winner]);

    useEffect(() => {
        opponentRef.current = opponent;
    }, [opponent]);
    //end of refs
    //------------

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
    }, [board]);

    useEffect(() => {
        oponentBoard.updateBoard();
    }, [oponentBoard]);

    useEffect(() => {
        if (hasOpponent) {
            setBoard(initBoard(false, true));
            setOponentBoard(initBoard(true, false));
        }
    }, [hasOpponent]);

    useEffect(() => {
        if (lightPlayer.breakthrough === 15) {
            if (playerSide === Labels.Light) setWinner(auth.username);
            else setWinner(opponentRef.current);

            if (playerSide === Labels.Light && isRanked) {
                socket?.emit("winner", room, auth.username, "battleships");
            }
        }
        if (darkPlayer.breakthrough === 15) {
            if (playerSide === Labels.Dark) setWinner(auth.username);
            else setWinner(opponentRef.current);

            if (playerSide === Labels.Dark && isRanked) {
                socket?.emit("winner", room, auth.username, "battleships");
            }
        }
    }, [lightPlayer, darkPlayer, socket]);

    useEffect(() => {
        if (isRanked) {
            socket?.emit("matchmaking", {
                playerName: auth.username,
                game: "battleships",
            });
        } else {
            if (paramsRoom) {
                setPlayerSide(Labels.Dark);
                setCurrentPlayer(lightPlayer);
                socket?.emit("join", JSON.stringify({ room: paramsRoom, playerName: auth.username }));
                setRoom(paramsRoom);
            } else {
                setPlayerSide(Labels.Light);
                setCurrentPlayer(darkPlayer);
                const newRoomName = uid.rnd();
                socket?.emit(
                    "create",
                    JSON.stringify({ room: newRoomName, playerName: auth.username, game: "battleships" })
                );
                setRoom(newRoomName);
            }
        }
    }, [paramsRoom, socket]);

    useEffect(() => {
        const onObserverJoined = () => {
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
            if (lostPlayerSide === userNameRef.current) setWinner(opponentRef.current);
            else setWinner(userNameRef.current);
        };

        socket?.on("observerJoined", onObserverJoined);

        socket?.on("wrongRoom", onWrongRoom);

        socket?.on("oponentLost", onOponentLost);

        socket?.on("matchFound", (data: any) => {
            const { room, firstPlayer } = data;
            setRoom(room);

            if (firstPlayer === socket?.id) {
                setPlayerSide(Labels.Light);
                socket?.emit("startTimer", JSON.stringify({ room, playerName: auth.username, step }));
            } else {
                setPlayerSide(Labels.Dark);
            }
            socket?.emit("getOponentUserName", JSON.stringify({ room, playerName: auth.username }));
            setCurrentPlayer(lightPlayer);
            setHasOpponent(true);
        });

        socket?.on("queueStart", (data: any) => {
            setRoom(data.room);
        });

        setCurrentPlayer(lightPlayer);

        return () => {

            socket?.off("observerJoined", onObserverJoined);
            socket?.off("wrongRoom", onWrongRoom);
            socket?.off("oponentLost", onOponentLost);
        };
    }, [socket]);

    useEffect(() => {
        return () => {
            if (
                room !== undefined &&
                hasOpponentRef.current &&
                winnerRef.current === undefined &&
                userNameRef.current !== undefined
            ) {
                socket?.emit("playerLost", JSON.stringify({ room, lostPlayerSide: userNameRef.current, isRanked }));
            } else {
                socket?.emit("leave", { room: room  });
            }
        };
    }, [socket, room]);

    useEffect(() => {
        const OnTimerOut = () => {
            socket?.emit("playerLost", JSON.stringify({ room, lostPlayerSide: auth.username, isRanked }));
        };
        if (room !== null && playerSide !== undefined && !winner) {
            socket?.on("timerOut", OnTimerOut);

            return () => {
                socket?.off("timerOut", OnTimerOut);
            };
        }
    }, [room, playerSide, winner, socket]);

    useEffect(() => {
        const onOponentJoined = () => {
            setHasOpponent(true);
            setShare(false);
            socket?.emit("getOponentUserName", JSON.stringify({ room, playerName: auth.username }));
            if (playerSide === Labels.Light)
                socket?.emit("startTimer", JSON.stringify({ room, playerName: auth.username, step }));
        };

        const onOpponentUserName = (data: string) => {
            const { opponent } = JSON.parse(data);
            setOpponent(opponent);
        };

        socket?.on("opponentJoined", onOponentJoined);
        socket?.on("opponentUserName", onOpponentUserName);

        return () => {
            socket?.off("opponentJoined", onOponentJoined);
            socket?.off("opponentUserName", onOpponentUserName);
        };
    }, [room, socket]);

    useEffect(() => {
        if (hasOpponent) {
            const timeout = setTimeout(() => {
                setTimer(timer - 1);
            }, 1000);

            return () => {
                clearTimeout(timeout);
            };
        }
    }, [timer, hasOpponent]);

    const giveUp = () => {
        socket?.emit("playerLost", JSON.stringify({ room, lostPlayerSide: userNameRef.current, isRanked }));
    };

    return (
        <div className="statki">
            <div>Room: {room}</div>
            <div>Side: {playerSide}</div>
            <div>
                User: {userNameRef.current}
            </div>
            <div>
                Opponent: {opponentRef.current}
            </div>
            <div>
                Winner: {winnerRef.current}
            </div>
            {status === Status.WrongRoom ? (
                <h1>This room does not exist</h1>
            ) : playerSide === Labels.Neutral ? (
                <h1>This game does not provide viewer mod.</h1>
            ) : winnerRef.current !== undefined ? (
                <h1>{winnerRef.current} wins!</h1>
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
                            {!isRanked ? 
                                <div>
                                    <button className="btn" onClick={() => setShare(!share)}>
                                        Share
                                    </button>
                                </div> : ''
                            }
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
                        <Chat room={room} socket={socket}></Chat>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Statki;
