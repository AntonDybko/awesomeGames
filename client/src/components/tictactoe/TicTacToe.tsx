import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";
import useAuth from "hooks/useAuth";
import Chat from "components/chat/Chat";
import ShortUniqueId from "short-unique-id";
import "./TicTacToe.scss";

interface LocationState {
    isRanked?: boolean;
}

type SocketProps = {
    socket: Socket | null;
};

const TicTacToe: React.FC<SocketProps> = ({ socket }) => {
    const { auth } = useAuth();
    const gamename = "tictactoe";
    const [game, setGame] = useState<string[]>(Array(9).fill(""));
    const [turnNumber, setTurnNumber] = useState<number>(0);
    const [myTurn, setMyTurn] = useState<boolean>(true);
    const [winner, setWinner] = useState<boolean>(false);
    const [xo, setXO] = useState<"X" | "O" | undefined>(undefined);
    const [player, setPlayer] = useState<string | undefined>("");
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

    //refs
    const hasOpponentRef = useRef<boolean>(false);
    const userNameRef = useRef<string | undefined>(undefined);
    const winnerRef = useRef<boolean>(false);
    const xoRef = useRef<"X" | "O" | undefined>(undefined)

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
        xoRef.current = xo;
    }, [xo]);

    //end of refs

    const turn = (index: number) => {
        if (!game[index] && !winner && myTurn && hasOpponent) {
            socket?.emit("reqTurn", JSON.stringify({ index, value: xoRef.current, room }));
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
                if (player === xoRef.current && isRanked) {
                    socket?.emit("winner", room, auth.username, gamename);
                }
            }
        });

        if (turnNumber === 0) {
            setMyTurn(xoRef.current === "X" ? true : false);
        }
    }, [game, turnNumber, socket]);

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
                setXO("X");
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
                setXO("X");
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
            socket?.emit("matchmaking", {
                playerName: auth.username,
                game: gamename,
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
                        game: gamename,
                    })
                );
                setRoom(newRoomName);
            }
        }

        socket?.on("oponentLost", (data: string) => {
            const { lostPlayerSide } = JSON.parse(data);
            setWinner(true);
            if (lostPlayerSide === userNameRef.current) {
                if(xoRef.current === "X") setPlayer("O");
                else setPlayer("X")
            }else {
                setPlayer(xoRef.current);
            }
        });
    }, [socket]);

    useEffect(() => {
        // socket?.on("opponentUserName", (data: string) => {
        //     const { opponent } = JSON.parse(data);
        //     setOpponent(opponent);
        // });

        return () => {
            if (
                room !== undefined &&
                hasOpponentRef.current &&
                winnerRef.current === false &&
                userNameRef.current !== undefined
            ) {
                socket?.emit('chatMessage', { room, username: auth.username, content: 'has left the room' });
                socket?.emit("playerLost", JSON.stringify({ room, lostPlayerSide: userNameRef.current, isRanked, gamename }));
            } else {
                socket?.emit('chatMessage', { room, username: auth.username, content: 'has left the room' });
                socket?.emit("leave", { room: room });
            }
        };
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
