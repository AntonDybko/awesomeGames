import { Server, Socket } from "socket.io";
import createRatingSystem from './ratingSystem'

const rating = createRatingSystem()


const socketManager = (io: Server) => {
    const rooms: {[name: string]: {players: string[]}} = {} // tutaj będzie jeszcze trzeba przechowywać aktualny rating graczy

    io.on('connection', (socket) => {
        console.log("User connected", socket.id);
        socket.on('reqTurn', (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit('playerTurn', data);
        })

        socket.on('reqWarcabyTurn', (data) => {
            //(json.key, json.label, json.isDame)
            const room = JSON.parse(data).room;
            console.log(JSON.parse(data));
            io.to(room).emit('playerTurn', data);
        })

        socket.on('create', (room: string, username: string) => {
            console.log("room:", room)
            console.log("username:", username)
            rooms[room] = { players: [] };
            rooms[room].players.push(username)
            socket.join(room);
        })

        socket.on('join', (room: string, username: string) => {
            console.log("room:", room)
            console.log("username:", username)
            socket.join(room);
            io.to(room).emit('opponentJoined');
            rooms[room].players.push(socket.id)
        })

        // 1) pod koniec gry usery osobno wysylaja zapytanie o update rankingu
        socket.on('winner', (room: string, username: string) => {
            console.log("room:", room)
            console.log("username:", username)
            // wyslac zapytanie o update ratingu
        })

        socket.on('loser', (room: string, username: string) => {
            console.log("room:", room)
            console.log("username:", username)
            // wyslac zapytanie o update ratingu
        })

        // 2) pod koniec gry wysylane jest zapytanie o update rankingu obu graczy
        socket.on('gameover', (room: string) => {
            console.log("room:", room)

            // const {
            //     playerAProbability,
            //     playerBProbability,
            //     nextPlayerARating,
            //     playerARatingDiff,
            //     nextPlayerBRating,
            //     playerBRatingDiff
            // } = rating.getNextRatings(playerARating, playerBRating, actualScore) // pozmieniac argumenty na poprawne ()
            // wyslac zapytanie o update ratingu
        })

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