import { Formik, Form } from "formik";
import StatusProps from "interfaces/Status";
import { Status } from '../Login/Login'
import useAuth from "hooks/useAuth";
import axios from "axios-config/axios";
import FormInput from "../FormInput";
import registrationSchema from "./registrationSchema";

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

    const handleRegister = async (values: FormValues) => {
        setStatus("pending");
        setResponse({ ...response, pending: 'Just a moment...'})
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
            
        } catch (e: any) {
            setStatus("rejected");
            setResponse({ ...response, rejected: "An error occurred" });
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
            onSubmit={(values: FormValues) => { handleRegister(values); }}>
            {(formik) => (
                <Form className="form">
                <div>
                    <FormInput name="username" type="text" placeholder="Enter Username"/>
                    <FormInput name="email" type="email" placeholder="Enter Email"/>
                    <FormInput name="password" type="password" placeholder="Enter Password"/>
                    <FormInput name="matchingPassword" type="password" placeholder="Repeat Password"/>
                </div>
                <button
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