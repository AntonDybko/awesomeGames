import { useState } from "react";
import GameLeaderboard from "./leaderboards/GameLeaderboard";
import "./Ranking.scss";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Ranking = () => {
    const [selectedGame, setSelectedGame] = useState("tictactoe");

    const handleGameChange = (event: any) => {
        setSelectedGame(event.target.value);
    };

    return (
        <div className="rankings-container">
            <div className="leaderboard-header-container">
                <EmojiEventsIcon className="throphy-emoji"/>
                <h2>Leaderboard</h2>
            </div>
            <div className="game-selector">
                <select id="game" value={selectedGame} onChange={handleGameChange}>
                    <option value="tictactoe">Tic-Tac-Toe</option>
                    <option value="mastermind">Mastermind</option>
                    <option value="battleships">Battleship</option>
                </select>
            </div>
            <GameLeaderboard gameName={selectedGame} />
        </div>
    );
};

export default Ranking;
