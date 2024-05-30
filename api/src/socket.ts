import { Server, Socket } from "socket.io";
import createRatingSystem from "./ratingSystem";
import updateFirstScore from "./helpers/dbHelp/updateFirstScore";
import getFirstScore from "./helpers/dbHelp/getFirstScore";
import { Status } from "./models/Status";
import { Room } from "./models/Room";
import { Player } from "./models/Player";
import { randomInt } from "crypto";
import ShortUniqueId from "short-unique-id";

const rating = createRatingSystem();
const uid = new ShortUniqueId({ length: 10 });

const socketManager = (io: Server) => {
    const rooms: { [name: string]: Room } = {};
    //const rooms: { [name: string]: { players: string[] } } = {} // tutaj będzie jeszcze trzeba przechowywać aktualny rating graczy
    //const rooms: { [name: string]: { [playerName: string]: {playerId: string, status: Status}}} = {};
    io.on("connection", (socket) => {
        console.log("User connected", socket.id);
        socket.on("reqTurn", (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit("playerTurn", data);
        });

        socket.on("create", (data) => {
            const { room, playerName, game } = JSON.parse(data);
            // console.log(socket.id, ":", playerName, ":", room);
            rooms[room] = new Room(game);
            rooms[room].players[playerName] = new Player(socket.id);
            //rooms[room][playerName] = {playerId: socket.id, status: Status.WaitingForMove}; // tutaj potem sprobowac po prostu socket.id, musi dzialac?
            console.log(socket.id, "created room:", room);
            socket.join(room);
        });

        socket.on("matchmaking", async (data) => {
            const { playerName, game } = data;
            const playerRating = await getFirstScore(playerName, game);
            console.log("mm start: ", playerName, playerRating, game);

            // szukanie pokoju o odpowiednim ratingu
            for (const name in rooms) {
                const room = rooms[name];
                console.log("Checking room:", name);
                if (
                    room.game === game &&
                    Math.abs(room.rating - playerRating) <= 50 &&
                    Object.keys(room.players).length < 2
                ) {
                    // dodanie usera do pokoju
                    console.log("Room found: ", name);
                    socket.join(name);
                    room.players[playerName] = new Player(socket.id);

                    // losowanie który z graczy ma pierwszy ruch
                    const players = Object.keys(room.players);
                    const randomIndex = Math.round(Math.random()); // 0 lub 1
                    const randomPlayer = room.players[players[randomIndex]].playerId;

                    // wysłanie komunikatu o rozpoczęciu meczu wraz z potrzebnymi danymi
                    io.to(name).emit("matchFound", {
                        room: name,
                        firstPlayer: randomPlayer,
                    });

                    return;
                }
            }

            // nie znaleziono odpowiedniego pokoju. tworzenie nowego
            const newRoomName = uid.rnd();
            rooms[newRoomName] = new Room(game, playerRating);
            rooms[newRoomName].players[playerName] = new Player(socket.id);
            console.log("Created new ranked room", newRoomName);
            socket.join(newRoomName);
            io.to(newRoomName).emit("queueStart", { room: newRoomName });
        });

        socket.on("leave", (data) => {
            const { room } = data;
            console.log(socket.id, "left room", room);
            if (rooms[room]) {
                delete rooms[room];
                console.log("Deleting room:", room);
            }
            socket.leave(room);
        });

        socket.on("attackLight", (data) => {
            const { attackedCellKey, room, playerName } = JSON.parse(data); //playerName
            rooms[room].players[playerName].status = Status.WaitingForOponentMove;
            console.log(rooms[room].players[playerName].status);

            rooms[room].step += 1;
            //const modifiedData = JSON.stringify({ attackedCellKey, room, playerName, step: rooms[room].step })

            io.to(room).emit("receiveAttackLight", data);
        });
        socket.on("responseToAttackLight", (data) => {
            const { ship, attackedCellKey, room } = JSON.parse(data);

            //const modifiedData = JSON.stringify({ ship, attackedCellKey, room, step: rooms[room].step })

            io.to(room).emit("receiveResponseToAttackLight", data);
        });
        socket.on("attackDark", (data) => {
            const { attackedCellKey, room, playerName } = JSON.parse(data); //playerName
            rooms[room].players[playerName].status = Status.WaitingForOponentMove;
            console.log(rooms[room].players[playerName].status);

            rooms[room].step += 1;
            //const modifiedData = JSON.stringify({ attackedCellKey, room, playerName, step: rooms[room].step })

            io.to(room).emit("receiveAttackDark", data);
        });
        socket.on("responseToAttackDark", (data) => {
            const { ship, attackedCellKey, room } = JSON.parse(data);

            //const modifiedData = JSON.stringify({ ship, attackedCellKey, room, step: rooms[room].step })

            io.to(room).emit("receiveResponseToAttackDark", data);
        });
        socket.on("startTimer", (data) => {
            console.log("startTimer");

            const { room, playerName, step } = JSON.parse(data);
            rooms[room].players[playerName].status = Status.WaitingForMove;

            setTimeout(() => {
                if (rooms[room] !== undefined) console.log("step: ", rooms[room].step, " : ", step);
                if (
                    rooms[room] !== undefined &&
                    rooms[room].players[playerName].status === Status.WaitingForMove &&
                    rooms[room].step === step
                ) {
                    console.log("timer out");
                    socket.emit("timerOut");
                }
            }, 60000); //10000 for testing
        });

        socket.on("join", (data) => {
            const { room, playerName } = JSON.parse(data);
            if (rooms[room] && playerName !== undefined) {
                //
                console.log("-----------");
                console.log(Object.keys(rooms[room].players).length);
                console.log(rooms[room].players[playerName] === undefined);
                console.log("-----------");
                //

                if (Object.keys(rooms[room].players).length < 2 && rooms[room].players[playerName] == undefined) {
                    console.log(socket.id, "dołączył do pokoju:", room);
                    socket.join(room);
                    console.log("opponentJoined");

                    console.log(socket.id, ":", playerName);
                    rooms[room].players[playerName] = {
                        playerId: socket.id,
                        status: Status.WaitingForOponentMove,
                    };

                    const players = Object.keys(rooms[room].players);
                    const randomIndex = Math.round(Math.random()); // 0 lub 1
                    const randomPlayer = rooms[room].players[players[randomIndex]].playerId;

                    io.to(room).emit("opponentJoined", { firstPlayer: randomPlayer });
                    // io.to(room).emit("opponentJoined");
                } else {
                    console.log(socket.id, ":", playerName);
                    rooms[room].players[playerName] = {
                        playerId: socket.id,
                        status: Status.WaitingForOponentMove,
                    };
                    console.log("observer joined");
                    io.to(socket.id).emit("observerJoined");
                }
                // rooms[room].players.push(username);

                // przeniosłem to wyżej do if-a.
                // console.log(socket.id, ":", playerName);
                // rooms[room].players[playerName] = {
                //     playerId: socket.id,
                //     status: Status.WaitingForOponentMove,
                // };
            } else {
                //emit proper event
                io.to(socket.id).emit("wrongRoom"); // handle vent
            }
        });

        // 1) pod koniec gry usery osobno wysylaja zapytanie o update rankingu
        /*socket.on('winner', (room: string, username: string, gamename: string) => {
            const loser = rooms[room].players.filter(player => player !== username)[0];

            const toDo = async () => {
                const loserRanking = await getFirstScore(loser, gamename);
                const winnerRanking = await getFirstScore(username, gamename);
                const newRating = rating.getNextRatings(winnerRanking, loserRanking, 1);
                
                updateFirstScore(username, gamename, newRating.nextPlayerARating);
                updateFirstScore(loser, gamename, newRating.nextPlayerBRating);
            };
            toDo();
        });*/ //to chyba nie dla statkow, wiec zakomentowalem, zeby dzialali statki
        socket.on("winner", (room: string, username: string, gamename: string) => {
            //console.log(Object.keys(rooms[room]))
            const loserName = Object.keys(rooms[room].players).filter((player) => player !== username)[0];
            //const loser = rooms[room][loserName];
            console.log(loserName);
            //console.log(loser)

            const toDo = async () => {
                const loserRanking = await getFirstScore(loserName, gamename);
                const winnerRanking = await getFirstScore(username, gamename);
                const newRating = rating.getNextRatings(winnerRanking, loserRanking, 1);

                updateFirstScore(username, gamename, newRating.nextPlayerARating);
                updateFirstScore(loserName, gamename, newRating.nextPlayerBRating);
            };
            toDo();
        }); //const rooms: { [name: string]: { [playerName: string]: {playerId: string}}} = {};

        socket.on("reqRestart", (data) => {
            const room = JSON.parse(data).room;

            const players = Object.keys(rooms[room].players);
            const randomIndex = Math.round(Math.random()); // 0 lub 1
            const randomPlayer = rooms[room].players[players[randomIndex]].playerId;

            io.to(room).emit("restart", { firstPlayer: randomPlayer });
        });

        socket.on("playerLost", (data) => {
            const { room, lostPlayerSide } = JSON.parse(data);
            console.log(room, ":", lostPlayerSide);
            if (rooms[room] !== undefined) {
                delete rooms[room];
                console.log("someone lost in room ", room);
                io.to(room).emit("oponentLost", data);
            }
        });

        socket.on("chatMessage", (data) => {
            const { room, username, content } = data;
            // console.log(room, "chatMessage", username + ": " + content)
            console.log(socket.id, "sent chat message in room:", room);
            io.to(room).emit("chatMessage", { username, content });
        });

        socket.on("disconnect", () => {
            console.log("User disconnected", socket.id);
        });
    });
};

export default socketManager;
