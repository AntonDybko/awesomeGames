import { useEffect, useState } from "react";
import axios from 'axios-config/axios'
import UserProps from '../../interfaces/User'
import { useNavigate } from "react-router-dom";
import useAuth from "hooks/useAuth";


const Profile: React.FC = () => {
    const [user, setUser] = useState({} as UserProps);
    const auth = useAuth();

    const userId = window.location.pathname.slice(9)
    const navigate = useNavigate();

    useEffect(() => {
        async function getUser() {
            try {
                const res = await axios.get(`users/profile/${userId}`);
                if (res.status === 200) setUser(res.data);
            } catch (e) {
                navigate("/");
            }
        }
        getUser();
    }, [ userId, navigate ])

    return (
        <div className="profile-page">
            <div className="profile-container">
                PROFILE
            </div>
        </div>
    );
}

export default Profile;