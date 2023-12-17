import { Server, Socket } from "socket.io";


const socketManager = (io: Server) => {
    io.on('connection', (socket) => {
        console.log("User connected", socket.id);
        socket.on('reqTurn', (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit('playerTurn', data);
        })

        socket.on('create', room => {
            socket.join(room);
        })

        socket.on('join', room => {
            socket.join(room);
            io.to(room).emit('opponentJoined');
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