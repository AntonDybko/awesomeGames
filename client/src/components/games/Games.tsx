import "./Games.scss";
import tictactoeImage from '../../images/tictactoe.png';
//import checkersImage from '../../images/checkers.png';
import Card from './card/Card'; 
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';

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
          title="Mastermind"
          description="Classic code-breaking game that challenges players to decipher a hidden code."
          linkTo="/games/mastermind"
          buttonText="Singleplayer"
          IconComponent={PsychologyAltIcon}
        />
        <Card
          title="Battleships"
          description="Prepare for a naval showdown as you deploy your fleet and engage in a battle of wits."
          linkTo="/games/warcaby"
          buttonText="Multiplayer"
          IconComponent={DirectionsBoatIcon}
        />
      </div>
    </div>
  );
};

export default Games;
