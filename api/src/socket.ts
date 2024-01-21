import { Server, Socket } from "socket.io";
import createRatingSystem from './ratingSystem'
import updateFirstScore from "./helpers/dbHelp/updateFirstScore";
import getFirstScore from "./helpers/dbHelp/getFirstScore";

const rating = createRatingSystem()


const socketManager = (io: Server) => {
    const rooms: { [name: string]: { players: string[] } } = {} // tutaj będzie jeszcze trzeba przechowywać aktualny rating graczy

    io.on('connection', (socket) => {
        console.log("User connected", socket.id);
        socket.on('reqTurn', (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit('playerTurn', data);
        })

        socket.on('reqStatkiTurn', (data) => {
            //(json.key, json.label, json.isDame)
            const room = JSON.parse(data).room;
            io.to(room).emit('playerTurn', data);
        })

        socket.on('create', (room: string, username: string) => {
            rooms[room] = { players: [] };
            rooms[room].players.push(username)
            socket.join(room);
        })

        socket.on('sendDarkBoard', data => {
            const room = JSON.parse(data).room;
            io.to(room).emit('lightPlayerTurn', data);
        })

        /*socket.on('initOponentBoard', data => {
            const room = JSON.parse(data).room;
            //io.to(room).emit('lightPlayerTurn', data);
            console.log(JSON.parse(data).label)
            io.to(room).emit('getOponentBoard', data);
            //io.to(room).emit('playerTurn', data);
        })*/
        socket.on('initDarkBoard', data => {
            const room = JSON.parse(data).room;
            console.log('init dark board')
            console.log(JSON.parse(data))
            io.to(room).emit('getDarkBoard', data);
        })
        socket.on('initLightBoard', data => {
            const room = JSON.parse(data).room;
            console.log('init light board')
            console.log(JSON.parse(data))
            io.to(room).emit('getLightBoard', data);
        })

        socket.on('sendLightBoard', data => {
            const room = JSON.parse(data).room;
            io.to(room).emit('darkPlayerTurn', data);
        })

        socket.on('join', (room: string, username: string) => {

            socket.join(room);
            io.to(room).emit('opponentJoined');
            rooms[room].players.push(username)
        })

        // 1) pod koniec gry usery osobno wysylaja zapytanie o update rankingu
        socket.on('winner', (room: string, username: string, gamename: string) => {
            const loser = rooms[room].players.filter(player => player !== username)[0];

            const toDo = async () => {
                const loserRanking = await getFirstScore(loser, gamename);
                const winnerRanking = await getFirstScore(username, gamename);
                const newRating = rating.getNextRatings(winnerRanking, loserRanking, 1);
                
                updateFirstScore(username, gamename, newRating.nextPlayerARating);
                updateFirstScore(loser, gamename, newRating.nextPlayerBRating);
            };
            toDo();
        });

        socket.on('reqRestart', (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit('restart');
        })

        socket.on('disconnect', () => {
            console.log("User disconnected", socket.id);
        })
    });
}

export default socketManager;