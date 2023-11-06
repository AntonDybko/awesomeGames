import { Outlet, Link } from "react-router-dom";

const GamesLayout = () => {
    return (
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/games/tictactoe">TicTacToe</Link>
            </li>
            <li>
              <Link to="/games/mastermind">Mastermind</Link>
            </li>
          </ul>
        </nav>
  
        <hr />
  
        <Outlet />
      </div>
    );
}

export default GamesLayout;