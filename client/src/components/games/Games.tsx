import "./Games.scss";
import tictactoeImage from '../../images/tictactoe.png';
import checkersImage from '../../images/checkers.png';
import mastermindImage from '../../images/mastermind.png';
import Card from './card/Card'; 

const Games = () => {
  return (
    <div className="page">
      <h2 className="title">GAMES</h2>

      <div className="container">
        <Card
          imageSrc={tictactoeImage}
          title="TicTacToe"
          description="Tic Tac Toe is a beloved choice for casual entertainment and strategic challenges."
          linkTo="/games/tictactoe"
          buttonText="Multiplayer"
        />
        <Card
          imageSrc={mastermindImage}
          title="Mastermind"
          description="Classic code-breaking game that challenges players to decipher a hidden code."
          linkTo="/games/mastermind"
          buttonText="Singleplayer"
        />
        <Card
          imageSrc={checkersImage}
          title="Checkers"
          description="Step onto the checkered battlefield, outmaneuver your opponent, and claim victory."
          linkTo="/games/warcaby"
          buttonText="Multiplayer"
        />
      </div>
    </div>
  );
};

export default Games;
