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

const createValidationTest = (
  endpoint: string,
  field: FieldProps<string>
) => async (value: string | undefined): Promise<boolean> => {
  if (value && value !== field.value) {
    try {
      if (endpoint === "/users/check-username") {
        await axios.get(endpoint, { params: { username: value } });
      } else {
        await axios.get(endpoint, { params: { email: value } });
      }
      

      field.value = value;
      field.isValid = true;
      return true;
    } catch (error) {
      field.value = value;
      field.isValid = false;
      return false;
    }
  }

  return field.isValid;
};


const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .min(4, "Username must contain at least 4 characters")
    .required("Username is required")
    .test("check-unique-username", "Username is already taken", createValidationTest("/users/check-username", usernameToCheck)),
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required")
    .test("check-unique-email", "Email is already taken", createValidationTest("/users/check-email", emailToCheck)),
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
