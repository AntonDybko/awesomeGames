import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        ok: true,
        errorMessage: ''
    });
    const [cookies, setCookie] = useCookies(["user"]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // console.log(formData); // DEV!

        const url = "http://localhost:5000/users/login";
        const data = {
            emailOrUsername: formData.login,
            password: formData.password
        };

        try {
            const response = await axios.post<FormData, AxiosResponse<{ accessToken: string, message: string }>>(url, data);
            setCookie("user", { username: formData.login, jwt: response.data.accessToken }); // Not safe!!!
            navigate('/');
        } catch (error: any) {
            if (error.response.data.message) {
                setFormData({
                    ...formData,
                    ok: false,
                    errorMessage: error.response.data.message
                });
            }
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Login:
                    <input
                        type="text"
                        name="login"
                        value={formData.login}
                        onChange={handleInputChange}
                    />
                </label>

                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Log In!</button>
            </form>
            <div className='error-message'>
                {!formData.ok ? <p>{formData.errorMessage}</p> : <p></p>}
            </div>
            <div className='alt'>
                <p>
                    Don't have an account?
                    <Link to="/register">Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
