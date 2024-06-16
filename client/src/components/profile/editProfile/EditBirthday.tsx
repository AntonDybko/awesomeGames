import axios from "axios-config/axios";
import { Formik, Form } from "formik";
import { useLocation, useNavigate } from "react-router-dom"
import FormInput from "../FormInput";
import { toast } from "react-toastify";
import birthdaySchema from "./schemas/birthdaySchema";
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { Dispatch, SetStateAction, useState } from "react";

interface FormInputProps {
    onSetBirthday: Dispatch<SetStateAction<Date | undefined>>
}

const EditBirthDay: React.FC<FormInputProps> = (props) => {
    const location = useLocation();
    const { auth } = location.state;
    const navigate = useNavigate();
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

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
                setIsSubmitted(true);
                props.onSetBirthday(values.birthday);
                toast.success('Birthday date updated succesfully!');
            }
        }catch(err) {
            toast.error(`Error: ${err}`);
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

export default EditBirthDay;