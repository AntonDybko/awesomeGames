import TicTacToe from "components/tictactoe/TicTacToe";
import '../tictactoe/TicTacToe.scss'

const TicTacToePage = () => {
    return (
        <div>
            {/*<h2>TicTacToe Page</h2>
            <hr /> */}
            <div className="tictactoe">
                <TicTacToe />
            </div>
        </div>
    );
}

export default TicTacToePage;