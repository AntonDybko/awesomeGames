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
            // console.log("room:", room)
            // console.log("username:", username)
            socket.join(room);
            io.to(room).emit('opponentJoined');
            rooms[room].players.push(username)
        })

        // 1) pod koniec gry usery osobno wysylaja zapytanie o update rankingu
        socket.on('winner', (room: string, username: string, gamename: string) => {
            const loser = rooms[room].players.filter(player => player !== username)[0];
            
            console.log('|Event winner>params>', room, username, gamename);
            console.log('|Event winner>loser>', loser);
            console.log('|Event winner>players>', rooms[room].players);

            const toDo = async () => {
                console.log('Async function here');
                

                const loserRanking = await getFirstScore(loser, gamename);
                const winnerRanking = await getFirstScore(username, gamename);
                const newRating = rating.getNextRatings(winnerRanking, loserRanking, 1);
                
                updateFirstScore(username, gamename, newRating.nextPlayerARating);
                updateFirstScore(loser, gamename, newRating.nextPlayerBRating);
            };
            toDo();
        });

        // socket.on('loser', (room: string, username: string) => {
        //     console.log("room:", room)
        //     console.log("username:", username)
        //     // wyslac zapytanie o update ratingu
        // })

        // 2) pod koniec gry wysylane jest zapytanie o update rankingu obu graczy
        // socket.on('gameover', (room: string) => {
        //     console.log("room:", room)

            // const {
            //     playerAProbability,
            //     playerBProbability,
            //     nextPlayerARating,
            //     playerARatingDiff,
            //     nextPlayerBRating,
            //     playerBRatingDiff
            // } = rating.getNextRatings(playerARating, playerBRating, actualScore) // pozmieniac argumenty na poprawne ()
            // wyslac zapytanie o update ratingu
        // })

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