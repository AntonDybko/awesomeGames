import { Routes, Route } from "react-router-dom";
import GamesLayout from "./GamesLayout";
import TicTacToe from "../tictactoe/TicTacToe";
import Mastermind from "../mastermind/Mastermind";

const Games = () => {
    return (
        <div>
            <h2>Games</h2>
            <Routes>
                <Route path="/" element={<GamesLayout />}>
                    <Route path="tictactoe" element={<TicTacToe />} />
                    <Route path="mastermind" element={<Mastermind />} />
                </Route>
            </Routes>
        </div>
    );
}

export default Games;