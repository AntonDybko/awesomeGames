import { useEffect, useState } from "react";
import axios from 'axios-config/axios'
import UserProps from '../../interfaces/User'
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";


const Profile: React.FC = () => {
    const [user, setUser] = useState({} as UserProps);
    const auth = useAuth();

    const profileName = window.location.pathname.slice(9)
    const navigate = useNavigate();

    const displayAvatar = () => (
        <div>
            {auth.auth.username === profileName ? (
                // when it's your profile
                <div className="profile-avatar"
                style={{
                    backgroundImage: `url("${
                      user.picture_url ||
                      ""
                    }")`,
                  }}>
                </div>
            ) : (
                // when you're browsing someone's profile
                <div>
                    
                </div>
            )}
        </div>
    );

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
                
            </div>
        </div>
    );
}

export default Profile;