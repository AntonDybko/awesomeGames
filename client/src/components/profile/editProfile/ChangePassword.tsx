import axios from "axios-config/axios";
import { Formik, Form } from "formik";
import { useLocation } from "react-router-dom"
import FormInput from "../FormInput";
import { toast } from "react-toastify";
import passwordSchema from "./schemas/passwordSchema";
import { ServerErrorResponse } from "interfaces/ServerErrorResponse";


const ChangePassword: React.FC = () => {
    const location = useLocation();
    const { auth } = location.state;

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
            }
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