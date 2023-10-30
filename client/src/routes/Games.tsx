import { Routes, Route } from "react-router-dom";
import GamesLayout from "./Games/GamesLayout";
import TicTacToe from "./Games/TicTacToe";
import Mastermind from "./Games/Mastermind";
import GamesDashboard from "./Games/GamesDashboard";

const Games = () => {
    return (
        <div>
            <h2>Games</h2>
            <Routes>
                <Route path="/" element={<GamesLayout />}>
                    <Route index element={<GamesDashboard />} />
                    <Route path="tictactoe" element={<TicTacToe />} />
                    <Route path="mastermind" element={<Mastermind />} />
                </Route>
            </Routes>
        </div>
    );
}

export default Games;