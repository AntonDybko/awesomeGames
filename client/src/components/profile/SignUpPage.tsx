import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCookies } from "react-cookie";

const SignUpPage: React.FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        passwordAgain: '',
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

    const postData = async () => {
        const url = "http://localhost:5000/users/register";
        const data = {
            email: formData.email,
            password: formData.password
        };

        try {
            const response = await axios.post<FormData, AxiosResponse<{accessToken: string, message: string}>>(url, data);
            setCookie("user", {username: formData.email, jwt: response.data.accessToken}); // Not safe!!!
            navigate('/');
        } catch (error: any) {
            if (error.response.data.details) {
                if (error.response.data.details.password) {
                    setFormData({
                        ...formData,
                        password: '',
                        passwordAgain: '',
                        ok: false,
                        errorMessage: 'Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character'
                    });
                }
            } else {
                if (error.response.data.message) {
                    setFormData({
                        ...formData,
                        ok: false,
                        errorMessage: error.response.data.message
                    });
                }
            }
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // console.log(formData); // DEV!

        if (formData.password === formData.passwordAgain) {
            console.log('Sending request to API...'); // DEV
            postData();
        } else {
            setFormData({
                ...formData,
                passwordAgain: '',
                ok: false,
                errorMessage: 'Invalid password!'
            });
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
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

                <label>
                    Repeat Password:
                    <input
                        type="password"
                        name="passwordAgain"
                        value={formData.passwordAgain}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Sign up!</button>
            </form>
            <div className='error-message'>
                {!formData.ok ? <p>{formData.errorMessage}</p> : <p></p>}
            </div>
            <div className='alt'>
                <p>
                    Already have an account?
                    <Link to="/login">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default SignUpPage;
