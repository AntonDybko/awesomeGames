import * as yup from "yup";

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
    .oneOf([yup.ref("newPassword"), null as any], "Passwords must match") 
    .required("Re-enter your new password"),
});

export default usernameSchema;
