import axios from "axios-config/axios";
import { Formik, Form } from "formik";
import { useState } from "react"
import { useLocation } from "react-router-dom"
import FormInput from "../FormInput";
import useAuth from "hooks/useAuth";
import { toast } from "react-toastify";
import birthdaySchema from "./schemas/birthdaySchema";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker  } from 'react-date-range';



const EditUserName: React.FC = () => {
    const location = useLocation();
    const { auth } = location.state;
    //setUserName(username);

    interface FormValues {
        birthday: Date | undefined,
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
                toast.success('Birthday date updated succesfully!');
            }
        }catch(err) {
            toast.error(`Error: ${err}`);
        }
    }

    return (
        <div>
            <Formik
                initialValues={{
                    birthday: undefined
                }}
                validationSchema={birthdaySchema}
                onSubmit={(values: FormValues) => handleEdit(values)}
            >
                {(formik) => (
                    <Form className="form">
                        <div>
                            <FormInput name="birthday" type="date"/>
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