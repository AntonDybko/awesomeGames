import JoinButton from './JoinButton/JoinButton'

const Home: React.FC = () =>  {
    return (
        <div className="home-page">
            <div className="left-page">
                <div className="home-text">
                    Ready to Play? Start Your Adventure Now!
                </div>
                <div className="home-description">
                    Join our vibrant gaming community and explore a variety of games. Compete with others and reach the top spot 
                    on the ranking ladder! 
                </div>
            </div>
            <div className="right-page">
                <div>Placeholder for an image</div>
                <JoinButton />
            </div>
        </div>
    );
}

export default Home;