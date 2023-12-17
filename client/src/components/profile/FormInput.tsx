import { useField } from "formik";
import { TextField } from "@mui/material";
import './FormInput.scss';

interface FormInputProps {
  type: string,
  name: string,
  placeholder: string
}

const FormInput: React.FC<FormInputProps> = (props) => {
  const [field, meta] = useField(props);

  return (
    <div className="form-input-container">
      <div className="inputs">
        <input {...field} {...props} />
      </div>
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </div>
  );
};

export default FormInput;