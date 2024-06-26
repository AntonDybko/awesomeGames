import { useField } from "formik";
import './FormInput.scss';
import { ChangeEvent } from "react";

interface FormInputProps {
  type: string,
  name: string,
  placeholder?: string, //changes
  value?: string//changes
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
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