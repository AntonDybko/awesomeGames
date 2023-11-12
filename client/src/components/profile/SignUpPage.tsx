import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        passwordAgain: ''
    });

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
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

                <label>
                    Repeat Password:
                    <input
                        type="password"
                        name="passwordAgain"
                        value={formData.password}
                        onChange={handleInputChange}
                    />
                </label>
                <button type="submit">Sign up!</button>
            </form>
            <p>
                Already have an account?
                <Link to="/login">Sign In</Link>
            </p>
        </div>
    );
};

export default SignUpPage;
