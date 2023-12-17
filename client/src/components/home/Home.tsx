import JoinButton from './JoinButton/JoinButton'
import './Home.scss';

const Home: React.FC = () =>  {
    return (
        <div className="home-page">
            <div className="left-page">
                <div className="home-text">
                    Ready to Play? Start Your Adventure Now!
                </div>
                <div className="home-description">
                    Join our vibrant gaming community and explore a variety of games.
                    Compete with others and reach the top spot on the ranking ladder! 
                </div>
                <JoinButton />
            </div>
            <div className="right-page">
                <div></div>
            </div>
        </div>
    );
}

export default Home;