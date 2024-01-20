import { Server, Socket } from "socket.io";


const socketManager = (io: Server) => {
    //const rooms: {[key: string]: {players: string[]} } = {};

    io.on('connection', (socket) => {
        console.log("User connected", socket.id);
        socket.on('reqTurn', (data) => {
            const room = JSON.parse(data).room;
            io.to(room).emit('playerTurn', data);
        })

        socket.on('reqStatkiTurn', (data) => {
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