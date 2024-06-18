import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useAuth from "hooks/useAuth";
import Chat from "components/chat/Chat";
import ShortUniqueId from "short-unique-id";
import './TicTacToe.scss';

interface LocationState {
    isRanked?: boolean;
}

type SocketProps =  {
    socket: Socket | null
}

const TicTacToe: React.FC<SocketProps> = ({socket}) => {
    const { auth } = useAuth();
    const [game, setGame] = useState<string[]>(Array(9).fill(""));
    const [turnNumber, setTurnNumber] = useState<number>(0);
    const [myTurn, setMyTurn] = useState<boolean>(true);
    const [winner, setWinner] = useState<boolean>(false);
    const [xo, setXO] = useState<"X" | "O">("X");
    const [player, setPlayer] = useState<string>("");
    const [hasOpponent, setHasOpponent] = useState<boolean>(false);
    const [share, setShare] = useState<boolean>(false);
    const [turnData, setTurnData] = useState<boolean>(false);

    const location = useLocation();
    const state = location.state as LocationState;
    const isRanked = state?.isRanked || false;
    const params = new URLSearchParams(location.search);
    const paramsRoom = params.get("room") || "";
    const [room, setRoom] = useState(paramsRoom);

    const uid = new ShortUniqueId({ length: 10 });
    const navigate = useNavigate();

    const turn = (index: number) => {
        if (!game[index] && !winner && myTurn && hasOpponent) {
            socket?.emit("reqTurn", JSON.stringify({ index, value: xo, room }));
        }
    };

    const sendRestart = () => {
        socket?.emit("reqRestart", JSON.stringify({ room }));
    };

    const cancelMatchmaking = () => {
        navigate("/games");
    };

    const restart = (firstPlayer: string) => {
        setGame(Array(9).fill(""));
        setWinner(false);
        setTurnNumber(0);
        setMyTurn(false);

        if (firstPlayer === socket?.id) {
            setMyTurn(true);
            setXO("X");
        } else {
            setMyTurn(false);
            setXO("O");
        }
    };

    useEffect(() => {

        combinations.forEach((c) => {
            if (game[c[0]] === game[c[1]] && game[c[0]] === game[c[2]] && game[c[0]] !== "") {
                setWinner(true);
                if (player === xo && isRanked) {
                    console.log("Win - emitting event!");
                    socket?.emit("winner", room, auth.username, "tictactoe");
                }
            }
        });

        if (turnNumber === 0) {
            setMyTurn(xo === "X" ? true : false);
        }
    }, [game, turnNumber, xo, socket]);

    useEffect(() => {
        socket?.on("playerTurn", (json: any) => {
            setTurnData(json);
        });

        socket?.on("restart", (data: any) => {
            restart(data.firstPlayer);
        });

        socket?.on("opponentJoined", (data: any) => {
            setHasOpponent(true);
            setShare(false);

            if (data.firstPlayer === socket?.id) {
                setMyTurn(true);
            } else {
                setMyTurn(false);
                setXO("O");
            }
        });

        socket?.on("matchFound", (data: any) => {
            setRoom(data.room);

            if (data.firstPlayer === socket?.id) {
                setMyTurn(true);
            } else {
                setMyTurn(false);
                setXO("O");
            }
            setHasOpponent(true);
        });

        socket?.on("queueStart", (data: any) => {
            setRoom(data.room);
        });

        if (isRanked) {
            console.log("ranked");
            socket?.emit("matchmaking", {
                playerName: auth.username,
                game: "tictactoe",
            });
        } else {
            if (paramsRoom) {
                socket?.emit(
                    "join",
                    JSON.stringify({
                        room: paramsRoom,
                        playerName: auth.username,
                    })
                );
                setRoom(paramsRoom);
            } else {
                const newRoomName = uid.rnd();
                socket?.emit(
                    "create",
                    JSON.stringify({
                        room: newRoomName,
                        playerName: auth.username,
                        game: "tictactoe",
                    })
                );
                setRoom(newRoomName);
            }
        }
    }, [socket]);

    useEffect(() => {
        if (room) {
            return () => {
                socket?.emit("leave", { room: room });
            };
        }
    }, [room, socket]);

    useEffect(() => {
        if (turnData) {
            const data = JSON.parse(turnData.toString());
            let g = [...game];
            if (!g[data.index] && !winner) {
                g[data.index] = data.value;
                setGame(g);
                setTurnNumber(turnNumber + 1);
                setTurnData(false);
                setMyTurn(!myTurn);
                setPlayer(data.value);
            }
        }
    }, [turnData, game, turnNumber, winner, myTurn]);

    const Box = ({ index, turn, value }: { index: number; turn: any; value: string }) => {
        return (
            <div className="box" onClick={() => turn(index)}>
                {value}
            </div>
        );
    };

    const combinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    return (
        <div>
            {isRanked && !hasOpponent ? (
                <div>
                    <div>Searching for worthy opponent...</div>
                    <button onClick={cancelMatchmaking}>Cancel</button>
                </div>
            ) : (
                <div className="container">
                    <div className="game">
                        {isRanked ? <p>This is ranked game</p> : <p>This is normal game</p>}
                        <div>Room: {room}</div>

                        {!isRanked ? (
                            <button className="btn" onClick={() => setShare(!share)}>
                                Share
                            </button>
                        ) : null}

                        {share ? (
                            <div>
                                Share link:{" "}
                                <input type="text" value={`${window.location.href}?room=${room}`} readOnly />
                            </div>
                        ) : null}

                        <br />
                        <br />
                        {hasOpponent ? (
                            <div>
                                {(winner || turnNumber === 9) && !isRanked ? (
                                    <button className="btn" onClick={sendRestart}>
                                        Restart
                                    </button>
                                ) : null}
                                {winner ? (
                                    <span>We have a winner: {player}</span>
                                ) : turnNumber === 9 ? (
                                    <span>It's a tie!</span>
                                ) : (
                                    <div>Turn: {myTurn ? "You" : "Opponent"}</div>
                                )}
                            </div>
                        ) : (
                            <div>Waiting for opponent...</div>
                        )}
                        <br />
                        <div className="row">
                            <Box index={0} turn={turn} value={game[0]} />
                            <Box index={1} turn={turn} value={game[1]} />
                            <Box index={2} turn={turn} value={game[2]} />
                        </div>
                        <div className="row">
                            <Box index={3} turn={turn} value={game[3]} />
                            <Box index={4} turn={turn} value={game[4]} />
                            <Box index={5} turn={turn} value={game[5]} />
                        </div>
                        <div className="row">
                            <Box index={6} turn={turn} value={game[6]} />
                            <Box index={7} turn={turn} value={game[7]} />
                            <Box index={8} turn={turn} value={game[8]} />
                        </div>
                    </div>
                    <Chat room={room} socket={socket}></Chat>
                </div>
            )}
        </div>
    );
};

export default TicTacToe;
