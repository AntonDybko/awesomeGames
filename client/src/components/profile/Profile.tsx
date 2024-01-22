import { useEffect, useState } from "react";
import axios from 'axios-config/axios'
import UserProps from '../../interfaces/User'
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { profile } from "console";
import './Profile.scss';
import defaultProfileImage from '../../images/defaultProfileImage.png';


type TicTacToeRank = number; 
type MastermindRank = number;


const Profile: React.FC = () => {
    const [user, setUser] = useState({} as UserProps);
    const auth = useAuth();
    const [ticTacToeRank, setTicTacToeRank] = useState<TicTacToeRank>();
    const [mastermindRank, setMastermindRank] = useState<MastermindRank>();


    const profileName = window.location.pathname.slice(9)
    const navigate = useNavigate();


    useEffect(() => {
        async function getUser() {
            try {
                const res = await axios.get(`users/profile/${profileName}`);
                if (res.status === 200) setUser(res.data);
            } catch (e) {
                navigate("/");
            }
        }

        async function getMastermindStats() {
            try {
                const res = await axios.get(`ranking/mastermind/${profileName}`);
                if (res.status === 200) setMastermindRank(res.data[0]?.averageScore);
            } catch (e) {
                navigate("/");
            }
        }

        async function getTictactoeStats() {
            try {
                const res = await axios.get(`users/profile/${profileName}/scores/byGame/tictactoe`);
                if (res.status === 200) setTicTacToeRank(res.data[0]?.score);
            } catch (e) {
                navigate("/");
            }
        }

        getUser();
        getTictactoeStats();
        getMastermindStats();
    }, [profileName, navigate]);

    return (
        <div className="profile-page">
            <div className="profile-container">
                <img src={defaultProfileImage} className="profile-image" alt="profile"/>
                <div className="profile-name">{profileName}</div>
                <div className="birthday-container">
                {user.birthday && (
                    <div>
                    {user.birthday.toString()}
                    </div>
                )}
                </div>
            </div>
            <div className="ranking-container">
                <h2>Rankings</h2>
                <div className="game-rankings">
                    <div className="mastermind-ranking">
                        Mastermind ranking: {mastermindRank !== undefined ? (mastermindRank % 1 !== 0 ? mastermindRank.toFixed(1) : mastermindRank) : 'No ranking yet'}
                    </div>
                    <div className="tictactoe-ranking">
                        Tictactoe ranking: {ticTacToeRank !== undefined ? (ticTacToeRank % 1 !== 0 ? ticTacToeRank.toFixed(1) : ticTacToeRank)  : 'No ranking yet'}
                    </div>
                    <div className="battleship-ranking">
                        Battleship ranking: {}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;