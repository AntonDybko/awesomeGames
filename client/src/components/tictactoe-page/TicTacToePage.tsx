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
            {/*<h2>TicTacToe Page</h2>
            <hr /> */}
            <div className="tictactoe">
                <TicTacToe socket={socket}/>
            </div>
        </div>
    );
}

export default TicTacToePage;