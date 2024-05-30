import { useEffect, useState } from "react";
import axios from 'axios-config/axios'
import UserProps from '../../interfaces/User'
import { useNavigate, Route, Link, Routes } from "react-router-dom";
import useAuth from "hooks/useAuth";
import './Profile.scss';
import defaultProfileImage from '../../images/defaultProfileImage.png';
import editImage from '../../images/pngwing.com.png'
import EditBirthday from "./editProfile/EditBirthday";
import EditProfileImage from "./editProfile/EditProfileImage";
import { Bounce, ToastContainer } from "react-toastify";
import ChangePassword from './editProfile/ChangePassword';
import EditIcon from '@mui/icons-material/Edit';
import PsychologyAltIcon from '@mui/icons-material/PsychologyAlt';
import DirectionsBoatIcon from '@mui/icons-material/DirectionsBoat';
import ClearIcon from '@mui/icons-material/Clear';


type TicTacToeRank = number; 
type MastermindRank = number;


const Profile: React.FC = () => {
    const [user, setUser] = useState({} as UserProps);
    const { auth } = useAuth();
    const [ticTacToeRank, setTicTacToeRank] = useState<TicTacToeRank>();
    const [mastermindRank, setMastermindRank] = useState<MastermindRank>();
    const [profileImage, setProfileImage] = useState<string | undefined>("")

    const profileName = auth.username;
    
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
                <div>
                    <Link to={`editProfileImage`} state={{ auth }}><EditIcon className="edit-icon"/></Link>
                    { profileImage ?
                        <img src={profileImage } className="profile-image" alt="profile"/> :
                        (user.picture_url ? 
                        <img src={user.picture_url } className="profile-image" alt="profile"/> :
                        <img src={defaultProfileImage} className="profile-image" alt="profile"/>)
                    }
                    <Routes>
                        <Route path={"editProfileImage"} element={
                            <div>
                                <EditProfileImage setProfileImage={setProfileImage}/>
                            </div>
                        }/>
                    </Routes>
                </div>
                <div className="profile-name">
                    {profileName}
                </div>
                <div>
                    <span>Email: </span>
                    <span >{user.email}</span>
                </div>
                <div>
                    <Link to={`editBirthday`} state={{ auth }}><EditIcon className="edit-icon"/></Link>
                    <span>Birthday: </span>
                    <span className="birthday-container">
                        {user.birthday ? (
                            <div>
                                {new Date(user.birthday).toLocaleDateString()}
                            </div>
                        ) : 'undefined'}
                    </span>
                    <Routes>
                        <Route path={"editBirthday"} element={
                            <div>
                                <EditBirthday/>
                            </div>
                        }/>
                    </Routes>
                </div>
                <div>
                    <Link to={`changePassword`} state={{ auth }}><EditIcon className="edit-icon"/>Change Password</Link>
                    <Routes>
                        <Route path={"changePassword"} element={
                            <div>
                                <ChangePassword/>
                            </div>
                        }/>
                    </Routes>
                </div>
            </div>
            <div className="ranking-container">
                <h2>Rankings</h2>
                <div className="game-rankings">
                    <div className="mastermind-ranking rating-container">
                        <div className="game-icon-container">
                            <PsychologyAltIcon className="game-icon"/>
                            <p className="rating-name">
                                MASTERMIND RANKING: 
                            </p>
                        </div>
                        <p className="rating">{mastermindRank !== undefined ? (mastermindRank % 1 !== 0 ? mastermindRank.toFixed(1) : mastermindRank) : 'No ranking yet'}</p>
                    </div>
                    <div className="tictactoe-ranking rating-container">
                        <div className="game-icon-container">
                            <ClearIcon className="game-icon"/>
                            <p className="rating-name">
                                TICTACTOE RANKING: 
                            </p>
                        </div>
                        <p className="rating">{ticTacToeRank !== undefined ? (ticTacToeRank % 1 !== 0 ? ticTacToeRank.toFixed(1) : ticTacToeRank)  : 'No ranking yet'}</p>
                    </div>
                    <div className="battleship-ranking rating-container">
                        <div className="game-icon-container">
                            <DirectionsBoatIcon className="game-icon"/>
                            <p className="rating-name">
                                BATTLESHIP RANKING: 
                            </p>
                        </div>
                        <p className="rating">{}</p>
                    </div>
                </div>
            </div>
            <ToastContainer
                            position="top-center"
                            autoClose={5000}
                            hideProgressBar={false}
                            newestOnTop={false}
                            closeOnClick
                            rtl={false}
                            pauseOnFocusLoss
                            draggable
                            pauseOnHover
                            theme="light"
                            transition={Bounce}
                        />
        </div>
    );
}

export default Profile;