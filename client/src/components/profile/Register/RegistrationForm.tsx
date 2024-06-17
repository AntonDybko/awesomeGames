import { Formik, Form, FormikHelpers } from "formik";
import StatusProps from "interfaces/Status";
import { Status } from '../Login/Login'
import useAuth from "hooks/useAuth";
import axios from "axios-config/axios";
import FormInput from "../FormInput";
import registrationSchema from "./registrationSchema";
import './RegistrationForm.scss';

interface FormValues {
    username: string,
    email: string,
    password: string,
    matchingPassword: string
}

interface RegistrationFormProps {
    response: StatusProps,
    setResponse: React.Dispatch<React.SetStateAction<StatusProps>>,
    setStatus: React.Dispatch<React.SetStateAction<Status>>
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({response, setResponse, setStatus}) => {
    const { setAuth } = useAuth();

    const checkUnique = async (field: string, value: string) => {
        try {
            await axios.get(`/users/check-${field}`, { params: { [field]: value } });
            return true;
        } catch (error) {
            return false;
        }
    }

    const handleRegister = async (values: FormValues, actions: FormikHelpers<FormValues>) => {
        setStatus("pending");
        setResponse({ ...response, pending: 'Just a moment...'});

        const isUsernameUnique = await checkUnique('username', values.username);
        const isEmailUnique = await checkUnique('email', values.email);

        if (!isUsernameUnique) {
            setStatus("rejected");
            setResponse({ ...response, rejected: "Username is already taken" });
            actions.setFieldError("username", "Username is already taken");
            actions.setSubmitting(false);
            return;
        }

        if (!isEmailUnique) {
            setStatus("rejected");
            setResponse({ ...response, rejected: "Email is already taken" });
            actions.setFieldError("email", "Email is already taken");
            actions.setSubmitting(false);
            return;
        }

        try {
            const res = await axios.post("/users/register", values, {
                headers: { "Content-Type": "application/json" },
                withCredentials: true
            })

            setStatus("resolved");
            setResponse({ ...response, resolved: res.data.message });

            setTimeout(() => {
                setAuth({
                  token: res.data.accessToken,
                  ...res.data.user,
                });
            }, 1500);
            
            actions.resetForm();
        } catch (e: any) {
            setStatus("rejected");
            setResponse({ ...response, rejected: "An error occurred" });
            actions.setSubmitting(false);
        }
    }

    return (
        <Formik
            initialValues={{
                username: "",
                password: "",
                matchingPassword: "",
                email: ""
            }}
            validationSchema={registrationSchema}
            onSubmit={handleRegister}>
            {(formik) => (
                <Form className="form">
                <div>
                    <FormInput name="username" type="text" placeholder="Enter Username"/>
                    <FormInput name="email" type="email" placeholder="Enter Email"/>
                    <FormInput name="password" type="password" placeholder="Enter Password"/>
                    <FormInput name="matchingPassword" type="password" placeholder="Repeat Password"/>
                </div>
                <button
                    className="submit-register"
                    disabled={
                    !formik || !(formik.isValid && formik.dirty) || formik.isSubmitting
                    }
                    type="submit"
                >
                    Register
                </button>
                </Form>
            )}
        </Formik>
    )
}

export default RegistrationForm;