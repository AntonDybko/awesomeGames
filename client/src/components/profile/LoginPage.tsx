import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const LoginForm: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        }); // changes only the provided pair
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Logged', formData.login);

        // here goes axios for example
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
                <button type="submit">Login</button>
            </form>
            <div className='alt'>
                <p>
                    Don't have an account?
                    <Link to="/register">Sign Up Now!</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginForm;
