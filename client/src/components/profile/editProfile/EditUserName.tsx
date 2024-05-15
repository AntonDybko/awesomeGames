import axios from "axios-config/axios";
import { Formik, Form } from "formik";
import { useState } from "react"
import { useLocation } from "react-router-dom"
import FormInput from "../FormInput";
import useAuth from "hooks/useAuth";
import usernameSchema from "./schemas/userNameSchema";
import { toast } from "react-toastify";


const EditUserName: React.FC = () => {
    const location = useLocation();
    const { auth } = location.state;
    //setUserName(username);

    interface FormValues {
        username: string,
    }

    const handleEdit = async (values: FormValues) => {
        try {
            const res = await axios.put("/users/profile", values, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}` 
                },
                withCredentials: true
            })
            if(res.status === 200) {
                toast.success('Username updated succesfully!');
            }
            //console.log("sdfsdf")
        }catch(err) {
            toast.error(`Error: ${err}`);
        }
    }

    return (
        <div>
            <Formik
                initialValues={{
                    username: ""
                }}
                validationSchema={usernameSchema}
                onSubmit={(values: FormValues) => handleEdit(values)}
            >
                {(formik) => (
                    <Form className="form">
                        <div>
                            <FormInput name="username" type="text"/>
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

export default EditUserName;