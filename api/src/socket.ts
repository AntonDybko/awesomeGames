import { Server, Socket } from "socket.io";


const socketManager = (io: Server) => {
    //const rooms: {[key: string]: {players: string[]} } = {};

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

        socket.on('create', (room: string) => {
            //rooms[room] = { players: [] };
            //rooms[room].players.push(socket.id)
            socket.join(room);
        })

        socket.on('join', room => {
            socket.join(room);
            io.to(room).emit('opponentJoined');
            /*if(rooms[room].players.length + 1 > 2) {
                io.to(socket.id).emit('maxPlayersError');
            }else{
                rooms[room].players.push(socket.id)
                io.to(room).emit('opponentJoined');
            }*/
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