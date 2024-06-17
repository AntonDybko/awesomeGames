import * as yup from "yup";
import axios from "axios-config/axios";

interface FieldProps<T> {
  value: T | undefined;
  isValid: boolean;
}

const createField = <T>(initialValue: T): FieldProps<T> => ({
  value: initialValue,
  isValid: true,
});

const usernameToCheck = createField<string>("");
const emailToCheck = createField<string>("");



const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, "Username must contain at least 4 characters")
    .required("Username is required"),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
  password: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&_]).{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character from [@ $ ! % * ? & _]",
    )
    .required("Password is required"),
  matchingPassword: yup
    .string()
    .oneOf([yup.ref("password"), null as any], "Passwords must match") // Maybe change as any later
    .required("Re-enter your password"),
});

export default registrationSchema;
