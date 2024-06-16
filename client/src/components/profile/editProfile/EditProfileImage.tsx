import axios from "axios-config/axios";
import { Formik, Form } from "formik";
import { Dispatch, SetStateAction } from "react"
import { useLocation } from "react-router-dom"
import imageSchema from "./schemas/imageSchema";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface FormInputProps {
    setProfileImage: Dispatch<SetStateAction<string | undefined>>
}

const EditProfileImage: React.FC<FormInputProps> = (props) => {
    const location = useLocation();
    const { auth } = location.state;

    interface FormValues {
        picture_url: string | undefined,
    }

    const handleEdit = async (values: FormValues) => {
        try {
            console.log(values.picture_url?.length)
            const res = await axios.put("/users/profile", values, {
                headers: { 
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${auth.token}` 
                },
                withCredentials: true
            })
            if(res.status === 200) {
                toast.success('Profile image updated succesfully!');
            }
        }catch(err) {
            toast.error(`Error: ${err}`);
        }
    }

    return (
        <div>
            <Formik
                initialValues={{
                    picture_url: ""
                }}
                validationSchema={imageSchema}
                onSubmit={(values: FormValues) => handleEdit(values)}
            >
                {(formik) => (
                    <Form className="form">
                        <div><input type="file" name="picture_url" onChange={e =>{
                                const fileReader = new FileReader();
                                if(e.target.files) fileReader.readAsDataURL(e.target.files[0]);
                                fileReader.onload = (event) => {
                                    formik.setFieldValue('picture_url', event.target?.result?.toString());
                                    props.setProfileImage(event.target?.result?.toString())
                                };
                            }}/>
                        </div>
                        <div>
                            {formik.errors.picture_url}
                        </div>
                        <button type="submit">
                            Save
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}

export default EditProfileImage;