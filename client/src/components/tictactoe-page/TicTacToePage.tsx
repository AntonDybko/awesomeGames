import TicTacToe from "components/tictactoe/TicTacToe";
import '../tictactoe/TicTacToe.scss'
import { Socket } from "socket.io-client";

type SocketProps = {
    //socket: Socket<ServerToClientEvents, ClientToServerEvents> | null;
    socket: Socket | null;
}

const TicTacToePage = ({socket}: SocketProps) => {
    return (
        <div>
            <div className="tictactoe">
                <TicTacToe socket={socket}/>
            </div>
        </div>
    );
}

export default TicTacToePage;