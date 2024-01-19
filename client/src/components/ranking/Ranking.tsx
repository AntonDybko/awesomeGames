import { Routes, Route, Link } from "react-router-dom";

const Ranking = () => {
    return (
        <div>
            <h2>Ranking</h2>
            <ul>
            <li>
              <Link to="/ranking/tictactoe">TicTacToe</Link>
            </li>
            <li>
              <Link to="/ranking/mastermind">Mastermind</Link>
            </li>
            <li>
              <Link to="/ranking/warcaby">Warcaby</Link>
            </li>
          </ul>
        </div>
    );
}

export default Ranking;