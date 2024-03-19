import { Server, Socket } from "socket.io";
import createRatingSystem from './ratingSystem'
import updateFirstScore from "./helpers/dbHelp/updateFirstScore";
import getFirstScore from "./helpers/dbHelp/getFirstScore";

const rating = createRatingSystem()


const socketManager = (io: Server) => {
    //const rooms: { [name: string]: { players: string[] } } = {} // tutaj będzie jeszcze trzeba przechowywać aktualny rating graczy
    const rooms: { [name: string]: { [playerName: string]: {playerId: string}}} = {};
    io.on('connection', (socket) => {
        console.log("User connected", socket.id);
        socket.on('reqTurn', (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit('playerTurn', data);
        })

        /*socket.on('reqStatkiTurn', (data) => {
            //(json.key, json.label, json.isDame)
            const room = JSON.parse(data).room;
            io.to(room).emit('playerTurn', data);
        })*/

        /*socket.on('create', (room: string, username: string) => {
            rooms[room] = { players: [] };
            //rooms[room].players.push(username)
            socket.join(room);
        })*///maybe needed in others?
        socket.on('create', (data) => {
            const {room, playerName} = JSON.parse(data);
            console.log(socket.id, ":", playerName, ":", room)
            rooms[room] = {}
            rooms[room][playerName] = {playerId : socket.id}; // tutaj potem sprobowac po prostu socket.id, musi dzialac?
            socket.join(room);
        })

        socket.on('attackLight', data => {
            const { attackedCellKey, room } = JSON.parse(data);
            io.to(room).emit('receiveAttackLight', data);
        })
        socket.on('responseToAttackLight', data => {
            const { ship, attackedCellKey, room } = JSON.parse(data);
            io.to(room).emit('receiveResponseToAttackLight', data);
        })
        socket.on('attackDark', data => {
            const { attackedCellKey, room } = JSON.parse(data);
            console.log(attackedCellKey, room)
            io.to(room).emit('receiveAttackDark', data);
        })
        socket.on('responseToAttackDark', data => {
            const { ship, attackedCellKey, room } = JSON.parse(data);
            io.to(room).emit('receiveResponseToAttackDark', data);
        })


        /*socket.on('sendDarkBoard', data => {
            const room = JSON.parse(data).room;
            io.to(room).emit('lightPlayerTurn', data);
        })*/

        /*socket.on('sendBothBoards', data => {
            const room = JSON.parse(data).room;
            console.log(room)
            io.to(room).emit('getBothBoards', JSON.stringify({ socketId: socket.id }));
        })*/

        /*socket.on('initOponentBoard', data => {
            const room = JSON.parse(data).room;
            //io.to(room).emit('lightPlayerTurn', data);
            console.log(JSON.parse(data).label)
            io.to(room).emit('getOponentBoard', data);
            //io.to(room).emit('playerTurn', data);
        })*/
        socket.on('initDarkBoard', data => {
            const room = JSON.parse(data).room;
            //if (Object.keys(rooms[room]).length <= 2){
                console.log('init dark board, ', room)
                //console.log(JSON.parse(data))
                io.to(room).emit('getDarkBoard', data);
            //}
        })
        socket.on('initLightBoard', data => {
            const room = JSON.parse(data).room;
            console.log('init light board, ', room)
            //console.log(JSON.parse(data))
            io.to(room).emit('getLightBoard', data);
        })

        /*socket.on('sendLightBoard', data => {
            const room = JSON.parse(data).room;
            io.to(room).emit('darkPlayerTurn', data);
        })*/


        socket.on('join', data => {
            const {room, playerName} = JSON.parse(data);
            if (rooms[room] && playerName !== undefined){
            //
                console.log("-----------")
                console.log(Object.keys(rooms[room]).length )
                console.log(rooms[room][playerName] === undefined )
                console.log("-----------")
                //
                if (Object.keys(rooms[room]).length < 2 && rooms[room][playerName] == undefined){
                    socket.join(room);
                    console.log("opponentJoined")
                    io.to(room).emit('opponentJoined');
                }else{
                    console.log('observer joined')
                    io.to(socket.id).emit('observerJoined');
                }
                //rooms[room].players.push(username)
                console.log(socket.id, ":", playerName)
                rooms[room][playerName] = {playerId: socket.id};
            }else{
                //emit proper event
                io.to(socket.id).emit('wrongRoom');// handle vent
            }
        })

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
        });*///to chyba nie dla statkow, wiec zakomentowalem, zeby dzialali statki
        socket.on('winner', (room: string, username: string, gamename: string) => {
            //console.log(Object.keys(rooms[room]))
            const loserName = Object.keys(rooms[room]).filter(player => player !== username)[0];
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
        });//const rooms: { [name: string]: { [playerName: string]: {playerId: string}}} = {};

        socket.on('reqRestart', (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit('restart');
        })

        socket.on('playerLost', data => {
            const { room, lostPlayerSide } = JSON.parse(data);
            console.log(room, lostPlayerSide)

            Object.keys(rooms[room]).forEach(user => {
                
                if(rooms[room][user] !== undefined && rooms[room][user].playerId === socket.id){
                    delete rooms[room][user];

                    if (Object.keys(rooms[room]).length === 0) delete rooms[room]
                }
            })

            console.log('someone lost in room ', room)
            io.to(room).emit('oponentLost', data);
        })

        socket.on('disconnect', () => {
            console.log("User disconnected", socket.id);
        })
    });
}

export default socketManager;