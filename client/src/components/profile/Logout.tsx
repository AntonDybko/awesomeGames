import React, { useState } from 'react';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const Logout = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');
    const [cookies, setCookie] = useCookies(["user"]);
    const handleClick = async () => {
        const url = "http://localhost:5000/users/logout";
        const config = {
            headers: {
                Authorization: `Bearer ${cookies.user.jwt}`
            }
        }
        try {
            await axios.delete(url, config);
            setCookie("user", {})
            navigate('/');
        } catch (error: any)  {
            setErrorMessage(error.message)
        }
    }

    return (
        <div>
            <p>Do you want to logout?</p>
            <button onClick={handleClick}>Logout</button>
            <p>{errorMessage}</p>
        </div>
    );
}

export default Logout;