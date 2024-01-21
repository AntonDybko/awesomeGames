import { Routes, Route, Link } from "react-router-dom";
import "./Ranking.scss";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

const Ranking = () => {
    return (
        <div className="rankings-container">
            <h2>Leaderboards</h2>
            <ul className="leaderboard-list">
              <li className="game-leaderboard">
                <EmojiEventsIcon className="trophy-icon"/>
                <Link to="/ranking/tictactoe">TicTacToe</Link>
              </li>
              <li className="game-leaderboard">
                <EmojiEventsIcon className="trophy-icon"/>
                <Link to="/ranking/mastermind">Mastermind</Link>
              </li>
              <li className="game-leaderboard">
                <EmojiEventsIcon className="trophy-icon"/>
                <Link to="/ranking/warcaby">Warcaby</Link>
              </li>
            </ul>
        </div>
    );
}

export default Ranking;