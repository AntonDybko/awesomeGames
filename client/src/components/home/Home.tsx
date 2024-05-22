import JoinButton from './JoinButton/JoinButton'
import './Home.scss';
import tictactoeImage from '../../images/tictactoe.png';
import mastermindImage from '../../images/mastermind.png';
import battleshipImage from '../../images/battleship.png';
import Slider from './Slider/Slider';


const Home: React.FC = () =>  {
    const gameSlides = [
        {url: tictactoeImage, title: 'Tic-tac-toe', description: "Tic Tac Toe is a beloved choice for casual entertainment and strategic challenges." },
        {url: mastermindImage, title: 'Mastermind', description: "Classic code-breaking game that challenges players to decipher a hidden code." },
        {url: battleshipImage, title: 'Battleship', description: "Prepare for a naval showdown as you deploy your fleet and engage in a battle of wits." },
    ]

    return (
        <div className="home-page">
            <div className="left-page">
                <div className="home-text">
                    Ready to Play?
                </div>
                <div className="home-description">
                    Start Your Adventure Now! Join our vibrant gaming community and explore a variety of games. <br/>
                    Compete with others and reach the top spot on the ranking ladder! 
                </div>
                <JoinButton />
            </div>
            <div className="right-page">
                <h1>Available Games</h1>
                <div className="slider-container">
                    <Slider slides={gameSlides}/>
                </div>
            </div>
        </div>
    );
}

export default Home;