import axios from "axios-config/axios";
import { Formik, Form } from "formik";
import { useState } from "react"
import { useLocation } from "react-router-dom"
import FormInput from "../FormInput";
import useAuth from "hooks/useAuth";
import usernameSchema from "./schemas/userNameSchema";
import { toast } from "react-toastify";
import passwordSchema from "./schemas/passwordSchema";
import { NotNull } from "yup";
import { ServerErrorResponse } from "models/ServerErrorResponse";


const ChangePassword: React.FC = () => {
    const location = useLocation();
    const { auth } = location.state;
    //setUserName(username);

    interface FormValues {
        newPassword: string,
        matchingNewPassword: string
    }

    /*interface ServerError {
        response: {
            data: {
                message: string,
                details: string,
                //criteria: Array<string>
            }
        }
    }*///need to create a good interface to handle all kind of errors......

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
            }
            //console.log("sdfsdf")
        }catch(err) {
            const errorWithDetails = err as ServerErrorResponse;
            toast.error(`Error: ${errorWithDetails.response.data.details}`);
        }
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