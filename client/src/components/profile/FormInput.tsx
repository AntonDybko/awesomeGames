import { useField } from "formik";

interface FormInputProps {
  type: string,
  name: string,
  placeholder: string
}

export const FormInput: React.FC<FormInputProps> = (props) => {
  const [field, meta] = useField(props);

  return (
    <div >
      <div >
        <input {...field} {...props} />
      </div>
      {meta.touched && meta.error && <div>{meta.error}</div>}
    </div>
  );
};