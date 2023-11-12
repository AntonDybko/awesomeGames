import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SignUpPage: React.FC = () => {
    const [formData, setFormData] = useState({
        login: '',
        password: '',
        passwordAgain: '',
        ok: true,
        errorMessage: ''
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
        // console.log(formData); // DEV!

        if (formData.password === formData.passwordAgain) {
            console.log('Logged', formData.login);
            // send to API
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
