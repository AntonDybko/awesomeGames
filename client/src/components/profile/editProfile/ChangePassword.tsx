import axios from "axios-config/axios";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom"
import FormInput from "../FormInput";
import { toast } from "react-toastify";
import passwordSchema from "./schemas/passwordSchema";
import { ServerErrorResponse } from "interfaces/ServerErrorResponse";
import { useState } from "react";


const ChangePassword: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = location.state;
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    interface FormValues {
        newPassword: string,
        matchingNewPassword: string
    }

    const handleEdit = async (values: FormValues) => {
        try {
            console.log(values)
            const res = await axios.put("/users/changePassword", values, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}` 
                },
                withCredentials: true
            })
            if(res.status === 200) {
                toast.success('Password updated succesfully!');
                setIsSubmitted(true);
            }
        }catch(err) {
            const errorWithDetails = err as ServerErrorResponse;
            toast.error(`Error: ${errorWithDetails.response.data.details}`);
        }
    }

    if(isSubmitted){
        setIsSubmitted(false);
        const editProfilePage = window.location.href.replace(/\/editBirthday$/, '');
        navigate(editProfilePage);
    }

    return (
        <div>
            <Formik
                initialValues={{
                    newPassword: "",
                    matchingNewPassword: ""
                }}
                validationSchema={passwordSchema}
                onSubmit={(values: FormValues) => handleEdit(values)}
            >
                {(formik) => (
                    <Form className="form">
                        <div>
                            <FormInput name="newPassword" type="password" placeholder="Enter new password"/>
                        </div>
                        <div>
                            <FormInput name="matchingNewPassword" type="password" placeholder="Repeat new password"/>
                        </div>
                        <button>
                            Save
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default ChangePassword;