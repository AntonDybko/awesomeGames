import { useEffect, useState } from "react";
import axios from 'axios-config/axios'
import UserProps from '../../interfaces/User'
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";
import { profile } from "console";
import './Profile.scss';
import defaultProfileImage from '../../images/defaultProfileImage.png';


const Profile: React.FC = () => {
    const [user, setUser] = useState({} as UserProps);
    const auth = useAuth();

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
        getUser();
    }, [ profileName, navigate ])

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
                        Mastermind ranking: {}
                    </div>
                    <div className="tictactoe-ranking">
                        Tictactoe ranking: {}
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