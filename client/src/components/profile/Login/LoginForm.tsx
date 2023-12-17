import { Formik, Form, useField } from "formik";
import StatusProps from "interfaces/Status";
import { Status } from '../Login/Login'
import useAuth from "hooks/useAuth";
import axios from "axios-config/axios";
import * as yup from 'yup';
import FormInput from "../FormInput";
import './LoginForm.scss';
import { useState } from "react";

interface FormValues {
    emailOrUsername: string,
    password: string
}

interface LoginFormProps {
    response: StatusProps,
    setResponse: React.Dispatch<React.SetStateAction<StatusProps>>,
    setStatus: React.Dispatch<React.SetStateAction<Status>>
}

const loginSchema = yup.object().shape({
    emailOrUsername: yup.string().required("Username or Email is required"),
    password: yup.string().required("Password is required")
});

const LoginForm: React.FC<LoginFormProps> = ({response, setResponse, setStatus}) => {
    const [submittingStatus, setSubmittingStatus] = useState(false)
    const { setAuth } = useAuth();

    const handleLogIn = async (values: FormValues) => {
        setStatus("pending");
        setResponse({ ...response, pending: 'Logging...'})
        try {
            setSubmittingStatus(true);
            const res = await axios.post("/users/login", values, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })

            setStatus("resolved");
            setResponse({ ...response, resolved: res.data.message });

            // delay updating auth state to show success response
            setTimeout(() => {
                setAuth({
                  token: res.data.accessToken,
                  ...res.data.user,
                });
              }, 1500);
            
        } catch (e: any) {
            setStatus("rejected");
            if (e.response.status === 401) {
                setResponse({ ...response, rejected: "Invalid credentials" });
            } else {
                setResponse({ ...response, rejected: "Encountered a problem" });
            }
        } finally {
            setSubmittingStatus(false);
        }
    }

    return (
        <Formik
            initialValues={{
                emailOrUsername: "",
                password: ""
            }}
            validationSchema={loginSchema}
            onSubmit={(values: FormValues) => { handleLogIn(values); }}>
            {(formik) => (
                <Form className="form">
                <div>
                    <FormInput name="emailOrUsername" type="text" placeholder="Enter Username or Email"/>
                    <FormInput name="password" type="password" placeholder="Enter Password"/>
                </div>
                <button
                    className="submit-login"
                    disabled={
                    !formik || !(formik.isValid && formik.dirty) || submittingStatus
                    }
                    type="submit"
                >
                    Log In
                </button>
                </Form>
            )}
        </Formik>
    )
}

export default LoginForm;