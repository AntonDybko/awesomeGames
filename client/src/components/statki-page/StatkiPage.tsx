import Statki from "../statki/Statki";
import { Socket } from "socket.io-client";

type StatkiProps = {
    socket: Socket | null;
}

const StatkiPage = ({socket}: StatkiProps) => {
    return (
        <div>
            <h2>Battleships</h2>
            <hr />
            <Statki socket={socket}/>
        </div>     
    );
}

export default StatkiPage