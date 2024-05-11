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

const createValidationTest = (
  endpoint: string,
  field: FieldProps<string>
) => async (value: string | undefined): Promise<boolean> => {
  if (value && value !== field.value) {
    try {
      await axios.get(endpoint, { params: { username: value } });

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


const usernameSchema = yup.object().shape({
  newPassword: yup
    .string()
    .matches(
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&_]).{8,}$/,
      "Password must contain at least 8 characters, one uppercase, one lowercase, one number, and one special character from [@ $ ! % * ? & _]",
    )
    .required("New password is required"),
  matchingNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword"), null as any], "Passwords must match") // Maybe change as any later
    .required("Re-enter your new password"),
});

export default usernameSchema;
