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

    io.on("connection", (socket) => {
        console.log(socket.id, " connected")
        socket.on("reqTurn", (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit("playerTurn", data);
        });

        socket.on("create", (data) => {
            const { room, playerName, game } = JSON.parse(data);
            rooms[room] = new Room(game);
            rooms[room].players[playerName] = new Player(socket.id);
            socket.join(room);
        });

        socket.on("matchmaking", async (data) => {
            const { playerName, game } = data;
            const playerRating = await getFirstScore(playerName, game);

            // szukanie pokoju o odpowiednim ratingu
            for (const name in rooms) {
                const room = rooms[name];
                if (
                    room.game === game &&
                    Math.abs(room.rating - playerRating) <= 50 &&
                    Object.keys(room.players).length < 2
                ) {
                    // dodanie usera do pokoju
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
            socket.join(newRoomName);
            io.to(newRoomName).emit("queueStart", { room: newRoomName });
        });

        socket.on("leave", (data) => {
            const { room } = data;
            if (rooms[room]) {
                delete rooms[room];
            }
            socket.leave(room);
        });

        socket.on("unlock-room", (room) => {
            console.log(room, " unlocked")
            rooms[room].lock = false;
        })

        socket.on("attackLight", (data) => {
            const { attackedCellKey, room, playerName } = JSON.parse(data); 

            //console.log(rooms[room].lock )
            if(rooms[room].lock === false){ //here
                rooms[room].lock = true;
                rooms[room].players[playerName].status = Status.WaitingForOponentMove;

                rooms[room].step += 1;

                console.log("sendReceiveAttackLightEvent")
                io.to(room).emit("receiveAttackLight", data);
            }else{
                socket.emit("timeout")
            }
        });
        socket.on("responseToAttackLight", (data) => {
            const { ship, attackedCellKey, room } = JSON.parse(data);
            io.to(room).emit("receiveResponseToAttackLight", data);
        });
        socket.on("attackDark", (data) => {
            const { attackedCellKey, room, playerName } = JSON.parse(data); //playerName

            //console.log(rooms[room].lock )
            if(rooms[room].lock === false){ //here
                rooms[room].players[playerName].status = Status.WaitingForOponentMove;

                rooms[room].step += 1;

                console.log("sendReceiveAttackDarkEvent")
                io.to(room).emit("receiveAttackDark", data);
            }else{
                socket.emit("timeout")
            }
        });
        socket.on("responseToAttackDark", (data) => {
            const { ship, attackedCellKey, room } = JSON.parse(data);

            io.to(room).emit("receiveResponseToAttackDark", data);
        });
        socket.on("startTimer", (data) => {

            const { room, playerName, step } = JSON.parse(data);
            if (rooms[room]) {
                rooms[room].players[playerName].status = Status.WaitingForMove;

                setTimeout(() => {
                    console.log(rooms[room]?.step, step)
                    if (
                        rooms[room] !== undefined &&
                        rooms[room].players[playerName].status === Status.WaitingForMove &&
                        rooms[room].step === step
                    ) {
                        socket.emit("timerOut");
                    }
                }, 60000);
            }
        });

        socket.on("join", (data) => {
            const { room, playerName } = JSON.parse(data);
            if (rooms[room] && playerName !== undefined) {

                if (Object.keys(rooms[room].players).length < 2 && rooms[room].players[playerName] == undefined) {
                    socket.join(room);
                    rooms[room].players[playerName] = {
                        playerId: socket.id,
                        status: Status.WaitingForOponentMove,
                    };

                    const players = Object.keys(rooms[room].players);
                    const randomIndex = Math.round(Math.random()); 
                    const randomPlayer = rooms[room].players[players[randomIndex]].playerId;

                    io.to(room).emit("opponentJoined", { firstPlayer: randomPlayer });
                } else {
                    rooms[room].players[playerName] = {
                        playerId: socket.id,
                        status: Status.WaitingForOponentMove,
                    };
                    io.to(socket.id).emit("observerJoined");
                }
            } else {
                io.to(socket.id).emit("wrongRoom"); 
            }
        });

        socket.on("winner", (room: string, username: string, gamename: string) => {
            const loserName = Object.keys(rooms[room].players).filter((player) => player !== username)[0];

            const toDo = async () => {
                const loserRanking = await getFirstScore(loserName, gamename);
                const winnerRanking = await getFirstScore(username, gamename);
                const newRating = rating.getNextRatings(winnerRanking, loserRanking, 1);

                updateFirstScore(username, gamename, newRating.nextPlayerARating);
                updateFirstScore(loserName, gamename, newRating.nextPlayerBRating);
            };
            toDo();
        }); 

        socket.on("reqRestart", (data) => {
            const room = JSON.parse(data).room;

            if(room !== undefined && rooms[room] !== undefined){
                const players = Object.keys(rooms[room].players);
                const randomIndex = Math.round(Math.random()); // 0 lub 1
                const randomPlayer = rooms[room].players[players[randomIndex]].playerId;

                io.to(room).emit("restart", { firstPlayer: randomPlayer });
            }
        });

        socket.on("playerLost", (data) => {
            const { room, lostPlayerSide, isRanked, gamename } = JSON.parse(data);

            if (isRanked) {
                const winnerName = Object.keys(rooms[room].players).filter((player) => player !== lostPlayerSide)[0];

                const toDo = async () => {
                    const loserRanking = await getFirstScore(lostPlayerSide, gamename);
                    const winnerRanking = await getFirstScore(winnerName, gamename);
                    const newRating = rating.getNextRatings(winnerRanking, loserRanking, 1);

                    updateFirstScore(winnerName, gamename, newRating.nextPlayerARating);
                    updateFirstScore(lostPlayerSide, gamename, newRating.nextPlayerBRating);
                };
                toDo();
            }

            if (rooms[room] !== undefined) {
                delete rooms[room];
                io.to(room).emit("oponentLost", data);
            }
        });

        socket.on("getOponentUserName", (data) => {
            const { room, playerName } = JSON.parse(data);
            const opponent = Object.keys(rooms[room].players).filter((player) => player !== playerName)[0];
            socket.emit("opponentUserName", JSON.stringify({ opponent }));
        });

        socket.on("chatMessage", (data) => {
            const { room, username, content } = data;
            io.to(room).emit("chatMessage", { username, content });
        });

        socket.on("disconnect", () => {
            console.log(socket.id, " disconnected")
            socket.disconnect();
        });
    });
};

export default socketManager;
