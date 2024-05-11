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
  username: yup
    .string()
    .min(4, "Username must contain at least 4 characters")
    .test("check-unique-username", "Username is already taken", createValidationTest("/users/check-username", usernameToCheck)),
});

export default usernameSchema;
